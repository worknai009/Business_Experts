import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }: Props) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <Reveal className={`max-w-2xl ${alignment} mb-14 md:mb-16`}>
      <span className="eyebrow">
        <span className="size-1 rounded-full bg-brand" />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.15]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-slate-500 md:text-lg">{subtitle}</p>
      ) : null}
    </Reveal>
  );
}
