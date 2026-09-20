export default function SectionHeading({
  title,
  intro,
  align = "left",
}: {
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <h2 className="text-3xl leading-tight sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-ink/70">{intro}</p>}
      <div className={`mt-6 h-px w-16 bg-brass ${align === "center" ? "mx-auto" : ""}`} />
    </div>
  );
}
