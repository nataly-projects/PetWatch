import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ActivityType } from '../utils/utils';

const HealthInformationSection = ({ 
  medicalConditions, 
  medications, 
  allergies, 
  onEdit, 
  onDelete 
}) => {

  const handleEdit = (item, type) => {
    onEdit(item, type);
  };

  const handleDelete = (item, type) => {
    onDelete(item, type);
  };

  return (
    <div className="health-information">
      <h3>Health Information</h3>

      <h4>Medical Conditions:</h4>
      <div className="health-info-cards">
        {medicalConditions.length > 0 ? (
          medicalConditions.map(condition => (
            <div className="health-info-card" key={condition._id}>
              <div className='health-info-header'>
                <h4>{condition.name}</h4>
                <div className="health-info-actions">
                  <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(condition, ActivityType.MEDICAL_CONDITION)} />
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(condition, ActivityType.MEDICAL_CONDITION)} />
                </div>
              </div>
              <p><strong>Description:</strong> {condition.description}</p>
              {condition.note && <p><strong>Note:</strong> {condition.note}</p>}
              {condition.continuedTreatment && <p><strong>Continued Treatment:</strong> {condition.continuedTreatment}</p>}
              <p><strong>Date Diagnosed:</strong> {new Date(condition.dateDiagnosed).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No Medical Conditions</p>
        )}
      </div>

      <h4>Medications:</h4>
      <div className="health-info-cards">
        {medications.length > 0 ? (
          medications.map(medication => (
            <div className="health-info-card" key={medication._id}>
              <div className='health-info-header'>
                <h4>{medication.name}</h4>
                <div className="health-info-actions">
                  <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(medication, ActivityType.MEDICATION)} />
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(medication, ActivityType.MEDICATION)} />
                </div>
              </div>
              <p><strong>Dosage:</strong> {medication.dosage}</p>
              {medication.note && <p><strong>Note:</strong> {medication.note}</p>}
              <p><strong>Start Date:</strong> {new Date(medication.startDate).toLocaleDateString()} - 
              <strong> End Date:</strong> {new Date(medication.endDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No Medications</p>
        )}
      </div>

      <h4>Allergies:</h4>
      <div className="health-info-cards">
        {allergies.length > 0 ? (
          allergies.map(allergy => (
            <div className="health-info-card" key={allergy._id}>
              <div className='health-info-header'>
                <h4>{allergy.name}</h4>
                <div className="health-info-actions">
                  <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(allergy, ActivityType.ALLERGY)} />
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(allergy, ActivityType.ALLERGY)} />
                </div>
              </div>
              <p><strong>Treatment:</strong> {allergy.treatment}</p>
              {allergy.note && <p><strong>Note:</strong> {allergy.note}</p>}
              <p><strong>Date:</strong> {new Date(allergy.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No Allergies</p>
        )}
      </div>
    </div>
  );
};

export default HealthInformationSection;
