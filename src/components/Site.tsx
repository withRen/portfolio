'use client';

import { useEffect, useState } from 'react';
import InfoPanel, { type PanelId } from './InfoPanel';
import Landing from './Landing';
import Portfolio, { type Filter } from './Portfolio';
import SideDial, { type DialId } from './SideDial';

export default function Site() {
  const [panel, setPanel] = useState<PanelId>(null);
  const [filter, setFilter] = useState<Filter>('photo');
  const [section, setSection] = useState<'intro' | 'catalogue'>('intro');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const targets = ['top', 'catalogue']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSection(e.target.id === 'top' ? 'intro' : 'catalogue');
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    targets.forEach((t) => io.observe(t));

    const cat = document.getElementById('catalogue');
    const reveal = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true);
          reveal.disconnect();
        }
      },
      { rootMargin: '0px 0px -25% 0px' },
    );
    if (cat) reveal.observe(cat);

    return () => {
      io.disconnect();
      reveal.disconnect();
    };
  }, []);

  const select = (id: DialId) => {
    if (id === 'intro') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setFilter(id);
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Landing onPanel={setPanel} />
      <Portfolio revealed={revealed} filter={filter} onFilter={setFilter} onPanel={setPanel} />
      <SideDial active={section === 'intro' ? 'intro' : filter} onSelect={select} />
      <InfoPanel panel={panel} onClose={() => setPanel(null)} />
    </>
  );
}
