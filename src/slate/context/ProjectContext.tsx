import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProjectContextType {
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  userId: string;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const DEFAULT_USER_ID = 'demo-user-123';

export const ProjectProvider: React.FC<{ children: ReactNode; userId?: string }> = ({
  children,
  userId = DEFAULT_USER_ID,
}) => {
  const [projectId, setProjectId] = useState<string | null>(null);

  return (
    <ProjectContext.Provider value={{ projectId, setProjectId, userId }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within ProjectProvider');
  }
  return context;
};
