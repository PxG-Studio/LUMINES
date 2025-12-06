import { useEffect, useCallback, useRef } from 'react';
import { Subscription } from 'nats.ws';
import { subscribe, publish } from '@/lib/messaging/client';
import { NatsSubjects } from '@/lib/messaging/subjects';
import type {
  ProjectEvent,
  FileEvent,
  AssetEvent,
  RuntimeEvent,
  BuildEvent,
} from '@/lib/messaging/subjects';

export function useMessaging() {
  const publishMessage = useCallback(async (subject: string, data: any) => {
    try {
      await publish(subject, data);
    } catch (error) {
      console.error('Failed to publish message:', error);
    }
  }, []);

  return { publish: publishMessage };
}

export function useProjectEvents(userId: string, callback: (event: ProjectEvent) => void) {
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    let mounted = true;

    const setupSubscription = async () => {
      try {
        const sub = await subscribe(NatsSubjects.project.created(userId), (event) => {
          if (mounted) {
            callback(event);
          }
        });
        subscriptionRef.current = sub;
      } catch (error) {
        console.error('Failed to subscribe to project events:', error);
      }
    };

    setupSubscription();

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [userId, callback]);
}

export function useFileEvents(projectId: string, callback: (event: FileEvent) => void) {
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    let mounted = true;

    const setupSubscription = async () => {
      try {
        const sub = await subscribe(NatsSubjects.file.allInProject(projectId), (event) => {
          if (mounted) {
            callback(event);
          }
        });
        subscriptionRef.current = sub;
      } catch (error) {
        console.error('Failed to subscribe to file events:', error);
      }
    };

    setupSubscription();

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [projectId, callback]);
}

export function useAssetEvents(projectId: string, callback: (event: AssetEvent) => void) {
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    let mounted = true;

    const setupSubscription = async () => {
      try {
        const sub = await subscribe(NatsSubjects.asset.allInProject(projectId), (event) => {
          if (mounted) {
            callback(event);
          }
        });
        subscriptionRef.current = sub;
      } catch (error) {
        console.error('Failed to subscribe to asset events:', error);
      }
    };

    setupSubscription();

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [projectId, callback]);
}

export function useRuntimeEvents(sessionId: string, callback: (event: RuntimeEvent) => void) {
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    let mounted = true;

    const setupSubscription = async () => {
      try {
        const sub = await subscribe(NatsSubjects.runtime.allForSession(sessionId), (event) => {
          if (mounted) {
            callback(event);
          }
        });
        subscriptionRef.current = sub;
      } catch (error) {
        console.error('Failed to subscribe to runtime events:', error);
      }
    };

    setupSubscription();

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [sessionId, callback]);
}

export function useBuildEvents(projectId: string, callback: (event: BuildEvent) => void) {
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    let mounted = true;

    const setupSubscription = async () => {
      try {
        const sub = await subscribe(NatsSubjects.build.allForProject(projectId), (event) => {
          if (mounted) {
            callback(event);
          }
        });
        subscriptionRef.current = sub;
      } catch (error) {
        console.error('Failed to subscribe to build events:', error);
      }
    };

    setupSubscription();

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [projectId, callback]);
}
