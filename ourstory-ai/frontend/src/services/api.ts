import axios from 'axios';
import type { RelationshipMemory, CreateMemoryRequest, ChatResponse, MemoryStats, MemoryType } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const memoryApi = {
  getAll: () => api.get<RelationshipMemory[]>('/memories').then((r) => r.data),

  getById: (id: number) =>
    api.get<RelationshipMemory>(`/memories/${id}`).then((r) => r.data),

  getByType: (type: MemoryType) =>
    api.get<RelationshipMemory[]>(`/memories?type=${type}`).then((r) => r.data),

  search: (keyword: string) =>
    api.get<RelationshipMemory[]>(`/memories?search=${encodeURIComponent(keyword)}`).then((r) => r.data),

  create: (data: CreateMemoryRequest) =>
    api.post<RelationshipMemory>('/memories', data).then((r) => r.data),

  update: (id: number, data: CreateMemoryRequest) =>
    api.put<RelationshipMemory>(`/memories/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/memories/${id}`),

  getStats: () => api.get<MemoryStats>('/memories/stats').then((r) => r.data),
};

export const chatApi = {
  sendMessage: (message: string) =>
    api.post<ChatResponse>('/chat', { message }).then((r) => r.data),
};
