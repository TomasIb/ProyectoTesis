import { createMuiTheme } from '@material-ui/core/styles';

const materialTheme = createMuiTheme({
  overrides: {
    MuiButton: {
      text: {
        height: 44,
      },
      textSizeLarge: {
        height: 44,
        padding: '0 30px 0 30px',
      },
    },
  },
  palette: {
    primary: {
      light: '#0E5858',
      main: '#083232',
      dark: '#062323',
      contrastText: '#fff',
    },
    secondary: {
      light: '#46adfa',
      main: '#1d8cf8',
      dark: '#388bc9',
      contrastText: '#fff',
    },
    error: {
      light: '#FC1B45',
      main: '#f44336', //f44336
      dark: '#FF728D',
      contrastText: '#fff',
    },
    success: {
      light: '#00AA44',
      main: '#1d8cf8', //fd5d93
      dark: '#4BE087',
      contrastText: '#fff',
    },
    info: {
      light: '#0E5858',
      main: '#0E5858',
      dark: '#61CDED',
      contrastText: '#fff',
    },
    warning: {
      light: '#FDCA04',
      main: '#ffd36f', //fd5d93
      dark: '#FFECA2',
    },

    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'Rubik',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Paytone One"',
    ].join(','),
  },
});


export default materialTheme;


