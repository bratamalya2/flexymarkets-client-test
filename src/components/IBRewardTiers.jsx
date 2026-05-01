// import { Award, Crown, Gem, Star, Sparkles } from "lucide-react";

// const tiers = [
//   { 
//     name: "Bronze", 
//     icon: Award, 
//     color: "from-orange-400/30 to-orange-600/30", 
//     rewards: "Cash Bonuses",
//     details: "$500 - $2,500",
//     requirement: "5-10 clients"
//   },
//   { 
//     name: "Silver", 
//     icon: Star, 
//     color: "from-gray-300/30 to-gray-500/30", 
//     rewards: "Premium Gadgets",
//     details: "iPhone, MacBook, iPads",
//     requirement: "11-25 clients"
//   },
//   { 
//     name: "Gold", 
//     icon: Sparkles, 
//     color: "from-primary/30 to-yellow-500/30", 
//     rewards: "Luxury Watches",
//     details: "Rolex, AP, Patek",
//     requirement: "26-50 clients"
//   },
//   { 
//     name: "Diamond", 
//     icon: Gem, 
//     color: "from-blue-400/30 to-cyan-600/30", 
//     rewards: "Designer Items",
//     details: "LV, Hermès, Cartier",
//     requirement: "51-100 clients"
//   },
//   { 
//     name: "Royal Elite", 
//     icon: Crown, 
//     color: "from-primary/40 to-secondary/40", 
//     rewards: "Luxury Cars",
//     details: "Ferrari, Lamborghini, RR",
//     requirement: "100+ clients"
//   }
// ];

// export const RewardTiers = () => {
//   return (
//     <section className="py-24 px-6 bg-background relative overflow-hidden">
//       {/* Background effects */}
//       <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

//       <div className="max-w-7xl mx-auto relative z-10">
//         <div className="text-center mb-16 animate-fade-in">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             From Cash to{" "}
//             <span className="text-gradient-gold">Supercars</span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Every client you refer moves you closer to the luxury lifestyle. Start earning cash bonuses today, 
//             <span className="text-primary font-semibold"> drive your Ferrari in 6-12 months</span>
//           </p>
//         </div>

//         {/* Progress bar */}
//         <div className="relative mb-16 max-w-4xl mx-auto animate-fade-in">
//           <div className="h-3 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm border border-border">
//             <div className="h-full bg-gradient-gold w-3/5 transition-all duration-1000 animate-shimmer" />
//           </div>
//         </div>

//         {/* Tier cards */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
//           {tiers.map((tier, index) => (
//             <div
//               key={tier.name}
//               className="glass-card p-8 text-center group hover:border-primary/50 hover:glow-gold transition-all duration-500 animate-fade-in"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <div className="relative inline-block mb-6">
//                 <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${tier.color} transition-transform group-hover:scale-110 duration-500 border-2 border-primary/20`}>
//                   <tier.icon className="h-9 w-9 text-foreground" />
//                 </div>
//                 {/* Level badge */}
//                 <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-background font-bold text-sm shadow-gold">
//                   {index + 1}
//                 </div>
//               </div>
//               <h3 className="font-bold text-lg mb-2">{tier.name}</h3>
//               <p className="text-sm text-primary font-semibold mb-2">{tier.rewards}</p>
//               <p className="text-xs text-muted-foreground mb-3">{tier.details}</p>
//               <div className="text-xs text-secondary font-bold bg-secondary/10 rounded-full px-3 py-1 inline-block">
//                 {tier.requirement}
//               </div>

//               {/* Hover effect line */}
//               <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-gold transition-all duration-500 mx-auto rounded-full" />
//             </div>
//           ))}
//         </div>

//         <div className="text-center animate-fade-in">
//           <p className="text-base text-muted-foreground mb-6">
//             Each tier unlocks <span className="text-primary font-semibold">exclusive luxury rewards and VIP benefits</span>
//           </p>
//           <div className="flex items-center justify-center gap-8 text-sm">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
//               <span className="text-muted-foreground">Average time to Gold tier: <span className="text-primary font-bold">3-4 months</span></span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
//               <span className="text-muted-foreground">To Royal Elite: <span className="text-secondary font-bold">6-12 months</span></span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };









import { Box, Typography, Paper } from "@mui/material";
import { Award, Crown, Gem, Star, Sparkles } from "lucide-react";
import Grid from "@mui/material/Grid2";

