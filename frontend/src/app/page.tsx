import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LoginPage from './auth/login/page'

export default function Home() {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", textAlign: "center", pt: 16 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        RPG Manager
      </Typography>
      <Box sx={{ p: 4 }}>
        <LoginPage />
      </Box>
    </Box>
  )
}