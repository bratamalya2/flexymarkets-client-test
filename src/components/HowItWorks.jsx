// import { UserPlus, Send, Coins } from "lucide-react";

// const steps = [
//   {
//     icon: UserPlus,
//     title: "Join Elite Program",
//     description: "Sign up instantly and get your unique luxury referral link"
//   },
//   {
//     icon: Send,
//     title: "Invite Elite Traders",
//     description: "Share your exclusive link with your premium network"
//   },
//   {
//     icon: Coins,
//     title: "Earn Luxury Rewards",
//     description: "Get paid automatically for every lot traded, unlock premium gifts"
//   }
// ];

// export const HowItWorks = () => {
//   return (
//     <section className="py-24 px-6 bg-background relative overflow-hidden">
//       {/* Background glow effects */}
//       <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
//       <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
//       <div className="max-w-6xl mx-auto relative z-10">
//         <div className="text-center mb-20 animate-fade-in">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             Simple. <span className="text-gradient-gold">Rewarding.</span> <span className="text-gradient-emerald">Elite.</span>
//           </h2>
//           <p className="text-lg text-muted-foreground">
//             Start your journey to luxury in three straightforward steps
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-12 relative">
//           {/* Connection lines for desktop */}
//           <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1">
//             <div className="h-full bg-gradient-to-r from-primary/50 via-secondary to-primary/50 animate-shimmer" />
//           </div>

//           {steps.map((step, index) => (
//             <div key={step.title} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
//               <div className="text-center">
//                 {/* Icon circle */}
//                 <div className="relative inline-flex mb-8">
//                   <div className="absolute inset-0 bg-gradient-gold blur-xl opacity-30 animate-pulse" />
//                   <div className="relative w-24 h-24 rounded-full glass-card border-2 border-primary flex items-center justify-center hover:glow-gold transition-all duration-500 group">
//                     <step.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   {/* Step number */}
//                   <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-background font-bold text-lg shadow-gold">
//                     {index + 1}
//                   </div>
//                 </div>

//                 <h3 className="text-xl font-bold mb-4">
//                   {step.title}
//                 </h3>
//                 <p className="text-base text-muted-foreground leading-relaxed">
//                   {step.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

















import { UserPlus, Send, Coins } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Join Elite Program",
    description: "Sign up instantly and get your unique luxury referral link"
  },
  {
    icon: Send,
    title: "Invite Elite Traders",
    description: "Share your exclusive link with your premium network"
  },
  {
    icon: Coins,
    title: "Earn Luxury Rewards",
    description: "Get paid automatically for every lot traded, unlock premium gifts"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple. <span className="text-gradient-gold">Rewarding.</span>{" "}
            <span className="text-gradient-emerald">Elite.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your journey to luxury in three straightforward steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection line (desktop only) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[12%] right-[12%] h-1">
            <div className="h-full bg-gradient-to-r from-primary/50 via-secondary/60 to-primary/50 animate-shimmer" />
          </div>

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-center">
                {/* Icon Circle */}
                <div className="relative inline-flex mb-8">
                  <div className="absolute inset-0 bg-gradient-gold blur-xl opacity-30 animate-pulse" />
                  <div className="relative w-24 h-24 rounded-full glass-card border-2 border-primary flex items-center justify-center group hover:glow-gold transition-all duration-500">
                    <step.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-background font-bold text-lg shadow-gold">
                    {index + 1}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};