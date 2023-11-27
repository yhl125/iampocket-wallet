import Image from 'next/image';
import { useState } from 'react';

interface IProps {
  size?: number;
  logoUrl: string;
  address: string;
}

const TokenImage = ({ size = 20, logoUrl, address }: IProps) => {
  const [src, setSrc] = useState(logoUrl);
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
      onError={() => setSrc(`https://cdn.stamp.fyi/avatar/${address}?s=100`)}
    />
  );
};

export default TokenImage;
