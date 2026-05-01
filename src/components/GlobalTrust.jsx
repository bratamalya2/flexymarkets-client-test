// import { Quote } from "lucide-react";
// import worldMapImage from "../assets/world-luxury-elite.jpg";

// const testimonials = [
//   {
//     quote: "Started with nothing. 6 months later I'm driving my red Ferrari F8 through Dubai. Flexy Elite literally changed my entire life!",
//     author: "Michael R.",
//     location: "Dubai, UAE",
//     tier: "Royal Elite",
//     earnings: "$127,000",
//     reward: "Ferrari F8 Tributo"
//   },
//   {
//     quote: "I thought it was too good to be true. Now I own 3 Rolexes, a Lamborghini, and just bought my Marina penthouse. Best decision ever.",
//     author: "Sarah T.",
//     location: "Dubai Marina",
//     tier: "Royal Elite",
//     earnings: "$284,500",
//     reward: "Lamborghini + Penthouse"
//   },
//   {
//     quote: "From $0 to $85K monthly income in 8 months. My garage now has a McLaren and Porsche. Living the dream I only imagined!",
//     author: "James K.",
//     location: "Singapore",
//     tier: "Diamond Elite",
//     earnings: "$85,000/mo",
//     reward: "McLaren 720S"
//   }
// ];

// export const GlobalTrust = () => {
//   return (
//     <section className="py-24 px-6 relative bg-gradient-dark overflow-hidden">
//       {/* World map background */}
//       <div className="absolute inset-0 opacity-20">
//         <img 
//           src={worldMapImage} 
//           alt="Global Elite IB network spanning 150+ countries" 
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Glow effects */}
//       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
//       <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

