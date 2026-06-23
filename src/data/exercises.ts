import { Exercise } from '@/types';

export const exercises: Exercise[] = [
    {
        id: 'bench-press',
        name: 'Barbell Bench Press',
        muscles: ['chest', 'triceps', 'front-deltoids'],
        type: 'compound',
        intensity: 'intermediate',
      },
      {
        id: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press',
        muscles: ['chest', 'front-deltoids', 'triceps'],
        type: 'compound',
        intensity: 'intermediate',
      },
      {
        id: 'chest-fly',
        name: 'Cable Chest Fly',
        muscles: ['chest'],
        type: 'isolation',
        intensity: 'beginner',
      },
    
      // ── BACK (Upper-Back & Trapezius) ──
      {
        id: 'pull-up',
        name: 'Pull-Up',
        muscles: ['upper-back', 'trapezius', 'biceps'],
        type: 'compound',
        intensity: 'intermediate',
      },
      {
        id: 'barbell-row',
        name: 'Barbell Row',
        muscles: ['upper-back', 'trapezius', 'biceps', 'lower-back'],
        type: 'compound',
        intensity: 'intermediate',
      },
      {
        id: 'face-pull',
        name: 'Cable Face Pull',
        muscles: ['trapezius', 'back-deltoids'],
        type: 'isolation',
        intensity: 'beginner',
      },
    
      // ── LOWER BACK ──
      {
        id: 'deadlift',
        name: 'Conventional Deadlift',
        muscles: ['lower-back', 'gluteal', 'hamstring', 'trapezius'],
        type: 'compound',
        intensity: 'advanced',
      },
      {
        id: 'hyperextension',
        name: 'Back Hyperextension',
        muscles: ['lower-back', 'gluteal', 'hamstring'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'good-morning',
        name: 'Barbell Good Morning',
        muscles: ['lower-back', 'hamstring', 'gluteal'],
        type: 'compound',
        intensity: 'advanced',
      },
    
      // ── SHOULDERS (Front & Back Deltoids) ──
      {
        id: 'overhead-press',
        name: 'Overhead Barbell Press',
        muscles: ['front-deltoids', 'triceps'],
        type: 'compound',
        intensity: 'intermediate',
      },
      {
        id: 'lateral-raise',
        name: 'Dumbbell Lateral Raise',
        muscles: ['front-deltoids'], // Hits lateral head natively
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'reverse-fly',
        name: 'Rear Delt Reverse Fly',
        muscles: ['back-deltoids', 'trapezius'],
        type: 'isolation',
        intensity: 'beginner',
      },
    
      // ── BICEPS & FOREARMS ──
      {
        id: 'barbell-curl',
        name: 'Barbell Bicep Curl',
        muscles: ['biceps'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'hammer-curl',
        name: 'Dumbbell Hammer Curl',
        muscles: ['biceps', 'forearm'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'reverse-curl',
        name: 'Barbell Reverse Curl',
        muscles: ['forearm', 'biceps'],
        type: 'isolation',
        intensity: 'beginner',
      },
    
      // ── TRICEPS ──
      {
        id: 'tricep-pushdown',
        name: 'Cable Tricep Pushdown',
        muscles: ['triceps'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'overhead-extension',
        name: 'Dumbbell Overhead Tricep Extension',
        muscles: ['triceps'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'dip',
        name: 'Parallel Bar Dip',
        muscles: ['triceps', 'chest', 'front-deltoids'],
        type: 'compound',
        intensity: 'intermediate',
      },
    
      // ── ABS & OBLIQUES (Core) ──
      {
        id: 'dragon-flag',
        name: 'Dragon Flag',
        muscles: ['abs', 'obliques', 'lower-back'],
        type: 'compound',
        intensity: 'advanced',
      },
      {
        id: 'hanging-leg-raise',
        name: 'Hanging Leg Raise',
        muscles: ['abs'],
        type: 'isolation',
        intensity: 'intermediate',
      },
      {
        id: 'russian-twist',
        name: 'Weighted Russian Twist',
        muscles: ['obliques', 'abs'],
        type: 'isolation',
        intensity: 'beginner',
      },
    
      // ── QUADRICEPS ──
      {
        id: 'back-squat',
        name: 'Barbell Back Squat',
        muscles: ['quadriceps', 'gluteal', 'hamstring'],
        type: 'compound',
        intensity: 'intermediate',
      },
      {
        id: 'leg-extension',
        name: 'Leg Extension Machine',
        muscles: ['quadriceps'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'bulgarian-split-squat',
        name: 'Dumbbell Bulgarian Split Squat',
        muscles: ['quadriceps', 'gluteal'],
        type: 'compound',
        intensity: 'intermediate',
      },
    
      // ── HAMSTRINGS & GLUTES ──
      {
        id: 'romanian-deadlift',
        name: 'Romanian Deadlift (RDL)',
        muscles: ['hamstring', 'gluteal', 'lower-back'],
        type: 'compound',
        intensity: 'intermediate',
      },
      {
        id: 'lying-leg-curl',
        name: 'Lying Leg Curl Machine',
        muscles: ['hamstring'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'hip-thrust',
        name: 'Barbell Hip Thrust',
        muscles: ['gluteal', 'hamstring'],
        type: 'compound',
        intensity: 'intermediate',
      },
    
      // ── CALVES ──
      {
        id: 'standing-calf-raise',
        name: 'Standing Calf Raise',
        muscles: ['calves'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'seated-calf-raise',
        name: 'Seated Calf Raise',
        muscles: ['calves'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'donkey-calf-raise',
        name: 'Donkey Calf Raise',
        muscles: ['calves'],
        type: 'isolation',
        intensity: 'intermediate',
      },
      {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        muscles: ['upper-back', 'trapezius', 'back-deltoids', 'biceps', 'forearm', 'triceps'],
        type: 'compound',
        intensity: 'beginner',
      },
      {
        id: 'tricep-pulldown',
        name: 'Tricep Pulldown',
        muscles: ['triceps'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'seated-leg-press',
        name: 'Seated Leg Press',
        muscles: ['quadriceps', 'hamstring', 'gluteal', 'calves', 'adductor'],
        type: 'compound',
        intensity: 'beginner',
      },
      {
        id: 'db-lunges',
        name: 'DB Lunges',
        muscles: ['quadriceps', 'gluteal', 'hamstring', 'calves', 'abs'],
        type: 'compound',
        intensity: 'intermediate',
      },
      {
        id: 'cable-lateral-raise',
        name: 'Cable Lateral Raise',
        muscles: ['front-deltoids', 'back-deltoids', 'trapezius'], 
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'cable-tricep-extension',
        name: 'Cable Tricep Extension',
        muscles: ['triceps'],
        type: 'isolation',
        intensity: 'beginner',
      },
      {
        id: 'shoulder-press',
        name: 'Shoulder Press',
        muscles: ['front-deltoids', 'triceps', 'trapezius', 'chest'],
        type: 'compound',
        intensity: 'intermediate',
      },
      {
        id: 'chest-press',
        name: 'Chest Press',
        muscles: ['chest', 'front-deltoids', 'triceps'],
        type: 'compound',
        intensity: 'beginner',
      }
];