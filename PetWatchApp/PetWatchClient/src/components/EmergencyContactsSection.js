import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/utils';
import { addPetEmergencyContact, updateEmergencyContactById, deleteEmergencyContactById } from '../services/petService';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal } from '@mui/material';
import { FormFieldsType, formFieldsConfig } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import useApiActions from '../hooks/useApiActions';

const EmergencyContactsSection = ({ propsContacts, petId, token }) => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(propsContacts);
  const [editingContact, setEditingContact] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const { execute, loading } = useApiActions();

  const handleAddContactClick = () => {
    setIsAddContactDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsAddContactDialogOpen(false);
  };

  const handleAddContact = async (contact) => {
    setIsAddContactDialogOpen(false);
    try {
      const response = await execute(addPetEmergencyContact, [petId, contact, token]);
      setContacts([...contacts, response.contact]);
      toast.success('Emergency contact added successfully!');
    } catch (error) {
      handleError(error);
      toast.error('Failed to add emergency contact. Please try again.');
    }
  };

  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      navigate('/login');
    }
  };

  const handleEditClick = (contact) => {
    console.log(contact);
    setEditMode(true);
    setEditingContact(contact);
  };

  const handleEditContact = async (updatedContact) => {
    setEditingContact(null);
    setEditMode(false);
    try {
      await execute(updateEmergencyContactById, [updatedContact, token]);
      setContacts(contacts.map(contact => (contact._id === updatedContact._id ? updatedContact : contact)));
      toast.success('Emergency Contact updated successfully!');
    } catch (error) {
      handleError(error);
      toast.error('Failed to update emergency contact. Please try again.');
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await execute(deleteEmergencyContactById, [id, token]);
      setContacts(contacts.filter(contact => contact._id !== id));
      toast.success('Emergency Contact deleted successfully!');
    } catch (error) {
      handleError(error);
      toast.error('Failed to delete emergency contact. Please try again.');
    }
  };
  const formConfig = editMode ? formFieldsConfig(editingContact.name)[FormFieldsType.EMERGENCY_CONTACT] : formFieldsConfig()[FormFieldsType.EMERGENCY_CONTACT];

  return (
    <Box sx={{ backgroundColor: '#fff', boxShadow: 2, border: 1, borderColor: '#ccc', p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Emergency Contacts</Typography>
      {contacts.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Updated Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map(contact => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.type}</TableCell>
                  <TableCell>{formatDate(contact.created_at)}</TableCell>
                  <TableCell>{contact.updatedDate ? formatDate(contact.updatedDate) : '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: '10px' }}>
                      <Button variant="outlined" onClick={() => handleEditClick(contact)}>Edit</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDeleteContact(contact._id)}>Delete</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No Emergency Contacts yet.</Typography>
      )}

      <Modal open={(editMode && formConfig)} onClose={handleDialogClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', width: '50%', mx: 'auto', my: '10%' }}>
        <GenericActivityForm
            title= {formConfig.title}
            fields={formConfig.fields}
              onSave={(data) => handleEditContact(data)}
              onClose={() => setEditMode(false)}
              validationRules={formConfig.validationRules}    
              initialData={editingContact}            
            />
        </Box>
      </Modal>

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddContactClick}>Add Contact</Button>
       <Modal open={(isAddContactDialogOpen && formConfig)} onClose={handleDialogClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', width: '50%', mx: 'auto', my: '10%' }}>
        <GenericActivityForm
            title= {formConfig.title}
            fields={formConfig.fields}
              onSave={(data) => handleAddContact(data)}
              onClose={handleDialogClose}
              validationRules={formConfig.validationRules}                
            />
        </Box>
      </Modal>

    </Box>
  );
};

EmergencyContactsSection.propTypes = {
  propsContacts: PropTypes.array.isRequired,
  petId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default EmergencyContactsSection;
