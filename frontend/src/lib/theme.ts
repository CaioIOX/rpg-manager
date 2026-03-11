import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: '#D4AF37', // Dourado clássico (Metallic Gold)
      light: '#F3E5F5',
      dark: '#9E8024',
      contrastText: '#121212', // Texto escuro para contrastar dentro de botões dourados
    },
    // Uma cor secundária opcional (ex: um vermelho escuro ou roxo místico)
    secondary: {
      main: '#8E24AA', 
    },
    // Tons escuros como base para o fundo e "papéis" (cards, modais, etc)
    background: {
      default: '#0D1117', // Fundo bem escuro, quase um "céu noturno" ou masmorra
      paper: '#161B22',   // Superfícies um pouco mais claras para dar profundidade
    },
    text: {
      primary: '#E6E6E6', // Branco levemente acinzentado para não cansar a vista
      secondary: '#A0AABF', // Cinza azulado para textos menos importantes
    },
  },
  typography: {
    // Dica para RPG: Você pode usar uma fonte Serifada para títulos (h1, h2, etc) 
    // e manter uma Sans-serif para os textos de leitura.
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
  // Opcional: Personalizar o estilo global dos componentes do MUI
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove o texto todo em maiúsculo padrão do MUI
          borderRadius: 4,       // Bordas levemente arredondadas
        },
      },
    },
  },
});

export default theme;