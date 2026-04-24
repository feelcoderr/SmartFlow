/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const VENUE_WIDTH = 800;
export const VENUE_HEIGHT = 600;
export const CELL_SIZE = 40;
export const SPAWN_RATE = 0.08; // Base rate
export const AGENT_RADIUS = 3;
export const AGENT_SPEED = 2.2;
export const MAX_AGENTS = 500;

export const THEME = {
  bgPrimary: '#0f172a',
  bgSecondary: '#0f172a',
  accentCyan: '#22d3ee',
  heatGreen: '#10b981',
  heatYellow: '#f59e0b',
  heatRed: '#ef4444',
  textSecondary: '#94a3b8',
};

export type LayoutType = 'stadium' | 'concert' | 'convention';

export interface LayoutConfig {
  name: string;
  gates: any[];
  walls: any[];
}

export const LAYOUTS: Record<LayoutType, LayoutConfig> = {
  stadium: {
    name: 'Olympic Stadium',
    gates: [
      { id: 0, name: 'North Gate', x: 740, y: 150, queue: 0, processed: 0, capacity: 40, throughput: 0.6, type: 'standard' },
      { id: 1, name: 'Main Concourse', x: 740, y: 300, queue: 0, processed: 0, capacity: 80, throughput: 1.4, type: 'express' },
      { id: 2, name: 'South Gate', x: 740, y: 450, queue: 0, processed: 0, capacity: 30, throughput: 0.4, type: 'standard' },
      { id: 3, name: 'West Auxiliary', x: 50, y: 500, queue: 0, processed: 0, capacity: 20, throughput: 0.3, type: 'service' },
    ],
    walls: [
      { x: 250, y: 50, w: 20, h: 200 },
      { x: 250, y: 350, w: 20, h: 200 },
      { x: 550, y: 50, w: 20, h: 150 },
      { x: 550, y: 400, w: 20, h: 150 },
      { x: 350, y: 220, w: 120, h: 60 },
      { x: 350, y: 320, w: 120, h: 60 },
    ]
  },
  concert: {
    name: 'Grand Arena',
    gates: [
      { id: 0, name: 'Pit Entry', x: 740, y: 300, queue: 0, processed: 0, capacity: 100, throughput: 2.0, type: 'express' },
      { id: 1, name: 'Balcony Left', x: 740, y: 100, queue: 0, processed: 0, capacity: 40, throughput: 0.5, type: 'standard' },
      { id: 2, name: 'Balcony Right', x: 740, y: 500, queue: 0, processed: 0, capacity: 40, throughput: 0.5, type: 'standard' },
    ],
    walls: [
      { x: 200, y: 100, w: 400, h: 20 },
      { x: 200, y: 480, w: 400, h: 20 },
      { x: 200, y: 100, w: 20, h: 400 },
      { x: 580, y: 100, w: 20, h: 400 },
      { x: 100, y: 250, w: 20, h: 100 }, // Stage
    ]
  },
  convention: {
    name: 'Expo Center',
    gates: [
      { id: 0, name: 'Hall A', x: 740, y: 150, queue: 0, processed: 0, capacity: 60, throughput: 0.8, type: 'standard' },
      { id: 1, name: 'Hall B', x: 740, y: 450, queue: 0, processed: 0, capacity: 60, throughput: 0.8, type: 'standard' },
      { id: 2, name: 'VIP Lounge', x: 400, y: 30, queue: 0, processed: 0, capacity: 20, throughput: 0.3, type: 'vip' },
    ],
    walls: [
      { x: 150, y: 150, w: 200, h: 20 },
      { x: 150, y: 430, w: 200, h: 20 },
      { x: 450, y: 150, w: 200, h: 20 },
      { x: 450, y: 430, w: 200, h: 20 },
      { x: 390, y: 150, w: 20, h: 300 }, // Central divider
    ]
  }
};
