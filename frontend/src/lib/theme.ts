import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',

        primary: {
            main: '#D4AF37',
            light: '#E8CC6E',
            dark: '#9E8024',
            contrastText: '#0D1117',
        },

        secondary: {
            main: '#8E24AA',
            light: '#BA68C8',
            dark: '#6A1B7A',
        },

        background: {
            default: '#0D1117',
            paper: '#161B22',
        },
        text: {
            primary: '#E6E6E6',
            secondary: '#8B949E',
        },
        divider: 'rgba(212, 175, 55, 0.12)',

        error: {
            main: '#F85149',
        },
        success: {
            main: '#3FB950',
        },
    },

    shape: {
        borderRadius: 12,
    },

    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: 700,
        },
        h4: {
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: 600,
        },
        h5: {
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        subtitle1: {
            fontWeight: 500,
        },
        button: {
            fontWeight: 600,
            letterSpacing: '0.02em',
        },
    },

    shadows: [
        'none',
        '0 1px 3px rgba(0,0,0,0.4)',
        '0 2px 6px rgba(0,0,0,0.4)',
        '0 4px 12px rgba(0,0,0,0.4)',
        '0 6px 16px rgba(0,0,0,0.5)',
        '0 8px 24px rgba(0,0,0,0.5)',
        '0 12px 32px rgba(0,0,0,0.5)',
        '0 16px 40px rgba(0,0,0,0.6)',
        '0 20px 48px rgba(0,0,0,0.6)',
        '0 24px 56px rgba(0,0,0,0.6)',
        '0 28px 64px rgba(0,0,0,0.7)',
        '0 32px 72px rgba(0,0,0,0.7)',
        '0 36px 80px rgba(0,0,0,0.7)',
        '0 40px 88px rgba(0,0,0,0.8)',
        '0 44px 96px rgba(0,0,0,0.8)',
        '0 48px 104px rgba(0,0,0,0.8)',
        '0 52px 112px rgba(0,0,0,0.8)',
        '0 56px 120px rgba(0,0,0,0.8)',
        '0 60px 128px rgba(0,0,0,0.8)',
        '0 64px 136px rgba(0,0,0,0.8)',
        '0 68px 144px rgba(0,0,0,0.8)',
        '0 72px 152px rgba(0,0,0,0.8)',
        '0 76px 160px rgba(0,0,0,0.8)',
        '0 80px 168px rgba(0,0,0,0.8)',
        '0 84px 176px rgba(0,0,0,0.8)',
    ],

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 20,
                    fontWeight: 600,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                contained: {
                    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.25)',
                    '&:hover': {
                        boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)',
                        transform: 'translateY(-1px)',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(212, 175, 55, 0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                root: {
                    '& .MuiBackdrop-root': {
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        transition: 'all 0.25s ease',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(212, 175, 55, 0.4)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#D4AF37',
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#1C2333',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    padding: '6px 12px',
                },
                arrow: {
                    color: '#1C2333',
                },
            },
        },
        MuiSkeleton: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(212, 175, 55, 0.1)',
                },
            },
        },
    },
});

export default theme;