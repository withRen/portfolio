export default function Hero() {
  return (
    <section id="top" className="flex min-h-[100dvh] items-end pb-10 pt-32 md:pb-16">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:gap-6 md:px-10">
        <h1 className="text-6xl font-semibold leading-none tracking-tighter md:col-span-9 md:text-8xl lg:text-9xl">
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="line-in block">Rahim</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] font-normal text-zinc-400 md:pl-[12vw]">
            <span className="line-in block [animation-delay:120ms]">Tamhaev</span>
          </span>
        </h1>

        <div className="fade-in flex flex-col gap-6 self-end border-t border-zinc-800 pt-6 md:col-span-3 md:col-start-10" style={{ ['--i' as string]: 0 }}>
          <p className="max-w-[28ch] text-lg leading-snug tracking-tight text-zinc-100 md:text-xl">
            Mi-développeur, mi-vidéaste. Je code des interfaces et je filme des histoires.
          </p>
          <p className="label leading-relaxed text-zinc-500">
            Étudiant BUT MMI
            <br />
            Développement / Audiovisuel / Photographie
          </p>
        </div>
      </div>
    </section>
  );
}
