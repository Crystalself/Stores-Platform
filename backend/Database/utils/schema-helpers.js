const knex = require("../config/knex");
const tables = require("../tables");


const getTableColumns = async (tableName) =>
    knex.raw(`
        SELECT 
            column_name, 
            data_type, 
            character_maximum_length,
            is_nullable,
            column_default,
            udt_name
        FROM 
            information_schema.columns 
        WHERE 
            table_name = ?`, [tableName]);

const getTableConstraints = async (tableName) =>
    knex.raw(`
        SELECT
            tc.constraint_name,
            tc.constraint_type,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM
            information_schema.table_constraints tc
        JOIN
            information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN
            information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE
            tc.table_name = ?
        ORDER BY
            tc.constraint_name, kcu.ordinal_position`, [tableName]);

const getTableIndexes = async (tableName) =>
    knex.raw(`
        SELECT
            i.relname as index_name,
            a.attname as column_name,
            ix.indisunique as is_unique
        FROM
            pg_index ix
        JOIN
            pg_class i ON i.oid = ix.indexrelid
        JOIN
            pg_class t ON t.oid = ix.indrelid
        JOIN
            pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
        WHERE
            t.relname = ?
        ORDER BY
            i.relname, a.attnum`, [tableName]);

const mapKnexTypeToPostgres = (knexType) => {
    const typeMap = {
        'increments': 'integer',
        'integer': 'integer',
        'bigInteger': 'bigint',
        'text': 'text',
        'string': 'character varying',
        'float': 'double precision',
        'decimal': 'numeric',
        'boolean': 'boolean',
        'date': 'date',
        'datetime': 'timestamp without time zone',
        'timestamp': 'timestamp without time zone',
        'time': 'time without time zone',
        'json': 'json',
        'jsonb': 'jsonb',
        'uuid': 'uuid'
    };

    return typeMap[knexType] || knexType;
};

const isDestructiveTypeChange = (fromType, toType) => {
    const destructiveChanges = {
        'character varying': ['integer', 'bigint', 'numeric', 'date', 'timestamp without time zone', 'time without time zone', 'boolean'],
        'text': ['integer', 'bigint', 'numeric', 'date', 'timestamp without time zone', 'time without time zone', 'boolean'],
        'integer': ['boolean'],
        'bigint': ['integer', 'boolean'],
        'numeric': ['integer', 'bigint', 'boolean'],
        'json': ['text', 'character varying', 'integer', 'bigint', 'numeric'],
        'jsonb': ['text', 'character varying', 'integer', 'bigint', 'numeric'],
        'timestamp without time zone': ['date', 'time without time zone'],
        'date': ['time without time zone'],
        'time without time zone': ['date']
    };
    return destructiveChanges[fromType] && destructiveChanges[fromType].includes(toType);
}

const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, i) => val === sortedB[i]);
};

const normalizeDefaultValue = (defaultValue) =>
    defaultValue ? defaultValue.replace(/::[\w\s]+$/, '') : null;

const initializeTableChanges = () => ({
    exists: true,
    columnsToAdd: [],
    columnsToRemove: [],
    columnsToAlter: [],
    constraintChanges: {
        primary: null,
        unique: [],
        foreign: [],
        indices: []
    },
    destructiveChanges: false
});

const analyzeColumnChanges = (changes, dbSchema, codeSchema) => {
    const dbColumns = Object.keys(dbSchema.columns);
    const codeColumns = Object.keys(codeSchema.columns);

    changes.columnsToAdd = codeColumns.filter(col => !dbColumns.includes(col));
    changes.columnsToRemove = dbColumns.filter(col => !codeColumns.includes(col));

    dbColumns.forEach(columnName => {
        if (!codeColumns.includes(columnName)) return;
        const dbColumn = dbSchema.columns[columnName];
        const codeColumn = codeSchema.columns[columnName];
        const columnChanges = {
            name: columnName,
            changes: {}
        };
        let hasChanges = false;
        const dbType = dbColumn.type;
        const codeType = mapKnexTypeToPostgres(codeColumn.type);
        if (dbType !== codeType) {
            hasChanges = true;
            columnChanges.changes.type = {
                from: dbType,
                to: codeType,
                destructive: isDestructiveTypeChange(dbType, codeType)
            };
        }
        const dbNullable = dbColumn.nullable;
        const codeNullable = !codeColumn.notNullable;
        if (dbNullable !== codeNullable) {
            hasChanges = true;
            columnChanges.changes.nullable = {
                from: dbNullable,
                to: codeNullable,
                destructive: dbNullable && !codeNullable
            };
        }
        const normalizedDbDefault = normalizeDefaultValue(dbColumn.default);
        const normalizedCodeDefault = codeColumn.defaultTo !== undefined ? String(codeColumn.defaultTo) : null;
        if (normalizedDbDefault !== normalizedCodeDefault) {
            hasChanges = true;
            columnChanges.changes.default = {
                from: normalizedDbDefault,
                to: normalizedCodeDefault,
                destructive: false
            };
        }
        if (hasChanges) {
            changes.columnsToAlter.push(columnChanges);
        }
    });
};

