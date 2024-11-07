import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/utils';
import { addPetMealPlanner, updateMealPlannerById, deleteMealPlannerById } from '../services/petService';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FormFieldsType, formFieldsConfig } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';

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
      setMeals([...meals, response.meal]);
      toast.success('Meal Planner added successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
      toast.error('Failed to add meal planner. Please try again.');
    }
  };

  const handleEditClick = (meal) => {
    setEditMode(true);
    setEditingMeal(meal);
  };

  const handleEditMeal = async (updatedMeal) => {
    setEditingMeal(null);
    setEditMode(false);
    try {
      const response = await updateMealPlannerById(updatedMeal, token);
      setMeals(meals.map(meal => (meal._id === updatedMeal._id ? updatedMeal : meal)));
      toast.success('Meal updated successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
      toast.error('Failed to update meal. Please try again.');
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await deleteMealPlannerById(id, token);
      setMeals(meals.filter(meal => meal._id !== id));
      toast.success('Meal deleted successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
      toast.error('Failed to delete meal. Please try again.');
    }
  };

  const formConfig = editMode ? formFieldsConfig(editingMeal)[FormFieldsType.MEAL_PLANNER] : formFieldsConfig()[FormFieldsType.MEAL_PLANNER];

  return (
    <Box sx={{ backgroundColor: '#fff', boxShadow: 2, border: 1, borderColor: '#ccc', p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Meal Planner</Typography>
      {meals.length > 0 ? (
          <Table aria-label="meal planner table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Food</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Note</strong></TableCell>
                <TableCell><strong>Created Date</strong></TableCell>
                <TableCell><strong>Updated Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meals.map((meal) => (
                <TableRow key={meal._id}>
                  <TableCell>{formatDate(meal.date)}</TableCell>
                  <TableCell>{meal.food}</TableCell>
                  <TableCell>{meal.amount}</TableCell>
                  <TableCell>{meal.note || '-'}</TableCell>
                  <TableCell>{formatDate(meal.created_at)}</TableCell>
                  <TableCell>{meal.updatedDate ? formatDate(meal.updatedDate) : '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="outlined" onClick={() => handleEditClick(meal)}>Edit</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDeleteMeal(meal._id)}>Delete</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      ) : (
        <Typography>No Meal Planner yet.</Typography>
      )}

      {editMode && formConfig && (
        <Box sx={{ padding: 2, marginTop: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
          <GenericActivityForm
            title= {formConfig.title}
            fields={formConfig.fields}
              onSave={handleEditMeal}
              onClose={() => setEditMode(false)}
              validationRules={formConfig.validationRules}  
              initialData={editingMeal}              
            />
        </Box>
      )}

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddMealClick}>
        Add Meal
      </Button>

      {showAddMealActivity && formConfig &&(
        <Box sx={{ padding: 2, marginTop: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
           <GenericActivityForm
            title= {formConfig.title}
            fields={formConfig.fields}
              onSave={handleAddMeal}
              onClose={() => setShowAddMealActivity(false)}
              validationRules={formConfig.validationRules}                
            />
        </Box>
      )}
    </Box>
  );
};

MealPlannerSection.propTypes = {
  propsMeals: PropTypes.array.isRequired,
  petId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default MealPlannerSection;
