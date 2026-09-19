import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  vacancySchema,
  type VacancyFormValues,
} from '../schemas/vacancySchema';

import type { Vacancy } from '../types/vacancy';

interface VacancyFormProps {
  vacancy?: Vacancy | null;
  isSubmitting?: boolean;
  onSubmit: (data: VacancyFormValues) => void | Promise<void>;
  onClose: () => void;
  error?: string | null;
}

export default function VacancyForm({
  vacancy,
  isSubmitting = false,
  onSubmit,
  onClose,
  error,
}: VacancyFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VacancyFormValues>({
    resolver: zodResolver(vacancySchema) as Resolver<VacancyFormValues>,
    defaultValues: {
      puesto: '',
      departamento: '',
      modalidad: 'presencial',
      salario: 0,
      fechaPublicacion: new Date().toISOString().split('T')[0],
      estado: 'abierta',
      candidatos: 0,
    },
  });

  // Cargar los datos cuando estamos editando
  useEffect(() => {
    if (vacancy) {
      reset({
        puesto: vacancy.puesto,
        departamento: vacancy.departamento,
        modalidad: vacancy.modalidad,
        salario: vacancy.salario,
        fechaPublicacion: vacancy.fechaPublicacion,
        estado: vacancy.estado,
        candidatos: vacancy.candidatos,
      });
    } else {
      reset({
        puesto: '',
        departamento: '',
        modalidad: 'presencial',
        salario: 0,
        fechaPublicacion: new Date()
          .toISOString()
          .split('T')[0],
        estado: 'abierta',
        candidatos: 0,
      });
    }
  }, [vacancy, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Puesto */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Puesto
        </label>

        <input
          type="text"
          placeholder="Ej. Desarrollador Frontend"
          {...register('puesto')}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
            errors.puesto
              ? 'border-red-400 focus:ring-2 focus:ring-red-200'
              : 'border-slate-300 focus:ring-2 focus:ring-blue-200'
          }`}
        />

        {errors.puesto && (
          <p className="text-red-500 text-xs mt-1">
            {errors.puesto.message}
          </p>
        )}
      </div>

      {/* Departamento */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Departamento
        </label>

        <select
          {...register('departamento')}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
            errors.departamento
              ? 'border-red-400'
              : 'border-slate-300'
          }`}
        >
          <option value="">Seleccionar departamento</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Recursos Humanos">
            Recursos Humanos
          </option>
          <option value="Finanzas">Finanzas</option>
          <option value="Operaciones">Operaciones</option>
          <option value="Ventas">Ventas</option>
          <option value="Marketing">Marketing</option>
        </select>

        {errors.departamento && (
          <p className="text-red-500 text-xs mt-1">
            {errors.departamento.message}
          </p>
        )}
      </div>

      {/* Modalidad */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Modalidad
        </label>

        <select
          {...register('modalidad')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="presencial">
            Presencial
          </option>

          <option value="remoto">
            Remoto
          </option>

          <option value="hibrido">
            Híbrido
          </option>
        </select>

        {errors.modalidad && (
          <p className="text-red-500 text-xs mt-1">
            {errors.modalidad.message}
          </p>
        )}
      </div>

      {/* Salario */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Salario
        </label>

        <input
          type="number"
          min="1"
          step="1"
          placeholder="Ej. 7500"
          {...register('salario', {
            valueAsNumber: true,
          })}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
            errors.salario
              ? 'border-red-400'
              : 'border-slate-300'
          }`}
        />

        {errors.salario && (
          <p className="text-red-500 text-xs mt-1">
            {errors.salario.message}
          </p>
        )}
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Fecha de publicación
        </label>

        <input
          type="date"
          {...register('fechaPublicacion')}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
            errors.fechaPublicacion
              ? 'border-red-400'
              : 'border-slate-300'
          }`}
        />

        {errors.fechaPublicacion && (
          <p className="text-red-500 text-xs mt-1">
            {errors.fechaPublicacion.message}
          </p>
        )}
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Estado
        </label>

        <select
          {...register('estado')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="abierta">
            Abierta
          </option>

          <option value="cerrada">
            Cerrada
          </option>
        </select>

        {errors.estado && (
          <p className="text-red-500 text-xs mt-1">
            {errors.estado.message}
          </p>
        )}
      </div>

      {/* Candidatos */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Número de candidatos
        </label>

        <input
          type="number"
          min="0"
          step="1"
          {...register('candidatos', {
            valueAsNumber: true,
          })}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
            errors.candidatos
              ? 'border-red-400'
              : 'border-slate-300'
          }`}
        />

        {errors.candidatos && (
          <p className="text-red-500 text-xs mt-1">
            {errors.candidatos.message}
          </p>
        )}
      </div>

      {/* Error del servidor */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting
            ? 'Guardando...'
            : vacancy
              ? 'Guardar cambios'
              : 'Crear vacante'}
        </button>
      </div>
    </form>
  );
}