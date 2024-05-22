import React from 'react';

const FilterSection = (
    { filterType, handleTypeChange, startDate, handleStartDateChange, endDate, 
        handleEndDateChange, handleMinAmountChange, minAmount, selectOptions, isExpenseFilter  }) => {
  return (
    <div className='filter-section'>
      <div className='input-container'>
        <label>Type:</label>
        <select value={filterType} onChange={handleTypeChange} className='input-field'>
          <option value="">All</option>
          {Object.entries(selectOptions).map(([key, value]) => (
            <option key={key} value={value}>{value}</option>
          ))}
        </select>
      </div>

      <div className='input-container'>
        <label>Start Date:</label>
        <input
          className='input-field'
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
        />
      </div>

      <div className='input-container'>
        <label>End Date:</label>
        <input
          className='input-field'
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>

      {isExpenseFilter && (
        <div className='input-container'>
          <label>Min Amount:</label>
          <input
            className='input-field'
            type="number"
            value={minAmount}
            onChange={handleMinAmountChange}
          />
        </div>
      )}

    </div>
  );
};

export default FilterSection;
