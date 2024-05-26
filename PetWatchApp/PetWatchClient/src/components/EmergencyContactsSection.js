import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/utils';
import EmergencyContactsActivity from './EmergencyContactsActivity';
import { addPetEmergencyContact, updateEmergencyContactById, deleteEmergencyContactById } from '../services/petService';
import '../styles/section.css';

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
        console.log(response.contact);
        setContacts([...contacts, response.contact]);
        toast.success('Emergency contact added successfully!');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('UNAUTHORIZED_ERROR');
          navigate('/login');
        }
        toast.error('Failed to adding emergency contact. Please try again.');
      }
  };
  
  const handleEditClick = (contact) => {
    setEditMode(true);
    setEditingContact(contact);
  }

  const handleEditContact = async (updatedContact) => {
    setEditingContact(null);
    setEditMode(false);
    
    try {
      const response = await updateEmergencyContactById(updatedContact, token);
      console.log(response);
      setContacts(contacts.map(contact => (contact._id === updatedContact._id ? updatedContact : contact)));
      toast.success('Emergency Contact updated successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        navigate('/login');
      }
      toast.error('Failed to updating emergency contact. Please try again.');
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await deleteEmergencyContactById(id, token);
      setContacts(contacts.filter(contact => contact._id !== id));
      toast.success('Emergency Contact deleted successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        navigate('/login');
      }
      toast.error('Failed to delete emergency contact. Please try again.');
    }
  };
  

  return (
      <div className="section">
      <h3>Emergency Contacts</h3>
      { contacts.length > 0 ?
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.phone}</td>
              <td>{contact.relationship}</td>
              <td>{formatDate(contact.created_at)}</td>
              <td>{contact.updatedDate ? formatDate(contact.updatedDate) : '-'}</td>
                <td>
                  <div className='actions'>
                    <button className='btn' onClick={() => handleEditClick(contact)}>Edit</button>
                    <button className='btn' onClick={() => handleDeleteContact(contact._id)}>Delete</button>
                  </div>          
                </td>
            </tr>
          ))}
        </tbody>
        </table>
        :
        <p>No Emergency Contacts yet.</p>
        }
        { editMode && (
          <div className='add-activity-card'>
            <EmergencyContactsActivity 
            onSave={(data) => handleEditContact(data)} 
            onClose={() => setEditMode(false)}
            contactToEdit={editingContact}
            />
          </div>
        )}
 
        <button className='btn' onClick={handleAddContactClick}>Add Contact</button>
        {showAddContactActivity && (
          <div className='add-activity-card'>
            <EmergencyContactsActivity 
            onSave={(data) => handleAddContact(data)} 
            onClose={() => setShowAddContactActivity(false)}
            />
          </div>
        )}
    </div>
  );
};

EmergencyContactsSection.propTypes = {
  propsContacts: PropTypes.array.isRequired,
  petId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
};

export default EmergencyContactsSection;
