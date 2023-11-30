import Image from 'next/image';
import { useEffect, useState } from 'react';

interface IProps {
  size?: number;
  logoUrl: string;
  address: string;
  imageKey?: string;
}

const TokenImage = ({ size = 20, logoUrl, address, imageKey }: IProps) => {
  const [src, setSrc] = useState(logoUrl);
  //TODO: Change this pattern
  useEffect(() => {
    setSrc(logoUrl);
  }, [logoUrl]);
  return (
    <Image
      key={imageKey}
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
