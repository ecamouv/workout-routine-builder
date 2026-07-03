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
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
             
              className={`text-xs font-medium px-4 py-4 transition-all hover:cursor-pointer ${
                isActive
                  ? 'text-light bg-light/10 rounded-b-md -mt-px [clip-path:polygon(0_0,100%_0,85%_100%,15%_100%)]'
                  : 'text-zinc-400 hover:text-zinc-200 rounded-xl'
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
