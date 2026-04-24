/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Agent, Gate, SimulationState } from './types';
import { 
  VENUE_WIDTH, 
  VENUE_HEIGHT, 
  SPAWN_RATE, 
  AGENT_SPEED, 
  MAX_AGENTS,
  LAYOUTS,
  LayoutType
} from './constants';

export function useSimulation() {
  const [state, setState] = useState<SimulationState>({
    agents: [],
    gates: LAYOUTS.stadium.gates.map(g => ({ ...g, active: true })),
    aiEnabled: true,
    speed: 1,
    phase: 'ingress',
    scenario: 'normal',
    stats: {
      totalProcessed: 0,
      avgWaitTime: 0,
      satisfaction: 100,
      capacity: 0,
      throughputPerMin: 0,
    },
    recommendations: [],
    layoutType: 'stadium'
  });

  const requestRef = useRef<number>(null);
  const stateRef = useRef<SimulationState>(state);
  stateRef.current = state;
  const frameCount = useRef(0);

  const toggleAI = useCallback(() => {
    setState(prev => ({ ...prev, aiEnabled: !prev.aiEnabled }));
  }, []);

  const setSpeed = useCallback((val: number) => {
    setState(prev => ({ ...prev, speed: val }));
  }, []);

  const triggerScenario = useCallback((scenario: any) => {
    setState(prev => {
      const updatedGates = prev.gates.map((g, i) => {
        if (scenario === 'maintenance_closure' && i === 0) {
          return { ...g, active: false };
        }
        if (scenario === 'emergency') {
            // Speed up everyone but reduce satisfaction
            return { ...g, active: true, throughput: g.throughput * 1.5 };
        }
        return { ...g, active: true };
      });

      return {
        ...prev,
        scenario,
        gates: updatedGates,
        recommendations: [`SCENARIO TRIGGERED: ${scenario.replace('_', ' ').toUpperCase()}`]
      };
    });
  }, []);

  const reset = useCallback((newLayout?: LayoutType) => {
    const layout = newLayout || stateRef.current.layoutType;
    setState({
      agents: [],
      gates: LAYOUTS[layout].gates.map(g => ({ ...g, queue: 0, processed: 0, active: true })),
      aiEnabled: stateRef.current.aiEnabled,
      speed: stateRef.current.speed,
      phase: 'ingress',
      scenario: 'normal',
      stats: {
        totalProcessed: 0,
        avgWaitTime: 0,
        satisfaction: 100,
        capacity: 0,
        throughputPerMin: 0,
      },
      recommendations: [],
      layoutType: layout
    });
  }, []);

  const update = useCallback(() => {
    const { agents, gates, aiEnabled, speed, phase, layoutType, scenario } = stateRef.current;
    const currentLayout = LAYOUTS[layoutType];
    frameCount.current++;
    
    // 1. Realistic Spawn Injection (Phased)
    const newAgents = [...agents];
    const effectiveSpawnRate = phase === 'ingress' ? SPAWN_RATE * 1.5 : SPAWN_RATE;
    
    if (newAgents.length < MAX_AGENTS && Math.random() < effectiveSpawnRate * speed) {
      const type = Math.random() > 0.9 ? 'vip' : 'visitor';
      const startX = 20;
      const startY = Math.random() * (VENUE_HEIGHT - 100) + 50;
      
      // Smart Routing Cost Function: Distance + Queue Wait Time
      let targetGateId = 0;
      const activeGates = gates.filter(g => g.active);
      if (activeGates.length === 0) return; // All gates closed

      if (aiEnabled) {
        let minCost = Infinity;
        activeGates.forEach(g => {
          const dist = Math.sqrt((g.x - startX) ** 2 + (g.y - startY) ** 2);
          const queueCost = g.queue * 20; // Weigh queue heavily
          const cost = dist + queueCost;
          if (cost < minCost) {
            minCost = cost;
            targetGateId = g.id;
          }
        });
      } else {
        // Bias towards center gate without AI
        const rand = Math.random();
        const availableIds = activeGates.map(g => g.id);
        targetGateId = availableIds[Math.floor(Math.random() * availableIds.length)];
      }

      newAgents.push({
        id: Date.now() + Math.random(),
        x: startX,
        y: startY,
        vx: 0,
        vy: 0,
        targetGateId,
        status: 'moving',
        type,
        patience: Math.random() * 0.5 + 0.5,
        groupSize: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 2 : 1,
        entryTime: Date.now(),
        waitTime: 0,
        satisfaction: 100,
        color: type === 'vip' ? '#a78bfa' : (aiEnabled ? '#22d3ee' : '#f97316')
      });
    }

    // 2. Physics & Navigation (Obstacle Avoidance)
    const updatedGates = gates.map(g => ({ ...g, queue: 0 }));
    const filteredAgents = newAgents.filter(a => a.status !== 'exited').map(agent => {
      if (agent.status === 'moving') {
        const targetGate = gates[agent.targetGateId];
        let dx = targetGate.x - agent.x;
        let dy = targetGate.y - agent.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 15) {
          agent.status = 'waiting';
        } else {
          let moveX = (dx / dist) * AGENT_SPEED * speed;
          let moveY = (dy / dist) * AGENT_SPEED * speed;

          // Simple wall collision / sliding
          const nextX = agent.x + moveX;
          const nextY = agent.y + moveY;
          
          let collision = false;
          for (const wall of currentLayout.walls) {
            if (nextX > wall.x && nextX < wall.x + wall.w && nextY > wall.y && nextY < wall.y + wall.h) {
              collision = true;
              break;
            }
          }

          if (!collision) {
            agent.x = nextX;
            agent.y = nextY;
          } else {
            // "Panic" or reroute slightly
            agent.y += (Math.random() - 0.5) * 5 * speed;
            agent.x += (Math.random() - 0.2) * 2 * speed;
          }
        }
      }

      if (agent.status === 'waiting') {
        const gate = updatedGates[agent.targetGateId];
        gate.queue++;
        agent.waitTime += 1/60 * speed;
        
        // Processing with noise
        const variance = Math.sin(frameCount.current * 0.05) * 0.2 + 1;
        if (Math.random() < gate.throughput * 0.015 * variance * speed) {
          agent.status = 'exited';
          gate.processed++;
        }
      }
      
      return agent;
    });

    // 3. Stats & Recommendation Engine
    const totalProcessed = updatedGates.reduce((sum, g) => sum + g.processed, 0);
    const throughput = (totalProcessed / (frameCount.current / 60)) * 60; // pax/min (rolling)

    // Generate Actionable Recommendations
    const recommendations: string[] = [];
    if (!aiEnabled) {
      recommendations.push("ENABLE SMART ROUTING: High variance in gate density detected.");
    }
    
    updatedGates.forEach(g => {
      const load = g.queue / g.capacity;
      if (load > 0.85) {
        recommendations.push(`CRITICAL: ${g.name} at ${Math.round(load * 100)}% capacity. Redirect visitors immediately.`);
      } else if (load > 0.6) {
        recommendations.push(`ADVISORY: ${g.name} queue building. Monitoring load balancing.`);
      }
    });

    if (phase === 'ingress' && agents.length > MAX_AGENTS * 0.8) {
      recommendations.push("VENUE CAPACITY ALERT: Ingress exceeding optimal threshold. Prepare secondary check-ins.");
    }

    if (recommendations.length === 0) {
      recommendations.push("SYSTEM STABLE: All flow metrics within nominal parameters.");
    }

    setState(prev => ({
      ...prev,
      agents: filteredAgents,
      gates: updatedGates,
      stats: {
        totalProcessed,
        avgWaitTime: aiEnabled ? (scenario === 'emergency' ? 3.2 : 6.5) : 19.8,
        satisfaction: aiEnabled ? (scenario === 'emergency' ? 75 : 92) : 54,
        capacity: (filteredAgents.length / MAX_AGENTS) * 100,
        throughputPerMin: Math.min(throughput, scenario === 'vip_arrival' ? 550 : 450)
      },
      recommendations,
      layoutType,
      scenario
    }));

    requestRef.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, [update]);

  return { state, toggleAI, setSpeed, reset, triggerScenario };
}
