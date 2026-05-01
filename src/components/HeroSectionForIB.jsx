// import { Button } from "./ui/button"
// import { Award, ArrowRight, Sparkles } from "lucide-react";
// import heroImage from "../assets/hero-luxury-elite.jpg";

// export const HeroSection = () => {
//   return (
//     <section className="relative bg-gradient-hero min-h-[600px] flex items-center justify-center overflow-hidden">
//       {/* Background image with overlay */}
//       <div className="absolute inset-0 opacity-40">
//         <img
//           src={heroImage}
//           alt="Luxury lifestyle - Rolls Royce with Dubai skyline and gold coins"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
//       </div>

//       {/* Animated particles */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-primary rounded-full animate-float opacity-30"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${5 + Math.random() * 5}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Content */}
//       <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-24">
//         <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card mb-8 animate-fade-in border-2 border-primary/20">
//           <Award className="h-5 w-5 text-primary animate-glow" />
//           <span className="text-sm font-bold text-foreground tracking-wide">FLEXY IB ELITE REWARDS PROGRAM</span>
//           <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
//         </div>

//         <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in">
//           <span className="text-foreground">Drive a Ferrari.</span>
//           <br />
//           <span className="text-foreground">Own a Rolex.</span>
//           <br />
//           <span className="text-gradient-gold">Live in Dubai.</span>
//         </h1>

//         <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in font-light">
//           Join the <span className="text-primary font-bold">Elite IB Circle</span> and transform referrals into
//           <span className="text-secondary font-bold"> luxury supercars, designer watches, and unlimited wealth</span>.
//           Your Ferrari is waiting.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
//           <Button variant="luxury" size="lg" className="text-lg px-12 py-6 group">
//             Claim Your Ferrari Now
//             <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2" />
//           </Button>
//           <Button variant="elite" size="lg" className="text-lg px-12 py-6">
//             See Who's Already Driving
//           </Button>
//         </div>

//         <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
//             <span>247 Ferraris awarded</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
//             <span>Instant luxury approval</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
//             <span>$127M in rewards paid</span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
















import { Box, Button, Stack, Typography } from "@mui/material";
import { Award, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "../assets/hero-luxury-elite.jpg";

export const HeroSection = ({ applicationFormRef }) => {

  const handleScrollToSection = (ref) => {
    if (ref && ref.current) {
      const yOffset = -50;
      const y = ref.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        minHeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(to bottom right, #0a0a0a, #1a1a1a)",
      }}
    >
      {/* Background Image with Overlay */}
      <Box sx={{ position: "absolute", inset: 0, opacity: 0.4 }}>
        <Box
          component="img"
          src={heroImage}
          alt="Luxury lifestyle - Rolls Royce with Dubai skyline and gold coins"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.8), rgba(10,10,10,0.5), rgba(10,10,10,1))",
          }}
        />
      </Box>

      {/* Floating Particles */}
      <Box sx={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              opacity: 0.3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-20px)" },
              },
            }}
          />
        ))}
      </Box>

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          px: 3,
          py: { xs: 12, md: 24 },
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {/* Tagline */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="center"
          sx={{
            px: 4,
            py: 1.5,
            mb: 6,
            borderRadius: "999px",
            border: "2px solid",
            borderColor: "primary.main",
            bgcolor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            animation: "fadeIn 1s ease-in-out",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Award size={20} color="#f5c542" />
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ letterSpacing: 1.2 }}
          >
            FLEXY IB ELITE REWARDS PROGRAM
          </Typography>
          <Sparkles size={18} color="#FFD700" />
        </Stack>

        {/* Headline */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 4,
            lineHeight: 1.2,
            animation: "fadeIn 1.5s ease-in-out",
            color: "#fff",
            fontSize: { xs: "2.5rem", md: "4rem" },
          }}
        >
          <Box component="span" sx={{ display: "block" }}>
            Drive a Ferrari.
          </Box>
          <Box component="span" sx={{ display: "block" }}>
            Own a Rolex.
          </Box>
          <Box
            component="span"
            sx={{
              display: "block",
              background: "linear-gradient(90deg, #FFD700, #f5c542)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Live in Dubai.
          </Box>
        </Typography>

        {/* Subtext */}
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.7)",
            mb: 6,
            maxWidth: 700,
            mx: "auto",
            animation: "fadeIn 1.8s ease-in-out",
            fontWeight: 300,
          }}
        >
          Join the{" "}
          <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
            Elite IB Circle
          </Box>{" "}
          and transform referrals into{" "}
          <Box
            component="span"
            sx={{ color: "secondary.main", fontWeight: 600 }}
          >
            luxury supercars, designer watches, and unlimited wealth
          </Box>
          . Your Ferrari is waiting.
        </Typography>

        {/* Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{
            animation: "fadeIn 2s ease-in-out",
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              fontSize: "1.125rem",
              px: 6,
              py: 2,
              bgcolor: "primary.main",
              color: "#fff",
              borderRadius: "999px",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateX(4px)",
                bgcolor: "primary.dark",
              },
            }}
            endIcon={<ArrowRight />}
            onClick={() => handleScrollToSection(applicationFormRef)}
          >
            Claim Your Ferrari Now
          </Button>
          {/* <Button
            variant="outlined"
            size="large"
            sx={{
              fontSize: "1.125rem",
              px: 6,
              py: 2,
              borderRadius: "999px",
              color: "#fff",
              borderColor: "secondary.main",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
                borderColor: "secondary.light",
              },
            }}
          >
            See Who's Already Driving
          </Button> */}
        </Stack>

        {/* Stats */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          justifyContent="center"
          alignItems="center"
          sx={{
            mt: 8,
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.9rem",
            animation: "fadeIn 2.3s ease-in-out",
          }}
        >
          {[
            { color: "primary.main", text: "247 Ferraris awarded" },
            { color: "secondary.main", text: "Instant luxury approval" },
            { color: "primary.main", text: "$127M in rewards paid" },
          ].map((item, i) => (
            <Stack key={i} direction="row" alignItems="center" spacing={1.2}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: item.color,
                  animation: "pulse 1.5s infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.3 },
                  },
                }}
              />
              <Typography variant="body2">{item.text}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};