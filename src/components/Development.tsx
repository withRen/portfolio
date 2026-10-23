import { projects } from '@/data/content';
import RowList from './RowList';
import SectionHead from './SectionHead';

export default function Development() {
  return (
    <section id="dev" aria-labelledby="dev-title" className="py-24 md:py-44">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:items-start md:gap-6 md:px-10">
        <SectionHead
          index="01"
          label="Développement"
          title="Web, mobile et desktop."
          titleId="dev-title"
          lead="Applications natives macOS et iOS, plateforme e-commerce full stack, logiciels de productivité."
          className="md:sticky md:top-24 md:col-span-4"
        />
        <div className="md:col-span-8">
          <RowList items={projects} />
        </div>
      </div>
    </section>
  );
}
