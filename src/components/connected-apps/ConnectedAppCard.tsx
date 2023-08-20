import { ReadOnlyConnectedApp } from '@/store/ConnectedAppStore';
import Image from 'next/image';

function ConnectedAppCard({
  connectedApp,
  wcDisconnect,
}: {
  connectedApp: ReadOnlyConnectedApp;
  wcDisconnect: (topic: string) => Promise<void>;
}) {
  const metadata = connectedApp.metadata;

  return (
    <div className="my-2 flex justify-between p-4">
      <div>
        {metadata.icons.length > 0 && (
          <div className="avatar mr-4">
            <div className="relative w-8 rounded">
              <Image
                src={metadata.icons[0]}
                alt={metadata.name}
                fill
                sizes="1x"
              />
            </div>
          </div>
        )}
        <a
          href={metadata.url}
          className="align-top text-lg font-medium underline"
        >
          {metadata.name}
        </a>
      </div>
      <button
        onClick={() => wcDisconnect(connectedApp.topic)}
        className="btn btn-error btn-sm"
      >
        Disconnect
      </button>
    </div>
  );
}
export default ConnectedAppCard;
