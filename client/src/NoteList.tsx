import { useNavigate } from 'react-router-dom';
import { useNotes } from './contexts/NotesContext';
import Nav from './Nav';

export default function NoteList() {
  const { notes, loading, error } = useNotes();
  const navigate = useNavigate();

  if (loading) return <div>Loading your notes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="note-list-container">
      <Nav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Contact Notes</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => navigate('/note')}
            className="add-new-contact-button"
          >
            Add New Contact
          </button>
        </div>
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