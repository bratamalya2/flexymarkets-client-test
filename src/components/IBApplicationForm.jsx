// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Textarea } from "./ui/textarea";
// import { Crown, Sparkles, TrendingUp } from "lucide-react";
// import { useToast } from "../hooks/use-toast";

// const applicationSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
//   email: z.string().email("Invalid email address").max(255, "Email too long"),
//   mobile: z.string().min(10, "Invalid mobile number").max(20, "Mobile number too long"),
//   country: z.string().min(2, "Please select your country"),
//   tradingExperienceLevel: z.string().min(1, "Please select your trading experience level"),
//   expectedClintsPerMonths: z.string().min(1, "Please select expected clients per months"),
//   networkSize: z.string().min(1, "Please tell us about your network"),
//   socialMedia: z.object({
//     instagram: z.string().max(200, "URL too long").optional(),
//     facebook: z.string().max(200, "URL too long").optional(),
//     linkedin: z.string().max(200, "URL too long").optional(),
//     tweeterX: z.string().max(200, "URL too long").optional(),
//     youtube: z.string().max(200, "URL too long").optional(),
//     tiktok: z.string().max(200, "URL too long").optional(),
//   }),
//   whyWantToBecomeIb: z.string().min(50, "Please provide at least 50 characters").max(1000, "Message too long"),
//   whatsYourDreamLuxuryReward: z.string().min(1, "Please select your dream luxury reward"),
//   monthlyIncomeGoal: z.string().min(1, "Please select your income goal"),
//   howYouAcquireClients: z.string().min(10, "Please describe your marketing approach").max(500, "Description too long"),
//   // agreedToTerms: z.boolean().refine((val) => val === true, "You must agree to terms"),
//   remark: z.string().min(10, "Please type your remark").max(100, "Description too long"),
// });

// export const IBApplicationForm = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { toast } = useToast();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(applicationSchema),
//   });

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     console.log("Form submitted:", data);

//     toast({
//       title: "Application Submitted Successfully! 🎉",
//       description:
//         "Welcome to the Elite IB Circle. Our team will contact you within 24 hours to unlock your luxury earning potential.",
//     });

//     setIsSubmitting(false);
//   };

//   return (
//     <section className="py-24 px-6 bg-gradient-dark relative overflow-hidden">
//       {/* Background effects */}
//       <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
//       <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

//       <div className="max-w-4xl mx-auto relative z-10">
//         <div className="text-center mb-16 animate-fade-in">
//           <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-8 border-2 border-primary/30">
//             <Crown className="h-5 w-5 text-primary animate-glow" />
//             <span className="text-sm font-bold tracking-wide">EXCLUSIVE APPLICATION</span>
//           </div>

//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             <span className="text-gradient-gold">Join the Elite</span>
//             <br />
//             <span className="text-foreground">IB Circle Today</span>
//           </h2>

