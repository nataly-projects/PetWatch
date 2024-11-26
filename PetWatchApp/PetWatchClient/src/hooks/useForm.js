import { useState } from 'react';

export const useForm = (initialValues, validationRules) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const validationErrors = {};
    Object.keys(validationRules).forEach((field) => {
      if (!formData[field]) {
        validationErrors[field] = `${validationRules[field]} is required`;
      }
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return { formData, errors, handleChange, validate };
};
