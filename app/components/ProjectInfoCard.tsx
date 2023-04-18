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
    <div className="grid content-center	">
      <div className="columns-3">
        <div className="avatar">
          <div className="w-8 rounded">
            {/* TODO fix Image with src "" is missing required "width" property */}
            <Image src={icons[0]} alt="Tailwind-CSS-Avatar-component" />
          </div>
        </div>
      </div>
      <div className="columns-auto">
        <h5>{name}</h5>
        <a className="link" href={url}>
          {url}
        </a>
      </div>
    </div>
  );
}
