// import { Car, Watch, Home, Gem, Smartphone, Sparkles } from "lucide-react";
// // import luxuryCarsImage from "@/assets/luxury-cars-collection.jpg";
// import luxuryCarsImage from "../assets/luxury-cars-collection.jpg"
// import ferrariDubaiImage from "../assets/ferrari-dubai.jpg";
// import luxuryRewardsImage from "../assets/luxury-rewards.jpg";
// import dubaiBurjImage from "../assets/dubai-burj-khalifa.jpg";

// const rewardCategories = [
//   {
//     icon: Car,
//     title: "Luxury Supercars",
//     value: "$250K - $500K",
//     items: ["Ferrari F8 Tributo", "Lamborghini Huracán EVO", "McLaren 720S", "Porsche 911 Turbo S"],
//     color: "from-red-500/20 to-orange-500/20"
//   },
//   {
//     icon: Watch,
//     title: "Elite Timepieces",
//     value: "$20K - $150K",
//     items: ["Rolex Daytona Gold", "Audemars Piguet Royal Oak", "Patek Philippe Nautilus", "Richard Mille RM"],
//     color: "from-primary/20 to-yellow-500/20"
//   },
//   {
//     icon: Home,
//     title: "Dubai Properties",
//     value: "$500K - $5M",
//     items: ["Marina Penthouse", "Palm Jumeirah Villa", "Downtown Dubai Apartment", "Burj Khalifa Residence"],
//     color: "from-secondary/20 to-cyan-500/20"
//   },
//   {
//     icon: Gem,
//     title: "Designer Luxury",
//     value: "$5K - $50K",
//     items: ["Louis Vuitton Collections", "Hermès Birkin Bags", "Cartier Jewelry", "Tom Ford Exclusives"],
//     color: "from-purple-500/20 to-pink-500/20"
//   },
//   {
//     icon: Smartphone,
//     title: "Premium Tech",
//     value: "$2K - $20K",
//     items: ["iPhone 15 Pro Max", "MacBook Pro M3 Max", "Apple Watch Ultra 2", "iPad Pro Collection"],
//     color: "from-blue-500/20 to-indigo-500/20"
//   },
//   {
//     icon: Sparkles,
//     title: "Exclusive Experiences",
//     value: "$10K - $100K",
//     items: ["Private Jet Rentals", "Yacht Charters", "VIP Event Access", "Michelin Star Dining"],
//     color: "from-primary/20 to-secondary/20"
//   }
// ];

// export const LuxuryRewardsShowcase = () => {
//   return (
//     <section className="py-24 px-6 bg-background relative overflow-hidden">
//       {/* Background glow */}
//       <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
//       <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Header */}
//         <div className="text-center mb-20 animate-fade-in">
//           <h2 className="text-4xl md:text-6xl font-bold mb-6">
//             <span className="text-gradient-gold">Your Luxury Rewards</span>
//             <br />
//             <span className="text-foreground">Await Your Success</span>
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//             From premium supercars to exclusive Dubai properties - these aren't just dreams anymore. 
//             <span className="text-primary font-semibold"> They're your next rewards.</span>
//           </p>
//         </div>

//         {/* Hero Image Grid */}
//         <div className="grid md:grid-cols-2 gap-8 mb-20">
//           <div className="relative group animate-fade-in">
//             <div className="absolute -inset-2 bg-gradient-gold rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
//             <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20">
//               <img 
//                 src={luxuryCarsImage} 
//                 alt="Luxury supercar collection including Ferrari, Lamborghini, and Rolls Royce"
//                 className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
//               <div className="absolute bottom-6 left-6 right-6">
//                 <h3 className="text-2xl font-bold text-gradient-gold mb-2">Elite Supercar Collection</h3>
//                 <p className="text-muted-foreground">Earn your dream Ferrari or Lamborghini within 6-12 months</p>
//               </div>
//             </div>
//           </div>

//           <div className="relative group animate-fade-in" style={{ animationDelay: '0.1s' }}>
//             <div className="absolute -inset-2 bg-gradient-emerald rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
//             <div className="relative overflow-hidden rounded-2xl border-2 border-secondary/20">
//               <img 
//                 src={ferrariDubaiImage} 
//                 alt="Red Ferrari parked at luxury Dubai Marina penthouse at sunset"
//                 className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
//               <div className="absolute bottom-6 left-6 right-6">
//                 <h3 className="text-2xl font-bold text-gradient-emerald mb-2">Dubai Lifestyle</h3>
//                 <p className="text-muted-foreground">Live the elite lifestyle in the world's most luxurious city</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Reward Categories Grid */}
//         <div className="grid md:grid-cols-3 gap-6 mb-20">
//           {rewardCategories.map((category, index) => (
//             <div
//               key={category.title}
//               className="luxury-card group hover:glow-gold animate-fade-in"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <div className={`p-4 rounded-xl bg-gradient-to-br ${category.color} inline-flex mb-6 group-hover:scale-110 transition-transform duration-500`}>
//                 <category.icon className="h-8 w-8 text-primary" />
//               </div>

