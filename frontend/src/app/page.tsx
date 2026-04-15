import Box from "@mui/material/Box";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ShowcaseSection from "@/components/landing/ShowcaseSection";
import Footer from "@/components/landing/Footer";

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
      }}
    >
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <Footer />
    </Box>
  );
}
