import React from 'react'
import { useNavigate } from 'react-router-dom'

export function FeedbackReport() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Hero Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-6 right-6 flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-400 font-medium">
            <span>● Good Job</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-blue-500 bg-blue-600/10">
              <div className="text-center">
                <span className="text-3xl font-extrabold text-white">82</span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">out of 100</span>
              </div>
            </div>

            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-2xl font-bold">Interview Complete</h1>
              <p className="text-sm text-slate-300">
                You completed a <strong className="text-white">Product Management</strong> interview simulation &bull; 3 behavioral questions, 5m 34s total. Your score places you in the <strong className="text-blue-400">top 28%</strong> of all candidates this week.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 text-xs text-slate-400">
                <span>Questions: <strong className="text-white">3</strong></span>
                <span>Total Duration: <strong className="text-white">5m 34s</strong></span>
                <span>Avg. Score: <strong className="text-white">80.3</strong></span>
                <span>Role: <strong className="text-white">PM Senior</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 block mb-1">Speech Fluency & Pace</span>
            <p className="text-2xl font-bold text-white mb-1">87</p>
            <span className="text-[10px] text-emerald-400">~142 wpm &bull; Ideal range</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 block mb-1">Filler Words Usage</span>
            <p className="text-2xl font-bold text-amber-400 mb-1">Low</p>
            <span className="text-[10px] text-slate-400">6 instances &bull; 'um', 'like'</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 block mb-1">Confidence Score</span>
            <p className="text-2xl font-bold text-white mb-1">79</p>
            <span className="text-[10px] text-slate-400">Strong opener, mild fade</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-xs text-slate-400 block mb-1">Key Keywords Used</span>
            <p className="text-2xl font-bold text-blue-400 mb-1">14/20</p>
            <span className="text-[10px] text-slate-400">STAR, metrics, ownership</span>
          </div>
        </div>

        {/* AI Feedback - STAR Method section */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-semibold">AI Feedback &bull; STAR Method Breakdown</h2>
            <button onClick={() => navigate('/dashboard')} className="text-xs text-blue-400 hover:underline">
              Volver al Dashboard
            </button>
          </div>

          {/* Situation */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 space-y-2">
            <span className="inline-block px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 text-xs font-bold uppercase">Situation</span>
            <p className="text-sm text-slate-200">You clearly established the context — team size and timeline are specific and credible.</p>
            <p className="text-xs text-blue-300/80 italic">+ Add the business stakes (e.g., revenue at risk, customer impact) to sharpen urgency.</p>
          </div>

          {/* Task */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-2">
            <span className="inline-block px-2.5 py-1 rounded-md bg-amber-600/20 text-amber-400 text-xs font-bold uppercase">Task</span>
            <p className="text-sm text-slate-200">Your ownership was evident — 'I led' positions you correctly as the decision-maker.</p>
            <p className="text-xs text-amber-300/80 italic">+ Briefly note what made this migration particularly complex versus standard upgrades.</p>
          </div>

          {/* Action */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-2">
            <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-600/20 text-emerald-400 text-xs font-bold uppercase">Action</span>
            <p className="text-sm text-slate-200">Good specificity: daily standups, two-day sprints, personal unblocking. Demonstrates hands-on leadership.</p>
            <p className="text-xs text-emerald-300/80 italic">+ Name one specific technical or interpersonal obstacle you resolved — concrete examples land better than methods.</p>
          </div>

          {/* Result */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-2">
            <span className="inline-block px-2.5 py-1 rounded-md bg-purple-600/20 text-purple-400 text-xs font-bold uppercase">Result</span>
            <p className="text-sm text-slate-200">Quantified outcome (on-time, zero P1 bugs) is strong. One month of stability is a solid proof point.</p>
            <p className="text-xs text-purple-300/80 italic">+ Add a business metric — e.g., 'reduced infrastructure costs by 22%' or 'enabled the Q3 product launch'.</p>
          </div>
        </div>

      </div>
    </div>
  )
}