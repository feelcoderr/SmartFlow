/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RotateCcw, Brain, Activity, Zap, ShieldAlert, Star, Settings2 } from 'lucide-react';
import { SimulationState, Scenario } from '../types';
import { LAYOUTS, LayoutType } from '../constants';

interface Props {
  state: SimulationState;
  onToggleAI: () => void;
  onReset: (newLayout?: LayoutType) => void;
  onSpeedChange: (val: number) => void;
  onTriggerScenario: (scenario: Scenario) => void;
}

export function ControlPanel({ state, onToggleAI, onReset, onSpeedChange, onTriggerScenario }: Props) {
  const scenarios: { type: Scenario; icon: any; label: string }[] = [
    { type: 'normal', icon: Zap, label: 'Standard' },
    { type: 'emergency', icon: ShieldAlert, label: 'Emergency' },
    { type: 'vip_arrival', icon: Star, label: 'VIP Burst' },
    { type: 'maintenance_closure', icon: Settings2, label: 'Maintenance' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Scenario Presets Bar */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-2 rounded-xl flex gap-2 items-center">
        <span className="text-[10px] font-black uppercase text-slate-500 px-3 tracking-widest border-r border-slate-800">Scenarios</span>
        {scenarios.map((s) => (
          <button
            key={s.type}
            onClick={() => onTriggerScenario(s.type)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-tight ${
              state.scenario === s.type
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-500 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <s.icon size={12} />
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-950/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50" />
        
        <div className="flex gap-4 items-center">
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
          {(Object.keys(LAYOUTS) as LayoutType[]).map((layout) => (
            <button
              key={layout}
              onClick={() => onReset(layout)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
                state.layoutType === layout
                  ? 'bg-slate-800 text-cyan-400 shadow-inner'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {layout}
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-slate-800" />
        <button 
          onClick={onToggleAI}
          className={`px-8 py-3 rounded-lg text-xs font-black transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)] uppercase tracking-widest flex items-center gap-3 ${
            state.aiEnabled 
              ? 'bg-cyan-500 text-slate-900 hover:bg-cyan-400' 
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Brain size={16} />
          {state.aiEnabled ? 'AI Routing Active' : 'Enable AI Routing'}
        </button>
        
        <div className="h-8 w-px bg-slate-800" />
        
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={14} />
          Full Reset
        </button>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Time Resolution</span>
            <span className="text-[10px] font-mono font-bold text-cyan-400">{state.speed.toFixed(1)}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="3" 
            step="0.5" 
            value={state.speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-32 accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
          />
        </div>
        
        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-3">
          <Activity size={14} className={state.aiEnabled ? 'text-cyan-400 animate-pulse' : 'text-slate-600'} />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Engine Status</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
              {state.aiEnabled ? 'Optimal' : 'Degraded'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
