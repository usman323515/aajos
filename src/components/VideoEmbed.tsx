function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideoEmbed({ url, title }: { url: string; title: string }) {
  const id = extractYouTubeId(url);
  if (!id) return null;

  return (
    <div className="mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-lg border border-line bg-ink sm:max-w-sm">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
