import { Routine } from '@/types';

export const mockRoutines: Routine[] = [
  {
    "id": "routine-1",
    "name": "Push Day",
    "exercises": [
      {
        "instanceId": "bench-press-1781930101000",
        "exercise": {
          "id": "bench-press",
          "name": "Barbell Bench Press",
          "muscles": ["chest", "triceps", "front-deltoids"],
          "type": "compound",
          "intensity": "intermediate"
        }
      },
      {
        "instanceId": "overhead-press-1781930102000",
        "exercise": {
          "id": "overhead-press",
          "name": "Overhead Barbell Press",
          "muscles": ["front-deltoids", "triceps"],
          "type": "compound",
          "intensity": "intermediate"
        }
      },
      {
        "instanceId": "chest-fly-1781930103000",
        "exercise": {
          "id": "chest-fly",
          "name": "Cable Chest Fly",
          "muscles": ["chest"],
          "type": "isolation",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "lateral-raise-1781930104000",
        "exercise": {
          "id": "lateral-raise",
          "name": "Dumbbell Lateral Raise",
          "muscles": ["front-deltoids"],
          "type": "isolation",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "tricep-pushdown-1781930105000",
        "exercise": {
          "id": "tricep-pushdown",
          "name": "Cable Tricep Pushdown",
          "muscles": ["triceps"],
          "type": "isolation",
          "intensity": "beginner"
        }
      }
    ]
  },
  {
    "id": "routine-2",
    "name": "Pull Day",
    "exercises": [
      {
        "instanceId": "pull-up-1781930201000",
        "exercise": {
          "id": "pull-up",
          "name": "Pull-Up",
          "muscles": ["upper-back", "trapezius", "biceps"],
          "type": "compound",
          "intensity": "intermediate"
        }
      },
      {
        "instanceId": "barbell-row-1781930202000",
        "exercise": {
          "id": "barbell-row",
          "name": "Barbell Row",
          "muscles": ["upper-back", "trapezius", "biceps", "lower-back"],
          "type": "compound",
          "intensity": "intermediate"
        }
      },
      {
        "instanceId": "lat-pulldown-1781930203000",
        "exercise": {
          "id": "lat-pulldown",
          "name": "Lat Pulldown",
          "muscles": ["upper-back", "trapezius", "back-deltoids", "biceps", "forearm", "triceps"],
          "type": "compound",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "barbell-curl-1781930204000",
        "exercise": {
          "id": "barbell-curl",
          "name": "Barbell Bicep Curl",
          "muscles": ["biceps"],
          "type": "isolation",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "face-pull-1781930205000",
        "exercise": {
          "id": "face-pull",
          "name": "Cable Face Pull",
          "muscles": ["trapezius", "back-deltoids"],
          "type": "isolation",
          "intensity": "beginner"
        }
      }
    ]
  },
  {
    "id": "routine-3",
    "name": "Leg Day",
    "exercises": [
      {
        "instanceId": "back-squat-1781930301000",
        "exercise": {
          "id": "back-squat",
          "name": "Barbell Back Squat",
          "muscles": ["quadriceps", "gluteal", "hamstring"],
          "type": "compound",
          "intensity": "intermediate"
        }
      },
      {
        "instanceId": "leg-extension-1781930302000",
        "exercise": {
          "id": "leg-extension",
          "name": "Leg Extension Machine",
          "muscles": ["quadriceps"],
          "type": "isolation",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "lying-leg-curl-1781930303000",
        "exercise": {
          "id": "lying-leg-curl",
          "name": "Lying Leg Curl Machine",
          "muscles": ["hamstring"],
          "type": "isolation",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "standing-calf-raise-1781930304000",
        "exercise": {
          "id": "standing-calf-raise",
          "name": "Standing Calf Raise",
          "muscles": ["calves"],
          "type": "isolation",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "romanian-deadlift-1781930305000",
        "exercise": {
          "id": "romanian-deadlift",
          "name": "Romanian Deadlift (RDL)",
          "muscles": ["hamstring", "gluteal", "lower-back"],
          "type": "compound",
          "intensity": "intermediate"
        }
      }
    ]
  },
  {
    "id": "routine-4",
    "name": "Shoulders & Arms",
    "exercises": [
      {
        "instanceId": "shoulder-press-1781930401000",
        "exercise": {
          "id": "shoulder-press",
          "name": "Shoulders Press",
          "muscles": ["front-deltoids", "triceps", "trapezius", "chest"],
          "type": "compound",
          "intensity": "intermediate"
        }
      },
      {
        "instanceId": "cable-lateral-raise-1781930402000",
        "exercise": {
          "id": "cable-lateral-raise",
          "name": "Cable Lateral Raise",
          "muscles": ["front-deltoids", "back-deltoids", "trapezius"],
          "type": "isolation",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "reverse-fly-1781930403000",
        "exercise": {
          "id": "reverse-fly",
          "name": "Rear Delt Reverse Fly",
          "muscles": ["back-deltoids", "trapezius"],
          "type": "isolation",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "cable-tricep-extension-1781930404000",
        "exercise": {
          "id": "cable-tricep-extension",
          "name": "Cable Tricep Extension",
          "muscles": ["triceps"],
          "type": "isolation",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "reverse-curl-1781930405000",
        "exercise": {
          "id": "reverse-curl",
          "name": "Barbell Reverse Curl",
          "muscles": ["forearm", "biceps"],
          "type": "isolation",
          "intensity": "beginner"
        }
      },
      {
        "instanceId": "tricep-pulldown-1781930406000",
        "exercise": {
          "id": "tricep-pulldown",
          "name": "Tricep Pulldown",
          "muscles": ["triceps"],
          "type": "isolation",
          "intensity": "beginner"
        }
      }
    ]
  }
];