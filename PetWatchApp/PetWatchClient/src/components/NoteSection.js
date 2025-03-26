import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Box, Button, Table as MuiTable, TableBody, TableCell, TableHead, TableRow, Typography, Modal } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { addPetNote, deleteNoteById, updateNoteById } from '../services/petService';
import { formatDateUniversal } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import { FormFieldsType, formFieldsConfig } from '../utils/utils';

const NoteSection = ({ propsNotes, petId }) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const [notes, setNotes] = useState(propsNotes);
  const [editingNote, setEditingNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);

  const handleAddNoteClick = () => {
    setIsAddNoteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsAddNoteDialogOpen(false);
  };

  const handleAddNote = async (note) => {
    setIsAddNoteDialogOpen(false);
    try {
      const response = await addPetNote(petId, note, token);
      setNotes([...notes, response.note]);
      toast.success('Note added successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) navigate('/login');
      toast.error('Failed to add note. Please try again.');
    }
  };

  const columns = useMemo(
    () => [
      { Header: 'Title', accessor: 'title' },
      { Header: 'Note', accessor: 'content' },
      { Header: 'Created Date', accessor: 'createdDate', Cell: ({ value }) => formatDateUniversal(new Date(value)) },
      { Header: 'Updated Date', accessor: 'updatedDate', Cell: ({ value }) => (value ? formatDateUniversal(new Date(value)) : '-') },
      petId ? { Header: 'Actions', accessor: 'actions', disableSortBy: true, Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={() => handleEditClick(row.original)}>Edit</Button>
            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteNote(row.original._id)}>Delete</Button>
          </Box>
        ) } : { Header: 'Actions', accessor: 'actions', show: false }
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
  };

  const handleEditNote = async (updatedNote) => {
    setEditingNote(null);
    setEditMode(false);
    try {
      await updateNoteById(updatedNote, token);
      setNotes(notes.map((note) => (note._id === updatedNote._id ? updatedNote : note)));
      toast.success('Note updated successfully!');
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401){
        navigate('/login');
      } 
      toast.error('Failed to update note. Please try again.');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNoteById(id, token);
      setNotes(notes.filter((note) => note._id !== id));
      toast.success('Note deleted successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) navigate('/login');
      toast.error('Failed to delete note. Please try again.');
    }
  };

  const formConfig = editMode ? formFieldsConfig(editingNote)[FormFieldsType.NOTE] : formFieldsConfig()[FormFieldsType.NOTE];


  return (
    <Box sx={{ backgroundColor: '#fff', boxShadow: 2, border: 1, borderColor: '#ccc', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {petId !== null ? `Notes` : 'Your Notes'}
      </Typography>
      {notes.length > 0 ? (
        <>
          <Table instance={notesTableInstance} />
          {petId && (
            <>
              {/* <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddNoteClick}>
                Add Note
              </Button> */}
              <Modal open={(isAddNoteDialogOpen && formConfig)} onClose={handleDialogClose}>
                <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', width: '50%', mx: 'auto', my: '10%' }}>
                  <GenericActivityForm
                    title= {formConfig.title}
                    fields={formConfig.fields}
                    onSave={(data) => handleAddNote(data)}
                    onClose={handleDialogClose}
                    validationRules={formConfig.validationRules}                
                    />
                </Box>
              </Modal>
            </>
          )}
        </>
      ) : (
        <Typography>No notes yet.</Typography>
      )}
      <Modal open={(editMode && formConfig)} onClose={handleDialogClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', width: '50%', mx: 'auto', my: '10%' }}>
        <GenericActivityForm
          title= {formConfig.title}
          fields={formConfig.fields}
          onSave={(data) => handleEditNote(data)}
          onClose={() => setEditMode(false)}
          validationRules={formConfig.validationRules}    
          initialData={editingNote}            
            />
        </Box>
      </Modal>
    </Box>
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
    state: { pageIndex },
    previousPage,
    nextPage,
    gotoPage,
  } = instance;

  return (
    <Box>
        <MuiTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  column.show !== false && (
                    <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {column.render('Header')}
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FontAwesomeIcon icon={faSortDown} />
                          ) : (
                            <FontAwesomeIcon icon={faSortUp} />
                          )
                        ) : (
                          !column.disableSortBy && <FontAwesomeIcon icon={faSort} />
                        )}
                      </Box>
                    </TableCell>
                  )
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    cell.show !== false && <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </MuiTable>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Typography variant="body2">
          Showing: {pageIndex * 10 + 1} - {Math.min((pageIndex + 1) * 10, instance.rows.length)} of {instance.rows.length}
        </Typography>
        <Box>
          <Button onClick={previousPage} disabled={!canPreviousPage}>
            Previous
          </Button>
          {pageOptions.map((page) => (
            <Button key={page} onClick={() => gotoPage(page)} variant={pageIndex === page ? 'contained' : 'outlined'}>
              {page + 1}
            </Button>
          ))}
          <Button onClick={nextPage} disabled={!canNextPage}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NoteSection;
