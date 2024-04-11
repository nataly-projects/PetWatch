import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActivityType, ExpenseCategory, RoutineCareActivityItems, VaccineRecordType } from '../utils/utils';
import VaccineRecordActivity from './VaccineRecordActivity';
import RoutineCareActivity from './RoutineCareActivity';
import ExpenseActivity from './ExpenseActivity';
import NoteActivity from './NoteActivity';
import AllergyActivity from './AllergyActivity';
import MedicationActivity from './MedicationActivity';
import VetVisitActivity from './VetVisitActivity';
import OtherActivity from './OtherActivity';
import '../styles/AddActivityPopup.css';

const AddActivityPopup = ({ onActivitySelect, onClose }) => {
    const [initialItems, setInitialItems] = useState(ActivityType);
    const [expandedActivity, setExpandedActivity] = useState(false);
    const [expandedItems, setExpandedItems] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedNestedActivity, setSelectedNestedActivity] = useState(null);
    const [showActivityComponent, setShowActivityComponent] = useState(false);

    const handleActivityClick = (activity) => {
        console.log('choosen activity: ', activity);
        if (activity.items) {
            switch (activity.name){
                case 'VACCINE_RECORD':
                    setInitialItems(null);
                    setShowActivityComponent(false);
                    setExpandedItems(VaccineRecordType);
                    setSelectedActivity(activity);
                    setExpandedActivity(true);
                    return;
                case 'ROUTINE_CARE':
                    setInitialItems(null);
                    setShowActivityComponent(false);
                    setExpandedActivity(true);
                    setSelectedActivity(activity);
                    setExpandedItems(RoutineCareActivityItems);
                    return;
                case 'EXPENSE': 
                    setInitialItems(null);
                    setShowActivityComponent(false);
                    setExpandedActivity(true);
                    setSelectedActivity(activity);
                    setExpandedItems(ExpenseCategory);
                    return;
                default:
                    setInitialItems(ActivityType);
                    setExpandedActivity(false);
                    setExpandedItems(null);
                    return null;
            }
        } else {
            setShowActivityComponent(true);
            setSelectedActivity(activity);
            setInitialItems(ActivityType);
            setExpandedActivity(false);
            setExpandedItems(null); 
            // onActivitySelect(activity);
        }
    };

    const handleNestedItemClick = (item) => {
        console.log('handleNestedItemClick: ', item);
        setSelectedNestedActivity(item);
        setShowActivityComponent(true);
    };

    const handleSave = (data) => {
        // Handle saving data based on the selected activity type
        console.log('Saving data:', data);
        // Call onActivitySelect or any other appropriate function
        onActivitySelect(selectedActivity, data);
    };


    return (
        <div className="add-activity-popup">
            
            {!showActivityComponent 
            ? 
            <>
            <h3>Choose Activity to Add</h3>
            <div className="activity-grid">
            {initialItems !== null && (
                <>
                {initialItems.map((activity, index) => (
                <div key={index} className="activity-card" onClick={() => handleActivityClick(activity)}>
                    <FontAwesomeIcon className="icon" icon={activity.icon} />
                    <span>{activity.value}</span>
                </div>
                )  
            )}
            </>   
            )}
            {expandedItems !== null && expandedActivity  && (
            <>
            {expandedItems.map((item, idx) => (
                <div key={idx} className="activity-card" onClick={() => handleNestedItemClick(item)}>
                {item.icon ? <FontAwesomeIcon className="icon" icon={item.icon} /> : null}
                <span>{item.value}</span>
                </div>
            ))}
            </>
            )}
            </div>
            </>
                
            :
            <div>
                {selectedActivity.name === 'VACCINE_RECORD' && 
                <VaccineRecordActivity 
                onSave={handleSave} 
                vaccineType={selectedNestedActivity} 
                />}
                {selectedActivity.name === 'ROUTINE_CARE' && 
                <RoutineCareActivity 
                onSave={handleSave} 
                routineCareType={selectedNestedActivity}
                />} 
                {selectedActivity.name === 'EXPENSE' && 
                <ExpenseActivity 
                onSave={handleSave}
                expenseCategory={selectedNestedActivity} 
                />} 
                {selectedActivity.name === 'NOTE' && 
                <NoteActivity 
                onSave={handleSave} 
                />}
                {selectedActivity.name === 'ALLERGY' && 
                <AllergyActivity 
                onSave={handleSave} 
                />}
                {selectedActivity.name === 'MEDICATION' && 
                <MedicationActivity 
                onSave={handleSave} 
                />}
                {selectedActivity.name === 'VET_VISIT' && 
                <VetVisitActivity 
                onSave={handleSave} 
                />}
                {selectedActivity.name === 'OTHER' && 
                <OtherActivity 
                onSave={handleSave} 
                />}
            </div>
            }
          
            <button className='btn' onClick={onClose}>Cancel</button>
        </div>
    );
};



export default AddActivityPopup;
