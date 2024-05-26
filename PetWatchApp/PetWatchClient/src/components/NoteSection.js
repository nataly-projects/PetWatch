import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { addPetNote, deleteNoteById, updateNoteById } from '../services/petService';
import { formatDate } from '../utils/utils';
import NoteActivity from './NoteActivity';
import '../styles/section.css';

const NoteSection = ({propsNotes, petId}) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const [notes, setNotes] = useState(propsNotes);
  const [editingNote, setEditingNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddNoteActivity, setShowAddNoteActivity] = useState(false);

  const handleAddNoteClick = () => {
    setShowAddNoteActivity(true);
  };

  const handleAddNote = async (note) => {
    setShowAddNoteActivity(false);
    try {
      const response = await addPetNote(petId, note, token);
      console.log(response.note);
      setNotes([...notes, response.note]);
      toast.success('Note added successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        navigate('/login');
      }
      toast.error('Failed to adding note. Please try again.');
    }
  };
  
  const handleEditClick = (note) => {
    setEditMode(true);
    setEditingNote(note);
  }

  const handleEditNote = async (updatedNote) => {
    setEditingNote(null);
    setEditMode(false);
    console.log('updatedNote: ', updatedNote);
    
    try {
      const response = await updateNoteById(updatedNote, token);
      console.log(response);
      setNotes(notes.map(note => (note._id === updatedNote._id ? updatedNote : note)));
      toast.success('Note updated successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        navigate('/login');
      }
      toast.error('Failed to updating note. Please try again.');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNoteById(id, token);
      setNotes(notes.filter(note => note._id !== id));
      toast.success('Note deleted successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        navigate('/login');
      }
      toast.error('Failed to delete note. Please try again.');
    }
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
                <td>
                  <div className='actions'>
                    <button className='btn' onClick={() => handleEditClick(note)}>Edit</button>
                    <button className='btn' onClick={() => handleDeleteNote(note._id)}>Delete</button>
                  </div>          
                </td>
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
      { editMode && (
        <div className='add-activity-card'>
          <NoteActivity onSave={(data) => handleEditNote(data)} 
          onClose={() => setEditMode(false)}
          noteToEdit={editingNote}
          />
        </div>
      )}
    </div>
  );
};

export default NoteSection;
