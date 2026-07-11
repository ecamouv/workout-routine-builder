# Buddy

Buddy is a web app for logging your daily progress in the gym. It's built to make routines easier to follow — create a personalized routine from a built-in exercise library, or add your own exercises and see exactly which muscles you're hitting.

**Live demo:** [buddy-woad-three.vercel.app](https://buddy-woad-three.vercel.app/)

## Features

- **Personalized routines** — build routines from a built-in exercise library, or create your own custom exercises
- **Muscle heat map** — an interactive front/back body visualization showing which muscles a routine or exercise targets
- **Weekly schedule** — assign routines to specific days and view your week on a calendar
- **Progress tracking** — log weight, sets, and reps per exercise to see how you've progressed over time
- **Streak tracking** — keep a running streak of consistent training, and log any missed sessions
- **Fast exercise search** — typo-tolerant search across the exercise library
- **Import/export routines** — share a routine with someone else, or bring one in from elsewhere

## Built With

- [Next.js](https://nextjs.org/) (Pages Router)
- React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Fuse.js](https://www.fusejs.io/) — fuzzy, typo-tolerant search
- [react-body-highlighter](https://github.com/giavinh79/react-body-highlighter) — interactive muscle map
- [react-icons](https://react-icons.github.io/react-icons/) (Box Icons) — navigation icons
- [Vercel](https://vercel.com/) — hosting and deployment

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm

### Installation

```bash
git clone <repository-url>
cd buddy
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data & Privacy

Buddy stores all routines, exercises, and schedules locally in your browser via `localStorage`. Nothing is sent to a server, and there's no account system — data doesn't sync across devices or browsers.

## License

This is a private project and is not currently licensed for reuse or distribution.