import { SignClientTypes } from '@walletconnect/types';
import Image from 'next/image';

/**
 * Types
 */
interface IProps {
  metadata: SignClientTypes.Metadata;
}

/**
 * Components
 */
export default function ProjectInfoCard({ metadata }: IProps) {
  const { icons, name, url } = metadata;

  return (
    <div className="flex">
      <div className="avatar mr-4">
        <div className="w-12 rounded">
          <Image
            src={icons[0]}
            fill
            alt="Tailwind-CSS-Avatar-component"
          />
        </div>
      </div>
      <div>
        <h5 className="whitespace-nowrap">{name}</h5>
        <a className="link whitespace-nowrap" href={url}>
          {url}
        </a>
      </div>
    </div>
  );
}
