import React, { useState } from 'react';
import { AppButton } from './ui/AppButton';
import { registerSale } from '../services/api';

interface SalesFormProps {
  userId: string;
  onSuccess: () => void;
}

export const SalesForm: React.FC<SalesFormProps> = ({ userId, onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Por favor, ingresa un monto válido mayor a 0.');
      return;
    }

    try {
      setLoading(true);
      await registerSale(userId, numericAmount);
      setSuccessMsg(`¡Venta de $${numericAmount} registrada con éxito!`);
      setAmount('');
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocurrió un error al registrar la venta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-heading-md mb-4">Registrar Venta</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-body-sm font-semibold mb-1">
            Monto de la venta ($)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ej. 1500.50"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-500 text-body-sm">{error}</p>}
        {successMsg && <p className="text-success-base text-body-sm font-medium">{successMsg}</p>}

        <AppButton type="submit" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl2 shadow-card" isLoading={loading}>
          Guardar Venta
        </AppButton>
      </form>
    </div>
  );
};
