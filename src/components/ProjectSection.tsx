import ProjectStrip from './ProjectStrip';
import SectionTitle from './SectionTitle';

export default function ProjectSection() {
  return (
    <section id="dev" aria-labelledby="dev-title" className="pt-24 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionTitle
          id="dev-title"
          title="Développement"
          lead="Jeux, outils créatifs et sites sur mesure. Les projets sur lesquels j'ai le plus appris."
        />
      </div>
      <ProjectStrip />
    </section>
  );
}
