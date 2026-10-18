import React, { useEffect, useRef, useState } from 'react';
import { CarFront } from 'lucide-react';

// A source change remounts the loader so the previous photo never flashes.
export default function LoadingImage(props) {
  return <ImageWithSkeleton key={props.src} {...props} />;
}

function ImageWithSkeleton({ src, alt, ...props }) {
  const [status, setStatus] = useState('loading');
  const image = useRef(null);
  useEffect(() => {
    if (image.current?.complete) {
      setStatus(image.current.naturalWidth > 0 ? 'loaded' : 'error');
    }
  }, [src]);

  return <>
    <img {...props} ref={image} src={src} alt={alt}
      style={{ opacity: status === 'loaded' ? 1 : 0 }}
      onLoad={() => setStatus('loaded')} onError={() => setStatus('error')} />
    {status === 'loading' && <span className="image-skeleton" role="status" aria-label={'Loading photo: ' + alt}>
      <CarFront size={36} aria-hidden="true" />
    </span>}
    {status === 'error' && <span className="image-fallback" role="img" aria-label={alt + ' — photo unavailable'}>
      <CarFront size={36} aria-hidden="true" />
      <span>Photo unavailable</span>
    </span>}
  </>;
}
