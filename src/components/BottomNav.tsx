import { useRouter } from 'next/router';

interface Props {
  active: 'home' | 'routines' | 'stats' | 'calendar';
}

const tabs = [
  { id: 'home',     label: 'Home',     href: '/' },
  { id: 'routines', label: 'Routines', href: '/routines' },
  { id: 'stats',    label: 'Stats',    href: '/stats' },
  { id: 'calendar',   label: 'Calendar',   href: '/calendar' },
] as const;

export default function BottomNav({ active }: Props) {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800">
      <div className="max-w-md mx-auto flex items-center justify-around px-4 py-3">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-xl transition-colors hover:cursor-pointer ${
                isActive
                  ? 'text-light bg-light/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}