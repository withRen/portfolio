'use client';

import { useCallback, useEffect, useState } from 'react';
import { asset } from '@/data/content';
import type { Locale } from '@/i18n/config';
import { I18nProvider } from '@/i18n/context';
import Backdrop from './Backdrop';
import ContactSection from './ContactSection';
import Landing from './Landing';
import Loader from './Loader';
import PhotoSection from './PhotoSection';
import ScrollDriver from './ScrollDriver';
import ProjectSection from './ProjectSection';
import CameraDial, { type DialId } from './CameraDial';
import VideoSection from './VideoSection';

const SECTIONS: DialId[] = ['top', 'photos', 'videos', 'dev', 'contact'];
const dunes = asset('/photos/dunes.png');

export default function Site({ locale }: { locale: Locale }) {
  const [section, setSection] = useState<DialId>('top');
  const [photo, setPhoto] = useState(dunes);
  const [backdrop, setBackdrop] = useState(dunes);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSection(e.target.id as DialId);
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // The fixed backdrop follows the active photo inside the photo section
  const target = section === 'photos' ? photo : dunes;
  useEffect(() => {
    const t = setTimeout(() => setBackdrop(target), 140);
    return () => clearTimeout(t);
  }, [target]);

  const nav = useCallback((id: string) => {
    if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <I18nProvider locale={locale}>
      <Loader />
      <Backdrop src={backdrop} />
      <Landing onNav={nav} />
      <main>
        <PhotoSection onActiveImage={setPhoto} />
        <VideoSection />
        <ProjectSection />
        <ContactSection />
      </main>
      <CameraDial active={section} onSelect={nav} />
      <ScrollDriver />
    </I18nProvider>
  );
}
