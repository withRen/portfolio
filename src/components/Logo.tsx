import { MARK_D, MARK_VIEWBOX } from '@/lib/logo';

type Props = { className?: string; title?: string };

/** Monogramme RT de l'identité de marque. Prend la couleur du texte (currentColor). */
export default function Logo({ className, title = 'Rahim Tamhaev' }: Props) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      <path fill="currentColor" d={MARK_D} />
    </svg>
  );
}
