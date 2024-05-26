import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/utils';
import MealPlannerActivity from './MealPlannerActivity';
import { addPetMealPlanner, updateMealPlannerById, deleteMealPlannerById  } from '../services/petService';
import '../styles/section.css';

const MealPlannerSection = ({ propsMeals, petId, token }) => {
  const navigate = useNavigate();

  const [meals, setMeals] = useState(propsMeals);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddMealActivity, setShowAddMealActivity] = useState(false);

    const handleAddMealClick = () => {
      setShowAddMealActivity(true);
    };

  const handleAddMeal = async (meal) => {
    setShowAddMealActivity(false);
    try {
        const response = await addPetMealPlanner(petId, meal, token);
        console.log(response.meal);
        setMeals([...meals, response.meal]);
        toast.success('Meal Planner added successfully!');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('UNAUTHORIZED_ERROR');
          navigate('/login');
        }
        toast.error('Failed to adding meal planner. Please try again.');
      }
  };

  const handleEditClick = (meal) => {
    setEditMode(true);
    setEditingMeal(meal);
  }

  const handleEditMeal = async (updatedMeal) => {
    setEditingMeal(null);
    setEditMode(false);
    
    try {
      const response = await updateMealPlannerById(updatedMeal, token);
      console.log(response);
      setMeals(meals.map(meal => (meal._id === updatedMeal._id ? updatedMeal : meal)));
      toast.success('Meal updated successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        navigate('/login');
      }
      toast.error('Failed to updating meal. Please try again.');
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await deleteMealPlannerById(id, token);
      setMeals(meals.filter(meal => meal._id !== id));
      toast.success('Meal deleted successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        navigate('/login');
      }
      toast.error('Failed to delete meal. Please try again.');
    }
  };

  return (
    <div className="section">
      <h3>Meal Planner</h3>
      { meals.length > 0 ?
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Food</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.map(meal => (
            <tr key={meal._id}>
              <td>{formatDate(meal.date)}</td>
              <td>{meal.food}</td>
              <td>{meal.amount}</td>
              <td>{meal.note ? meal.note : '-'}</td>
              <td>{formatDate(meal.created_at)}</td>
              <td>{meal.updatedDate ? formatDate(meal.updatedDate) : '-'}</td>
                <td>
                  <div className='actions'>
                    <button className='btn' onClick={() => handleEditClick(meal)}>Edit</button>
                    <button className='btn' onClick={() => handleDeleteMeal(meal._id)}>Delete</button>
                  </div>          
                </td>
            </tr>
          ))}
        </tbody>
        </table>
        :
        <p>No Meal Planner yet.</p>
        }
        { editMode && (
          <div className='add-activity-card'>
            <MealPlannerActivity 
            onSave={(data) => handleEditMeal(data)} 
            onClose={() => setEditMode(false)}
            mealToEdit={editingMeal}
            />
          </div>
        )}
 
        <button className='btn' onClick={handleAddMealClick}>Add Meal</button>
        {showAddMealActivity && (
          <div className='add-activity-card'>
            <MealPlannerActivity 
            onSave={(data) => handleAddMeal(data)} 
            onClose={() => setShowAddMealActivity(false)}
            />
          </div>
        )}
    </div>
  );
};

MealPlannerSection.propTypes = {
  propsMeals: PropTypes.array.isRequired,
  petId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
};

export default MealPlannerSection;
