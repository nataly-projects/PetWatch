import React, { useState } from 'react';
import { addPetNote } from '../services/petService';
import { formatDate } from '../utils/utils';

const NoteSection = ({propsNotes, petId}) => {
  console.log('propsNotes: ', propsNotes);

  const  [notes, setNotes] = useState(propsNotes);
  console.log('notes: ', notes);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      const newNoteObj = {
        updatedDate: Date.now(),
        content: newNote
      };
      //TODO - send the note to the petSerivce - addPetNote
      setNotes([...notes, newNoteObj]);
      setNewNote('');
    }
  };

  const handleEditNote = (id, updatedNote) => {
    setNotes(notes.map(note => (note._id === id ? { ...note, note: updatedNote, updatedDate: new Date().toISOString().slice(0, 10) } : note)));
    //TODO - send the edit note to the petSerivce - editPetNote
    setEditingNoteId(null);
  };

  const handleDeleteNote = id => {
    setNotes(notes.filter(note => note._id !== id));
    //TODO - delete the note to the petSerivce - deletePetNote

  };

  return (
    <div className="note-section">
      { notes.length > 0 ?
      <table>
      <thead>
        <tr>
          <th>Created Date</th>
          <th>Updated Date</th>
          <th>Note</th>
          {petId !== null && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {notes.map(note => (
          <tr key={note._id}>
            <td>{formatDate(note.createdDate)}</td>
            <td>{note.updatedDate ? formatDate(note.updatedDate) : '-'}</td>
            <td>{note.content}</td>
            {petId !== null && (
            <>
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
          </>
        )}     
          </tr>
        ))}
        {petId !== null && (
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
        )}
      </tbody>
      </table>
      :
      <p>No notes yet.</p>
      }
   
    </div>
  );
};

export default NoteSection;
