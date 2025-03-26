import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#9e918d' : '#795B4A', 
      },
      secondary: {
        main: isDark ? '#FF4081' : '#f50057', 
      },
      background: {
        default: isDark ? '#615454' : '#f9f9f9',
        paper: isDark ? '#7a7676' : '#ffffff',
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
        color: isDark ? '#A1887F' : '#795B4A',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#424242' : '#f9f9f9',
            borderBottom: `1px solid ${isDark ? '#A1887F' : '#795B4A'}`,
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
            color: isDark ? '#A1887F' : '#795B4A',
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
            border: `2px solid ${isDark ? '#A1887F' : '#795B4A'}`,
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: 'none',
            color: isDark ? '#A1887F' : '#795B4A',
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
};

export default getTheme;
