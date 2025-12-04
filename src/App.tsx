import { SlateLayoutConnected } from './slate/components/SlateLayoutConnected';
import { ProjectProvider } from './slate/context/ProjectContext';

function App() {
  return (
    <ProjectProvider>
      <SlateLayoutConnected status="Ignition: ready" />
    </ProjectProvider>
  );
}

export default App;
