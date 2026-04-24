/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Agent {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetGateId: number;
  status: 'moving' | 'waiting' | 'exited';
  type: 'visitor' | 'vip' | 'staff';
  patience: number; // 0 to 1, affects dissatisfaction rate
  groupSize: number;
  entryTime: number;
  waitTime: number;
  satisfaction: number;
  color: string;
}

export interface Gate {
  id: number;
  name: string;
  x: number;
  y: number;
  queue: number;
  processed: number;
  capacity: number;
  throughput: number;
  type: string;
  active: boolean; // For closure scenarios
}

export type Scenario = 'normal' | 'emergency' | 'vip_arrival' | 'maintenance_closure';

export interface SimulationState {
  agents: Agent[];
  gates: Gate[];
  aiEnabled: boolean;
  speed: number;
  phase: 'idle' | 'ingress' | 'intermission' | 'egress';
  scenario: Scenario;
  stats: {
    totalProcessed: number;
    avgWaitTime: number;
    satisfaction: number;
    capacity: number;
    throughputPerMin: number;
  };
  recommendations: string[];
  layoutType: 'stadium' | 'concert' | 'convention';
}
