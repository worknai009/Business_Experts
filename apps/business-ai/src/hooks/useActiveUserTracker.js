import { useEffect, useRef } from 'react';

/**
 * Sends a heartbeat to the backend every 30 s so the admin can see
 * how many users are currently on the site.
 *
 * The sessionId is a tab-scoped UUID stored in sessionStorage (cleared
 * when the tab closes, so the server eventually ages it out after 45 s).
 */

const HEARTBEAT_INTERVAL_MS = 30_000; // 30 seconds
const API_URL = '/api/active-users/heartbeat';

function getSessionId() {
  let id = sessionStorage.getItem('_bai_sid');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('_bai_sid', id);
  }
  return id;
}

export function useActiveUserTracker(page = '/') {
  const intervalRef = useRef(null);

  useEffect(() => {
    const sessionId = getSessionId();

    const sendHeartbeat = async () => {
      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, page }),
          // Fire-and-forget — ignore errors silently
        }).catch(() => {});
      } catch (_) {}
    };

    // Send immediately on mount
    sendHeartbeat();

    // Then every 30 s
    intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [page]);
}
