"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/system";

const floatContainer = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export default function ShowcaseSection() {
  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 8, md: 15 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "80%",
          background: "radial-gradient(ellipse, rgba(142, 36, 170, 0.15) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 800,
            mb: { xs: 2, md: 3 },
            color: "text.primary",
            fontSize: { xs: "2rem", md: "2.8rem" },
          }}
        >
          Um Vislumbre do Compêndio
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            mx: "auto",
            mb: { xs: 6, md: 8 },
            color: "text.secondary",
            maxWidth: "600px",
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          Interface projetada do zero para ser intuitiva, bela e livre de distrações, deixando o foco apenas no que importa: a sua história.
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: "1000px",
            mx: "auto",
            height: { xs: "300px", md: "500px" },
            bgcolor: "rgba(13, 17, 23, 0.8)", // GitHub dark mode inspired bg
            borderRadius: "16px",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px rgba(142, 36, 170, 0.15)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: `${floatContainer} 6s ease-in-out infinite`,
          }}
        >
          {/* Mockup Top Bar */}
          <Box
            sx={{
              height: "40px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              px: 2,
              gap: 1,
            }}
          >
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#FF5F56" }} />
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#FFBD2E" }} />
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#27C93F" }} />
          </Box>
          
          {/* Mockup Body */}
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Sidebar */}
            <Box
              sx={{
                width: { xs: "0px", md: "250px" },
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                p: 2,
                gap: 2,
              }}
            >
              {[1, 2, 3, 4, 5].map((item) => (
                <Box key={item} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: "4px", bgcolor: "rgba(212, 175, 55, 0.1)" }} />
                  <Box sx={{ flex: 1, height: 12, borderRadius: "4px", bgcolor: "rgba(255, 255, 255, 0.05)" }} />
                </Box>
              ))}
            </Box>

            {/* Main Content Area */}
            <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Title representation */}
              <Box sx={{ width: "40%", height: 32, borderRadius: "6px", bgcolor: "rgba(212, 175, 55, 0.15)" }} />
              
              {/* Paragraphs representation */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ width: "100%", height: 12, borderRadius: "4px", bgcolor: "rgba(255, 255, 255, 0.05)" }} />
                <Box sx={{ width: "95%", height: 12, borderRadius: "4px", bgcolor: "rgba(255, 255, 255, 0.05)" }} />
                <Box sx={{ width: "80%", height: 12, borderRadius: "4px", bgcolor: "rgba(255, 255, 255, 0.05)" }} />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                <Box sx={{ width: "90%", height: 12, borderRadius: "4px", bgcolor: "rgba(255, 255, 255, 0.05)" }} />
                <Box sx={{ width: "60%", height: 12, borderRadius: "4px", bgcolor: "rgba(255, 255, 255, 0.05)" }} />
              </Box>

              {/* Special block representing a template field or mention */}
              <Box
                sx={{
                  mt: "auto",
                  width: "100%",
                  height: 60,
                  borderRadius: "8px",
                  bgcolor: "rgba(142, 36, 170, 0.1)",
                  border: "1px solid rgba(142, 36, 170, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                }}
              >
                <Box sx={{ width: "30%", height: 12, borderRadius: "4px", bgcolor: "rgba(142, 36, 170, 0.3)" }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
