import { Routes, Route, useNavigate } from "react-router-dom"
import { BrowserRouter as Router } from "react-router-dom"
import './App.css'
import NoteList from './NoteList'
import Note from './Note'
import { NotesProvider } from './contexts/NotesContext'
import Nav from './Nav'

function Home() {
  const navigate = useNavigate()
  return (
    <>
      <Nav />
      <h1>Field Notr</h1>
      <div className="card">
        <button onClick={() => navigate('/note')}>Start Noting</button>
        <button onClick={() => navigate('/notes')}>View Notes</button>
      </div>
    </>
  )
}

function App() {
  return (
    <Router>
      <NotesProvider>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<NoteList />} />
            <Route path="/note" element={<Note />} />
          </Routes>
        </div>
      </NotesProvider>
    </Router>
  )
}

export default App
