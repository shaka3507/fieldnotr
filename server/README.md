# Canvas App Server

## Database Setup

1. Make sure you have MySQL installed and running
2. Create a database named `canvas_app`:
   ```sql
   CREATE DATABASE canvas_app;
   ```
3. Update the database configuration in `config/database.js` with your MySQL credentials
4. Run the database setup script (this will also populate 20 dummy contacts):
   ```bash
   npm run setup-db
   ```

## Environment Variables

The application uses the following environment variables (with defaults):
- `DB_HOST` (default: localhost)
- `DB_USER` (default: root)
- `DB_PASSWORD` (default: your_password_here)
- `DB_NAME` (default: canvas_app)
- `DB_PORT` (default: 3306)

## Database Schema

### Canvas Contact Table
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR(255), NOT NULL)
- `address` (VARCHAR(500), NOT NULL)
- `phone_number` (VARCHAR(20))
- `last_contacted` (DATETIME)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Canvas Notes Table
- `id` (INT, Primary Key, Auto Increment)
- `notes` (TEXT)
- `canvas_contact_id` (INT, Foreign Key to canvas_contact.id)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## API Endpoints

### POST /api/canvas-notes
Save a new canvas note.

**Request Body:**
```json
{
  "notes": "This is a note about the contact",
  "canvas_contact_id": 1
}
```

**Response:**
```json
{
  "message": "Canvas note saved successfully",
  "data": {
    "id": 1,
    "notes": "This is a note about the contact",
    "canvas_contact_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Running the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
``` 