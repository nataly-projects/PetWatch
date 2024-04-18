import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addPetNote } from '../services/petService';
import { formatDate } from '../utils/utils';
import NoteActivity from './NoteActivity';
import '../styles/section.css';

const NoteSection = ({propsNotes, petId}) => {

  const  [notes, setNotes] = useState(propsNotes);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showAddNoteActivity, setShowAddNoteActivity] = useState(false);

  const handleAddNoteClick = () => {
    setShowAddNoteActivity(true);
  };

  const handleAddNote = async (note) => {
    console.log('handleAddNote: ', note);
    setShowAddNoteActivity(false);
    try {
      const response = await addPetNote(petId, note);
      console.log(response.note);
      setNotes([...notes, response.note]);
      toast.success('Note added successfully!');
    } catch (error) {
      console.error('Error while adding pet:', error);
      toast.error('Failed to adding note. Please try again.');
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
                {/* <td>
                  {editingNoteId === note._id ? (
                    <textarea
                      value={note.content}
                      onChange={e => handleEditNote(note._id, e.target.value)}
                    />
                  ) : (
                    note.note
                  )}
                </td> */}
                {/* <td>
                  {editingNoteId === note._id ? (
                    <button onClick={() => handleEditNote(note._id, note.content)}>Save</button>
                  ) : (
                    <button className='btn' onClick={() => setEditingNoteId(note._id)}>Edit</button>
                  )}
                  <button className='btn' onClick={() => handleDeleteNote(note._id)}>Delete</button>
                </td> */}
                <td>
                  <div className='actions'>
                    <button className='btn' onClick={() => setEditingNoteId(note._id)}>Edit</button>
                    <button className='btn' onClick={() => handleDeleteNote(note._id)}>Delete</button>
                  </div>          
                </td>
            </>
          )}     
            </tr>
          ))}
        </tbody>
        </table>
        {petId !== null && (
          <>
            <button className='btn' onClick={handleAddNoteClick}>Add Note</button>
            {showAddNoteActivity && (
              <div className='add-activity-card'>
                <NoteActivity onSave={(data) => handleAddNote(data)} onClose={() => setShowAddNoteActivity(false)}/>
              </div>
            )}
          </>
        )}
      </>
      :
      <p>No notes yet.</p>
      }
   
    </div>
  );
};

export default NoteSection;
