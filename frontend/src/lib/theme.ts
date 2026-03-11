import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',

        primary: {
            main: '#D4AF37',
            light: '#F3E5F5',
            dark: '#9E8024',
            contrastText: '#121212',
        },

        secondary: {
            main: '#8E24AA',
        },

        background: {
            default: '#0D1117',
            paper: '#161B22',
        },
        text: {
            primary: '#E6E6E6',
            secondary: '#A0AABF',
        },
    },
    typography: {

        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: 700,
        },
        h2: {
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: 700,
        },
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 4,
                },
            },
        },
    },
});

export default theme;