const compareUniqueConstraints = (changes, dbUniqueConstraints, codeUniqueConstraints) => {
    const formattedCodeConstraints = (codeUniqueConstraints || [])
        .reduce((acc, u, idx) => {
            const columns = Array.isArray(u.columns) ? u.columns : [u.columns];
            acc[`unique_${idx}`] = columns;
            return acc;
        }, {});
    Object.entries(dbUniqueConstraints).forEach(([name, columns]) => {
        let found = false;
        Object.values(formattedCodeConstraints).forEach(codeColumns => {
            if (arraysEqual(columns, codeColumns)) {
                found = true;
            }
        });
        if (!found) {
            changes.constraintChanges.unique.push({
                action: 'remove',
                name,
                columns,
                destructive: false
            });
        }
    });
    Object.entries(formattedCodeConstraints).forEach(([name, columns]) => {
        let found = false;
        Object.values(dbUniqueConstraints).forEach(dbColumns => {
            if (arraysEqual(columns, dbColumns)) {
                found = true;
            }
        });
        if (!found) {
            changes.constraintChanges.unique.push({
                action: 'add',
                name,
                columns,
                destructive: false
            });
        }
    });
};

const compareForeignKeyConstraints = (changes, dbForeignKeys, codeForeignKeys) => {
    const formattedCodeForeignKeys = (codeForeignKeys || [])
        .reduce((acc, fk, idx) => {
            const name = `fk_${idx}`;
            acc[name] = {
                columns: Array.isArray(fk.columns) ? fk.columns : [fk.columns],
                references: {
                    table: fk.table,
                    columns: Array.isArray(fk.references) ? fk.references : [fk.references]
                }
            };
            return acc;
        }, {});
    const dbFkCount = Object.keys(dbForeignKeys).length;
    const codeFkCount = Object.keys(formattedCodeForeignKeys).length;
    if (dbFkCount > codeFkCount) {
        changes.constraintChanges.foreign.push({
            action: 'remove',
            destructive: true
        });
    } else if (dbFkCount < codeFkCount) {
        changes.constraintChanges.foreign.push({
            action: 'add',
            destructive: false
        });
    }
};

const analyzeConstraintChanges = (changes, dbSchema, codeSchema) => {
    const dbPrimaryKey = dbSchema.constraints.primary;
    let codePrimaryKey = [];
    if (codeSchema.constraints.primary) {
        codePrimaryKey = Array.isArray(codeSchema.constraints.primary.columns)
            ? codeSchema.constraints.primary.columns
            : [codeSchema.constraints.primary.columns];
    }
    if (!arraysEqual(dbPrimaryKey, codePrimaryKey)) {
        changes.constraintChanges.primary = {
            from: dbPrimaryKey,
            to: codePrimaryKey,
            destructive: false
        };
    }
    compareUniqueConstraints(changes, dbSchema.constraints.unique, codeSchema.constraints.unique);
    compareForeignKeyConstraints(changes, dbSchema.constraints.foreign, codeSchema.constraints.foreign);
};

