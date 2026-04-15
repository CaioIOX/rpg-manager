"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/system";
import { useLocale } from "@/lib/i18n";

// ─── Animations ───────────────────────────────────────────────────────────────

const glowPulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

// ─── Showcase items ───────────────────────────────────────────────────────────
// Items are now defined inside the component to use the translation hook.

// ─── Showcase card ────────────────────────────────────────────────────────────

function ShowcaseCard({
  item,
  index,
}: {
  item: { title: string; description: string; image: string; alt: string };
  index: number;
}) {
  const isReversed = index % 2 !== 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: isReversed ? "row-reverse" : "row",
        },
        alignItems: "center",
        gap: { xs: 4, md: 6 },
        mb: { xs: 8, md: 0 },
      }}
    >
      {/* Text side */}
      <Box
        sx={{
          flex: { md: "0 0 35%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 2,
            color: "text.primary",
            fontSize: { xs: "1.6rem", md: "2rem" },
            lineHeight: 1.2,
          }}
        >
          {item.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            lineHeight: 1.7,
            fontSize: { xs: "0.95rem", md: "1.05rem" },
          }}
        >
          {item.description}
        </Typography>
      </Box>

      {/* Image side */}
      <Box
        sx={{
          flex: { md: "0 0 60%" },
          position: "relative",
        }}
      >
        {/* Subtle glow */}
        <Box
          sx={{
            position: "absolute",
            inset: "-10%",
            background:
              index % 2 === 0
                ? "radial-gradient(ellipse, rgba(212, 175, 55, 0.06) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(142, 36, 170, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
            animation: `${glowPulse} 4s ease-in-out infinite`,
          }}
        />
        <Box
          component="img"
          src={item.image}
          alt={item.alt}
          sx={{
            position: "relative",
            width: "100%",
            height: "auto",
            borderRadius: { xs: "10px", md: "14px" },
            border: "1px solid rgba(212, 175, 55, 0.12)",
            boxShadow:
              "0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 0 60px rgba(142, 36, 170, 0.06)",
            transition: "transform 0.4s ease, box-shadow 0.4s ease",
            "&:hover": {
              transform: "scale(1.015)",
              boxShadow:
                "0 25px 60px -10px rgba(0, 0, 0, 0.6), 0 0 80px rgba(212, 175, 55, 0.1)",
            },
          }}
        />
      </Box>
    </Box>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ShowcaseSection() {
  const { t } = useLocale();

  const showcaseItems = [
    {
      title: t.landing.showcaseEditorTitle,
      description: t.landing.showcaseEditorDesc,
      image: "/screenshots/editor.png",
      alt: t.landing.showcaseEditorTitle,
    },
    {
      title: t.landing.showcaseTemplateTitle,
      description: t.landing.showcaseTemplateDesc,
      image: "/screenshots/template.png",
      alt: t.landing.showcaseTemplateTitle,
    },
    {
      title: t.landing.showcaseLorenaTitle,
      description: t.landing.showcaseLorenaDesc,
      image: "/screenshots/lorena.png",
      alt: t.landing.showcaseLorenaTitle,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 8, md: 14 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          height: "80%",
          background:
            "radial-gradient(ellipse, rgba(142, 36, 170, 0.08) 0%, transparent 70%)",
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
          {t.landing.showcaseTitle}
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            mx: "auto",
            mb: { xs: 6, md: 10 },
            color: "text.secondary",
            maxWidth: "600px",
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          {t.landing.showcaseSubtitle}
        </Typography>

        {/* Showcase items — alternating layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 4, md: 12 },
          }}
        >
          {showcaseItems.map((item, idx) => (
            <ShowcaseCard key={idx} item={item} index={idx} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