//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Complete this application to unlock{" "}
//             <span className="text-primary font-semibold">unlimited earning potential</span>, luxury rewards, and
//             exclusive benefits reserved for our top performers
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="luxury-card animate-fade-in">
//           <div className="space-y-8">
//             {/* Personal Information */}
//             <div>
//               <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
//                 <Sparkles className="h-6 w-6 text-primary" />
//                 Personal Information
//               </h3>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <Label htmlFor="name" className="text-base">
//                     Full Name *
//                   </Label>
//                   <Input id="name" {...register("name")} placeholder="Your full name" className="mt-2" />
//                   {errors.name && <p className="text-destructive text-sm text-red-500 mt-1">{errors.name.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="email" className="text-base">
//                     Email Address *
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     {...register("email")}
//                     placeholder="your.email@example.com"
//                     className="mt-2"
//                   />
//                   {errors.email && <p className="text-destructive text-sm text-red-500 mt-1">{errors.email.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="mobile" className="text-base">
//                     Phone Number *
//                   </Label>
//                   <Input id="mobile" {...register("mobile")} placeholder="+1 234 567 8900" className="mt-2" />
//                   {errors.mobile && <p className="text-destructive text-sm text-red-500 mt-1">{errors.mobile.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="country" className="text-base">
//                     Country *
//                   </Label>
//                   <Input id="country" {...register("country")} placeholder="Your country" className="mt-2" />
//                   {errors.country && <p className="text-destructive text-sm text-red-500 mt-1">{errors.country.message}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Trading & Network Information */}
//             <div className="pt-6 border-t border-border/50">
//               <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
//                 <TrendingUp className="h-6 w-6 text-primary" />
//                 Your Network & Experience
//               </h3>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <Label htmlFor="tradingExperienceLevel" className="text-base">
//                     Trading Experience *
//                   </Label>
//                   <select
//                     id="tradingExperienceLevel"
//                     {...register("tradingExperienceLevel")}
//                     className="w-full mt-2 rounded-lg bg-background border border-border px-4 py-3 text-foreground"
//                   >
//                     <option value="">Select experience level</option>
//                     <option value="beginner">Beginner (0-1 year)</option>
//                     <option value="intermediate">Intermediate (1-3 years)</option>
//                     <option value="advanced">Advanced (3-5 years)</option>
//                     <option value="expert">Expert (5+ years)</option>
//                   </select>
//                   {errors.tradingExperienceLevel && (
//                     <p className="text-destructive text-sm text-red-500 mt-1">{errors.tradingExperienceLevel.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="expectedClintsPerMonths" className="text-base">
//                     Expected Clients Per Month *
//                   </Label>
//                   <select
//                     id="expectedClintsPerMonths"
//                     {...register("expectedClintsPerMonths")}
//                     className="w-full mt-2 rounded-lg bg-background border border-border px-4 py-3 text-foreground"
//                   >
//                     <option value="">Select expected clients</option>
//                     <option value="1-5">1-5 clients</option>
//                     <option value="6-10">6-10 clients</option>
//                     <option value="11-20">11-20 clients</option>
//                     <option value="21-50">21-50 clients</option>
//                     <option value="50+">50+ clients (Elite)</option>
//                   </select>
//                   {errors.expectedClintsPerMonths && (
//                     <p className="text-destructive text-sm text-red-500 mt-1">{errors.expectedClintsPerMonths.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="networkSize" className="text-base">
//                     Your Network Size *
//                   </Label>
//                   <select
//                     id="networkSize"
//                     {...register("networkSize")}
//                     className="w-full mt-2 rounded-lg bg-background border border-border px-4 py-3 text-foreground"
//                   >
//                     <option value="">Select network size</option>
//                     <option value="small">Small (Under 1,000)</option>
//                     <option value="medium">Medium (1,000 - 10,000)</option>
//                     <option value="large">Large (10,000 - 100,000)</option>
//                     <option value="massive">Massive (100,000+)</option>
//                   </select>
//                   {errors.networkSize && (
//                     <p className="text-destructive text-sm text-red-500 mt-1">{errors.networkSize.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="monthlyIncomeGoal" className="text-base">
//                     Monthly Income Goal *
//                   </Label>
//                   <select
//                     id="monthlyIncomeGoal"
//                     {...register("monthlyIncomeGoal")}
//                     className="w-full mt-2 rounded-lg bg-background border border-border px-4 py-3 text-foreground"
//                   >
//                     <option value="">Select income goal</option>
//                     <option value="1k-5k">$1,000 - $5,000</option>
//                     <option value="5k-10k">$5,000 - $10,000</option>
//                     <option value="10k-25k">$10,000 - $25,000</option>
//                     <option value="25k-50k">$25,000 - $50,000</option>
//                     <option value="50k+">$50,000+ (Royal Elite)</option>
//                   </select>
//                   {errors.monthlyIncomeGoal && (
//                     <p className="text-destructive text-sm text-red-500 mt-1">{errors.monthlyIncomeGoal.message}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Social Media Links */}
//             <div className="pt-6 border-t border-border/50">
//               <h3 className="text-2xl font-bold mb-6">Social Media Presence (Optional)</h3>
//               <div className="grid md:grid-cols-2 gap-6">
//                 {["instagram", "facebook", "linkedin", "twitter", "youtube", "tiktok"].map((platform) => (
//                   <div key={platform}>
//                     <Label htmlFor={platform} className="text-base capitalize">
//                       {platform}
//                     </Label>
//                     <Input
//                       id={platform}
//                       {...register(`socialMedia.${platform}`)}
//                       placeholder={`${platform}.com/yourprofile`}
//                       className="mt-2"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Motivation & Goals */}
//             <div className="pt-6 border-t border-border/50">
//               <h3 className="text-2xl font-bold mb-6">Your Vision & Strategy</h3>
//               <div className="space-y-6">
//                 <div>
//                   <Label htmlFor="whyWantToBecomeIb" className="text-base">
//                     Why do you want to become an Elite IB? *
//                   </Label>
//                   <Textarea
//                     id="whyWantToBecomeIb"
//                     {...register("whyWantToBecomeIb")}
//                     placeholder="Tell us about your goals, what drives you, and why you're ready to join the elite circle..."
//                     className="mt-2 min-h-[150px]"
//                   />
//                   {errors.whyWantToBecomeIb && (
//                     <p className="text-destructive text-sm text-red-500 mt-1">{errors.whyWantToBecomeIb.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="howYouAcquireClients" className="text-base">
//                     How will you market and acquire clients? *
//                   </Label>
//                   <Textarea
//                     id="howYouAcquireClients"
//                     {...register("howYouAcquireClients")}
//                     placeholder="Describe your marketing strategy, channels you'll use, and how you plan to build your network..."
//                     className="mt-2 min-h-[120px]"
//                   />
//                   {errors.howYouAcquireClients && (
//                     <p className="text-destructive text-sm text-red-500 mt-1">{errors.howYouAcquireClients.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="whatsYourDreamLuxuryReward" className="text-base">
//                     What's your dream luxury reward? *
//                   </Label>
//                   <select
//                     id="whatsYourDreamLuxuryReward"
//                     {...register("whatsYourDreamLuxuryReward")}
//                     className="w-full mt-2 rounded-lg bg-background border border-border px-4 py-3 text-foreground"
//                   >
//                     <option value="">Select your dream reward</option>
//                     <option value="rolex">Rolex Daytona Gold ($50,000)</option>
//                     <option value="ferrari">Ferrari F8 Tributo ($280,000)</option>
//                     <option value="lamborghini">Lamborghini Huracán ($250,000)</option>
//                     <option value="rollsroyce">Rolls Royce Cullinan ($350,000)</option>
//                     <option value="dubai-penthouse">Dubai Marina Penthouse ($2M+)</option>
//                     <option value="all">All of the above (Royal Elite)</option>
//                   </select>
//                   {errors.whatsYourDreamLuxuryReward && (
//                     <p className="text-destructive text-red-500 text-sm mt-1">{errors.whatsYourDreamLuxuryReward.message}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Terms Agreement */}
//             {/* <div className="pt-6 border-t border-border/50">
//               <label className="flex items-start gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   {...register("agreedToTerms")}
//                   className="mt-1 w-5 h-5 rounded border-border"
//                 />
//                 <span className="text-sm text-muted-foreground">
//                   I agree to the terms and conditions, and I understand that Flexy Markets will process my application
//                   within 24-48 hours. I'm ready to unlock my elite earning potential. *
//                 </span>
//               </label>
//               {errors.agreedToTerms && (
//                 <p className="text-destructive text-sm mt-2">{errors.agreedToTerms.message}</p>
//               )}
//             </div> */}

