import type { Vacancy } from '../types/vacancy';
import type { VacancyFormValues } from '../schemas/vacancySchema';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/vacancies`;
export async function getVacancies(params?: {
  puesto?: string;
  estado?: Vacancy['estado'];
}): Promise<Vacancy[]> {
  const searchParams = new URLSearchParams();

  if (params?.puesto) {
    searchParams.append('puesto_like', params.puesto);
  }

  if (params?.estado) {
    searchParams.append('estado', params.estado);
  }

  const query = searchParams.toString();

  const response = await fetch(
    query ? `${API_URL}?${query}` : API_URL
  );

  if (!response.ok) {
    throw new Error('No se pudieron obtener las vacantes');
  }

  return response.json();
}

export async function createVacancy(
  data: VacancyFormValues
): Promise<Vacancy> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear la vacante');
  }

  return response.json();
}

export async function updateVacancy(
  id: number,
  data: VacancyFormValues
): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar la vacante');
  }

  return response.json();
}

export async function deleteVacancy(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar la vacante');
  }
}