import { createStore } from 'redux';

// Define the initial state
const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
};


const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload.user, token: action.payload.token, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isLoggedIn: false };
    default:
        return state;
  }
};

// Load state from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    // Handle errors while saving state
  }
};

// Create the Redux store with initial state from localStorage
const store = createStore(rootReducer, loadState());

// Subscribe to store changes and save state to localStorage
store.subscribe(() => {
  saveState(store.getState());
});


export default store;
