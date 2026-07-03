import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Routine } from '@/types';
import { mockRoutines } from '@/data/standardRoutines';
import { exportRoutine } from '@/utils/routineSharing';

import RoutineTab from '@/components/RoutineTab';
import BottomNav from '@/components/BottomNav';
import ImportRoutineModal from '@/components/ImportRoutineModal';


export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (router.query.startRoutineId) {
      router.push(`/workout/${router.query.startRoutineId}`);
    }
  }, [router.query.startRoutineId]);

  // Load standard routines
  useEffect(() => {
    setIsMounted(true);

    const storedName = localStorage.getItem('user-name');
    if (storedName) {
      setUserName(storedName);
    } else {
      const name = window.prompt("What is your name?")

      if (name !== null && name.trim() !== '') {
        localStorage.setItem('user-name', name)
        setUserName(name)
      }



    }

    const stored = localStorage.getItem('workout-routine-builder-routines');
    let loaded: Routine[] = [];

    if (!stored || stored === '[]' || stored === '') {
      const formattedMocks = mockRoutines.map((r, i) => ({
        ...r,
        updatedAt: r.updatedAt || (Date.now() - i * 1000),
      }));

      localStorage.setItem('workout-routine-builder-routines', JSON.stringify(formattedMocks))
      loaded = formattedMocks;
    }
    else if (stored) {
      try {
        loaded = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing routines from localStorage', e);
      }
    }

    setRoutines(loaded);
  }, [userName]);

  const sortedRoutines = [...routines].sort((a, b) => {
    const timeA = a.updatedAt || 0;
    const timeB = b.updatedAt || 0;
    return timeB - timeA;
  });

  const recentRoutines = sortedRoutines.slice(0, 5);

  const filtered = recentRoutines.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const reloadRoutines = () => {
    const stored = localStorage.getItem('workout-routine-builder-routines');
    if (stored) {
      try { setRoutines(JSON.parse(stored)); } catch { }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <main className="flex-1 px-6 pt-16 pb-32 max-w-md mx-auto w-full flex flex-col gap-8 ">

        {/* Header */}
        <div className="">
          <h1 className="font-semibold text-2xl"> {userName} Routines</h1>
          <button
            onClick={() => setShowImportModal(true)}
            className="m-2 text-xs font-semibold text-neutral-400 hover:text-white border border-neutral-700 px-3 py-1.5 rounded-xl transition-colors hover:cursor-pointer"
          >
            Import Routine
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routines..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-9 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-light transition-colors"
          />
        </div>

        {/* Routine list */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest px-1">
            Recent Routines
          </p>
          <div className="rounded-2xl overflow-hidden border border-neutral-800 divide-y divide-neutral-800">
            {!isMounted || filtered.length === 0 ? (
              <p className="text-sm text-neutral-600 px-5 py-5">
                {!isMounted ? 'Loading routines...' : 'No routines found.'}
              </p>
            ) : (
              filtered.map((routine) => (
                <div key={routine.id} className="relative group">
                  <RoutineTab
                    key={routine.id}
                    routine={routine}
                    onClick={() => router.push(`/routine/${routine.id}`)} />
                  <button
                    onClick={(e) => { e.stopPropagation(); exportRoutine(routine); }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/20
                border border-neutral-700 hover:border-neutral-500 px-2 py-1 rounded-lg 
                  transition-colors hover:cursor-pointer "
                  >
                    Export
                  </button>
                </div>
              )
              )
            )
            }
          </div>
        </div>

        {/* New routine */}
        <button
          onClick={() => router.push('/builder')}
          className="w-full bg-light text-black hover:opacity-90 active:scale-95 transition-all text-sm font-semibold rounded-2xl py-4 tracking-wide hover:cursor-pointer"
        >
          + New Routine
        </button>

      </main>

      {showImportModal && (
        <ImportRoutineModal
          onClose={() => setShowImportModal(false)}
          onImported={() => {
            reloadRoutines();
            setShowImportModal(false);
          }}
        />
      )}

      <BottomNav active="home" />


    </div>
  );
}