import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD600', // Amarelo
      contrastText: '#212121',
    },
    secondary: {
      main: '#1976D2', // Azul
      contrastText: '#fff',
    },
    success: {
      main: '#43A047', // Verde
      contrastText: '#fff',
    },
    info: {
      main: '#90A4AE', // Cinza
      contrastText: '#212121',
    },
    background: {
      default: '#F5F5F5',
      paper: '#fff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-1px' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    h3: { fontWeight: 500, fontSize: '1.5rem' },
    body1: { fontSize: '1.1rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme; 