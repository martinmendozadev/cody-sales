import { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { getUsers } from './services/api';
import type { User } from './services/api';
import { AppButton } from './components/ui/AppButton';

function App() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error cargando usuarios", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (!selectedUserId) {
    return (
      <div className="min-h-screen bg-surface-muted flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <h1 className="text-heading-lg text-brand-primary mb-2">Cody Sales</h1>
          <p className="text-body-md text-gray-500 mb-8">Selecciona tu perfil de promotor para continuar</p>

          {loading ? (
            <div className="animate-pulse flex space-x-4 justify-center">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className="w-full text-left px-4 py-3 rounded-lg border-2 border-transparent bg-surface-muted hover:border-brand-primary hover:bg-white transition-all group"
                >
                  <p className="font-semibold text-gray-900 group-hover:text-brand-primary">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400">ID: {user.id.split('-')[0]}...</p>
                </button>
              ))}

              {users.length === 0 && (
                <p className="text-red-500 text-sm">No hay usuarios en la base de datos. Ejecuta el seed en el backend.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted py-8">
      <div className="max-w-4xl mx-auto px-6 mb-6">
        <AppButton variant="secondary" size="sm" onClick={() => setSelectedUserId(null)}>
          ← Cambiar de Promotor
        </AppButton>
      </div>
      <Dashboard userId={selectedUserId} />
    </div>
  );
}

export default App;
