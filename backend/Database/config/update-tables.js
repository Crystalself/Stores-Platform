const tables = require("../tables");
const knex = require("./knex");
const {checkSchemaChanges} = require("../utils/schema-helpers");

//TODO: make index changes.

const logDestructiveChanges = (tableName, changes) => {
    console.warn(`WARNING: Destructive changes detected for table ${tableName}`);
    if (changes.columnsToRemove.length > 0) {
        console.warn(`  - Columns to be removed: ${changes.columnsToRemove.join(', ')}`);
    }
    changes.columnsToAlter.forEach(col => {
        Object.entries(col.changes).forEach(([changeType, change]) => {
            if (change.destructive) {
                console.warn(`  - Column ${col.name}: ${changeType} change from ${change.from} to ${change.to} is potentially destructive`);
            }
        });
    });
    if (changes.constraintChanges.foreign.some(fk => fk.action === 'remove' && fk.destructive)) {
        console.warn(`  - Foreign key constraints would be removed`);
    }
    console.warn(`Run with --force flag to apply drop ALL tables and create new tables or update the database manually.`);
    console.warn(`USING --force WILL LOSE ALL DATA IN DATABASE.`);
};

const getColumnDefinition = (tableName, colName) => {
    const tempTable = {};
    tables[tableName](tempTable);
    return tempTable[colName];
};

const addNewColumns = (table, tableName, columnsToAdd) => {
    for (const colName of columnsToAdd) {
        const colDef = getColumnDefinition(tableName, colName);
        if (colDef) {
            let column = table[colDef.type](colName);
            if (colDef.notNullable) column.notNullable();
            if (colDef.defaultTo !== undefined) column.defaultTo(colDef.defaultTo);
            console.log(`Added column ${colName} to table ${tableName}`);
        }
    }
};
const applyTypeChange = (column, tableName, col) => {
    if (col.changes.type && !col.changes.type.destructive) {
        const colDef = getColumnDefinition(tableName, col.name);
        if (colDef) {
            column[colDef.type]();
            console.log(`Changed column ${col.name} type from ${col.changes.type.from} to ${col.changes.type.to} in table ${tableName}`);
        }
    }
};

const applyNullabilityChange = (column, tableName, col) => {
    if (col.changes.nullable && !col.changes.nullable.destructive) {
        if (col.changes.nullable.to) {
            column.nullable();
            console.log(`Made column ${col.name} nullable in table ${tableName}`);
        } else {
            column.notNullable();
            console.log(`Made column ${col.name} NOT NULL in table ${tableName}`);
        }
    }
};

const applyDefaultValueChange = (column, tableName, col) => {
    if (col.changes.default) {
        if (col.changes.default.to === null) {
            column.dropDefault();
            console.log(`Removed default value for column ${col.name} in table ${tableName}`);
        } else {
            const colDef = getColumnDefinition(tableName, col.name);
            if (colDef && colDef.defaultTo !== undefined) {
                column.defaultTo(colDef.defaultTo);
                console.log(`Set default value for column ${col.name} to ${colDef.defaultTo} in table ${tableName}`);
            }
        }
    }
};

const alterColumns = (table, tableName, columnsToAlter) => {
    for (const col of columnsToAlter) {
        const hasNonDestructiveChanges = Object.values(col.changes).some(change => !change.destructive);
        if (hasNonDestructiveChanges) {
            table.alterColumn(col.name, column => {
                applyTypeChange(column, tableName, col);
                applyNullabilityChange(column, tableName, col);
                applyDefaultValueChange(column, tableName, col);
            });
        }
    }
};

const applyColumnChanges = async (tableName, changes) => {
    const hasColumnChanges = changes.columnsToAdd.length > 0 || changes.columnsToAlter.some(col => Object.values(col.changes).some(change => !change.destructive));
    if (!hasColumnChanges) return;
    await knex.schema.alterTable(tableName, table => {
        addNewColumns(table, tableName, changes.columnsToAdd);
        alterColumns(table, tableName, changes.columnsToAlter);
    });
};



const applyPrimaryKeyChanges = async (tableName, primaryKeyChange) => {
    if (!primaryKeyChange) return;
    const pkInfo = await knex.raw(`
        SELECT
            tc.constraint_name
        FROM
            information_schema.table_constraints tc
        WHERE
            tc.table_name = ? AND tc.constraint_type = 'PRIMARY KEY'
    `, [tableName]);

    if (pkInfo.rows.length > 0) {
        await knex.raw(`ALTER TABLE "${tableName}" DROP CONSTRAINT "${pkInfo.rows[0].constraint_name}"`);
        console.log(`Dropped primary key constraint from table ${tableName}`);
    }

    if (primaryKeyChange.to.length > 0) {
        await knex.schema.alterTable(tableName, table => {
            table.primary(primaryKeyChange.to);
        });
        console.log(`Added primary key on (${primaryKeyChange.to.join(', ')}) to table ${tableName}`);
    }
};

const applyUniqueConstraintChanges = async (tableName, uniqueChanges) => {
    for (const uniqueChange of uniqueChanges) {
        if (uniqueChange.action === 'add') {
            await knex.schema.alterTable(tableName, table => {
                table.unique(uniqueChange.columns);
            });
            console.log(`Added unique constraint on (${uniqueChange.columns.join(', ')}) to table ${tableName}`);
        } else if (uniqueChange.action === 'remove') {
            await knex.raw(`ALTER TABLE "${tableName}" DROP CONSTRAINT "${uniqueChange.name}"`);
            console.log(`Dropped unique constraint ${uniqueChange.name} from table ${tableName}`);
        }
    }
};

const dropForeignKeyConstraints = async (tableName) => {
    const fkInfo = await knex.raw(`
        SELECT
            tc.constraint_name
        FROM
            information_schema.table_constraints tc
        WHERE
            tc.table_name = ? AND tc.constraint_type = 'FOREIGN KEY'
    `, [tableName]);

    for (const fk of fkInfo.rows) {
        await knex.raw(`ALTER TABLE "${tableName}" DROP CONSTRAINT "${fk.constraint_name}"`);
        console.log(`Dropped foreign key constraint ${fk.constraint_name} from table ${tableName}`);
    }
};

const applyForeignKeyChanges = async (tableName, foreignKeyChanges) => {
    for (const fkChange of foreignKeyChanges) {
        if (fkChange.action === 'add') {
            await knex.schema.table(tableName, tables[tableName]);
            console.log(`Updated foreign key constraints for table ${tableName}`);
        } else if (fkChange.action === 'remove') {
            await dropForeignKeyConstraints(tableName);
        }
    }
};

const applyConstraintChanges = async (tableName, changes) => {
    if (changes.destructiveChanges) return;
    await applyPrimaryKeyChanges(tableName, changes.constraintChanges.primary);
    await applyUniqueConstraintChanges(tableName, changes.constraintChanges.unique);
    await applyForeignKeyChanges(tableName, changes.constraintChanges.foreign);
};

const updateTables = async (force = false) => {
    try {
        const schemaChanges = await checkSchemaChanges();
        for (const [tableName, changes] of Object.entries(schemaChanges)) {
            if (!changes.exists) {
                continue;
            }
            if (changes.destructiveChanges) {
                logDestructiveChanges(tableName, changes);
                continue;
            }
            await applyColumnChanges(tableName, changes, force);
            await applyConstraintChanges(tableName, changes, force);
        }
    } catch (e) {
        console.error('Error updating tables:', e);
    }
};

module.exports = updateTables;