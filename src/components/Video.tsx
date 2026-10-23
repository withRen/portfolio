import { featuredVideo, videos } from '@/data/content';
import FeaturedVideo from './FeaturedVideo';
import Reveal from './Reveal';
import RowList from './RowList';
import SectionHead from './SectionHead';

export default function Video() {
  return (
    <section id="audiovisuel" aria-labelledby="video-title" className="bg-zinc-900 py-20 md:py-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-12 gap-y-6 md:mb-16">
          <SectionHead
            index="02"
            label="Audiovisuel"
            title="Images en mouvement."
            titleId="video-title"
            className="basis-full"
          />
          <p className="-mt-2 max-w-[34ch] leading-relaxed text-zinc-400">
            Courts-métrages, publicités produits et projets créatifs.
          </p>
        </div>

        <Reveal>
          <FeaturedVideo {...featuredVideo} />
        </Reveal>

        <div className="mt-10 md:mt-16">
          <RowList items={videos} variant="video" />
        </div>
      </div>
    </section>
  );
}
