import React, { useState } from 'react';
import { addPetNote } from '../services/petService';
import { formatDate } from '../utils/utils';
import '../styles/section.css';

const NoteSection = ({notes, petId}) => {

  // const  [notes, setNotes] = useState(propsNotes);
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
      notes = ([...notes, newNoteObj]);
      setNewNote('');
    }
  };

  const handleEditNote = (id, updatedNote) => {
    // setNotes(notes.map(note => (note._id === id ? { ...note, note: updatedNote, updatedDate: new Date().toISOString().slice(0, 10) } : note)));
    //TODO - send the edit note to the petSerivce - editPetNote
    setEditingNoteId(null);
  };

  const handleDeleteNote = id => {
    // setNotes(notes.filter(note => note._id !== id));
    //TODO - delete the note to the petSerivce - deletePetNote

  };

  return (
    <div className="section">
      <h3>{petId !== null ? `Notes` : 'Your Notes'}</h3>
      { notes.length > 0 ?
      <>
       <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Note</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            {petId !== null && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {notes.map(note => (
            <tr key={note._id}>
              <td>{note.title}</td>
              <td>{note.content}</td>
              <td>{formatDate(note.createdDate)}</td>
              <td>{note.updatedDate ? formatDate(note.updatedDate) : '-'}</td>
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
        </tbody>
        </table>
        {petId !== null && (
          <button className='btn' onClick={handleAddNote}>Add Note</button>
        )}
      </>
      :
      <p>No notes yet.</p>
      }
   
    </div>
  );
};

export default NoteSection;