//             {/* Submit Button */}
//             <div className="pt-8">
//               <Button
//                 type="submit"
//                 variant="luxury"
//                 size="lg"
//                 className="w-full text-lg py-7"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting Your Elite Application..." : "Join Elite IB Circle Now"}
//               </Button>

//               <p className="text-center text-sm text-muted-foreground mt-4">
//                 🔒 Your information is secure and will be reviewed by our elite team within 24 hours
//               </p>
//             </div>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };






























// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Textarea } from "./ui/textarea";
// import { Crown, Sparkles, TrendingUp } from "lucide-react";
// import { useToast } from "../hooks/use-toast";
// import { useDispatch } from "react-redux";
// import { useRequestForIBMutation } from "../globalState/ibState/ibStateApis";
// import { setNotification } from "../globalState/notificationState/notificationStateSlice";

// const emptyToUndefined = (schema) =>
//   z.preprocess((val) => (val === "" || val === null ? undefined : val), schema.optional());

// const applicationSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
//   email: z.string().email("Invalid email address").max(255, "Email too long"),
//   mobile: z.string().min(10, "Invalid mobile number").max(20, "Mobile number too long"),
//   country: z.string().min(2, "Please select your country"),
//   tradingExperienceLevel: z.string().min(1, "Please select your trading experience level"),
//   expectedClintsPerMonths: z.string().min(1, "Please select expected clients per months"),
//   networkSize: z.string().min(1, "Please tell us about your network"),
//   // socialMedia: z.object({
//   instagram: emptyToUndefined(z.string().max(200, "URL too long").optional()),
//   facebook: emptyToUndefined(z.string().max(200, "URL too long").optional()),
//   linkedin: emptyToUndefined(z.string().max(200, "URL too long").optional()),
//   tweeterX: emptyToUndefined(z.string().max(200, "URL too long").optional()),
//   youtube: emptyToUndefined(z.string().max(200, "URL too long").optional()),
//   tiktok: emptyToUndefined(z.string().max(200, "URL too long").optional()),
//   // }),
//   whyWantToBecomeIb: z.string().min(50, "Please provide at least 50 characters").max(1000, "Message too long"),
//   whatsYourDreamLuxuryReward: z.string().min(1, "Please select your dream luxury reward"),
//   monthlyIncomeGoal: z.string().min(1, "Please select your income goal"),
//   howYouAcquireClients: z.string().min(10, "Please describe your marketing approach").max(500, "Description too long"),
//   remark: z.string().min(10, "Please type your remark").max(100, "Description too long"),
// });

