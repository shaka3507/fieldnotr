import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';

interface CanvasNote {
  id: number;
  contact_name: string;
  email: string | null;
  notes: string;
  last_updated: string;
  created_at: string;
}

export default function NoteList() {
  const [notes, setNotes] = useState<CanvasNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8002/api/notes');
      setNotes(response.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await axios.delete(`http://localhost:8002/api/notes/${noteId}`);
      setNotes(notes.filter(note => note.id !== noteId));
      alert('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  if (loading) return <div>Loading your notes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="note-list-container">
      <Nav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Contact Notes</h2>
        <button 
          onClick={() => navigate('/note')}
          className="add-new-contact-button"
        >
          Add New Contact
        </button>
      </div>

      {notes.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem', width: '100%' }}>
          {notes.map((note) => (
            <div key={note.id} className="contact-card" style={{ 
              border: '1px solid #ddd', 
              padding: '1rem', 
              borderRadius: '8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{note.contact_name}</h3>
                  {note.notes && (
                    <div style={{ margin: '0.5rem 0' }}>
                      <p>
                        {note.notes.slice(0, 100)}...
                      </p>
                    </div>
                  )}
                  <small style={{ color: '#999' }}>
                    Added: {new Date(note.created_at).toLocaleDateString()}{' '}
                    {note.last_updated !== note.created_at && (
                      <span>• Updated: {new Date(note.last_updated).toLocaleDateString()}</span>
                    )}
                  </small>
                </div>
                
                <div>
                  <button 
                    onClick={() => navigate(`/note?id=${note.id}`)}
                     className="update-button"
                  >
                    update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}