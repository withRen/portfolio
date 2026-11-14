import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { contactHref, socials } from "@/data/content";
import { useI18n } from "@/i18n/context";
import LangSwitch from "./LangSwitch";
import Logo from "./Logo";
import PrivacySettings from "./PrivacySettings";
import Reveal from "./Reveal";

export default function ContactSection() {
  const { t, locale, content, href } = useI18n();
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="pb-10 pt-24 md:pt-40"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 md:grid-cols-12 md:gap-6 md:px-10">
        <Reveal className="sd-rise md:col-span-7">
          <h2
            id="contact-title"
            className="text-5xl font-semibold leading-[0.95] tracking-tighter text-zinc-50 md:text-7xl"
          >
            {t.contact.title}
          </h2>
          <a
            href={contactHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-zinc-50 py-3 pl-6 pr-3 font-medium text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {t.contact.cta}
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-zinc-950 text-zinc-50 transition-transform duration-500 ease-out-expo group-hover:rotate-45">
              <ArrowUpRight size={16} weight="regular" aria-hidden />
            </span>
          </a>
        </Reveal>

        <Reveal
          index={1}
          className="sd-rise-late flex flex-col gap-8 md:col-span-4 md:col-start-9 md:pt-3"
        >
          <p className="max-w-[40ch] leading-relaxed text-zinc-300">
            {t.contact.bio}
          </p>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {content.tools.map((g) => (
              <div key={g.group}>
                <dt className="text-sm font-medium text-zinc-500">{g.group}</dt>
                <dd className="mt-1.5 leading-relaxed text-zinc-300">
                  {g.items.join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <footer
        id="site-footer"
        className="mx-auto mt-24 flex max-w-[1400px] flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-white/10 px-5 pb-10 pt-6 md:mt-36 md:px-10 md:pb-10"
      >
        <span className="flex items-center gap-3 text-sm text-zinc-500">
          <Logo className="size-6 text-zinc-300" title="" />
          &copy; 2026 Rahim Tamhaev
        </span>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
          <li>
            <a
              href={href("legal")}
              className="transition-colors duration-300 hover:text-accent"
            >
              {t.contact.legal}
            </a>
          </li>
          <li>
            <PrivacySettings className="transition-colors duration-300 hover:text-accent" />
          </li>
        </ul>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <ul className="flex gap-6 text-sm text-zinc-400">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <LangSwitch
            locale={locale}
            page="home"
            className="-my-2 text-sm text-zinc-400"
          />
        </div>
      </footer>
    </section>
  );
}
