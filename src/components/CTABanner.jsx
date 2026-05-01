// import { Button } from "./ui/button";
// import { ArrowRight, CheckCircle2, Crown } from "lucide-react";

// export const CTABanner = () => {
//   return (
//     <section className="py-24 px-6 relative overflow-hidden">
//       {/* Animated gradient background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 animate-shimmer" />
//       <div className="absolute inset-0 bg-gradient-dark opacity-80" />

//       {/* Glow effects */}
//       <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
//       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

//       <div className="relative z-10 max-w-5xl mx-auto text-center">
//         <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-8 border-2 border-primary/30 animate-fade-in">
//           <Crown className="h-5 w-5 text-primary animate-glow" />
//           <span className="text-sm font-bold tracking-wide">JOIN THE ELITE CIRCLE</span>
//         </div>

//         <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
//           <span className="text-foreground">Stop Dreaming.</span>
//           <br />
//           <span className="text-gradient-gold">Start Earning Luxury.</span>
//         </h2>

//         <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed">
//           While you're reading this, our Elite IBs are collecting Rolex watches, booking Ferrari deliveries, and signing Dubai property contracts. 
//           <span className="text-primary font-bold"> The only question is: when will YOU join them?</span>
//         </p>

//         <div className="flex flex-wrap gap-8 justify-center mb-12 text-foreground animate-fade-in">
//           {[
//             { text: "247 Ferraris awarded", icon: CheckCircle2 },
//             { text: "1,450+ Rolex watches claimed", icon: CheckCircle2 },
//             { text: "89 Dubai properties purchased", icon: CheckCircle2 }
//           ].map((benefit, index) => (
//             <div key={benefit.text} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
//               <benefit.icon className="h-6 w-6 text-primary" />
//               <span className="text-base font-semibold">{benefit.text}</span>
//             </div>
//           ))}
//         </div>

//         <Button 
//           size="lg" 
//           variant="luxury"
//           className="text-lg px-16 py-7 group animate-fade-in shadow-luxury hover:scale-105"
//         >
//           I Want My Ferrari - Apply Now
//           <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
//         </Button>

//         <p className="mt-8 text-sm text-muted-foreground animate-fade-in">
//           ⚡ Limited Elite spots available - Only 50 new members accepted this month
//         </p>
//       </div>
//     </section>
//   );
// };









import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { ArrowRight, CheckCircle2, Crown } from "lucide-react";

export const CTABanner = ({ applicationFormRef }) => {

  const theme = useTheme();

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
        py: 12,
        px: 3,
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Animated gradient background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom right, rgba(255, 215, 0, 0.2), rgba(255, 255, 255, 0.1), rgba(255, 215, 0, 0.2))",
          animation: "shimmer 8s infinite linear",
          "@keyframes shimmer": {
            "0%": { backgroundPosition: "0% 50%" },
            "100%": { backgroundPosition: "100% 50%" },
          },
        }}
      />

      {/* Dark overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, #0a0a0a 40%, #111 100%)",
          opacity: 0.85,
        }}
      />

      {/* Glow effects */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "25%",
          width: 400,
          height: 400,
          backgroundColor: "rgba(255,215,0,0.25)",
          borderRadius: "50%",
          filter: "blur(120px)",
          animation: "pulse 3s infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.6 },
            "50%": { opacity: 1 },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: "25%",
          width: 400,
          height: 400,
          backgroundColor: "rgba(255,105,0,0.25)",
          borderRadius: "50%",
          filter: "blur(120px)",
          animation: "pulse 3s infinite",
          animationDelay: "1s",
        }}
      />

      {/* Main content */}
      <Box sx={{ position: "relative", zIndex: 10, maxWidth: "900px", mx: "auto" }}>
        {/* Header badge */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1.5}
          sx={{
            border: "2px solid rgba(255,215,0,0.3)",
            borderRadius: "9999px",
            px: 3,
            py: 1.5,
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.05)",
            mb: 6,
            animation: "fadeIn 1s ease-in-out",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Crown size={20} style={{ color: "#FFD700" }} />
          <Typography fontWeight="bold" fontSize="0.9rem" letterSpacing={1}>
            JOIN THE ELITE CIRCLE
          </Typography>
        </Stack>

        {/* Headline */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: theme.palette.text.primary,
          }}
        >
          Stop Dreaming.
          <br />
          <Box
            component="span"
            sx={{
              background: "linear-gradient(90deg, #FFD700, #FFA500)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Start Earning Luxury.
          </Box>
        </Typography>

        {/* Description */}
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.7)",
            mb: 8,
            maxWidth: 700,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          While you're reading this, our Elite IBs are collecting Rolex watches,
          booking Ferrari deliveries, and signing Dubai property contracts.
          <Box component="span" sx={{ color: "#FFD700", fontWeight: "bold" }}>
            {" "}
            The only question is: when will YOU join them?
          </Box>
        </Typography>

        {/* Benefits */}
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          spacing={4}
          sx={{ mb: 8 }}
        >
          {[
            "247 Ferraris awarded",
            "1,450+ Rolex watches claimed",
            "89 Dubai properties purchased",
          ].map((text, index) => (
            <Stack
              key={text}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                animation: "fadeIn 0.8s ease-in-out",
                animationDelay: `${index * 0.2}s`,
                animationFillMode: "both",
              }}
            >
              <CheckCircle2 size={22} color="#FFD700" />
              <Typography fontWeight={600}>{text}</Typography>
            </Stack>
          ))}
        </Stack>

        {/* Call-to-Action Button */}
        <Button
          variant="contained"
          size="large"
          sx={{
            px: 6,
            py: 2,
            fontSize: "1.1rem",
            borderRadius: 2,
            background: "linear-gradient(90deg, #FFD700, #FFA500)",
            color: "#000",
            boxShadow: "0 0 25px rgba(255,215,0,0.4)",
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 0 40px rgba(255,215,0,0.6)",
              background: "linear-gradient(90deg, #FFA500, #FFD700)",
            },
          }}
          endIcon={<ArrowRight />}
          onClick={() => handleScrollToSection(applicationFormRef)}
        >
          I Want My Ferrari - Apply Now
        </Button>

        {/* Footer note */}
        <Typography
          variant="body2"
          sx={{
            mt: 4,
            color: "rgba(255,255,255,0.6)",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          ⚡ Limited Elite spots available – Only 50 new members accepted this month
        </Typography>
      </Box>
    </Box>
  );
};
