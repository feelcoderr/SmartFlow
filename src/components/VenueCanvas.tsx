/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect } from 'react';
import { SimulationState } from '../types';
import { VENUE_WIDTH, VENUE_HEIGHT, CELL_SIZE, AGENT_RADIUS, THEME, LAYOUTS } from '../constants';

interface Props {
  state: SimulationState;
}

export function VenueCanvas({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, VENUE_WIDTH, VENUE_HEIGHT);

    // Draw Heatmap
    const gridCols = Math.ceil(VENUE_WIDTH / CELL_SIZE);
    const gridRows = Math.ceil(VENUE_HEIGHT / CELL_SIZE);
    const densityMap = new Array(gridRows).fill(0).map(() => new Array(gridCols).fill(0));

    state.agents.forEach(agent => {
      const col = Math.floor(agent.x / CELL_SIZE);
      const row = Math.floor(agent.y / CELL_SIZE);
      if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
        densityMap[row][col]++;
      }
    });

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const count = densityMap[r][c];
        if (count > 0) {
          const intensity = Math.min(count / 12, 1);
          let color = THEME.heatGreen;
          if (intensity > 0.4) color = THEME.heatYellow;
          if (intensity > 0.8) color = THEME.heatRed;
          
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.globalAlpha = intensity * 0.4;
          ctx.arc(c * CELL_SIZE + CELL_SIZE/2, r * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1.0;

    // Draw Walls / Architecture
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    const currentLayout = LAYOUTS[state.layoutType];
    currentLayout.walls.forEach(wall => {
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
    });

    // Outer boundary dashed
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(50, 50, 700, 500);
    ctx.setLineDash([]);

    // Draw Gates
    state.gates.forEach(gate => {
      const load = gate.queue / gate.capacity;
      const baseColor = load > 0.8 ? THEME.heatRed : load > 0.4 ? THEME.heatYellow : THEME.heatGreen;
      const color = gate.active ? baseColor : '#334155';
      
      // Gate Marker
      ctx.fillStyle = color;
      ctx.fillRect(gate.x - 5, gate.y - 40, 10, 80);

      if (!gate.active) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 1]);
        ctx.strokeRect(gate.x - 6, gate.y - 41, 12, 82);
        ctx.setLineDash([]);
      }

      // Label
      ctx.fillStyle = gate.active ? color : '#64748b';
      ctx.font = 'bold 10px IBM Plex Mono';
      const textX = gate.x > 400 ? gate.x - 100 : gate.x + 15;
      ctx.fillText(`${gate.name.toUpperCase()} ${gate.active ? `(${Math.round(load * 100)}%)` : '[OFFLINE]'}`, textX, gate.y + 4);
    });

    // Draw Agents
    state.agents.forEach(agent => {
      ctx.beginPath();
      ctx.arc(agent.x, agent.y, agent.type === 'vip' ? AGENT_RADIUS + 1 : AGENT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = agent.status === 'waiting' ? THEME.heatRed : agent.color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      
      if (agent.type === 'vip') {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    });

  }, [state]);

  return (
    <div className="relative grow bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center">
      <div className="dot-grid" />
      
      <div className="absolute top-20 left-40 w-64 h-64 bg-heat-red/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-heat-green/5 rounded-full blur-3xl" />
      
      <canvas 
        ref={canvasRef} 
        width={VENUE_WIDTH} 
        height={VENUE_HEIGHT}
        className="relative z-10 w-full h-auto max-w-[800px] aspect-video"
      />

      <div className="absolute bottom-4 left-4 flex gap-2">
        <div className="px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full text-[10px] font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-cyan" /> <span>Standard</span>
        </div>
        <div className="px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full text-[10px] font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-purple" /> <span>VIP Path</span>
        </div>
        <div className="px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full text-[10px] font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-heat-red" /> <span>Congestion</span>
        </div>
      </div>
    </div>
  );
}
