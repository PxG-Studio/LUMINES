import { QueryClientProvider } from '@tanstack/react-query';
import { SlateLayoutConnected } from './slate/components/SlateLayoutConnected';
import { ProjectProvider } from './slate/context/ProjectContext';
import { queryClient } from './lib/cache/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <SlateLayoutConnected status="Ignition: ready" />
      </ProjectProvider>
    </QueryClientProvider>
  );
}

export default App;
