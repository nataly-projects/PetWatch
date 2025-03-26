import { createStore } from 'redux';

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  theme: 'light'
};


const rootReducer = (state = initialState, action) => {
  console.log('action:',
    action);
  switch (action.type) {
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload.user,
        token: action.payload.token, 
        isLoggedIn: true,
        theme: action.payload.user.theme || 'light',
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null, 
        isLoggedIn: false, 
        theme: 'light' 
      };
      case 'SET_THEME':
        return { 
          ...state, 
          theme: action?.payload ?? 'light'
        };
    default:
        return state;
  }
};

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

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
  }
};

const store = createStore(rootReducer, loadState());

store.subscribe(() => {
  saveState(store.getState());
});


export default store;