// export const IBApplicationForm = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { toast } = useToast();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(applicationSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       mobile: "",
//       country: "",
//       tradingExperienceLevel: "",
//       expectedClintsPerMonths: "",
//       networkSize: "",
//       monthlyIncomeGoal: "",
//       instagram: "",
//       facebook: "",
//       linkedin: "",
//       tweeterX: "",
//       youtube: "",
//       tiktok: "",
//       whyWantToBecomeIb: "",
//       howYouAcquireClients: "",
//       whatsYourDreamLuxuryReward: "",
//       remark: "",
//     },
//   });

//   // const onSubmit = async (data) => {
//   //   setIsSubmitting(true);

//   //   await new Promise((resolve) => setTimeout(resolve, 2000));

//   //   console.log("Form submitted:", data);

//   //   toast({
//   //     title: "Application Submitted Successfully! 🎉",
//   //     description:
//   //       "Welcome to the Elite IB Circle. Our team will contact you within 24 hours to unlock your luxury earning potential.",
//   //   });

//   //   setIsSubmitting(false);
//   // };

//   const dispatch = useDispatch();
//   const [requestForIB, { isLoading }] = useRequestForIBMutation();

//   const onSubmit = async (data) => {
//     try {
//       const response = await requestForIB(data).unwrap();
//       if (response?.status) {
//         dispatch(setNotification({
//           open: true,
//           message: response?.message || "Request submitted successfully.",
//           severity: "success"
//         }));
//         reset()
//         // dispatch(setRequestStatus(true));
//       }
//     } catch (error) {
//       dispatch(setNotification({
//         open: true,
//         message: error?.data?.message || "Failed to submit. Please try again later.",
//         severity: "error"
//       }));
//     }
//   };

//   return (
//     <section className="py-24 px-6 bg-gradient-dark relative overflow-hidden">
//       <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
//       <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

//       <div className="max-w-4xl mx-auto relative z-10">
//         <div className="text-center mb-16 animate-fade-in">
//           <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-8 border-2 border-primary/30">
//             <Crown className="h-5 w-5 text-primary animate-glow" />
//             <span className="text-sm font-bold tracking-wide">EXCLUSIVE APPLICATION</span>
//           </div>

//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             <span className="text-gradient-gold">Join the Elite</span>
//             <br />
//             <span className="text-foreground">IB Circle Today</span>
//           </h2>

