"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import GroupsIcon from "@mui/icons-material/Groups";

const features = [
  {
    title: "Editor Riquíssimo",
    description: "Escreva lore imersiva usando um editor Markdown avançado (TipTap). Formate parágrafos, insira tabelas e construa seu mundo sem esforço.",
    icon: <AutoFixHighIcon sx={{ fontSize: "2rem", color: "#D4AF37" }} />,
  },
  {
    title: "Links Interconectados",
    description: "Mencione personagens, locais e itens com um atalho (@). Dê vida ao seu RPG criando pontes dinâmicas entre os documentos da campanha.",
    icon: <AccountTreeIcon sx={{ fontSize: "2rem", color: "#BA68C8" }} />,
  },
  {
    title: "Templates & Pastas",
    description: "Chega de copiar e colar arquétipos. Defina templates com campos customizados para suas raças/NPCs e os organize lindamente em pastas.",
    icon: <FolderSpecialIcon sx={{ fontSize: "2rem", color: "#D4AF37" }} />,
  },
  {
    title: "Multiplayer Integrado",
    description: "Tudo que você escreve sincroniza magicamente. Junte seus amigos para editarem os mesmos documentos em Tempo Real com Yjs.",
    icon: <GroupsIcon sx={{ fontSize: "2rem", color: "#BA68C8" }} />,
  },
];

export default function FeaturesSection() {
  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 8, md: 15 },
        bgcolor: "background.default",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 800,
            mb: { xs: 3, md: 5 },
            background: "linear-gradient(135deg, #FFFFFF 0%, #BA68C8 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Para Mestres de Respeito
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mx: "auto", mb: { xs: 8, md: 10 }, color: "text.secondary", maxWidth: 600, fontSize: "1.1rem" }}
        >
          Descubra ferramentas imersivas desenvolvidas perfeitamente para auxiliar mestres e campanhas ao redor do globo.
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box
                sx={{
                  height: "100%",
                  bgcolor: "rgba(22, 27, 34, 0.4)",
                  border: "1px solid rgba(212, 175, 55, 0.08)",
                  borderRadius: "24px",
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  // No interactive hover effects per user request to avoid misinterpretation of buttons
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "16px",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: "text.primary" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, fontSize: "0.95rem" }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
