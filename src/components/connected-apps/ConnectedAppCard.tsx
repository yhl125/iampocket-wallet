import { ReadOnlyConnectedApp } from '@/store/ConnectedAppStore';
import Image from 'next/image';

export default function ConnectedAppCard({
  connectedApp,
  wcDisconnect,
}: {
  connectedApp: ReadOnlyConnectedApp;
  wcDisconnect: (topic: string) => Promise<void>;
}) {
  const metadata = connectedApp.metadata;

  return (
    <div className="flex justify-between p-4 my-2">
      <div>
        {metadata.icons.length > 0 && (
          <div className="avatar mr-4">
            <div className="w-8 rounded">
              <Image src={metadata.icons[0]} alt={metadata.name} fill />
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
        className="btn-error btn-sm btn"
      >
        Disconnect
      </button>
    </div>
  );
}
