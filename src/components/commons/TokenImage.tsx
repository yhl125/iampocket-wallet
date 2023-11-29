import Image from 'next/image';
import { useState } from 'react';

interface IProps {
  size?: number;
  logoUrl: string;
  address: string;
  key?: string;
}

const TokenImage = ({ size = 30, logoUrl, address, key = '' }: IProps) => {
  const [src, setSrc] = useState(logoUrl);

  return (
    <Image
      src={src}
      alt=""
      key={key}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
      onError={() => setSrc(`https://cdn.stamp.fyi/avatar/${address}?s=100`)}
    />
  );
};

export default TokenImage;