//       <div className="relative z-10 max-w-7xl mx-auto">
//         <div className="text-center mb-20 animate-fade-in">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             Real People.{" "}
//             <span className="text-gradient-gold">Real Ferraris.</span>{" "}
//             Real Wealth.
//           </h2>
//           <p className="text-lg text-muted-foreground">
//             These aren't actors or stock photos - they're <span className="text-primary font-semibold">actual Elite IBs</span> living the luxury lifestyle right now
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           {testimonials.map((testimonial, index) => (
//             <div
//               key={index}
//               className="luxury-card hover:glow-gold animate-fade-in"
//               style={{ animationDelay: `${index * 0.15}s` }}
//             >
//               <Quote className="h-8 w-8 text-primary/40 mb-6" />
//               <blockquote className="text-lg font-medium mb-8 leading-relaxed">
//                 "{testimonial.quote}"
//               </blockquote>
//               <div className="flex items-center gap-4 pt-6 border-t border-border/50">
//                 <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center text-background font-bold text-lg shadow-gold">
//                   {testimonial.author[0]}
//                 </div>
//                   <div className="flex-1">
//                     <div className="font-bold text-base mb-1">{testimonial.author}</div>
//                     <div className="text-sm text-muted-foreground mb-1">{testimonial.location}</div>
//                     <div className="flex items-center gap-3 flex-wrap">
//                       <span className="text-xs text-primary font-semibold">{testimonial.tier}</span>
//                       <span className="text-xs text-secondary font-bold">{testimonial.earnings}</span>
//                       <span className="text-xs text-primary/70 font-medium">🏆 {testimonial.reward}</span>
//                     </div>
//                   </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Stats banner */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 luxury-card animate-fade-in">
//           {[
//             { value: "10,247", label: "Elite IBs Worldwide", subtext: "Living Luxury" },
//             { value: "$127M", label: "In Luxury Rewards", subtext: "Distributed YTD" },
//             { value: "247", label: "Supercars Awarded", subtext: "This Year Alone" },
//             { value: "24/7", label: "Concierge Support", subtext: "Elite Service" }
//           ].map((stat, index) => (
//             <div key={index} className="text-center p-6">
//               <div className="text-4xl md:text-5xl font-bold text-gradient-gold mb-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
//                 {stat.value}
//               </div>
//               <div className="text-sm md:text-base text-foreground font-semibold mb-1">
//                 {stat.label}
//               </div>
//               <div className="text-xs text-muted-foreground">
//                 {stat.subtext}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };







import { Quote } from "lucide-react";
import { Box, Typography, Avatar, Stack, useTheme } from "@mui/material";
import worldMapImage from "../assets/world-luxury-elite.jpg";
import Grid from "@mui/material/Grid2";

const testimonials = [
  {
    quote: "Started with nothing. 6 months later I'm driving my red Ferrari F8 through Dubai. Flexy Elite literally changed my entire life!",
    author: "Michael R.",
    location: "Dubai, UAE",
    tier: "Royal Elite",
    earnings: "$127,000",
    reward: "Ferrari F8 Tributo",
  },
  {
    quote: "I thought it was too good to be true. Now I own 3 Rolexes, a Lamborghini, and just bought my Marina penthouse. Best decision ever.",
    author: "Sarah T.",
    location: "Dubai Marina",
    tier: "Royal Elite",
    earnings: "$284,500",
    reward: "Lamborghini + Penthouse",
  },
  {
    quote: "From $0 to $85K monthly income in 8 months. My garage now has a McLaren and Porsche. Living the dream I only imagined!",
    author: "James K.",
    location: "Singapore",
    tier: "Diamond Elite",
    earnings: "$85,000/mo",
    reward: "McLaren 720S",
  },
];

export const GlobalTrust = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 12 },
        px: 3,
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
        background: "linear-gradient(180deg, #000 0%, #111 100%)",
      }}
    >
      {/* World map background */}
      <Box
        component="img"
        src={worldMapImage}
        alt="Global Elite IB network spanning 150+ countries"
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.2,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* Glow effects */}
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: "25%",
          width: 400,
          height: 400,
          bgcolor: "secondary.main",
          opacity: 0.2,
          borderRadius: "50%",
          filter: "blur(120px)",
          animation: "pulse 3s infinite ease-in-out",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "25%",
          right: "25%",
          width: 400,
          height: 400,
          bgcolor: "primary.main",
          opacity: 0.2,
          borderRadius: "50%",
          filter: "blur(120px)",
          animation: "pulse 3s infinite ease-in-out",
          animationDelay: "1s",
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 2, maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background:
                "linear-gradient(90deg, #FFD700, #FFB347, #FFD700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
              fontSize: { xs: "2rem", md: "2.8rem" },
            }}
          >
            Real People. Real Ferraris. Real Wealth.
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "text.secondary", maxWidth: 700, mx: "auto" }}
          >
            These aren't actors or stock photos — they're{" "}
            <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
              actual Elite IBs
            </Box>{" "}
            living the luxury lifestyle right now.
          </Typography>
        </Box>

        {/* Testimonials */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          {testimonials.map((t, i) => (
            <Grid
              size={{ xs: 12, md: 4 }}
              key={i}
              sx={{
                opacity: 0,
                animation: `fadeIn 0.8s ease forwards`,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 3,
                  p: 4,
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Quote
                  size={32}
                  style={{ color: theme.palette.primary.light, marginBottom: 16 }}
                />
                <Typography
                  variant="body1"
                  sx={{ mb: 3, fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  "{t.quote}"
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ borderTop: "1px solid rgba(255,255,255,0.15)", pt: 3 }}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: "primary.main",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: theme.palette.background.default,
                      backgroundImage:
                        "linear-gradient(135deg, #FFD700, #FFB347)",
                      boxShadow: "0 0 10px rgba(255,215,0,0.5)",
                    }}
                  >
                    {t.author[0]}
                  </Avatar>

                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {t.author}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                    >
                      {t.location}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" spacing={1}>
                      <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600 }}>
                        {t.tier}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "secondary.main", fontWeight: 700 }}>
                        {t.earnings}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "primary.light" }}>
                        🏆 {t.reward}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Stats banner */}
        <Grid
          container
          spacing={3}
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            borderRadius: 3,
            p: 4,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {[
            { value: "10,247", label: "Elite IBs Worldwide", subtext: "Living Luxury" },
            { value: "$127M", label: "In Luxury Rewards", subtext: "Distributed YTD" },
            { value: "247", label: "Supercars Awarded", subtext: "This Year Alone" },
            { value: "24/7", label: "Concierge Support", subtext: "Elite Service" },
          ].map((s, i) => (
            <Grid
              item
              size={{ xs: 12, sm: 6, md: 3 }}
              key={i}
              sx={{
                textAlign: "center",
                animation: `fadeIn 0.8s ease forwards`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(90deg, #FFD700, #FFB347, #FFD700)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                {s.value}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {s.label}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {s.subtext}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
      `}</style>
    </Box >
  );
};