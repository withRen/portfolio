import { useId } from 'react';

type Props = { className?: string; title?: string };

/** RT monogram: a T whose inner cut traces an R. Uses currentColor. */
export default function Logo({ className, title = 'Rahim Tamhaev' }: Props) {
  const id = `cut-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="#fff" />
          <path
            d="M39 15 V92 M39 17 H49 A12.5 12.5 0 0 1 49 42 H39 M47 42 L58 92"
            fill="none"
            stroke="#000"
            strokeWidth="5.5"
          />
        </mask>
      </defs>
      <g fill="currentColor" mask={`url(#${id})`}>
        <rect x="8" y="8" width="84" height="28" rx="3" />
        <rect x="32" y="30" width="36" height="62" rx="3" />
      </g>
    </svg>
  );
}