const fetchDatabaseSchema = async (tableName) => {
    const schema = {
        columns: {},
        constraints: {
            primary: [],
            unique: {},
            foreign: {}
        },
        indices: {}
    };
    const tableInfo = getTableColumns(tableName);
    tableInfo.rows.forEach(col => {
        schema.columns[col.column_name] = {
            type: col.data_type,
            nullable: col.is_nullable === 'YES',
            default: col.column_default
        };
    });
    const constraintInfo = getTableConstraints(tableName);
    constraintInfo.rows.forEach(constraint => {
        if (constraint.constraint_type === 'PRIMARY KEY') {
            schema.constraints.primary.push(constraint.column_name);
        } else if (constraint.constraint_type === 'UNIQUE') {
            const name = constraint.constraint_name;
            if (!schema.constraints.unique[name]) {
                schema.constraints.unique[name] = [];
            }
            schema.constraints.unique[name].push(constraint.column_name);
        } else if (constraint.constraint_type === 'FOREIGN KEY') {
            const name = constraint.constraint_name;
            if (!schema.constraints.foreign[name]) {
                schema.constraints.foreign[name] = {
                    columns: [],
                    references: {
                        table: constraint.foreign_table_name,
                        columns: []
                    }
                };
            }
            schema.constraints.foreign[name].columns.push(constraint.column_name);
            schema.constraints.foreign[name].references.columns.push(constraint.foreign_column_name);
        }
    });
    const indexInfo = getTableIndexes(tableName);
    indexInfo.rows.forEach(idx => {
        const name = idx.index_name;
        if (!schema.indices[name]) {
            schema.indices[name] = {
                columns: [],
                unique: idx.is_unique
            };
        }
        schema.indices[name].columns.push(idx.column_name);
    });
    return schema;
};

const extractCodeSchema = async (tableName, callback) => {
    const codeSchema = {
        columns: {},
        constraints: {
            primary: null,
            unique: [],
            foreign: [],
            index: []
        }
    };

    await knex.schema.createTable('__temp_schema_check', table => {
        callback(table);
        codeSchema.columns = table._single.columns || {};
        if (table._single.primary) {
            codeSchema.constraints.primary = table._single.primary;
        }
        if (table._single.unique && table._single.unique.length) {
            codeSchema.constraints.unique = table._single.unique;
        }
        if (table._single.foreign && table._single.foreign.length) {
            codeSchema.constraints.foreign = table._single.foreign;
        }
        if (table._single.index && table._single.index.length) {
            codeSchema.constraints.index = table._single.index;
        }
    }).then(() => {
        return knex.schema.dropTableIfExists('__temp_schema_check');
    });
    return codeSchema;
};

const checkForDestructiveChanges = (tableChanges) => {
    if (tableChanges.columnsToRemove.length > 0) {
        tableChanges.destructiveChanges = true;
        return;
    }
    for (const col of tableChanges.columnsToAlter) {
        for (const [_, change] of Object.entries(col.changes)) {
            if (change.destructive) {
                tableChanges.destructiveChanges = true;
                return;
            }
        }
    }
    if (tableChanges.constraintChanges.foreign.some(fk => fk.action === 'remove' && fk.destructive)) {
        tableChanges.destructiveChanges = true;
    }
};

const checkSchemaChanges = async () => {
    try {
        const changes = {};
        for (const [tableName, callback] of Object.entries(tables)) {
            const hasTable = await knex.schema.hasTable(tableName);
            if (!hasTable) {
                changes[tableName] = { exists: false, create: true };
                continue;
            }
            changes[tableName] = initializeTableChanges();
            const dbSchema = await fetchDatabaseSchema(tableName);
            const codeSchema = await extractCodeSchema(tableName, callback);
            analyzeColumnChanges(changes[tableName], dbSchema, codeSchema);
            analyzeConstraintChanges(changes[tableName], dbSchema, codeSchema);
            checkForDestructiveChanges(changes[tableName]);
        }
        return changes;
    } catch (e) {
        console.error('Error checking schema changes:', e);
        return {};
    }
};

module.exports = {
    getTableColumns,
    getTableConstraints,
    getTableIndexes,
    mapKnexTypeToPostgres,
    isDestructiveTypeChange,
    arraysEqual,
    normalizeDefaultValue,
    initializeTableChanges,
    analyzeColumnChanges,
    analyzeConstraintChanges,
    fetchDatabaseSchema,
    extractCodeSchema,
    checkForDestructiveChanges,
    checkSchemaChanges
};