//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Complete this application to unlock{" "}
//             <span className="text-primary font-semibold">unlimited earning potential</span>, luxury rewards, and
//             exclusive benefits reserved for our top performers
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="luxury-card animate-fade-in">
//           <div className="space-y-8">
//             {/* Personal Information */}
//             <div>
//               <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
//                 <Sparkles className="h-6 w-6 text-primary" />
//                 Personal Information
//               </h3>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <Label htmlFor="name" className="text-base">Full Name *</Label>
//                   <Input id="name" {...register("name")} placeholder="Your full name" className="mt-2" />
//                   {errors.name && <p className="text-destructive text-red-500 text-sm mt-1">{errors.name.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="email" className="text-base">Email Address *</Label>
//                   <Input id="email" type="email" {...register("email")} placeholder="your.email@example.com" className="mt-2" />
//                   {errors.email && <p className="text-destructive text-red-500 text-sm mt-1">{errors.email.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="mobile" className="text-base">Phone Number *</Label>
//                   <Input id="mobile" {...register("mobile")} placeholder="+1 234 567 8900" className="mt-2" />
//                   {errors.mobile && <p className="text-destructive text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="country" className="text-base">Country *</Label>
//                   <Input id="country" {...register("country")} placeholder="Your country" className="mt-2" />
//                   {errors.country && <p className="text-destructive text-red-500 text-sm mt-1">{errors.country.message}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Trading & Network Information */}
//             <div className="pt-6 border-t border-border/50">
//               <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
//                 <TrendingUp className="h-6 w-6 text-primary" />
//                 Your Network & Experience
//               </h3>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <Label htmlFor="tradingExperienceLevel" className="text-base">Trading Experience *</Label>
//                   <select id="tradingExperienceLevel" {...register("tradingExperienceLevel")} className="w-full mt-2 rounded-lg bg-background border border-border px-4 py-3 text-foreground">
//                     <option value="">Select experience level</option>
//                     <option value="BEGINER">Beginner (0-1 year)</option>
//                     <option value="INTERMEDIATE">Intermediate (1-3 years)</option>
//                     <option value="ADVANCED">Advanced (3-5 years)</option>
//                     <option value="EXPRET">Expert (5+ years)</option>
//                   </select>
//                   {errors.tradingExperienceLevel && <p className="text-destructive text-red-500 text-sm mt-1">{errors.tradingExperienceLevel.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="expectedClintsPerMonths" className="text-base">Expected Clients Per Month *</Label>
//                   <select id="expectedClintsPerMonths" {...register("expectedClintsPerMonths")} className="w-full mt-2 rounded-lg bg-background border border-border px-4 py-3 text-foreground">
//                     <option value="">Select expected clients</option>
//                     <option value="1-5 CLIENTS">1-5 clients</option>
//                     <option value="6-10 CLIENTS">6-10 clients</option>
//                     <option value="11-20 CLIENTS">11-20 clients</option>
//                     <option value="21-50 CLIENTS">21-50 clients</option>
//                     <option value="50+ CLIENTS">50+ clients (Elite)</option>
//                   </select>
//                   {errors.expectedClintsPerMonths && <p className="text-destructive text-red-500 text-sm mt-1">{errors.expectedClintsPerMonths.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="networkSize" className="text-base">Your Network Size *</Label>
//                   <select id="networkSize" {...register("networkSize")} className="w-full mt-2 rounded-lg bg-background border border-border px-4 py-3 text-foreground">
//                     <option value="">Select network size</option>
//                     <option value="SMALL">Small (Under 1,000)</option>
//                     <option value="MEDIUM">Medium (1,000 - 10,000)</option>
//                     <option value="LARGE">Large (10,000 - 100,000)</option>
//                     <option value="MASSIVE">Massive (100,000+)</option>
//                   </select>
//                   {errors.networkSize && <p className="text-destructive text-red-500 text-sm mt-1">{errors.networkSize.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="monthlyIncomeGoal" className="text-base">Monthly Income Goal *</Label>
//                   <select id="monthlyIncomeGoal" {...register("monthlyIncomeGoal")} className="w-full mt-2 rounded-lg bg-background border border-border px-4 py-3 text-foreground">
//                     <option value="">Select income goal</option>
//                     <option value="1000-5000">$1,000 - $5,000</option>
//                     <option value="5000-10000">$5,000 - $10,000</option>
//                     <option value="10000-25000">$10,000 - $25,000</option>
//                     <option value="25000-50000">$25,000 - $50,000</option>
//                     <option value="50000+">$50,000+ (Royal Elite)</option>
//                   </select>
//                   {errors.monthlyIncomeGoal && <p className="text-destructive text-red-500 text-sm mt-1">{errors.monthlyIncomeGoal.message}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Social Media */}
//             <div className="pt-6 border-t border-border/50">
//               <h3 className="text-2xl font-bold mb-6">Social Media Presence (Optional)</h3>
//               <div className="grid md:grid-cols-2 gap-6">
//                 {["instagram", "facebook", "linkedin", "tweeterX", "youtube", "tiktok"].map((platform) => (
//                   <div key={platform}>
//                     <Label htmlFor={platform} className="text-base capitalize">{platform}</Label>
//                     <Input id={platform} {...register(platform)} placeholder={`${platform}.com/yourprofile`} className="mt-2" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Vision & Strategy */}
//             <div className="pt-6 border-t border-border/50">
//               <h3 className="text-2xl font-bold mb-6">Your Vision & Strategy</h3>
//               <div className="space-y-6">
//                 <div>
//                   <Label htmlFor="whyWantToBecomeIb" className="text-base">Why do you want to become an Elite IB? *</Label>
//                   <Textarea id="whyWantToBecomeIb" {...register("whyWantToBecomeIb")} placeholder="Tell us about your goals..." className="mt-2 min-h-[150px]" />
//                   {errors.whyWantToBecomeIb && <p className="text-destructive text-red-500 text-sm mt-1">{errors.whyWantToBecomeIb.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="howYouAcquireClients" className="text-base">How will you market and acquire clients? *</Label>
//                   <Textarea id="howYouAcquireClients" {...register("howYouAcquireClients")} placeholder="Describe your marketing strategy..." className="mt-2 min-h-[120px]" />
//                   {errors.howYouAcquireClients && <p className="text-destructive text-red-500 text-sm mt-1">{errors.howYouAcquireClients.message}</p>}
//                 </div>

