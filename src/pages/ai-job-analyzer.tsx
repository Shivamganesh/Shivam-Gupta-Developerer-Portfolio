import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const JobAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

     const body = {
      jobDescription,
      resumeText: `
Shivam Gupta – Full Stack Developer (B.Tech CSE 2024)
✅ Experience : 0 years()
✅ Key Skills:
- React.js, Node.js, Express.js, MongoDB, Core Java, Tailwind CSS, JavaScript, HTML5, CSS3, TypeScript, Fastify, Zustand, React Native
- MERN Stack, Responsive UI, JWT Authentication, Real-Time Updates (WebSockets), Google Maps Integration, UI Animation

✅ Relevant Projects:
1. GrocyGo – Cross-platform grocery delivery app using React Native CLI, Zustand, Fastify, WebSockets, JWT, MongoDB.
2. ShareIt – Offline file sharing app using React Native, TCP/UDP, Zustand, QR pairing.
3. Apple Vision – Responsive animated showcase website using HTML, Tailwind CSS, GSAP, Shery.js, Canvas.
4. Elegant Booking – Venue booking platform with Express.js, MongoDB, REST APIs, admin dashboard.
      `,
      skills: [
        "React.js", "Node.js", "MongoDB", "Java", "Tailwind CSS", "Express.js",
        "TypeScript", "Fastify", "React Native", "WebSockets"
      ],
      projects: ["GrocyGo", "ShareIt", "Apple Vision", "Elegant Booking"]
    };

    try {
      const res = await fetch("https://shivam-gupta-portfolio-server.onrender.com/api/job-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.result) setResult(data.result);
      else alert("Invalid result format");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-violet-950 text-white p-6 sm:p-10 font-sans">
      {/* Title */}
     <motion.div
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="text-center mb-10"
>
  <h1 className="flex justify-center items-center gap-3 text-3xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
    <Sparkles className="text-cyan-300 w-8 h-8 animate-pulse" />
    AI Job Match Analyzer
  </h1>

  <p className="mt-3 text-blue-200 text-sm sm:text-base max-w-xl mx-auto">
    🔍 Paste a job description & get instant insights on how well my <span className="text-cyan-300 font-medium">skills, projects, and experience</span> align with it.
  </p>
</motion.div>


      {/* Textarea */}
      <motion.textarea
        rows={8}
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="scrollbar-thin scrollbar  mt-10 w-full p-5 sm:p-6 text-lg leading-relaxed bg-white/10 backdrop-blur-lg rounded-xl text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-blue-200 resize-none transition-all duration-300"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      />

      {/* Analyze Button */}
      <motion.button
        onClick={handleAnalyze}
        disabled={loading}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        className="mt-6 mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300"
      >
        {loading && <Loader2 className="animate-spin h-5 w-5" />}
        {loading ? "Analyzing..." : "🔍 Analyze Job Match"}
      </motion.button>

      {/* Result Output */}
    {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatedCard title="🎯 Match Score">
            <p className="text-5xl font-bold text-cyan-300">{result["Match Score"]}%</p>
          </AnimatedCard>

          <AnimatedCard title="✅ Matched Skills">
            <SkillList data={result["Matched Skills"]} color="text-green-400" />
          </AnimatedCard>

          <AnimatedCard title="❌ Missing Skills">
            <SkillList data={result["Missing Skills"]} color="text-red-400" />
          </AnimatedCard>

          <AnimatedCard title="📦 Matched Projects">
            <SkillList data={result["Matched Projects"]} color="text-yellow-300" />
          </AnimatedCard>

          <AnimatedCard title="📈 Suggestions for Improvement">
            <ul className="list-disc list-inside space-y-1 text-blue-100 text-sm">
              {result["Suggestions for improvement"].map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </AnimatedCard>

          <AnimatedCard title="👨‍💼 Experience Match">
            <div className="text-sm text-blue-100 space-y-1">
              <p><strong className="text-blue-400">Job Requirement:</strong> {result["Experience Match"]["Job Requirement"]}</p>
              <p><strong className="text-blue-400">Your Experience:</strong> {result["Experience Match"]["Candidate Experience"]}</p>
              <p><strong className="text-blue-400">Match:</strong> {result["Experience Match"]["Match"]}</p>
              <p><strong className="text-blue-400">Comment:</strong> {result["Experience Match"]["Comment"]}</p>
            </div>
          </AnimatedCard>

          <AnimatedCard
            title="🧠 Fit Summary"
            full
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-blue-700/40 via-purple-800/40 to-indigo-900/40 border-cyan-500/30"
          >
            <p className="text-white italic text-base">{result["Fit Summary"]}</p>
          </AnimatedCard>
        </motion.div>
      )}
    </section>
  );
};

export default JobAnalyzer;

// 🎨 Helper components

const AnimatedCard = ({ title, children, className = "", full = false }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className={`rounded-2xl p-5 bg-white/10 backdrop-blur-lg border border-white/10 shadow-md transition-all ${className} ${full ? "col-span-full" : ""}`}
  >
    <h3 className="text-lg font-semibold text-cyan-300 mb-3">{title}</h3>
    {children}
  </motion.div>
);

const SkillList = ({ data, color = "text-white" }) => (
  <div className="flex flex-wrap gap-2">
    {data?.length > 0 ? data.map((item, i) => (
      <span
        key={i}
        className={`px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20 ${color}`}
      >
        {item}
      </span>
    )) : (
      <span className="text-white/60 text-sm">No data</span>
    )}
  </div>
);
