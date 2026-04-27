import { Dashboard } from './components/Dashboard';

const USER_ID = import.meta.env.VITE_TEST_USER_ID || 'agrega-tu-user-id-al-env';

function App() {
  return (
    <div className="min-h-screen bg-surface-muted py-8">
      {USER_ID === 'agrega-tu-user-id-al-env' ? (
        <div className="text-center text-red-500 p-8">
          Por favor, configura tu VITE_TEST_USER_ID en el archivo .env del frontend.
        </div>
      ) : (
        <Dashboard userId={USER_ID} />
      )}
    </div>
  );
}

export default App;
