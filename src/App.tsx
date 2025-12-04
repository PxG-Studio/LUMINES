import { SlateLayoutConnected } from './slate/components/SlateLayoutConnected';
import { ProjectProvider } from './slate/context/ProjectContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { AuthGuard } from './components/auth/AuthGuard';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthGuard>
          <ProjectProvider>
            <SlateLayoutConnected status="Ignition: ready" />
          </ProjectProvider>
        </AuthGuard>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
