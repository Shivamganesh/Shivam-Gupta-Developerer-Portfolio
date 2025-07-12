import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Loader2,
  AlertCircle,
  BadgeCheck,
  ShieldAlert,
  BarChartBig,
} from "lucide-react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerPath from "pdfjs-dist/build/pdf.worker?url";

GlobalWorkerOptions.workerSrc = pdfWorkerPath;

const ResumeReviewer = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    setError("");
    setUploadedFile(file);
    setResult(null);
    setLoading(true);

    try {
      const pdfData = await file.arrayBuffer();
      const pdf = await getDocument({ data: pdfData }).promise;

      let resumeText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        resumeText += content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ") + "\n";
      }

      const response = await fetch("http://localhost:5000/api/resume-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to analyze resume");

      setResult(data.result);
    } catch (err) {
      console.error("Resume parse/analyze error:", err);
      setError("Something went wrong while analyzing the resume.");
    }

    setLoading(false);
  };

  const getColor = (score) =>
    score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-300" : "text-red-400";

  return (
    <section className="min-h-screen py-20 px-6 bg-gradient-to-br from-indigo-950 via-blue-950 to-violet-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
          Upload Your Resume & Let AI Do the Magic
        </h1>
        <p className="text-blue-200 text-lg mb-10">
          Get your resume reviewed with a smart score, keyword match, grammar check, and improvement tips.
        </p>

        {/* Upload Box */}
        <label
          htmlFor="resume-upload"
          className="cursor-pointer group relative inline-block w-full max-w-md mx-auto border-2 border-dashed border-purple-400 p-10 rounded-2xl hover:border-pink-500 transition-all duration-300"
        >
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <UploadCloud
            size={36}
            className="mx-auto text-pink-300 group-hover:scale-110 transition-transform"
          />
          <p className="mt-4 text-purple-200">Click or Drag & Drop your resume PDF</p>
        </label>

        {/* Loader */}
        {loading && (
          <div className="mt-10 text-pink-300 flex items-center justify-center">
            <Loader2 className="mr-2 animate-spin" /> Analyzing with AI...
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            className="mt-6 bg-red-500/10 text-red-300 border border-red-400 p-4 rounded-xl flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle /> {error}
          </motion.div>
        )}

        {/* Output */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-14 space-y-10 text-left"
            >
              {/* AI Feedback Summary */}
              <motion.div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
                <h2 className="text-xl font-semibold text-pink-300 mb-2">📢 AI Summary</h2>
                <p className="text-blue-100 text-base">
                  {result["AI Summary"] || "AI summary not available."}
                </p>
              </motion.div>

              {/* Resume Score & ATS */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div className="p-6 bg-green-600/10 rounded-2xl border border-green-500/20">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">📈 Resume Score</h3>
                  <p className="text-5xl font-bold text-green-400">{result["Resume Score"]}%</p>
                </motion.div>

                <motion.div className="p-6 bg-sky-600/10 rounded-2xl border border-sky-500/20">
                  <h3 className="text-lg font-semibold text-sky-300 mb-2">🤖 ATS Compatibility</h3>
                  <p className="text-3xl font-bold text-sky-200">{result["Category Scores"]["ATS Compatibility"]}%</p>
                  <p className={`mt-2 font-medium ${result["Category Scores"]["ATS Compatibility"] > 75 ? "text-green-400" : "text-yellow-300"}`}>
                    {result["Category Scores"]["ATS Compatibility"] > 75
                      ? <BadgeCheck className="inline-block mr-1" />
                      : <ShieldAlert className="inline-block mr-1" />}
                    {result["Category Scores"]["ATS Compatibility"] > 75
                      ? "ATS Friendly"
                      : "Not Fully ATS Friendly"}
                  </p>
                </motion.div>
              </div>

              {/* Category Scores */}
              <div className="bg-gradient-to-br from-purple-700/10 to-indigo-600/10 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                  <BarChartBig className="text-purple-300" /> Category Breakdown
                </h3>
                {Object.entries(result["Category Scores"]).map(([label, score], i) => {
                  const numericScore = typeof score === "number" ? score : Number(score);
                  return (
                    <div key={i} className="mb-4">
                      <p className="mb-1 text-blue-100">
                        {label}: <span className={`font-semibold ${getColor(numericScore)}`}>{numericScore}%</span>
                      </p>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${numericScore}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Suggestions */}
              <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold text-yellow-300 mb-3">💡 Suggestions for Improvement</h3>
                <ul className="text-yellow-100 space-y-2 list-disc list-inside">
                  {result["Suggestions for improvement"].map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default ResumeReviewer;
