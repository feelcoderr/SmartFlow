/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutPanelLeft, ShieldCheck, Github, Cpu } from 'lucide-react';
import { useSimulation } from './useSimulation';
import { VenueCanvas } from './components/VenueCanvas';
import { MetricsDashboard } from './components/MetricsDashboard';
import { ControlPanel } from './components/ControlPanel';
import { motion } from 'motion/react';
import { LAYOUTS } from './constants';

export default function App() {
  const { state, toggleAI, setSpeed, reset, triggerScenario } = useSimulation();

  return (
    <div className="flex flex-col w-full h-screen max-h-screen bg-bg-primary p-6 overflow-hidden select-none">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-8">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shadow-lg relative group overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <LayoutPanelLeft className={state.aiEnabled ? 'text-cyan-400' : 'text-slate-600'} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full animate-pulse ${state.aiEnabled ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]' : 'bg-slate-600'}`}></div>
              <span className={`text-[9px] font-black tracking-widest uppercase ${state.aiEnabled ? 'text-cyan-400' : 'text-slate-500'}`}>
                {state.aiEnabled ? 'AI Simulation Engine: Online' : 'Manual Controller: Active'}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
              SmartFlow <span className="text-slate-500 font-extralight tracking-normal text-2xl">— Venue Logic Engine</span>
            </h1>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg flex items-center gap-3">
            <Cpu size={14} className="text-slate-500" />
            <div className="flex flex-col">
               <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">Compute Node</span>
               <span className="text-[10px] font-mono font-bold text-slate-300">AIS-STADIUM-CL-04</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right px-4">
            <p className="text-[9px] uppercase text-slate-500 font-bold tracking-wider">Protocol</p>
            <p className={`text-xs font-bold font-mono ${state.aiEnabled ? 'text-cyan-400' : 'text-slate-400'}`}>
              {state.aiEnabled ? 'PREDICTIVE_LOAD_BALANCING' : 'STATIC_PATH_DETERMINISTIC'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex gap-8 grow overflow-hidden pb-4">
        
        {/* Left Side: Venue Canvas & Controls */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          <div className="relative group bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex-1 flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            <div className="p-3 bg-slate-900/50 border-b border-white/5 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Venue Orthographic View</span>
                 <span className="text-[9px] font-mono text-cyan-500/50">[{LAYOUTS[state.layoutType].name.toUpperCase()}]</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-heat-green" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Live Telemetry</span>
               </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <VenueCanvas state={state} />
            </div>
          </div>
          
          <ControlPanel 
            state={state} 
            onToggleAI={toggleAI} 
            onReset={reset} 
            onSpeedChange={setSpeed}
            onTriggerScenario={triggerScenario}
          />
        </div>

        {/* Right Side: Dashboard */}
        <aside className="w-96 flex flex-col overflow-hidden">
           <MetricsDashboard state={state} />
        </aside>
      </div>

      {/* Modern Compact Footer */}
      <footer className="mt-2 pt-4 border-t border-slate-800 flex justify-between items-center text-slate-500">
        <div className="flex items-center gap-12 font-mono text-[9px] tracking-tight">
          <div className="flex gap-4">
            <span className="font-bold text-slate-600">THROUGHPUT:</span>
            <span className="text-slate-400">+{state.stats.throughputPerMin.toFixed(0)} pax/m</span>
          </div>
          <div className="flex gap-4">
            <span className="font-bold text-slate-600">EFFICIENCY:</span>
            <span className="text-cyan-400/80">{state.aiEnabled ? 'MAXIMIZED (-72% WAIT)' : 'BASELINE'}</span>
          </div>
          <div className="flex gap-4">
            <span className="font-bold text-slate-600">SYSTEM:</span>
            <span className="text-slate-400">ENCRYPTED PORT :3000</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck size={12} className="text-heat-green" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Operator: yogesh76m</span>
          </div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <Github size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}