//               <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
//               <p className="text-lg text-gradient-gold font-bold mb-4">{category.value}</p>

//               <ul className="space-y-2">
//                 {category.items.map((item) => (
//                   <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
//                     <div className="w-1.5 h-1.5 rounded-full bg-primary" />
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Bottom CTA with Burj Khalifa */}
//         <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 animate-fade-in">
//           <img 
//             src={dubaiBurjImage} 
//             alt="Burj Khalifa tower illuminated at night with Dubai Marina skyline"
//             className="w-full h-[500px] object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

//           <div className="absolute inset-0 flex items-center">
//             <div className="max-w-2xl px-12">
//               <h3 className="text-4xl md:text-5xl font-bold mb-6">
//                 <span className="text-gradient-gold">This Could Be</span>
//                 <br />
//                 <span className="text-foreground">Your View Tomorrow</span>
//               </h3>
//               <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
//                 Top Elite IBs are already living in Dubai penthouses, driving Ferraris, and wearing Rolexes. 
//                 <span className="text-primary font-semibold"> When will you join them?</span>
//               </p>
//               <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
//                   <span>Average time to first luxury reward: <span className="text-primary font-bold">3-6 months</span></span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
//                   <span>Top performers earning: <span className="text-secondary font-bold">$50K+/month</span></span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Bar */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-fade-in">
//           {[
//             { value: "247", label: "Ferraris Awarded", subtext: "Since 2023" },
//             { value: "1,450", label: "Rolex Watches", subtext: "To Elite IBs" },
//             { value: "89", label: "Dubai Properties", subtext: "Purchased" },
//             { value: "$127M", label: "Total Rewards", subtext: "Distributed" }
//           ].map((stat, index) => (
//             <div key={stat.label} className="glass-card p-6 text-center" style={{ animationDelay: `${index * 0.1}s` }}>
//               <div className="text-3xl md:text-4xl font-bold text-gradient-gold mb-2">{stat.value}</div>
//               <div className="text-sm font-semibold mb-1">{stat.label}</div>
//               <div className="text-xs text-muted-foreground">{stat.subtext}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };











import {
  Box,
  Typography,
  Card,
  Stack,
} from "@mui/material";
import {
  Car,
  Watch,
  Home,
  Gem,
  Smartphone,
  Sparkles,
} from "lucide-react";
import luxuryCarsImage from "../assets/luxury-cars-collection.jpg";
import ferrariDubaiImage from "../assets/ferrari-dubai.jpg";
import dubaiBurjImage from "../assets/dubai-burj-khalifa.jpg";
import Grid from "@mui/material/Grid2";


const rewardCategories = [
  {
    icon: Car,
    title: "Luxury Supercars",
    value: "$250K - $500K",
    items: [
      "Ferrari F8 Tributo",
      "Lamborghini Huracán EVO",
      "McLaren 720S",
      "Porsche 911 Turbo S",
    ],
    gradient: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(249,115,22,0.2))",
  },
  {
    icon: Watch,
    title: "Elite Timepieces",
    value: "$20K - $150K",
    items: [
      "Rolex Daytona Gold",
      "Audemars Piguet Royal Oak",
      "Patek Philippe Nautilus",
      "Richard Mille RM",
    ],
    gradient: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,255,0,0.15))",
  },
  {
    icon: Home,
    title: "Dubai Properties",
    value: "$500K - $5M",
    items: [
      "Marina Penthouse",
      "Palm Jumeirah Villa",
      "Downtown Dubai Apartment",
      "Burj Khalifa Residence",
    ],
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.2))",
  },
  {
    icon: Gem,
    title: "Designer Luxury",
    value: "$5K - $50K",
    items: [
      "Louis Vuitton Collections",
      "Hermès Birkin Bags",
      "Cartier Jewelry",
      "Tom Ford Exclusives",
    ],
    gradient: "linear-gradient(135deg, rgba(147,51,234,0.2), rgba(236,72,153,0.2))",
  },
  {
    icon: Smartphone,
    title: "Premium Tech",
    value: "$2K - $20K",
    items: [
      "iPhone 15 Pro Max",
      "MacBook Pro M3 Max",
      "Apple Watch Ultra 2",
      "iPad Pro Collection",
    ],
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))",
  },
  {
    icon: Sparkles,
    title: "Exclusive Experiences",
    value: "$10K - $100K",
    items: [
      "Private Jet Rentals",
      "Yacht Charters",
      "VIP Event Access",
      "Michelin Star Dining",
    ],
    gradient: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.2))",
  },
];

