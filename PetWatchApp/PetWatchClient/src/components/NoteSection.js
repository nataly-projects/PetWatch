import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { useTable, useSortBy, usePagination } from 'react-table';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort, faDownload } from '@fortawesome/free-solid-svg-icons';
import { addPetNote, deleteNoteById, updateNoteById } from '../services/petService';
import { formatDate, formatDateUniversal } from '../utils/utils';
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


  const columns = useMemo(
    () => [
        { Header: 'Title', accessor: 'title'},
        { Header: 'Note', accessor: 'content' },
        { Header: 'Created Date', accessor: 'createdDate', Cell: ({ value }) => formatDateUniversal(new Date(value)) },
        { Header: 'Updated Date', accessor: 'updatedDate', Cell: ({ value }) => !value ? '' : formatDateUniversal(new Date(value)) },
        petId !== null ? { Header: 'Actions', accessor: 'actions', disableSortBy: true, Cell: ({ row }) => (
          <div>
            <button className='btn' onClick={() => handleEditClick(row.original)}>Edit</button>
            <button className='btn' onClick={() => handleDeleteNote(row.original._id)}>Delete</button>
          </div>
      ), } : {Header: 'Actions', accessor: 'actions', show: false}
    ],
    [petId]
  );

  const notesTableInstance = useTable(
    {
        columns,
        data: notes,
        initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );
  
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
      <Table instance={notesTableInstance} />

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

const Table = ({ instance }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize },
    previousPage,
    nextPage,
    gotoPage,
  } = instance;

  const totalItems = instance.rows.length;

  return (
    <>
      <table {...getTableProps()} className='table'>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                column.show !== false && (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      {column.render('Header')}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FontAwesomeIcon icon={faSortDown} />
                        ) : (
                          <FontAwesomeIcon icon={faSortUp} />
                        )
                      ) : (
                        column.disableSortBy ? null : 
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <FontAwesomeIcon icon={faSort} className="sort" />
                        </div>
                      )}
                    </div>
                  </th>
                )
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  cell.show !== false && (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  )
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <span className="pagination-info">
          Showing: {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, totalItems)} of {totalItems}
        </span>
        <div className="pagination-controls">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          {pageOptions.map((page, index) => (
            <button
              key={index}
              onClick={() => gotoPage(index)}
              className={pageIndex === index ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};
export default NoteSection;
