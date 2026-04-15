import Box from "@mui/material/Box";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ShowcaseSection from "@/components/landing/ShowcaseSection";
import Footer from "@/components/landing/Footer";
import LanguageSwitch from "@/components/layout/LanguageSwitch";

export default function Home() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 20, right: { xs: 20, md: 40 }, zIndex: 1100 }}>
        <LanguageSwitch />
      </Box>
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <Footer />
    </Box>
  );
}
