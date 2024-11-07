import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#795B4A', // חום לסרגל
    },
    secondary: {
      main: '#f50057', // צבע נוסף
    },
    background: {
      default: '#f9f9f9', // צבע רקע לסרגל ניווט
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.8rem',
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      fontWeight: 'bold',
      color: '#795B4A',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f9f9f9', // רקע הסרגל
          borderBottom: '1px solid #795B4A',
          position: 'static',
          top: 0,
          width: '100%',
          zIndex: 100,
          height: '100px',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: 'space-between',
          padding: '0 24px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#795B4A', // צבע הכפתורים האייקוניים בסרגל
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: '80px',
          height: 'auto',
          marginLeft: '10px',
          marginTop: '10px',
          borderRadius: '10px',
          border: '2px solid #795B4A',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: '#795B4A',
          fontWeight: 'bold',
          padding: '24px 32px',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
    },
  },
});

export default theme;
