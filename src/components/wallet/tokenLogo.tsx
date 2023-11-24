import Image from 'next/image';
import { useState } from 'react';

export default function TokenLogo(token: { logoUrl: string; address: string }) {
  const [src, setSrc] = useState(token.logoUrl);
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="1x"
      onError={() =>
        setSrc(`https://cdn.stamp.fyi/avatar/${token.address}?s=100`)
      }
    />
  );
}
