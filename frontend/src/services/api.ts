import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

export interface Milestone {
  id: string;
  type: string;
  achievedAt: string;
}

export interface ProgressData {
  target: number;
  current: number;
  percentage: number;
  milestones: Milestone[];
}

export const getProgress = async (userId: string): Promise<ProgressData> => {
  const { data } = await api.get(`/progreso/${userId}`);
  return data.data;
};

export const registerSale = async (userId: string, amount: number) => {
  const { data } = await api.post(`/ventas`, { userId, amount });
  return data.data;
};
