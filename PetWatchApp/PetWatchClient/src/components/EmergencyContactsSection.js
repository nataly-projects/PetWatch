import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/utils';
import { addPetEmergencyContact, updateEmergencyContactById, deleteEmergencyContactById } from '../services/petService';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FormFieldsType, formFieldsConfig } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';

const EmergencyContactsSection = ({ propsContacts, petId, token }) => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(propsContacts);
  const [editingContact, setEditingContact] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddContactActivity, setShowAddContactActivity] = useState(false);

  const handleAddContactClick = () => {
    setShowAddContactActivity(true);
  };

  const handleAddContact = async (contact) => {
    setShowAddContactActivity(false);
    try {
      const response = await addPetEmergencyContact(petId, contact, token);
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
    setEditMode(true);
    setEditingContact(contact);
  };

  const handleEditContact = async (updatedContact) => {
    setEditingContact(null);
    setEditMode(false);
    try {
      await updateEmergencyContactById(updatedContact, token);
      setContacts(contacts.map(contact => (contact._id === updatedContact._id ? updatedContact : contact)));
      toast.success('Emergency Contact updated successfully!');
    } catch (error) {
      handleError(error);
      toast.error('Failed to update emergency contact. Please try again.');
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await deleteEmergencyContactById(id, token);
      setContacts(contacts.filter(contact => contact._id !== id));
      toast.success('Emergency Contact deleted successfully!');
    } catch (error) {
      handleError(error);
      toast.error('Failed to delete emergency contact. Please try again.');
    }
  };
console.log(editingContact);
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
                  <TableCell>{contact.relationship}</TableCell>
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

      {editMode && formConfig && (
        <Box sx={{ padding: '10px', margin: '10px auto', width: '70%', border: '1px solid #ccc', borderRadius: '8px' }}>
        <GenericActivityForm
            title= {formConfig.title}
            fields={formConfig.fields}
              onSave={(data) => handleEditContact(data)}
              onClose={() => setEditMode(false)}
              validationRules={formConfig.validationRules}  
              initialData={editingContact}              
            />
        </Box>
      )}

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddContactClick}>Add Contact</Button>
      {showAddContactActivity && formConfig && (
        <Box sx={{ padding: '10px', margin: '10px auto', width: '70%', border: '1px solid #ccc', borderRadius: '8px' }}>
           <GenericActivityForm
            title= {formConfig.title}
            fields={formConfig.fields}
              onSave={(data) => handleAddContact(data)}
              onClose={() => setShowAddContactActivity(false)}
              validationRules={formConfig.validationRules}                
            />
        </Box>
      )}
    </Box>
  );
};

EmergencyContactsSection.propTypes = {
  propsContacts: PropTypes.array.isRequired,
  petId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default EmergencyContactsSection;
