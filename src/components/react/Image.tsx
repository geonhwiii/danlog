interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  creditUrl?: string;
}

export default function Image({ src, alt, caption, credit, creditUrl }: ImageProps) {
  const hasCaption = Boolean(caption || credit);

  return (
    <figure className="m-0 overflow-hidden rounded-lg">
      <img alt={alt} className="block w-full" decoding="async" loading="lazy" src={src} />
      {hasCaption && (
        <figcaption className="caption px-4 pb-3 pt-2 text-center text-xs text-muted">
          {caption && <span>{caption}</span>}
          {credit && (
            <span>
              {caption && <br />}
              출처:{' '}
              {creditUrl ? (
                <a href={creditUrl} rel="noopener noreferrer" target="_blank">
                  {credit}
                </a>
              ) : (
                credit
              )}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
