import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createVacancy,
  deleteVacancy,
  getVacancies,
  updateVacancy,
} from '../services/vacancyService';

import type { Vacancy } from '../types/vacancy';
import type { VacancyFormValues } from '../schemas/vacancySchema';

type VacancyFilters = {
  puesto?: string;
  estado?: Vacancy['estado'];
};

/**
 * Obtener vacantes
 */
export function useVacancies(filters: VacancyFilters = {}) {
  return useQuery({
    queryKey: ['vacancies', filters],
    queryFn: () => getVacancies(filters),
  });
}

/**
 * Crear una vacante
 */
export function useCreateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VacancyFormValues) =>
      createVacancy(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vacancies'],
      });
    },
  });
}

/**
 * Actualizar una vacante
 */
export function useUpdateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: VacancyFormValues;
    }) => updateVacancy(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vacancies'],
      });
    },
  });
}

/**
 * Eliminar una vacante
 */
export function useDeleteVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      deleteVacancy(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vacancies'],
      });
    },
  });
}