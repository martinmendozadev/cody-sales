import React, { useEffect, useState } from 'react';
import { getProgress } from '../services/api';
import type { ProgressData } from '../services/api';
import { ProgressBar } from './ui/ProgressBar';
import { Badge } from './ui/Badge';
import { SalesForm } from './SalesForm';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

export const Dashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getProgress(userId);
      setData(result);
    } catch (err: any) {
      setError('No se pudo cargar el progreso. Verifica la conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchProgress();
  }, [userId]);

  if (loading && !data) return <div className="p-8 text-center">Cargando tu progreso...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Columna Izquierda: Progreso y Logros */}
      <div className="space-y-8">
        <div>
          <h1 className="text-heading-lg text-gray-900 mb-1">¡Hola, Promotor!</h1>
          <p className="text-body-md text-gray-500">Aquí está tu resumen del mes.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-body-sm text-gray-500">Progreso mensual</p>
              <p className="text-heading-md text-brand-primary">{formatCurrency(data.current)}</p>
            </div>
            <div className="text-right">
              <p className="text-body-sm text-gray-500">Meta</p>
              <p className="text-body-md font-semibold">{formatCurrency(data.target)}</p>
            </div>
          </div>

          <ProgressBar percentage={data.percentage} className="mb-2" />
          <p className="text-right text-body-sm font-semibold text-gray-700">
            {data.percentage.toFixed(1)}% completado
          </p>
        </div>

        <div>
          <h3 className="text-heading-md mb-3">Tus Logros</h3>
          <div className="flex flex-wrap gap-2">
            {data.milestones.length === 0 ? (
              <p className="text-body-sm text-gray-400">Aún no hay logros este mes. ¡Tú puedes!</p>
            ) : (
              data.milestones.map((m) => (
                <Badge key={m.id} variant={m.type === '100_PERCENT' ? 'success' : 'warning'}>
                  {m.type === '50_PERCENT' && '🔥 50% Alcanzado'}
                  {m.type === '80_PERCENT' && '🚀 80% Alcanzado'}
                  {m.type === '100_PERCENT' && '🏆 Meta Superada'}
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>

      <div>
        <SalesForm userId={userId} onSuccess={fetchProgress} />
      </div>
    </div>
  );
};
