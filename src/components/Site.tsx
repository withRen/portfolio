'use client';

import { useState } from 'react';
import InfoPanel, { type PanelId } from './InfoPanel';
import Landing from './Landing';
import Portfolio from './Portfolio';

export default function Site() {
  const [panel, setPanel] = useState<PanelId>(null);

  return (
    <>
      <Landing onPanel={setPanel} />
      <Portfolio onPanel={setPanel} />
      <InfoPanel panel={panel} onClose={() => setPanel(null)} />
    </>
  );
}
