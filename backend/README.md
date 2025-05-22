# Stores' Platform Backend 🛠️

A robust backend service powering the Stores' Platform web application.

---

## 🚩 Flags

When starting the server, you can pass any of the following flags to `node .`:

| Flag                | Description                                                                                                 |
| ------------------- |-------------------------------------------------------------------------------------------------------------|
| `--force`           | Forces a full sync of your database tables (always drops & recreates).                                      |
| `--buildDataBase`   | Creates a new database from (must not be an exisiting one).                                                 |
| `--rebuildDataBase` | Drops the existing database and then creates it anew (drop + create).                                       |
| `--updateTables`    | Runs migration scripts to update existing tables (no drop and stops and warns in case of datalose updates). |

```bash
# Example: build DB from scratch
node . --buildDataBase

# Example: force tables sync and start in dev mode
node . --force
```

---

## 🛠️ Prerequisites

1. **Node.js** (>=20) & npm: Install from [nodejs.org](https://nodejs.org)  
2. **PostgreSQL**(>=17): Ensure a running Postgres server and a user with create/modify rights.  
3. **Global NPM tools**:
   ```bash
   npm install -g nodemon
   ```
4. **Installing dependencies**(make sure you are in "/Stores-Platform/backend"):
   ```bash
   npm i
   ```
5. OPTIONAL: install postman from: [postman.com](https://www.postman.com/downloads/) for testing apis.
---

## ⚙️ more fluid explanation must come here.


---

## 🔒 Environment Variables

Create a `.env` file in the project root(/backend). Replace `<angle_brackets>` values as needed:

```dotenv
HOSTNAME=localhost            # Default host binding
PORT=4000                     # Default server port
JWT_SECRET=<your_jwt_secret>  # Secure random JWT secret

# PostgreSQL configuration
DB_NAME=stores-platform
DB_USERNAME=<your_db_user>    # e.g. postgres
DB_PASSWORD=<your_db_pass>    # e.g. 12345678
DB_HOST=localhost             # Database host
DB_PORT=5432                  # Database port

NODE_ENV=development          # "development" or "production"
```

> **Note**: create your own `.env` file and fill it.

---

## 💾 Database Setup

1. Ensure Postgres is running.  
2. **Create** database & tables:
   ```bash
   node . --buildDataBase
   ```
3. exist using ctrl+c
---

## 🚀 Running the Server

- **Production**:
  ```bash
  npm start
  ```
- **Development** (with hot reload):
  ```bash
  npm run dev
  ```

---

## 📦 Dependencies Explained

| Package           | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| **axios**         | HTTP client for outbound API requests                      |
| **bcrypt**        | Secure password hashing                                    |
| **compression**   | Gzip compression for responses                             |
| **cookie-parser** | Parse cookies from requests                                |
| **cors**          | Configure Cross-Origin Resource Sharing                    |
| **dotenv**        | Load `.env` variables into `process.env`                   |
| **express**       | Web framework for routing & middleware                     |
| **helmet**        | Security headers middleware                                |
| **jsonwebtoken**  | JWT creation & verification                                |
| **knex**          | SQL query builder & migration tool                         |
| **pg**            | PostgreSQL client for Node.js                              |

---

## 🗂️ Project Structure

```text
├── Controllers/               # Express route handlers
├── Database/                  # Database config & migrations
├── app.js                     # Express app setup
├── index.js                   # Entry point + flag handling
└── package.json               # Dependencies & scripts
```

---

## 📝 Next Steps

- Replace placeholder values in `.env`.  
- Add new controllers/routes under `Controllers/`.  
- Extend DB migrations or seed data in `Database/`.  
- Integrate testing and CI/CD workflows.
- Use swagger for api explanations. 
