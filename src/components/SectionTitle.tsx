import Reveal from './Reveal';

type Props = { id: string; title: string; lead?: string; className?: string };

export default function SectionTitle({ id, title, lead, className }: Props) {
  return (
    <Reveal className={`sd-rise ${className ?? ''}`}>
      <h2 id={id} className="text-4xl font-semibold leading-none tracking-tighter text-zinc-50 md:text-6xl">
        {title}
      </h2>
      {lead && <p className="mt-5 max-w-[52ch] leading-relaxed text-zinc-400">{lead}</p>}
    </Reveal>
  );
}
