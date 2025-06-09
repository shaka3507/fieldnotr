require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { pool, testConnection } = require('./config/database');

const corsOptions = {
  origin: true, // allow all origins when testing locally
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json()); // Add JSON parsing middleware

// Test database connection on startup
testConnection();

app.get("/api", (req, res) => {
  res.json({ message: "Canvas Notes API is running!" })
});

// GET endpoint for fetching all notes
app.get("/api/notes", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM canvas_notes ORDER BY last_updated DESC'
    );
    
    connection.release();
    
    res.json(rows);
    
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// GET endpoint for fetching a specific note
app.get("/api/notes/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM canvas_notes WHERE id = ?',
      [noteId]
    );
    
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json(rows[0]);
    
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// POST endpoint for creating new notes
app.post("/api/notes", async (req, res) => {
  try {
    const { contact_name, email, notes } = req.body;
    
    // Validate required fields
    if (!contact_name) {
      return res.status(400).json({ 
        error: "contact_name is required" 
      });
    }
    
    const connection = await pool.getConnection();
    
    // Insert the canvas note
    const [result] = await connection.execute(
      'INSERT INTO canvas_notes (contact_name, email, notes) VALUES (?, ?, ?)',
      [contact_name, email || null, notes || '']
    );
    
    // Get the inserted note with its ID
    const [rows] = await connection.execute(
      'SELECT * FROM canvas_notes WHERE id = ?',
      [result.insertId]
    );
    
    connection.release();
    
    res.status(201).json({
      message: "Note saved successfully",
      data: rows[0]
    });
    
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: "Failed to save note" });
  }
});

// PUT endpoint for updating notes
app.put("/api/notes/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const { contact_name, email, notes } = req.body;
    
    // Validate required fields
    if (!contact_name) {
      return res.status(400).json({ 
        error: "contact_name is required" 
      });
    }
    
    const connection = await pool.getConnection();
    
    // Update the note
    const [result] = await connection.execute(
      'UPDATE canvas_notes SET contact_name = ?, email = ?, notes = ? WHERE id = ?',
      [contact_name, email || null, notes || '', noteId]
    );
    
    if (result.affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: "Note not found" });
    }
    
    // Get the updated note
    const [rows] = await connection.execute(
      'SELECT * FROM canvas_notes WHERE id = ?',
      [noteId]
    );
    
    connection.release();
    
    res.json({
      message: "Note updated successfully",
      data: rows[0]
    });
    
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// DELETE endpoint for deleting notes
app.delete("/api/notes/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM canvas_notes WHERE id = ?',
      [noteId]
    );
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json({ message: "Note deleted successfully" });
    
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

app.listen(8002, () => {
  console.log("Server is running on port 8002");
});

