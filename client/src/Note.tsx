import { useState, useEffect } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"
import { useNotes } from "./contexts/NotesContext"
import Nav from "./Nav"

interface CanvasNote {
  id: number;
  contact_name: string;
  email: string | null;
  notes: string;
  last_updated: string;
  created_at: string;
}

export default function Note() {
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('id');
  const { fetchNotes } = useNotes();
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [existingNote, setExistingNote] = useState<CanvasNote | null>(null)
  const [lastSavedNoteId, setLastSavedNoteId] = useState<number | null>(null)
  const [lastSavedNoteName, setLastSavedNoteName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const isEditing = !!noteId;

  // Load existing note if we're in edit mode
  useEffect(() => {
    const loadNote = async () => {
      if (!noteId) return;

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8002/api/notes/${noteId}`);
        const note = response.data;
        
        setExistingNote(note);
        setContactName(note.contact_name);
        setEmail(note.email || '');
        setNotes(note.notes || '');
      } catch (error) {
        console.error('Error loading note:', error);
        setError('Failed to load note');
        navigate('/notes');
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId, navigate]);

  const handleSave = async () => {
    if (!contactName.trim()) {
      setError('Contact name is required')
      return
    }

    try {
      setSaving(true)
      
      if (isEditing && existingNote) {
        // Update existing note
        await axios.put(`http://localhost:8002/api/notes/${existingNote.id}`, {
          contact_name: contactName,
          email: email || null,
          notes: notes
        });
        alert('Contact updated successfully!');
        await fetchNotes(); // Refresh the notes list
        navigate('/notes');
      } else {
        // Create new note
        const response = await axios.post('http://localhost:8002/api/notes', {
          contact_name: contactName,
          email: email || null,
          notes: notes
        });
        
        alert('Contact saved successfully!');
        await fetchNotes(); // Refresh the notes list
        
        // Store the last saved note info
        setLastSavedNoteId(response.data.data.id);
        setLastSavedNoteName(contactName);
        
        // Reset form for next person
        setContactName('');
        setEmail('');
        setNotes('');
      }
      
    } catch (error) {
      console.error('Error saving contact:', error)
      setError('Failed to save contact')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!isEditing || !existingNote) return;
    
    if (!confirm(`Are you sure you want to delete the contact "${existingNote.contact_name}"?`)) return;

    try {
      await axios.delete(`http://localhost:8002/api/notes/${existingNote.id}`);
      alert('Contact deleted successfully!');
      await fetchNotes(); // Refresh the notes list
      navigate('/notes');
    } catch (error) {
      console.error('Error deleting contact:', error);
      setError('Failed to delete contact');
    }
  }

  const handleViewLastNote = () => {
    if (lastSavedNoteId) {
      navigate(`/note?id=${lastSavedNoteId}`);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('email changed', e.target.value);
    setEmail(e.target.value);
  };

  const handleEmailBlur = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(email.length === 0) {
      setError(null);
      return;
    }
    if (email.includes('@') && email.includes('.') && email.indexOf('@') < email.indexOf('.')) {
      setError(null);
      setEmail(email);
    } else {
      setError('Please enter a valid email address');
    }
  }

  const handleBack = () => {
    handleSave();
    navigate('/notes');
  }

  if (loading) {
    return (
      <div>
        <Nav />
        <div>Loading contact...</div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="canvas-note-container">
        <h2>{isEditing ? `${existingNote?.contact_name}` : 'new note'}</h2>
        {isEditing && existingNote && (
          <div>
            <small style={{ color: '#666' }}>
              <strong>Created:</strong> {new Date(existingNote.created_at).toLocaleDateString()} at {new Date(existingNote.created_at).toLocaleTimeString()}
              {existingNote.last_updated !== existingNote.created_at && (
                <span> • <strong>Last Updated:</strong> {new Date(existingNote.last_updated).toLocaleDateString()} at {new Date(existingNote.last_updated).toLocaleTimeString()}</span>
              )}
            </small>
          </div>
        )}

<div>
      {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}
      </div>
        
        {!isEditing && lastSavedNoteId && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '', borderRadius: '4px', border: '1px solid #28a745' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                 previous note ({lastSavedNoteName})
              </div>
              <div>
                <button 
                  onClick={handleViewLastNote}
                  style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem', cursor: 'pointer' }}
                >
                  View Note
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Contact Name *
          </label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Enter their name..."
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={(e) => handleEmailBlur(e as any)}
            placeholder="Enter their email..."
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Notes
          </label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this person (what you talked about, their interests, follow-up needed, etc.)"
            rows={6}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        
        <div className="canvas-note-container-buttons">
          <button 
            onClick={handleSave}
            disabled={saving || !contactName.trim()}
            style={{ marginRight: '0.5rem', backgroundColor: 'lightblue', color: 'black', padding: '0.75rem 1rem', border: 'none', borderRadius: '4px' }}
          >
            {saving ? 'Saving...' : isEditing ? 'update' : 'save'}
          </button>
          
          {isEditing && (
            <button 
              onClick={handleDelete}
              style={{ marginRight: '0.5rem', backgroundColor: '#dc3545', color: 'black', padding: '0.75rem 1rem', border: 'none', borderRadius: '4px' }}
            >
              delete
            </button>
          )}
          
          <button 
            onClick={handleBack}
          >
            back
          </button>
        </div>
      </div>
    </div>
  )
}