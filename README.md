# Field Notr


## Tech Stack
- Frontend: React/Typescript (vite)
- Backend: Express/MySQL Database

## Specs
- [x] A page that lets a canvasser write down a name and some free-form notes about a person they just talked to
- [x] A page to view all canvassing notes
- [x] JSON API
- [x] Email validation
- [x] Editing and deleting canvas notes
- [x] Mobile friendly
- [x] Modern UI
- [x] Possible to search across canvassing notes

## Database Setup

Before running the application, you need to set up the MySQL database:

1. **Install MySQL** (if not already installed)
   - On macOS: `brew install mysql`
   - On Ubuntu: `sudo apt-get install mysql-server`
   - On Windows: Download from [MySQL official website](https://dev.mysql.com/downloads/mysql/)

2. **Start MySQL service**
   - On macOS: `brew services start mysql`
   - On Ubuntu: `sudo systemctl start mysql`
   - On Windows: Start MySQL service from Services panel

3. **Create the database**
   ```sql
   CREATE DATABASE canvas_app;
   ```

4. **Configure database credentials** (optional)
   - Set environment variables:
     - `DB_HOST` (default: 127.0.0.1)
     - `DB_USER` (no default - please update)
     - `DB_PASSWORD` (no default - please update)
     - `DB_NAME` (default: canvas_app)
     - `DB_PORT` (default: 3306)

5. **Set up database table**
   - Note - running this script will drop any existing table (with your data) named canvas_notes, and then recreate it.
   ```bash
   cd server && npm install && node scripts/setup-database.js
   ```

## How to run application
- To get server started
  - Run the following on command line: `cd server && nvm use && npm install && npm run dev`
  - Should see the following message:
```Server is running on port 8002
Connected to MySQL database!```
  
- To get the frontend/client started
  - Run the following on command line: `cd client && nvm use && npm install && npm run dev`
  - Should see the following message:
```
VITE v6.3.5  ready in 5119 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## AI Tool Usage
- I used Cursor + Claude-4-sonnet for basic debugging, and to give me feedback on set up the context provider, set up instructions, and to set up a script to create the table in the database for easy setup.


