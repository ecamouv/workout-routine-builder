import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Routine } from '@/types';
import {mockRoutines} from '@/data/standardRoutines'
import BottomNav from '@/components/BottomNav';
import RoutineTab from '@/components/RoutineTab';

export default function RoutinesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('workout-routine-builder-routines');
    let loaded: Routine[] = [];
    
    if (stored) {
      try {
         loaded = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing routines from localStorage', e);
      }
    } 

    const formattedMocks = mockRoutines.map((r, i) => ({
      ...r,
      updatedAt: r.updatedAt || (Date.now() - i * 1000), 
    }));

    const uniqueMocks = formattedMocks.filter(
      (mock) => !loaded.some((storedRoutine) => storedRoutine.id === mock.id)
    );

    setRoutines([...loaded, ...uniqueMocks]);
  }, []);

  // Sort chronologically by layout update timestamp
  const sortedRoutines = [...routines].sort((a, b) => {
    const timeA = a.updatedAt || 0;
    const timeB = b.updatedAt || 0;
    return timeB - timeA;
  });

  const filteredRoutines = sortedRoutines.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <main className="flex-1 px-6 pt-16 pb-32 max-w-md mx-auto w-full flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">All Routines</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all routines..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-9 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-light transition-colors"
          />
        </div>

        {/* Routines Grid/Stack Container */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest px-1">
            Available Programs ({filteredRoutines.length})
          </p>
          <div className="rounded-2xl overflow-hidden border border-neutral-800 divide-y divide-neutral-800">
            {!isMounted || filteredRoutines.length === 0 ? (
              <p className="text-sm text-neutral-600 px-5 py-5">
                {!isMounted ? 'Loading routines...' : 'No routines found.'}
              </p>
            ) : (
              (
                filteredRoutines.map((routine) => (
                  <RoutineTab
                    key={routine.id}
                    routine={routine}
                    onClick={() => router.push(`/routine/${routine.id}`)} />
                )
                )
              
              )  
            )
                    }             
          </div>
        </div>

        

      </main>

      {/* Adjust active state marker depending on your bottom nav setup */}
      <BottomNav active="routines" />
    </div>
  );
}