//                 <div>
//                   <Label htmlFor="whatsYourDreamLuxuryReward" className="text-base">What's your dream luxury reward? *</Label>
//                   <select id="whatsYourDreamLuxuryReward" {...register("whatsYourDreamLuxuryReward")} className="w-full mt-2 rounded-lg bg-background border border-border px-4 py-3 text-foreground">
//                     <option value="">Select your dream reward</option>
//                     <option value="rolex">Rolex Daytona Gold ($50,000)</option>
//                     <option value="ferrari">Ferrari F8 Tributo ($280,000)</option>
//                     <option value="lamborghini">Lamborghini Huracán ($250,000)</option>
//                     <option value="rollsroyce">Rolls Royce Cullinan ($350,000)</option>
//                     <option value="dubai-penthouse">Dubai Marina Penthouse ($2M+)</option>
//                     <option value="all">All of the above (Royal Elite)</option>
//                   </select>
//                   {errors.whatsYourDreamLuxuryReward && <p className="text-destructive text-red-500 text-sm mt-1">{errors.whatsYourDreamLuxuryReward.message}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Remark & Submit */}
//             <div className="pt-6 border-t border-border/50">
//               <Label htmlFor="remark" className="text-base">Remark *</Label>
//               <Textarea id="remark" {...register("remark")} placeholder="Type your remark..." className="mt-2 min-h-[80px]" />
//               {errors.remark && <p className="text-destructive text-red-500 text-sm mt-1">{errors.remark.message}</p>}
//             </div>

//             <div className="pt-8">
//               <Button type="submit" variant="luxury" size="lg" className="w-full text-lg py-7" disabled={isSubmitting}>
//                 {isSubmitting ? "Submitting Your Elite Application..." : "Join Elite IB Circle Now"}
//               </Button>
//               <p className="text-center text-sm text-muted-foreground mt-4">
//                 🔒 Your information is secure and will be reviewed by our elite team within 24 hours
//               </p>
//             </div>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };





















