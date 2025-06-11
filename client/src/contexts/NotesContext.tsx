import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

export interface CanvasNote {
  id: number;
  contact_name: string;
  email: string | null;
  notes: string;
  last_updated: string;
  created_at: string;
}

interface NotesContextType {
  notes: CanvasNote[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  deleteNote: (noteId: number) => Promise<void>;
  selectedNote: CanvasNote | null;
  setSelectedNote: (note: CanvasNote | null) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<CanvasNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<CanvasNote | null>(null);

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

  const deleteNote = async (noteId: number) => {
    try {
      await axios.delete(`http://localhost:8002/api/notes/${noteId}`);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const value: NotesContextType = {
    notes,
    loading,
    error,
    fetchNotes,
    deleteNote,
    selectedNote,
    setSelectedNote,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}; 