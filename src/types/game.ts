export type FarmStage = 'empty' | 'watering' | 'sprout' | 'tree' | 'fruit' | 'fallow' | 'overworked';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type CropCategory = 'fruit' | 'animal';

export interface CropDef {
  id: string;
  emoji: string;
  category: CropCategory;
  rarity: Rarity;
  weight: number;
}

export interface FarmCell {
  keyCode: string;
  label: string;
  stage: FarmStage;
  hitCount: number;
  cropId: string | null;
  isGolden: boolean;
  row: number;
  col: number;
  width: number;
  fallowUntil: number | null;
  harvestTimestamps: number[];
  overworkedUntil: number | null;
  hasPest: boolean;
  pestSince: number | null;
  preOverworkedStage: FarmStage | null;
  preOverworkedHitCount: number;
}

export interface DailyEntry {
  date: string;       // 'YYYY-MM-DD'
  keyPresses: number;
  harvests: number;
  pestsRemoved: number;
}

export interface GameState {
  cells: Record<string, FarmCell>;
  totalHarvested: number;
  harvestsByCrop: Record<string, number>;
  goldenHarvests: Record<string, number>;
  totalKeyPresses: Record<string, number>;
  totalPestsRemoved: number;
  dailyStats: DailyEntry[];
  workers: number;
  workerSpeed: number; // speed upgrade level (1-based)
  animals: AnimalInstance[];
}

// ── Animal character types ─────────────────────────────────────────
export interface AnimalDef {
  id: string;
  sprites: { idle: string; walk: string; action: string };
  size: number;
  moveSpeed: number;
  zIndexOffset: number;
  spawnCapTiers: { harvests: number; cap: number }[];
  respawnDelay: [number, number]; // [min, max] seconds
  spawnInterval: [number, number]; // [min, max] seconds
  mouseReaction: {
    type: 'flee';
    triggerRadius: number;
    fleeDistance: number;
    fleeSpeedMultiplier: number;
  };
}

export interface AnimalInstance {
  id: string;
  animalId: string;
  col: number;
  row: number;
  state: 'idle' | 'walking' | 'working' | 'fleeing' | 'dead';
  facingLeft: boolean;
  targetKey: string | null;
  actionType: 'harvest' | 'fertilize' | null;
  moveStartCol: number;
  moveStartRow: number;
  moveEndCol: number;
  moveEndRow: number;
  moveStartTime: number;
  moveDuration: number;
  workStartTime: number;
  diedAt: number | null;
  nextActionTime: number;
  restUntil: number;
  workCount: number;
}

// ── Worker upgrade tiers ────────────────────────────────────────────
export interface WorkerTier {
  harvests: number;   // total harvests required
  species: number;    // unique species discovered
  golden: number;     // golden harvests required
}

export const WORKER_TIERS: WorkerTier[] = [
  { harvests: 0, species: 0, golden: 0 },    // Worker 1: free
  { harvests: 1, species: 1, golden: 1 },    // Worker 2
  { harvests: 2, species: 2, golden: 2 },    // Worker 3
  { harvests: 3, species: 3, golden: 3 },    // Worker 4
  { harvests: 5, species: 5, golden: 5 },    // Worker 5
  { harvests: 6, species: 6, golden: 6 },    // Worker 6
  { harvests: 7, species: 7, golden: 7 },    // Worker 7
  { harvests: 8, species: 8, golden: 8 },    // Worker 8
  { harvests: 8, species: 8, golden: 8 },    // Worker 9
];

export const MAX_WORKERS = WORKER_TIERS.length;

// ── Worker speed upgrade tiers ──────────────────────────────────────
export interface SpeedTier {
  harvests: number;
  pestsRemoved: number;
  intervalMin: number; // ms
  intervalMax: number; // ms
}

export const SPEED_TIERS: SpeedTier[] = [
  { harvests: 0, pestsRemoved: 0, intervalMin: 9000,  intervalMax: 11000 },  // Lv1: 9 -11s
  { harvests: 1, pestsRemoved: 1, intervalMin: 7000,  intervalMax: 9000 },   // Lv2: 7 - 9s
  { harvests: 2, pestsRemoved: 2, intervalMin: 5000,  intervalMax: 7000 },   // Lv3: 5 - 7s
  { harvests: 3, pestsRemoved: 3, intervalMin: 3000,  intervalMax: 5000 },   // Lv4: 3 - 5s
  { harvests: 4, pestsRemoved: 4, intervalMin: 1000,  intervalMax: 3000 },   // Lv5: 1 - 3s
];

export const MAX_SPEED_LEVEL = SPEED_TIERS.length;

export const STAGE_THRESHOLDS: Record<string, number> = {
  empty: 1,
  watering: 2,
  sprout: 3,
  tree: 5,
  fruit: 0,
  fallow: 0,
  overworked: 0,
};

export const NEXT_STAGE: Record<string, FarmStage | null> = {
  empty: 'watering',
  watering: 'sprout',
  sprout: 'tree',
  tree: 'fruit',
  fruit: null,
  fallow: null,
  overworked: null,
};

export const FALLOW_HARVEST_LIMIT = 999999;
export const FALLOW_WINDOW_MS = 1_000;
export const FALLOW_DURATION_MS = 1_000;

export const OVERWORK_PRESS_LIMIT = 999999;
export const OVERWORK_WINDOW_MS = 1_000;
export const OVERWORK_DURATION_MS = 1_000;

export const PEST_INTERVAL_MIN_MS = 40_000;    // 40 seconds
export const PEST_INTERVAL_MAX_MS = 80_000;    // 80 seconds

// Pest spawn speed multiplier per worker speed level (faster workers → more pests)
export const PEST_SPEED_MULTIPLIER = [1.0, 0.85, 0.65, 0.5, 0.3, 0.25, 0.05];
export const PEST_MAX_CONCURRENT = 8;          // max pests on board at once
export const PEST_EXPIRE_MS = 6 * 600_000;     // pests auto-disappear after 6 * 10 minutes

export const GOLDEN_CHANCE = 0.1;

export const DUCK_SPAWN_TIERS: { harvests: number; cap: number }[] = [
  { harvests: 0, cap: 0 },
  { harvests: 1, cap: 1 },
  { harvests: 3, cap: 2 },
  { harvests: 5, cap: 3 },
  { harvests: 7, cap: 4 },
  { harvests: 9, cap: 5 },
];

export const DUCK_SPAWN_INTERVAL: [number, number] = [60_000, 90_000];   // ms
export const DUCK_RESPAWN_DELAY: [number, number]  = [120_000, 180_000]; // ms

export const CAT_SPAWN_TIERS: { harvests: number; cap: number }[] = [
  { harvests: 0, cap: 0 },
  { harvests: 1, cap: 1 },
  { harvests: 2, cap: 2 },
  { harvests: 3, cap: 3 },
  { harvests: 5, cap: 5 },
  { harvests: 6, cap: 6 },
  { harvests: 7, cap: 7 },
  { harvests: 8, cap: 8 },
  { harvests: 9, cap: 9 },
];

export const CAT_SPAWN_INTERVAL: [number, number] = [90_000, 120_000]; // ms
