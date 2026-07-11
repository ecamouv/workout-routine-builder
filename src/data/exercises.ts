import { Exercise } from '@/types';

export const exercises: Exercise[] = [
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    muscles: ['chest', 'triceps', 'front-deltoids'],
    type: 'compound',
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    muscles: ['chest', 'front-deltoids', 'triceps'],
    type: 'compound',
  },
  {
    id: 'chest-fly',
    name: 'Cable Chest Fly',
    muscles: ['chest'],
    type: 'isolation',
  },

  // ── BACK (Upper-Back & Trapezius) ──
  {
    id: 'pull-up',
    name: 'Pull-Up',
    muscles: ['upper-back', 'trapezius', 'biceps'],
    type: 'compound',
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    muscles: ['upper-back', 'trapezius', 'biceps', 'lower-back'],
    type: 'compound',
  },
  {
    id: 'face-pull',
    name: 'Cable Face Pull',
    muscles: ['trapezius', 'back-deltoids'],
    type: 'isolation',
  },

  // ── LOWER BACK ──
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    muscles: ['lower-back', 'gluteal', 'hamstring', 'trapezius'],
    type: 'compound',
  },
  {
    id: 'hyperextension',
    name: 'Back Hyperextension',
    muscles: ['lower-back', 'gluteal', 'hamstring'],
    type: 'isolation',
  },
  {
    id: 'good-morning',
    name: 'Barbell Good Morning',
    muscles: ['lower-back', 'hamstring', 'gluteal'],
    type: 'compound',
  },

  // ── SHOULDERS (Front & Back Deltoids) ──
  {
    id: 'overhead-press',
    name: 'Overhead Barbell Press',
    muscles: ['front-deltoids', 'triceps'],
    type: 'compound',
  },
  {
    id: 'lateral-raise',
    name: 'Dumbbell Lateral Raise',
    muscles: ['front-deltoids'], // Hits lateral head natively
    type: 'isolation',
  },
  {
    id: 'reverse-fly',
    name: 'Rear Delt Reverse Fly',
    muscles: ['back-deltoids', 'trapezius'],
    type: 'isolation',
  },

  // ── BICEPS & FOREARMS ──
  {
    id: 'barbell-curl',
    name: 'Barbell Bicep Curl',
    muscles: ['biceps'],
    type: 'isolation',
  },
  {
    id: 'hammer-curl',
    name: 'Dumbbell Hammer Curl',
    muscles: ['biceps', 'forearm'],
    type: 'isolation',
  },
  {
    id: 'reverse-curl',
    name: 'Barbell Reverse Curl',
    muscles: ['forearm', 'biceps'],
    type: 'isolation',
  },

  // ── TRICEPS ──
  {
    id: 'tricep-pushdown',
    name: 'Cable Tricep Pushdown',
    muscles: ['triceps'],
    type: 'isolation',
  },
  {
    id: 'overhead-extension',
    name: 'Dumbbell Overhead Tricep Extension',
    muscles: ['triceps'],
    type: 'isolation',
  },
  {
    id: 'dip',
    name: 'Parallel Bar Dip',
    muscles: ['triceps', 'chest', 'front-deltoids'],
    type: 'compound',
  },

  // ── ABS & OBLIQUES (Core) ──
  {
    id: 'dragon-flag',
    name: 'Dragon Flag',
    muscles: ['abs', 'obliques', 'lower-back'],
    type: 'compound',
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    muscles: ['abs'],
    type: 'isolation',
  },
  {
    id: 'russian-twist',
    name: 'Weighted Russian Twist',
    muscles: ['obliques', 'abs'],
    type: 'isolation',
  },

  // ── QUADRICEPS ──
  {
    id: 'back-squat',
    name: 'Barbell Back Squat',
    muscles: ['quadriceps', 'gluteal', 'hamstring'],
    type: 'compound',
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension Machine',
    muscles: ['quadriceps'],
    type: 'isolation',
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Dumbbell Bulgarian Split Squat',
    muscles: ['quadriceps', 'gluteal'],
    type: 'compound',
  },

  // ── HAMSTRINGS & GLUTES ──
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    muscles: ['hamstring', 'gluteal', 'lower-back'],
    type: 'compound',
  },
  {
    id: 'lying-leg-curl',
    name: 'Lying Leg Curl Machine',
    muscles: ['hamstring'],
    type: 'isolation',
  },
  {
    id: 'hip-thrust',
    name: 'Barbell Hip Thrust',
    muscles: ['gluteal', 'hamstring'],
    type: 'compound',
  },

  // ── CALVES ──
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    muscles: ['calves'],
    type: 'isolation',
  },
  {
    id: 'seated-calf-raise',
    name: 'Seated Calf Raise',
    muscles: ['calves'],
    type: 'isolation',
  },
  {
    id: 'donkey-calf-raise',
    name: 'Donkey Calf Raise',
    muscles: ['calves'],
    type: 'isolation',
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscles: ['upper-back', 'trapezius', 'back-deltoids', 'biceps', 'forearm', 'triceps'],
    type: 'compound',
  },
  {
    id: 'tricep-pulldown',
    name: 'Tricep Pulldown',
    muscles: ['triceps'],
    type: 'isolation',
  },
  {
    id: 'seated-leg-press',
    name: 'Seated Leg Press',
    muscles: ['quadriceps', 'hamstring', 'gluteal', 'calves', 'adductor'],
    type: 'compound',
  },
  {
    id: 'db-lunges',
    name: 'DB Lunges',
    muscles: ['quadriceps', 'gluteal', 'hamstring', 'calves', 'abs'],
    type: 'compound',
  },
  {
    id: 'cable-lateral-raise',
    name: 'Cable Lateral Raise',
    muscles: ['front-deltoids', 'back-deltoids', 'trapezius'],
    type: 'isolation',
  },
  {
    id: 'cable-tricep-extension',
    name: 'Cable Tricep Extension',
    muscles: ['triceps'],
    type: 'isolation',
  },
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    muscles: ['front-deltoids', 'triceps', 'trapezius', 'chest'],
    type: 'compound',
  },
  {
    id: 'chest-press',
    name: 'Chest Press',
    muscles: ['chest', 'front-deltoids', 'triceps'],
    type: 'compound',
  }
];