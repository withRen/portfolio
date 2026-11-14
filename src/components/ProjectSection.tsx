'use client';

import { useI18n } from '@/i18n/context';
import ProjectStrip from './ProjectStrip';
import SectionTitle from './SectionTitle';

export default function ProjectSection() {
  const { t } = useI18n();
  return (
    <section id="dev" aria-labelledby="dev-title" className="pt-24 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionTitle id="dev-title" title={t.dev.title} lead={t.dev.lead} />
      </div>
      <ProjectStrip />
    </section>
  );
}
