// import { DollarSign, TrendingUp, Bitcoin } from "lucide-react";
// import dashboardImage from "../assets/dashboard-luxury-elite.jpg";

// const rewardTiers = [
//   {
//     icon: DollarSign,
//     title: "XAUUSD & Major Pairs",
//     amount: "$10",
//     description: "per Lot",
//     gradient: "from-primary/20 to-primary/5"
//   },
//   {
//     icon: TrendingUp,
//     title: "Minor FX Pairs",
//     amount: "$5",
//     description: "per Lot",
//     gradient: "from-secondary/20 to-secondary/5"
//   },
//   {
//     icon: Bitcoin,
//     title: "Crypto Pairs",
//     amount: "$10",
//     description: "per Lot",
//     gradient: "from-primary/20 to-secondary/20"
//   }
// ];

// export const RewardsGrid = () => {
//   return (
//     <section className="py-24 px-6 bg-gradient-dark relative overflow-hidden">
//       {/* Subtle background glow */}
//       <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
//       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

//       <div className="max-w-7xl mx-auto relative z-10">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           {/* Left: Dashboard mockup */}
//           <div className="relative animate-fade-in">
//             <div className="absolute -inset-4 bg-gradient-luxury rounded-2xl blur-2xl opacity-50" />
//             <img 
//               src={dashboardImage} 
//               alt="Elite IB Dashboard showing luxury trading earnings and metrics" 
//               className="relative rounded-2xl shadow-luxury border border-primary/20 w-full"
//             />
//           </div>

//           {/* Right: Text and rewards */}
//           <div className="space-y-10 animate-fade-in">
//             <div>
//               <h2 className="text-4xl md:text-5xl font-bold mb-6">
//                 Your Path to{" "}
//                 <span className="text-gradient-gold">Elite Wealth</span>
//               </h2>
//               <p className="text-lg text-muted-foreground leading-relaxed">
//                 Earn competitive commissions on every lot traded by your referrals. 
//                 Clear, transparent pricing with <span className="text-secondary font-semibold">industry-leading rewards</span>.
//               </p>
//             </div>

//             {/* Reward cards */}
//             <div className="space-y-4">
//               {rewardTiers.map((tier, index) => (
//                 <div
//                   key={tier.title}
//                   className="luxury-card group hover:scale-[1.02] animate-fade-in"
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                 >
//                   <div className="flex items-center gap-6">
//                     <div className={`p-4 rounded-xl bg-gradient-to-br ${tier.gradient} group-hover:glow-gold transition-all duration-500`}>
//                       <tier.icon className="h-8 w-8 text-primary" />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-bold text-lg mb-1">{tier.title}</h3>
//                       <p className="text-sm text-muted-foreground">{tier.description}</p>
//                     </div>
//                     <div className="text-4xl font-bold text-gradient-gold">
//                       {tier.amount}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };











import { Box, Typography, Stack, Grid, Card } from "@mui/material";
import { DollarSign, TrendingUp, Bitcoin } from "lucide-react";
import dashboardImage from "../assets/dashboard-luxury-elite.jpg";

const rewardTiers = [
  {
    icon: DollarSign,
    title: "XAUUSD & Major Pairs",
    amount: "$10",
    description: "per Lot",
    gradient: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))",
  },
  {
    icon: TrendingUp,
    title: "Minor FX Pairs",
    amount: "$5",
    description: "per Lot",
    gradient: "linear-gradient(135deg, rgba(255,140,0,0.2), rgba(255,140,0,0.05))",
  },
  {
    icon: Bitcoin,
    title: "Crypto Pairs",
    amount: "$10",
    description: "per Lot",
    gradient: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.2))",
  },
];

export const RewardsGrid = () => {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: 12,
        px: 3,
        background: "linear-gradient(to bottom right, #0b0b0b, #1a1a1a)",
      }}
    >
      {/* Subtle background glows */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "25%",
          width: 384,
          height: 384,
          bgcolor: "primary.main",
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: "25%",
          width: 384,
          height: 384,
          bgcolor: "secondary.main",
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 10, maxWidth: "1200px", mx: "auto" }}>
        <Grid container spacing={8} alignItems="center">
          {/* Left: Dashboard Mockup */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ position: "relative", animation: "fadeIn 1s ease-in-out" }}>
              <Box
                sx={{
                  position: "absolute",
                  inset: -16,
                  borderRadius: 4,
                  background:
                    "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,140,0,0.1))",
                  filter: "blur(40px)",
                  opacity: 0.5,
                }}
              />
              <Box
                component="img"
                src={dashboardImage}
                alt="Elite IB Dashboard showing luxury trading earnings and metrics"
                sx={{
                  position: "relative",
                  width: "100%",
                  borderRadius: 4,
                  border: "1px solid rgba(255,215,0,0.2)",
                  boxShadow: "0 0 40px rgba(255,215,0,0.1)",
                }}
              />
            </Box>
          </Grid>

          {/* Right: Text and Rewards */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ animation: "fadeIn 1.3s ease-in-out" }}>
              {/* Heading */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#fff",
                  fontSize: { xs: "2rem", md: "3rem" },
                }}
              >
                Your Path to{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(90deg, #FFD700, #f5c542)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Elite Wealth
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  mb: 6,
                }}
              >
                Earn competitive commissions on every lot traded by your referrals.
                Clear, transparent pricing with{" "}
                <Box component="span" sx={{ color: "secondary.main", fontWeight: 600 }}>
                  industry-leading rewards
                </Box>
                .
              </Typography>

              {/* Reward Cards */}
              <Stack spacing={3}>
                {rewardTiers.map((tier, index) => {
                  const Icon = tier.icon;
                  return (
                    <Card
                      key={tier.title}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "all 0.3s ease",
                        animation: `fadeIn 0.8s ${index * 0.1}s ease-in-out both`,
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: "0 0 20px rgba(255,215,0,0.1)",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={3}
                      >
                        {/* Icon & Info */}
                        <Stack direction="row" alignItems="center" spacing={3}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              background: tier.gradient,
                              transition: "all 0.5s ease",
                              "&:hover": { boxShadow: "0 0 15px rgba(255,215,0,0.3)" },
                            }}
                          >
                            <Icon size={32} color="#f5c542" />
                          </Box>
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 700, color: "#fff", mb: 0.5 }}
                            >
                              {tier.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255,255,255,0.6)" }}
                            >
                              {tier.description}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Amount */}
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            background: "linear-gradient(90deg, #FFD700, #f5c542)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {tier.amount}
                        </Typography>
                      </Stack>
                    </Card>
                  );
                })}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};