const tiers = [
  {
    name: "Bronze",
    icon: Award,
    color: "linear-gradient(135deg, rgba(251,146,60,0.3), rgba(234,88,12,0.3))",
    rewards: "Cash Bonuses",
    details: "$500 - $2,500",
    requirement: "5-10 clients"
  },
  {
    name: "Silver",
    icon: Star,
    color: "linear-gradient(135deg, rgba(212,212,212,0.3), rgba(115,115,115,0.3))",
    rewards: "Premium Gadgets",
    details: "iPhone, MacBook, iPads",
    requirement: "11-25 clients"
  },
  {
    name: "Gold",
    icon: Sparkles,
    color: "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(234,179,8,0.3))",
    rewards: "Luxury Watches",
    details: "Rolex, AP, Patek",
    requirement: "26-50 clients"
  },
  {
    name: "Diamond",
    icon: Gem,
    color: "linear-gradient(135deg, rgba(96,165,250,0.3), rgba(34,211,238,0.3))",
    rewards: "Designer Items",
    details: "LV, Hermès, Cartier",
    requirement: "51-100 clients"
  },
  {
    name: "Royal Elite",
    icon: Crown,
    color: "linear-gradient(135deg, rgba(236,72,153,0.4), rgba(34,211,238,0.4))",
    rewards: "Luxury Cars",
    details: "Ferrari, Lamborghini, RR",
    requirement: "100+ clients"
  }
];

export const RewardTiers = () => {
  return (
    <Box
      component="section"
      sx={{
        py: 12,
        px: 3,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #0a0a0a, rgba(255,255,255,0.02))",
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "white",
          }}
        >
          From Cash to{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(90deg, #FFD700, #E8A317)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Supercars
          </Box>
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.7)",
            maxWidth: "700px",
            mx: "auto",
            fontSize: "1.1rem",
          }}
        >
          Every client you refer moves you closer to the luxury lifestyle. Start
          earning cash bonuses today,{" "}
          <Box component="span" sx={{ color: "#FFD700", fontWeight: 600 }}>
            drive your Ferrari in 6-12 months
          </Box>
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 8 }}>
        <Box
          sx={{
            height: 10,
            borderRadius: 5,
            overflow: "hidden",
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        >
          <Box
            sx={{
              width: "60%",
              height: "100%",
              background: "linear-gradient(90deg, #FFD700, #E8A317)",
              animation: "shimmer 2s infinite",
              "@keyframes shimmer": {
                "0%": { opacity: 0.6 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.6 },
              },
            }}
          />
        </Box>
      </Box>

      {/* Tier cards */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
        {tiers.map((tier, index) => {
          const Icon = tier.icon;
          return (
            <Grid item size={{ xs: 12, sm: 6, md: 2.4 }} key={tier.name}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: "1px solid #FFD700",
                    boxShadow: "0 0 20px rgba(255,215,0,0.2)",
                  },
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: tier.color,
                      border: "2px solid rgba(255,215,0,0.2)",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <Icon size={36} color="#fff" />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(90deg, #FFD700, #E8A317)",
                      color: "#000",
                      fontWeight: "bold",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 10px rgba(255,215,0,0.5)",
                    }}
                  >
                    {index + 1}
                  </Box>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
                  {tier.name}
                </Typography>
                <Typography sx={{ color: "#FFD700", fontWeight: 600, fontSize: 14 }}>
                  {tier.rewards}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                  {tier.details}
                </Typography>

                <Box
                  sx={{
                    mt: 1,
                    display: "inline-block",
                    px: 2,
                    py: 0.5,
                    borderRadius: 10,
                    bgcolor: "rgba(255,215,0,0.1)",
                    color: "#FFD700",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {tier.requirement}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Footer Info */}
      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}>
          Each tier unlocks{" "}
          <Box component="span" sx={{ color: "#FFD700", fontWeight: 600 }}>
            exclusive luxury rewards and VIP benefits
          </Box>
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            flexWrap: "wrap",
            color: "rgba(255,255,255,0.7)",
            fontSize: 14,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#FFD700",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 0.4 },
                  "50%": { opacity: 1 },
                },
              }}
            />
            Average time to Gold tier:{" "}
            <Box component="span" sx={{ color: "#FFD700", fontWeight: "bold" }}>
              3–4 months
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#00FFFF",
                animation: "pulse 1.5s infinite",
              }}
            />
            To Royal Elite:{" "}
            <Box component="span" sx={{ color: "#00FFFF", fontWeight: "bold" }}>
              6–12 months
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};