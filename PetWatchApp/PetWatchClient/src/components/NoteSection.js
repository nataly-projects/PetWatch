import React, { useState } from 'react';
import { formatDate } from '../utils/utils';

const NoteSection = ({petNote}) => {
  console.log('petNotes: ', petNote);

  const  [notes, setNotes] = useState(petNote);
  console.log('notes: ', notes);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      const currentDate = new Date().toISOString().slice(0, 10);
      const newNoteObj = {
        id: notes.length + 1,
        createdDate: currentDate,
        updatedDate: currentDate,
        note: newNote
      };
      setNotes([...notes, newNoteObj]);
      setNewNote('');
    }
  };

  const handleEditNote = (id, updatedNote) => {
    setNotes(notes.map(note => (note._id === id ? { ...note, note: updatedNote, updatedDate: new Date().toISOString().slice(0, 10) } : note)));
    setEditingNoteId(null);
  };

  const handleDeleteNote = id => {
    setNotes(notes.filter(note => note._id !== id));
  };

  return (
    <div className="note-section">
      <h3>Notes</h3>
      <table>
        <thead>
          <tr>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map(note => (
            <tr key={note._id}>
              <td>{formatDate(note.createdDate)}</td>
              <td>{note.updatedDate ? formatDate(note.updatedDate) : '-'}</td>
              <td>{note.content}</td>
              <td>
                {editingNoteId === note._id ? (
                  <textarea
                    value={note.content}
                    onChange={e => handleEditNote(note._id, e.target.value)}
                  />
                ) : (
                  note.note
                )}
              </td>
              <td>
                {editingNoteId === note._id ? (
                  <button onClick={() => handleEditNote(note._id, note.content)}>Save</button>
                ) : (
                  <button onClick={() => setEditingNoteId(note._id)}>Edit</button>
                )}
                <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3">
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Enter new note..."
              />
            </td>
            <td>
              <button onClick={handleAddNote}>Add Note</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NoteSection;
