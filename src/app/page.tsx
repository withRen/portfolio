import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Development from '@/components/Development';
import Video from '@/components/Video';
import Photography from '@/components/Photography';
import Tools from '@/components/Tools';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <a
        href="#dev"
        className="fixed left-3 top-3 z-[300] -translate-y-[200%] bg-zinc-100 px-4 py-2 text-sm text-zinc-950 focus:translate-y-0"
      >
        Aller au contenu
      </a>
      <Header />
      <main>
        <Hero />
        <Development />
        <Video />
        <Photography />
        <Tools />
        <Contact />
      </main>
    </>
  );
}
