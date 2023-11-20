'use client';

import ChatMain from '@/components/chat/ChatMain';
import { useIsMounted } from '@/hooks/useIsMounted';

function ChatPage() {
  const mounted = useIsMounted();
  return (
    mounted && (
      <>
        <ChatMain />
      </>
    )
  );
}
export default ChatPage;
