// import { Users, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";
// import { Button } from "./ui/button";

// const stats = [
//   { label: "Total Referrals", value: "127", icon: Users, change: "+12 this week", gradient: "from-secondary/20 to-secondary/5" },
//   { label: "Total Traded Lots", value: "1,847", icon: TrendingUp, change: "+234 this month", gradient: "from-primary/10 to-secondary/10" },
//   { label: "Total Earnings", value: "$18,470", icon: DollarSign, change: "+$2,340 this month", highlighted: true, gradient: "from-primary/30 to-primary/10" }
// ];

// export const DashboardPreview = () => {
//   return (
//     <section className="py-24 px-6 bg-gradient-dark relative overflow-hidden">
//       {/* Glow effects */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      
//       <div className="max-w-6xl mx-auto relative z-10">
//         <div className="text-center mb-16 animate-fade-in">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             Track Your{" "}
//             <span className="text-gradient-gold">Elite Performance</span>
//           </h2>
//           <p className="text-lg text-muted-foreground">
//             Real-time luxury dashboard to monitor your earnings and exponential growth
//           </p>
//         </div>

//         <div className="luxury-card shadow-luxury animate-fade-in">
//           {/* Stats Grid */}
//           <div className="grid md:grid-cols-3 gap-6 mb-10">
//             {stats.map((stat, index) => (
//               <div
//                 key={stat.label}
//                 className={`relative p-8 rounded-2xl transition-all duration-500 overflow-hidden group ${
//                   stat.highlighted 
//                     ? "bg-gradient-gold text-background shadow-gold" 
//                     : "glass-card hover:border-primary/50"
//                 }`}
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 {/* Background gradient */}
//                 {!stat.highlighted && (
//                   <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
//                 )}
                
//                 <div className="relative z-10">
//                   <div className="flex items-start justify-between mb-6">
//                     <stat.icon className={`h-8 w-8 ${
//                       stat.highlighted ? "text-background" : "text-primary"
//                     }`} />
//                     <ArrowUpRight className={`h-6 w-6 ${
//                       stat.highlighted ? "text-background" : "text-secondary"
//                     } group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`} />
//                   </div>
//                   <div className={`text-5xl font-bold mb-3 ${
//                     stat.highlighted ? "text-background" : "text-foreground"
//                   }`}>
//                     {stat.value}
//                   </div>
//                   <div className={`text-base font-semibold mb-2 ${
//                     stat.highlighted ? "text-background" : "text-foreground"
//                   }`}>
//                     {stat.label}
//                   </div>
//                   <div className={`text-sm font-medium ${
//                     stat.highlighted ? "text-background/80" : "text-muted-foreground"
//                   }`}>
//                     {stat.change}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Action buttons */}
//           <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 border-t border-border/50">
//             <Button variant="luxury" size="lg" className="text-base px-10">
//               Withdraw to Wallet
//             </Button>
//             <Button variant="elite" size="lg" className="text-base px-10">
//               View Full Analytics
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };












import { Users, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";

const stats = [
  { 
    label: "Total Referrals", 
    value: "127",
    icon: Users, 
    change: "+12 this week", 
    gradient: "from-secondary/20 to-secondary/5" 
  },
  { 
    label: "Total Traded Lots", 
    value: "1,847", 
    icon: TrendingUp, 
    change: "+234 this month", 
    gradient: "from-primary/10 to-secondary/10" 
  },
  { 
    label: "Total Earnings", 
    value: "$18,470", 
    icon: DollarSign, 
    change: "+$2,340 this month", 
    highlighted: true, 
    gradient: "from-primary/30 to-primary/10" 
  }
];

export const DashboardPreview = () => {
  return (
    <section className="py-24 px-6 bg-gradient-dark relative overflow-hidden">
      {/* Subtle glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Track Your{" "}
            <span className="text-gradient-gold">Elite Performance</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time luxury dashboard to monitor your earnings and exponential growth
          </p>
        </div>

        {/* Main Card Container */}
        <div className="luxury-card shadow-luxury animate-fade-in">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`relative p-8 rounded-2xl overflow-hidden transition-all duration-500 group ${
                  stat.highlighted 
                    ? "bg-gradient-gold text-background shadow-gold" 
                    : "glass-card hover:border-primary/50"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Overlay */}
                {!stat.highlighted && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <stat.icon
                      className={`h-8 w-8 ${
                        stat.highlighted ? "text-background" : "text-primary"
                      }`}
                    />
                    <ArrowUpRight
                      className={`h-6 w-6 ${
                        stat.highlighted ? "text-background" : "text-secondary"
                      } group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`}
                    />
                  </div>

                  <div
                    className={`text-5xl font-bold mb-3 ${
                      stat.highlighted ? "text-background" : "text-foreground"
                    }`}
                  >
                    {stat.value}
                  </div>

                  <div
                    className={`text-base font-semibold mb-2 ${
                      stat.highlighted ? "text-background" : "text-foreground"
                    }`}
                  >
                    {stat.label}
                  </div>

                  <div
                    className={`text-sm font-medium ${
                      stat.highlighted ? "text-background/80" : "text-muted-foreground"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 border-t border-border/50">
            <Button variant="luxury" size="lg" className="text-base px-10">
              Withdraw to Wallet
            </Button>
            <Button variant="elite" size="lg" className="text-base px-10">
              View Full Analytics
            </Button>
          </div> */}
        </div>
      </div>
    </section>
  );
};