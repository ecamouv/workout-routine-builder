import { useRouter } from 'next/router';
import { BiSolidHomeAlt2, BiDumbbell, BiStats, BiCalendar } from 'react-icons/bi';

interface Props {
  active: 'home' | 'routines' | 'stats' | 'calendar';
}

const tabs = [
  { id: 'home', label: 'Home', href: '/', Icon: BiSolidHomeAlt2 },
  { id: 'routines', label: 'Routines', href: '/routines', Icon: BiDumbbell },
  { id: 'stats', label: 'Stats', href: '/stats', Icon: BiStats },
  { id: 'calendar', label: 'Calendar', href: '/calendar', Icon: BiCalendar },
] as const;

export default function BottomNav({ active }: Props) {
  const router = useRouter();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/80 backdrop-blur-lg border-t border-neutral-800">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-2">
        {tabs.map(({ id, label, href, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => router.push(href)}
              aria-label={label}
              className="relative flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-2xl transition-all hover:cursor-pointer group"
            >
              {isActive && (
                <span className="absolute inset-0 bg-light/10 rounded-2xl" />
              )}
              <Icon
                className={`relative text-2xl transition-all duration-200 ${isActive
                  ? 'text-light scale-110'
                  : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
              />


            </button>
          );
        })}
      </div>
    </nav>
  );
}