export const LuxuryRewardsShowcase = () => {
  return (
    <Box
      component="section"
      sx={{
        py: 12,
        px: 3,
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      {/* Background Glows */}
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          right: "25%",
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
          bottom: "25%",
          left: "25%",
          width: 384,
          height: 384,
          bgcolor: "secondary.main",
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 10, maxWidth: "1200px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 15, animation: "fadeIn 1s ease-in-out" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.5rem", md: "4rem" },
              mb: 2,
              background: "linear-gradient(90deg, #FFD700, #f5c542)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Luxury Rewards
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#fff",
              mb: 4,
              fontSize: { xs: "2.5rem", md: "4rem" },
            }}
          >
            Await Your Success
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              color: "rgba(255,255,255,0.7)",
              fontSize: "1.2rem",
              lineHeight: 1.8,
            }}
          >
            From premium supercars to exclusive Dubai properties — these aren't just
            dreams anymore.
            <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
              {" "}
              They're your next rewards.
            </Box>
          </Typography>
        </Box>

        {/* Hero Image Grid */}
        <Grid container spacing={4} mb={15}>
          {[
            {
              src: luxuryCarsImage,
              title: "Elite Supercar Collection",
              desc: "Earn your dream Ferrari or Lamborghini within 6-12 months",
              glow: "linear-gradient(90deg, #FFD700, #f5c542)",
            },
            {
              src: ferrariDubaiImage,
              title: "Dubai Lifestyle",
              desc: "Live the elite lifestyle in the world's most luxurious city",
              glow: "linear-gradient(90deg, #00ffcc, #00ffaa)",
            },
          ].map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  animation: `fadeIn 1s ${idx * 0.1}s ease-in-out both`,
                  "&:hover img": { transform: "scale(1.05)" },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: -8,
                    background: item.glow,
                    borderRadius: 4,
                    opacity: 0,
                    filter: "blur(20px)",
                    transition: "opacity 0.5s",
                    "&:hover": { opacity: 0.5 },
                  }}
                />
                <Box
                  component="img"
                  src={item.src}
                  alt={item.title}
                  sx={{
                    width: "100%",
                    height: 400,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "2px solid rgba(255,215,0,0.2)",
                    transition: "transform 0.5s",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  }}
                />
                <Box sx={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      background: item.glow,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Reward Categories Grid */}
        <Grid container spacing={3} mb={15}>
          {rewardCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={category.title}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.4s",
                    animation: `fadeIn 0.8s ${index * 0.1}s ease-in-out both`,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 0 20px rgba(255,215,0,0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      display: "inline-flex",
                      borderRadius: 2,
                      background: category.gradient,
                      mb: 3,
                      transition: "transform 0.5s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <Icon size={32} color="#f5c542" />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#fff" }}>
                    {category.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      background: "linear-gradient(90deg, #FFD700, #f5c542)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {category.value}
                  </Typography>

                  {category.items.map((item) => (
                    <Stack direction="row" alignItems="center" spacing={1} key={item} sx={{ mb: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main" }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Bottom CTA */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 5,
            overflow: "hidden",
            border: "2px solid rgba(255,215,0,0.3)",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <Box
            component="img"
            src={dubaiBurjImage}
            alt="Burj Khalifa tower illuminated at night"
            sx={{
              width: "100%",
              height: 500,
              objectFit: "cover",
              borderRadius: 5,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent)",
            }}
          />
          <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
            <Box sx={{ maxWidth: "600px", px: { xs: 4, md: 10 } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: "#fff",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(90deg, #FFD700, #f5c542)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  This Could Be
                </Box>
                <br />
                Your View Tomorrow
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mb: 4,
                  lineHeight: 1.8,
                }}
              >
                Top Elite IBs are already living in Dubai penthouses, driving Ferraris,
                and wearing Rolexes.
                <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
                  {" "}
                  When will you join them?
                </Box>
              </Typography>

              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", animation: "pulse 1.5s infinite" }} />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    Average time to first luxury reward:{" "}
                    <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
                      3–6 months
                    </Box>
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "secondary.main", animation: "pulse 1.5s infinite" }} />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    Top performers earning:{" "}
                    <Box component="span" sx={{ color: "secondary.main", fontWeight: 600 }}>
                      $50K+/month
                    </Box>
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Stats Bar */}
        <Grid container spacing={3} mt={8} sx={{ animation: "fadeIn 1s ease-in-out" }}>
          {[
            { value: "247", label: "Ferraris Awarded", subtext: "Since 2023" },
            { value: "1,450", label: "Rolex Watches", subtext: "To Elite IBs" },
            { value: "89", label: "Dubai Properties", subtext: "Purchased" },
            { value: "$127M", label: "Total Rewards", subtext: "Distributed" },
          ].map((stat, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    background: "linear-gradient(90deg, #FFD700, #f5c542)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#fff" }}>
                  {stat.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {stat.subtext}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};