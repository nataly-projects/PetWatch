import React from 'react';
import { Select, MenuItem, TextField, InputAdornment, FormControl, InputLabel, Box } from '@mui/material';

const FilterSection = ({
    filterType, handleTypeChange, startDate, handleStartDateChange, endDate, 
    handleEndDateChange, handleMinAmountChange, minAmount, selectOptions, isExpenseFilter 
}) => {
  return (
    <Box 
      display="flex"
      gap={2}
      sx={{ width: '100%' }}
    >

      {/* Filter Type */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={filterType}
          onChange={handleTypeChange}
          label="Type"
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              height: '60px' 
            },
          }}
          >
          <MenuItem value="">All</MenuItem>
          {Object.entries(selectOptions).map(([key, value]) => (
            <MenuItem key={key} value={value}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Start Date */}
      <FormControl variant="standard" size="small">
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}

        />
      </FormControl>

      {/* End Date */}
      <FormControl variant="standard" size="small">
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
        />
      </FormControl>

      {isExpenseFilter && (
        <FormControl variant="standard" size="small">
          <TextField
            label="Min Amount"
            type="number"
            value={minAmount}
            onChange={handleMinAmountChange}
          />
        </FormControl>
      )}
      </Box>
  );
};

export default FilterSection;
