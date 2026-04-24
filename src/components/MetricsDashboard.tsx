/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { SimulationState } from '../types';
import { ShieldAlert, CheckCircle2, TrendingUp, Info, Zap } from 'lucide-react';

interface Props {
  state: SimulationState;
}

export function MetricsDashboard({ state }: Props) {
  const { stats, recommendations, scenario } = state;

  return (
    <div className="flex flex-col gap-6 h-full font-sans select-none">
      {/* Scenario Header */}
      <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg flex items-center justify-between">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Protocol</span>
        <div className="flex items-center gap-2">
           <Zap size={10} className="text-cyan-400" />
           <span className="text-xs font-bold text-white uppercase italic tracking-tighter">
             {scenario.replace('_', ' ')}
           </span>
        </div>
      </div>

      {/* Primary KPI Section */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-cyan-400" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Flow Velocity</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{stats.throughputPerMin.toFixed(0)}</span>
            <span className="text-xs text-slate-500 font-medium tracking-tighter">pax / min</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-heat-green" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Wait Time</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-black ${stats.avgWaitTime > 12 ? 'text-heat-red' : 'text-white'}`}>
              {stats.avgWaitTime.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-tighter">min (avg)</span>
          </div>
        </div>
      </section>

      {/* Operator Recommendations Panel */}
      <section className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Operator Directives</h3>
          </div>
          <span className="text-[9px] font-mono text-slate-500 uppercase">Live Intelligence</span>
        </div>

        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-inner">
          <div className="flex-1 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {recommendations.map((rec, i) => (
                <motion.div
                  key={rec}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-3 rounded-lg border flex gap-3 items-start transition-colors ${
                    rec.includes('CRITICAL') 
                      ? 'bg-red-500/10 border-red-500/30 text-red-100' 
                      : rec.includes('ADVISORY')
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-100'
                        : 'bg-slate-800/50 border-slate-700 text-slate-200'
                  }`}
                >
                  {rec.includes('CRITICAL') ? (
                    <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  )}
                  <span className="text-[11px] font-bold leading-relaxed tracking-tight">{rec}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Global Venue Status */}
      <section className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-3 shadow-lg">
        <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
          <span>Overall Saturation</span>
          <span className={stats.satisfaction < 70 ? 'text-heat-red' : 'text-cyan-400'}>{stats.satisfaction}% Effectiveness</span>
        </div>
        
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full rounded-full ${stats.satisfaction < 60 ? 'bg-heat-red' : 'bg-cyan-400 opacity-80'}`}
            initial={{ width: 0 }}
            animate={{ width: `${stats.satisfaction}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
               <span className="text-[9px] text-slate-500 uppercase font-bold">Processed</span>
               <span className="text-sm font-black text-white">{stats.totalProcessed}</span>
             </div>
             <div className="flex flex-col border-l border-slate-800 pl-4">
               <span className="text-[9px] text-slate-500 uppercase font-bold">Groups</span>
               <span className="text-sm font-black text-white">
                 {Math.round(state.agents.reduce((acc, a) => acc + (a.groupSize > 1 ? 1 : 0), 0))}
               </span>
             </div>
             <div className="flex flex-col border-l border-slate-800 pl-4">
               <span className="text-[9px] text-slate-500 uppercase font-bold">Occupancy</span>
               <span className="text-sm font-black text-white">{stats.capacity.toFixed(0)}%</span>
             </div>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center">
             <div className={`w-2 h-2 rounded-full ${state.aiEnabled ? 'bg-heat-green animate-pulse' : 'bg-slate-600'}`} />
          </div>
        </div>
      </section>
    </div>
  );
}
