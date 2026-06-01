interface VideoProps {
  src: string;
  caption?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export default function Video({
  src,
  caption,
  autoPlay = true,
  loop = true,
  muted = true,
  controls = true,
}: VideoProps) {
  return (
    <figure className="m-0 overflow-hidden rounded-lg border border-hairline bg-surface-card">
      <video
        autoPlay={autoPlay}
        className="block w-full"
        controls={controls}
        loop={loop}
        muted={muted}
        playsInline
        src={src}
      />
      {caption && <figcaption className="caption px-4 pb-3 pt-2 text-center text-muted">{caption}</figcaption>}
    </figure>
  );
}
