import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { exercises } from '@/data/exercises';
import BottomNav from '@/components/BottomNav';
import { getWeightComparison } from '@/data/weightComparisons';

type ExerciseType = 'compound' | 'isolation' | 'cardio' | 'stretching';

interface Exercise {
  id: string;
  name: string;
  muscles: string[];
  type: ExerciseType;
}

interface SessionLog {
  timestamp: number;
  routineId: string;
  routineName: string;
  logs: Record<string, { weight: number; unit: 'lb' | 'kg' }>;
}

interface ExerciseDataPoint {
  session: number;
  date: string;
  weight: number;
}

const toLb = (weight: number, unit: 'lb' | 'kg') =>
  unit === 'lb' ? weight : weight * 2.20462;

const formatWeight = (lb: number) =>
  lb >= 1000
    ? `${(lb / 1000).toFixed(1)}k lb`
    : `${Math.round(lb)} lb`;

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const DAY_ACRONYMS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function LineChart({ data, color = '#e2e2e2', chartId = 'default' }: { data: ExerciseDataPoint[]; color?: string; chartId?: string }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-neutral-600 text-xs">No sessions logged yet</p>
      </div>
    );
  }

  if (data.length === 1) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-1">
        <p className="text-white text-sm font-semibold">{Math.round(data[0].weight)} lb</p>
        <p className="text-white text-xs">{data[0].date} · only session so far</p>
      </div>
    );
  }

  const W = 600;
  const H = 160;
  const PAD = { top: 16, right: 16, bottom: 32, left: 48 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const weights = data.map(d => d.weight);
  const rawMin = Math.min(...weights);
  const rawMax = Math.max(...weights);

  // ±5lb padding up and down
  const hasChange = rawMax - rawMin > 0.5;
  const minW = hasChange ? rawMin : rawMin - 5;
  const maxW = hasChange ? rawMax : rawMax + 5;
  const range = maxW - minW;

  const xStep = innerW / (data.length - 1);
  const yOf = (w: number) => PAD.top + innerH - ((w - minW) / range) * innerH;
  const xOf = (i: number) => PAD.left + i * xStep;

  const points = data.map((d, i) => `${xOf(i)},${yOf(d.weight)}`).join(' ');
  const areaPoints = [
    `${xOf(0)},${PAD.top + innerH}`,
    ...data.map((d, i) => `${xOf(i)},${yOf(d.weight)}`),
    `${xOf(data.length - 1)},${PAD.top + innerH}`,
  ].join(' ');

  const yTicks = [minW, (minW + maxW) / 2, maxW].map(v => Math.round(v));
  const xLabels = [0, Math.floor((data.length - 1) / 2), data.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`areaGrad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((_, i) => {
        const y = i === 0 ? PAD.top + innerH : i === 1 ? PAD.top + innerH / 2 : PAD.top;
        return <line key={`${chartId}-gridline-${i}`} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#262626" strokeWidth="1" />;
      })}

      <polygon points={areaPoints} fill={`url(#areaGrad-${chartId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {data.map((d, i) => (
        <circle key={`${chartId}-dot-${i}`} cx={xOf(i)} cy={yOf(d.weight)} r="3" fill={color} />
      ))}

      {yTicks.map((v, i) => {
        const y = i === 0 ? PAD.top + innerH : i === 1 ? PAD.top + innerH / 2 : PAD.top;
        return (
          <text key={`${chartId}-ylabel-${i}`} x={PAD.left - 6} y={y + 4} textAnchor="end" fill="#525252" fontSize="10" fontFamily="sans-serif">
            {v}
          </text>
        );
      })}

      {xLabels.map((idx) => (
        <text key={`${chartId}-xlabel-${idx}`} x={xOf(idx)} y={H - 6} textAnchor="middle" fill="#525252" fontSize="10" fontFamily="sans-serif">
          {data[idx].date}
        </text>
      ))}
    </svg>
  );
}

