import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNotes } from './contexts/NotesContext';
import Nav from './Nav';

const updateSvg = (
<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" version="1.1" id="Capa_1" width="20px" height="20px" viewBox="0 0 494.936 494.936" xmlSpace="preserve">
    <g>
      <g>
        <path d="M389.844,182.85c-6.743,0-12.21,5.467-12.21,12.21v222.968c0,23.562-19.174,42.735-42.736,42.735H67.157    c-23.562,0-42.736-19.174-42.736-42.735V150.285c0-23.562,19.174-42.735,42.736-42.735h267.741c6.743,0,12.21-5.467,12.21-12.21    s-5.467-12.21-12.21-12.21H67.157C30.126,83.13,0,113.255,0,150.285v267.743c0,37.029,30.126,67.155,67.157,67.155h267.741    c37.03,0,67.156-30.126,67.156-67.155V195.061C402.054,188.318,396.587,182.85,389.844,182.85z"/>
        <path d="M483.876,20.791c-14.72-14.72-38.669-14.714-53.377,0L221.352,229.944c-0.28,0.28-3.434,3.559-4.251,5.396l-28.963,65.069    c-2.057,4.619-1.056,10.027,2.521,13.6c2.337,2.336,5.461,3.576,8.639,3.576c1.675,0,3.362-0.346,4.96-1.057l65.07-28.963    c1.83-0.815,5.114-3.97,5.396-4.25L483.876,74.169c7.131-7.131,11.06-16.61,11.06-26.692    C494.936,37.396,491.007,27.915,483.876,20.791z M466.61,56.897L257.457,266.05c-0.035,0.036-0.055,0.078-0.089,0.107    l-33.989,15.131L238.51,247.3c0.03-0.036,0.071-0.055,0.107-0.09L447.765,38.058c5.038-5.039,13.819-5.033,18.846,0.005    c2.518,2.51,3.905,5.855,3.905,9.414C470.516,51.036,469.127,54.38,466.61,56.897z"/>
      </g>
    </g>
  </svg>
) 

export default function NoteList() {
  const { notes, loading, error } = useNotes();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [isSearching, setIsSearching] = useState(false);

  // Update filtered notes when notes change
  useEffect(() => {
    if (!isSearching) {
      setFilteredNotes(notes);
    }
  }, [notes, isSearching]);

  if (loading) return <div>Loading your notes...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("handle search submit");

    if (search.trim().length > 0) {
      const searchResults = notes.filter((note) => 
        note.contact_name.toLowerCase().includes(search.toLowerCase()) ||
        note.notes.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredNotes(searchResults);
      setIsSearching(true);
    } else {
      setFilteredNotes(notes);
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setFilteredNotes(notes);
    setIsSearching(false);
  };

  const displayNotes = isSearching ? filteredNotes : notes;

  return (
    <div className="note-list-container">
      <Nav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0' }}>
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
      <div className="search-container">
       <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
         <input 
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           placeholder="Search by contact name or notes..."
           style={{ flex: 1, padding: '0.5rem', width: '250px' }}
         />
         <button type="submit" style={{ padding: '0.5rem 1rem' }}>Search</button>
         {isSearching && (
           <button type="button" onClick={handleClearSearch} style={{ padding: '0.5rem 1rem' }}>Clear</button>
         )}
       </form>
       <br />
      </div>
      <div>
      {isSearching && (
         <p style={{ margin: '0.5rem 0', color: '#666' }}>
           Showing {filteredNotes.length} result{filteredNotes.length !== 1 ? 's' : ''} for "{search}"
         </p>
       )}
      </div>

      {displayNotes.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem', width: '100%' }}>
          {displayNotes.map((note) => (
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
                    {updateSvg}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {displayNotes.length === 0 && isSearching && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No notes found for "{search}". <button onClick={handleClearSearch} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>Clear search</button>
        </div>
      )}
    </div>
  );
}