import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  Button,
  FormHelperText,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import { Crown, Sparkles, TrendingUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { useToast } from "../hooks/use-toast";
import { useRequestForIBMutation } from "../globalState/ibState/ibStateApis";
import { setNotification } from "../globalState/notificationState/notificationStateSlice";

const emptyToUndefined = (schema) =>
  z.preprocess((val) => (val === "" || val === null ? undefined : val), schema.optional());

const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  mobile: z.string().min(10, "Invalid mobile number").max(20, "Mobile number too long"),
  country: z.string().min(2, "Please select your country"),
  tradingExperienceLevel: z.string().min(1, "Please select your trading experience level"),
  expectedClintsPerMonths: z.string().min(1, "Please select expected clients per months"),
  networkSize: z.string().min(1, "Please tell us about your network"),
  instagram: emptyToUndefined(z.string().max(200, "URL too long").optional()),
  facebook: emptyToUndefined(z.string().max(200, "URL too long").optional()),
  linkedin: emptyToUndefined(z.string().max(200, "URL too long").optional()),
  tweeterX: emptyToUndefined(z.string().max(200, "URL too long").optional()),
  youtube: emptyToUndefined(z.string().max(200, "URL too long").optional()),
  tiktok: emptyToUndefined(z.string().max(200, "URL too long").optional()),
  whyWantToBecomeIb: z.string().min(50, "Please provide at least 50 characters").max(1000, "Message too long"),
  whatsYourDreamLuxuryReward: z.string().min(1, "Please select your dream luxury reward"),
  monthlyIncomeGoal: z.string().min(1, "Please select your income goal"),
  howYouAcquireClients: z.string().min(10, "Please describe your marketing approach").max(500, "Description too long"),
  remark: z.string().min(10, "Please type your remark").max(100, "Description too long"),
});