export default function Stats() {
  const router = useRouter();
  const [history, setHistory] = useState<SessionLog[]>([]);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [activePill, setActivePill] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('workout-routine-builder-history');
    if (raw) {
      try { setHistory(JSON.parse(raw)); } catch { }
    }
    const pins = localStorage.getItem('stats-pinned-exercises');
    if (pins) {
      try { setPinnedIds(JSON.parse(pins)); } catch { }
    }
  }, []);

  const exerciseMap = new Map<string, Exercise>(
    (exercises as Exercise[]).map(e => [e.id, e])
  );

  // Frequency map
  const exerciseFreq: Record<string, number> = {};
  history.forEach(session => {
    Object.keys(session.logs).forEach(exId => {
      exerciseFreq[exId] = (exerciseFreq[exId] || 0) + 1;
    });
  });

  // max 5 total pills
  const topByFreq = Object.entries(exerciseFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)
    .filter(id => !pinnedIds.includes(id));

  const pillIds = [
    ...pinnedIds,
    ...topByFreq,
  ].slice(0, 5);

  useEffect(() => {
    if (pillIds.length > 0 && !activePill) {
      setActivePill(pillIds[0]);
    }
  }, [pillIds.length]);

  // Chart data for active pill
  const chartData: ExerciseDataPoint[] = (activePill
    ? history.filter(s => s.logs[activePill])
    : []
  ).map((s, i) => ({
    session: i + 1,
    date: formatDate(s.timestamp),
    weight: toLb(s.logs[activePill!].weight, s.logs[activePill!].unit),
  }));

  // Search
  const searchExercise = searchQuery.length > 1
    ? (exercises as Exercise[]).find(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  const searchChartData: ExerciseDataPoint[] = searchExercise
    ? history
        .filter(s => s.logs[searchExercise.id])
        .map((s, i) => ({
          session: i + 1,
          date: formatDate(s.timestamp),
          weight: toLb(s.logs[searchExercise.id].weight, s.logs[searchExercise.id].unit),
        }))
    : [];

  // At a glance
  const totalSessions = history.length;

  const totalVolumeLb = history.reduce((acc, s) =>
    acc + Object.values(s.logs).reduce((sum, l) => sum + toLb(l.weight, l.unit), 0), 0);

  const mostTrainedId = Object.entries(exerciseFreq).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostTrained = mostTrainedId ? exerciseMap.get(mostTrainedId)?.name ?? '—' : '—';

  // Streak
  const sessionDays = [...new Set(history.map(s => new Date(s.timestamp).toDateString()))]
    .map(d => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const day of sessionDays) {
    if (day === cursor.getTime() || day === cursor.getTime() - 86400000) {
      streak++;
      cursor = new Date(day);
    } else break;
  }

  // 5-day strip: today is index 2 (middle)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fiveDays = [-2, -1, 0, 1, 2].map(offset => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d;
  });

  const loggedDayStrings = new Set(history.map(s => new Date(s.timestamp).toDateString()));

  // Pin/unpin
  const handlePin = (id: string) => {
    let next: string[];
    if (pinnedIds.includes(id)) {
      next = pinnedIds.filter(p => p !== id);
    } else {
      if (pinnedIds.length >= 5) return; // max 5 pins
      next = [...pinnedIds, id];
    }
    setPinnedIds(next);
    localStorage.setItem('stats-pinned-exercises', JSON.stringify(next));
  };

  // Weight milestone
  const comparison = getWeightComparison(totalVolumeLb);

  const statCards = [
    { label: 'Sessions', value: totalSessions > 0 ? totalSessions.toString() : '—' },
    { label: 'Total Volume', value: totalVolumeLb > 0 ? formatWeight(totalVolumeLb) : '—' },
    { label: 'Top Exercise', value: mostTrained },
    { label: 'Streak', value: streak > 0 ? `${streak}d` : '—' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <main className="flex-1 px-6 pt-16 pb-32 max-w-md mx-auto w-full flex flex-col gap-8">

        {/* Header */}
        <h1 className="text-2xl font-semibold">Progress</h1>

        {/* Graph */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest px-1">Top Exercises</span>

          {/* Pills */}
          {pillIds.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {pillIds.map((id) => {
                const ex = exerciseMap.get(id);
                if (!ex) return null;
                const isActive = activePill === id;
                const isPinned = pinnedIds.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => setActivePill(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:cursor-pointer border ${
                      isActive
                        ? 'bg-light text-black border-light'
                        : isPinned
                          ? 'bg-light/10 text-neutral-300 border-light/20 hover:text-white'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    {isPinned && <span className="text-[10px]">📌</span>}
                    {ex.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-7 w-24 rounded-xl bg-neutral-900 border border-neutral-800" />
              ))}
            </div>
          )}

          {/* Pin button */}
          {activePill && (
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] text-neutral-600">
                {pinnedIds.includes(activePill)
                  ? 'Pinned'
                  : pinnedIds.length >= 5
                    ? 'Max 5 pins reached'
                    : 'Pin to keep this exercise visible'}
              </span>
              <button
                onClick={() => activePill && handlePin(activePill)}
                disabled={!pinnedIds.includes(activePill) && pinnedIds.length >= 5}
                className="text-[11px] text-neutral-500 hover:text-light transition-colors hover:cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {pinnedIds.includes(activePill) ? 'Unpin' : 'Pin'}
              </button>
            </div>
          )}

          {/* Chart */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-4 pt-4 pb-2 h-52">
            {activePill && exerciseMap.get(activePill) && (
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-white">{exerciseMap.get(activePill)?.name}</span>
                <span className="text-[10px] text-white">{chartData.length} sessions</span>
              </div>
            )}
            {!activePill && (
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-neutral-600">No exercise selected</span>
              </div>
            )}
            <div className="h-40">
              <LineChart data={activePill ? chartData : []} chartId="top" />
            </div>
          </div>
        </div>

        {/* At a glance */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map(({ label, value }) => (
            <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4 flex flex-col gap-1">
              <span className="text-xs text-neutral-500 font-medium uppercase tracking-widest">{label}</span>
              <span className="text-md font-bold text-white truncate">{value}</span>
            </div>
          ))}
        </div>

        {/* 5-day strip */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest px-1">This Week</span>
          <div className="flex gap-2 justify-between">
            {fiveDays.map((day, i) => {
              const isToday = i === 2;
              const isFuture = i > 2;
              const logged = loggedDayStrings.has(day.toDateString());
              return (
                <div
                  key={i}
                  className={`flex-1 flex flex-col items-center justify-between py-3 px-1 rounded-2xl border gap-2
                    ${isToday
                      ? 'bg-neutral-800 border-neutral-700'
                      : 'bg-neutral-900 border-neutral-800'}`}
                >
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase">
                    {DAY_ACRONYMS[day.getDay()]}
                  </span>
                  <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-neutral-400'}`}>
                    {day.getDate()}
                  </span>
                  {/* Circle */}
                  {isFuture ? (
                    <div className="w-2 h-2 rounded-full border border-neutral-700" />
                  ) : logged ? (
                    <div className="w-2 h-2 rounded-full bg-light" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Search exercise */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest px-1">Search Exercise</span>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">⌕</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any exercise..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-9 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-light transition-colors"
            />
          </div>

          {searchExercise && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-4 pt-4 pb-2">
              <div className="flex items-center justify-between mb-2 px-1">
                <div>
                  <span className="text-xs font-semibold text-white">{searchExercise.name}</span>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className="inline-block bg-neutral-800 text-neutral-400 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                      {searchExercise.type}
                    </span>
                    {searchExercise.muscles.slice(0, 2).map(m => (
                      <span key={m} className="inline-block bg-neutral-800 text-neutral-400 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                        {m.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-neutral-500">{searchChartData.length} sessions</span>
              </div>
              <div className="h-40">
                <LineChart data={searchChartData} chartId="search" />
              </div>
            </div>
          )}

          {searchQuery.length > 1 && !searchExercise && (
            <p className="text-neutral-600 text-sm text-center">No exercise found matching "{searchQuery}"</p>
          )}
        </div>

        {/* Weight milestone */}
        <p className="text-xs text-neutral-600 text-center px-4 pb-2 leading-relaxed">
          {totalVolumeLb > 0
            ? comparison.descriptionLb
            : 'Start logging workouts to see your lifetime volume milestone here.'}
        </p>

      </main>

      <BottomNav active="stats" />
    </div>
  );
}