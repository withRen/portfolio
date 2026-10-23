import { videos } from '@/data/content';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';
import VideoCard from './VideoCard';

// Bento: featured film spans 2x2, two cards on its right, three below (9 cells, 6 items)
const cells = [
  'md:col-span-2 md:row-span-2',
  'md:col-start-3 md:row-start-1',
  'md:col-start-3 md:row-start-2',
  'md:row-start-3',
  'md:row-start-3',
  'md:row-start-3',
];

export default function VideoSection() {
  return (
    <section id="videos" aria-labelledby="videos-title" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionTitle
          id="videos-title"
          title="Vidéo"
          lead="Courts-métrages, publicités produits et projets créatifs, du tournage à l'étalonnage."
        />
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 md:mt-16 md:grid-cols-3 md:grid-rows-[repeat(3,minmax(15rem,auto))]">
          {videos.map((v, i) => (
            <Reveal key={v.id} index={i} className={cells[i]}>
              <VideoCard video={v} featured={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
