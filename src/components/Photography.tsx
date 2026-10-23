import { photoColumns } from '@/data/content';
import Gallery from './Gallery';
import SectionHead from './SectionHead';

export default function Photography() {
  return (
    <section id="photographie" aria-labelledby="photo-title" className="py-28 md:py-52">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <SectionHead
          index="03"
          label="Photographie"
          title="Architectures, détails urbains, scènes naturelles."
          titleId="photo-title"
          titleClass="text-4xl md:text-7xl"
          className="mb-14 max-w-5xl md:mb-24"
        />
        <Gallery columns={photoColumns} />
      </div>
    </section>
  );
}
