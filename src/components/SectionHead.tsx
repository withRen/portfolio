import Reveal from './Reveal';

type Props = {
  index: string;
  label: string;
  title: string;
  titleId: string;
  lead?: string;
  titleClass?: string;
  className?: string;
};

export default function SectionHead({ index, label, title, titleId, lead, titleClass, className }: Props) {
  return (
    <Reveal as="header" className={className}>
      <span className="label mb-6 block text-zinc-500">
        {index} — {label}
      </span>
      <h2
        id={titleId}
        className={`font-semibold leading-[0.98] tracking-tighter ${titleClass ?? 'text-4xl md:text-6xl'}`}
      >
        {title}
      </h2>
      {lead && <p className="mt-6 max-w-[34ch] leading-relaxed text-zinc-400">{lead}</p>}
    </Reveal>
  );
}
