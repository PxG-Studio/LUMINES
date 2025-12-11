/**
 * Presence Layer Component
 * 
 * Renders Figma-style presence cursors showing where other users are
 */

import React, { useEffect, useState } from 'react';
import { awareness, yCursors } from './YProvider';

interface User {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor: { x: number; y: number };
}

interface PresenceLayerProps {
  containerRef: React.RefObject<HTMLElement>;
}

export function PresenceLayer({ containerRef }: PresenceLayerProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const updateUsers = () => {
      if (!containerRef.current) return;

      const states = awareness.getStates();
      const userList: User[] = [];
      const rect = containerRef.current.getBoundingClientRect();
      
      states.forEach((state, clientId) => {
        // Skip self
        if (clientId === awareness.clientID) return;

        const cursor = yCursors.get(clientId.toString()) as { x: number; y: number } | undefined;
        if (cursor) {
          const userState = state.user as { name?: string; avatar?: string; color?: string } | undefined;
          userList.push({
            id: clientId.toString(),
            name: userState?.name || `User ${clientId}`,
            avatar: userState?.avatar,
            color: userState?.color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
            cursor: {
              x: cursor.x - rect.left,
              y: cursor.y - rect.top
            }
          });
        }
      });
      
      setUsers(userList);
    };

    const handleAwarenessChange = () => {
      updateUsers();
    };

    const handleCursorChange = () => {
      updateUsers();
    };

    awareness.on('change', handleAwarenessChange);
    yCursors.observe(handleCursorChange);
    
    // Track mouse movement for local user
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        yCursors.set(awareness.clientID.toString(), {
          x: e.clientX,
          y: e.clientY
        });
      }
    };

    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    
    // Initial update
    updateUsers();
    
    return () => {
      awareness.off('change', handleAwarenessChange);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);

  if (users.length === 0) return null;

  return (
    <div style={{ 
      pointerEvents: "none", 
      position: "absolute", 
      inset: 0,
      zIndex: 1000,
      overflow: "hidden"
    }}>
      {users.map(u => (
        <div 
          key={u.id}
          style={{
            position: "absolute",
            transform: `translate(${u.cursor.x}px, ${u.cursor.y}px)`,
            transition: "transform 0.1s ease-out",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <div style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: u.color,
            border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px"
          }}>
            {u.avatar ? (
              <img src={u.avatar} alt={u.name} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
            ) : (
              u.name.charAt(0).toUpperCase()
            )}
          </div>
          <span style={{ 
            background: u.color, 
            color: "white", 
            padding: "2px 6px", 
            borderRadius: 6,
            fontSize: "11px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
          }}>
            {u.name}
          </span>
        </div>
      ))}
    </div>
  );
}

