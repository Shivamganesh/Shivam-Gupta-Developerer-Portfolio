// import React, { useState } from "react";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Sparkles } from "lucide-react";

// export default function AiAnalyzer() {
//   const [jobDescription, setJobDescription] = useState("");

//   const handleAnalyze = () => {
//     if (!jobDescription.trim()) return;
//     window.open(`/ai-result?jd=${encodeURIComponent(jobDescription)}`, "_blank");
//   };

//   return (
//     <section className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-20 flex items-center justify-center">
//       <div className="max-w-4xl w-full text-center">
//         {/* Header */}
//         <div className="mb-12">
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4 font-serif">
//             AI Job Match Analyzer
//           </h1>
//           <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
//             Paste a job description below and let our smart AI evaluate how well Shivam Gupta's profile matches the role.
//             Get instant insights like match score, skill gaps, and suggestions.
//           </p>
//         </div>

//         {/* Text Area */}
//         <div className="mb-8">
//           <Textarea
//             className="w-full h-52 p-4 rounded-lg border border-cyan-600 bg-slate-800 text-white placeholder:text-blue-300 focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
//             placeholder="Paste the job description here..."
//             value={jobDescription}
//             onChange={(e) => setJobDescription(e.target.value)}
//           />
//         </div>

//         {/* Analyze Button */}
//         <Button
//           onClick={handleAnalyze}
//           className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 text-lg rounded-full hover:shadow-lg hover:shadow-cyan-500/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
//         >
//           <Sparkles className="animate-pulse" size={20} />
//           Analyze with AI
//         </Button>

//         {/* Footer Note */}
//         <p className="mt-6 text-blue-400 text-sm">
//           Powered by AI and Shivam’s portfolio data — your next best hire is one click away.
//         </p>
//       </div>
//     </section>
//   );
// }
