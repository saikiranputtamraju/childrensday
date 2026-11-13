import { EyeOff, HardDrive, LockOpen, ShieldCheck } from 'lucide-react';

export default function PrivacySection() {
  const items = [
    {
      icon: LockOpen,
      title: 'No Registration or Login',
      description:
        'Start creating right away—no accounts, passwords, or email sign-ups required.',
      tint: '#FEF3C7',
      color: '#D97706',
    },
    {
      icon: HardDrive,
      title: 'Processed Locally in Browser',
      description:
        'Cropping, zooming, camera snapshots, and HD frame compositing run locally on your device.',
      tint: '#E0F2FE',
      color: '#0284C7',
    },
    {
      icon: EyeOff,
      title: 'Never Publicly Exposed',
      description:
        'No public photo walls or feeds. Only you can view, save, or share your framed keepsakes.',
      tint: '#FCE7F3',
      color: '#DB2777',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Server Photo Storage',
      description:
        'Personal photos are never uploaded to external databases. Closing the tab clears everything.',
      tint: '#F3E8FF',
      color: '#7C3AED',
    },
  ];

  return (
    <section id="privacy" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-7 text-center">
        <p className="text-sm font-semibold text-[#0284C7]">Family-First Privacy</p>
        <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-[#1E1B4B] sm:text-4xl">
          Your Photos Stay With You
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-3xl border border-white bg-white/85 p-6 shadow-md shadow-[#BAE6FD]/15 backdrop-blur-sm"
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: item.tint, color: item.color }}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#1E1B4B]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