export default function IBApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [requestForIB, { isLoading }] = useRequestForIBMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      country: "",
      tradingExperienceLevel: "",
      expectedClintsPerMonths: "",
      networkSize: "",
      monthlyIncomeGoal: "",
      instagram: "",
      facebook: "",
      linkedin: "",
      tweeterX: "",
      youtube: "",
      tiktok: "",
      whyWantToBecomeIb: "",
      howYouAcquireClients: "",
      whatsYourDreamLuxuryReward: "",
      remark: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await requestForIB(data).unwrap();
      if (response?.status) {
        dispatch(
          setNotification({
            open: true,
            message: response?.message || "Request submitted successfully.",
            severity: "success",
          })
        );
        reset();
      }
    } catch (error) {
      dispatch(
        setNotification({
          open: true,
          message: error?.data?.message || "Failed to submit. Please try again later.",
          severity: "error",
        })
      );
    }
  };

  return (
    <Box sx={{ py: 8, px: 3, bgcolor: "background.default" }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
        <Box textAlign="center" mb={5}>
          <Box display="inline-flex" alignItems="center" gap={1} px={3} py={1} mb={2} border={1} borderColor="primary.main" borderRadius={5}>
            <Crown size={18} color="#ffb300" />
            <Typography variant="subtitle2" fontWeight="bold">
              EXCLUSIVE APPLICATION
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Join the <span style={{ color: "#ffb300" }}>Elite IB Circle</span> Today
          </Typography>
          <Typography color="text.secondary">
            Complete this application to unlock <strong>unlimited earning potential</strong>, luxury rewards, and exclusive benefits.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Information */}
          <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}>
            <Sparkles size={20} color="#ffb300" /> Personal Information
          </Typography>
          <Grid container spacing={3}>
            {[
              { name: "name", label: "Full Name *" },
              { name: "email", label: "Email Address *", type: "email" },
              { name: "mobile", label: "Phone Number *" },
              { name: "country", label: "Country *" },
            ].map(({ name, label, type }) => (
              <Grid item xs={12} md={6} key={name}>
                <TextField
                  size="small"
                  placeholder={label}
                  fullWidth
                  type={type || "text"}
                  {...register(name)}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                />
              </Grid>
            ))}
          </Grid>

          {/* Network & Experience */}
          <Box mt={5}>
            <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}>
              <TrendingUp size={20} color="#ffb300" /> Your Network & Experience
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  name: "tradingExperienceLevel",
                  label: "Trading Experience *",
                  options: ["BEGINER", "INTERMEDIATE", "ADVANCED", "EXPRET"],
                },
                {
                  name: "expectedClintsPerMonths",
                  label: "Expected Clients Per Month *",
                  options: ["1-5 CLIENTS", "6-10 CLIENTS", "11-20 CLIENTS", "21-50 CLIENTS", "50+ CLIENTS"],
                },
                {
                  name: "networkSize",
                  label: "Network Size *",
                  options: ["SMALL", "MEDIUM", "LARGE", "MASSIVE"],
                },
                {
                  name: "monthlyIncomeGoal",
                  label: "Monthly Income Goal *",
                  options: ["1000-5000", "5000-10000", "10000-25000", "25000-50000", "50000+"],
                },
              ].map(({ name, label, options }) => (
                <Grid item xs={12} md={6} key={name}>
                  <InputLabel sx={{ mb: "10px" }}>{label}</InputLabel>
                  <FormControl fullWidth error={!!errors[name]}>
                    <Select {...register(name)} defaultValue="" size="small">
                      <MenuItem value="">Select</MenuItem>
                      {options.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors[name]?.message}</FormHelperText>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Social Media */}
          <Box mt={5}>
            <Typography variant="h6" mb={2}>
              Social Media Presence (Optional)
            </Typography>
            <Grid container spacing={3}>
              {["instagram", "facebook", "linkedin", "tweeterX", "youtube", "tiktok"].map((platform) => (
                <Grid item xs={12} md={6} key={platform}>
                  <TextField
                    size="small"
                    placeholder={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    fullWidth
                    {...register(platform)}
                    error={!!errors[platform]}
                    helperText={errors[platform]?.message}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Vision & Strategy */}
          <Box mt={5}>
            <Typography variant="h6" mb={2}>
              Your Vision & Strategy
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  placeholder="Why do you want to become an Elite IB? *"
                  multiline
                  minRows={4}
                  fullWidth
                  {...register("whyWantToBecomeIb")}
                  error={!!errors.whyWantToBecomeIb}
                  helperText={errors.whyWantToBecomeIb?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  placeholder="How will you market and acquire clients? *"
                  multiline
                  minRows={4}
                  fullWidth
                  {...register("howYouAcquireClients")}
                  error={!!errors.howYouAcquireClients}
                  helperText={errors.howYouAcquireClients?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel sx={{ mb: "10px" }}>What's your dream luxury reward? *</InputLabel>
                <FormControl fullWidth error={!!errors.whatsYourDreamLuxuryReward}>
                  <Select {...register("whatsYourDreamLuxuryReward")} defaultValue="" size="small">
                    <MenuItem value="">Select your dream reward</MenuItem>
                    <MenuItem value="rolex">Rolex Daytona Gold ($50,000)</MenuItem>
                    <MenuItem value="ferrari">Ferrari F8 Tributo ($280,000)</MenuItem>
                    <MenuItem value="lamborghini">Lamborghini Huracán ($250,000)</MenuItem>
                    <MenuItem value="rollsroyce">Rolls Royce Cullinan ($350,000)</MenuItem>
                    <MenuItem value="dubai-penthouse">Dubai Marina Penthouse ($2M+)</MenuItem>
                    <MenuItem value="all">All of the above (Royal Elite)</MenuItem>
                  </Select>
                  <FormHelperText>{errors.whatsYourDreamLuxuryReward?.message}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Remark */}
          <Box mt={5}>
            <TextField
              label="Remark *"
              multiline
              minRows={3}
              fullWidth
              {...register("remark")}
              error={!!errors.remark}
              helperText={errors.remark?.message}
            />
          </Box>

          {/* Submit */}
          <Box mt={5}>
            <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={isSubmitting || isLoading}>
              {isSubmitting ? "Submitting Your Elite Application..." : "Join Elite IB Circle Now"}
            </Button>
            <Typography align="center" variant="body2" color="text.secondary" mt={2}>
              🔒 Your information is secure and will be reviewed by our elite team within 24 hours
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}