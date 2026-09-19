import { useCallback, useMemo, useState } from 'react';
import {
  useCreateVacancy,
  useDeleteVacancy,
  useUpdateVacancy,
  useVacancies,
} from '../hooks/useVacancies';

import type { Vacancy } from '../types/vacancy';
import type { VacancyFormValues } from '../schemas/vacancySchema';

import StatsBadge from '../components/StatsBadge';
import Modal from '../components/Modal';
import VacancyCard from '../components/VacancyCard';
import VacancyForm from '../components/VacancyForm';

function VacanciesPage() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    Vacancy['estado'] | ''
  >('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Obtener vacantes aplicando filtros
  const {
    data: vacancies = [],
    isLoading,
    isError,
    error,
  } = useVacancies({
    puesto: search || undefined,
    estado: selectedStatus || undefined,
  });

  // Obtener todas las vacantes para las estadísticas
  const { data: allVacancies = [] } = useVacancies({});

  // Mutaciones
  const createVacancy = useCreateVacancy();
  const updateVacancy = useUpdateVacancy();
  const deleteVacancy = useDeleteVacancy();

  // Estadísticas
  const total = allVacancies.length;

  const abiertas = useMemo(
    () =>
      allVacancies.filter(
        (vacancy) => vacancy.estado === 'abierta'
      ).length,
    [allVacancies]
  );

  const cerradas = useMemo(
    () =>
      allVacancies.filter(
        (vacancy) => vacancy.estado === 'cerrada'
      ).length,
    [allVacancies]
  );

  // Abrir formulario para crear
  const handleOpenCreate = useCallback(() => {
    setEditingVacancy(null);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  // Abrir formulario para editar
  const handleOpenEdit = useCallback((vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  // Eliminar vacante
  const handleDelete = useCallback(
    (id: number) => {
      const confirmed = window.confirm(
        '¿Estás seguro de eliminar esta vacante?'
      );

      if (!confirmed) return;

      deleteVacancy.mutate(id);
    },
    [deleteVacancy]
  );

  // Crear o actualizar
  const handleSubmit = useCallback(
    async (values: VacancyFormValues) => {
      setSubmitError(null);

      try {
        if (editingVacancy) {
          await updateVacancy.mutateAsync({
            id: editingVacancy.id,
            data: values,
          });
        } else {
          await createVacancy.mutateAsync(values);
        }

        setModalOpen(false);
      } catch {
        setSubmitError(
          'No se pudo guardar la vacante. Verifica que el servidor esté disponible.'
        );
      }
    },
    [editingVacancy, createVacancy, updateVacancy]
  );

  // Limpiar filtros
  const clearFilters = () => {
    setSearch('');
    setSelectedStatus('');
  };

  const isSubmitting =
    createVacancy.isPending || updateVacancy.isPending;

  const hasFilters = Boolean(search || selectedStatus);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* Encabezado */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Gestión de Vacantes
          </h2>

          <p className="text-slate-500 mt-1">
            {isLoading
              ? 'Cargando vacantes...'
              : `${vacancies.length} vacantes mostradas`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-2.5 bg-brand-800 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Nueva vacante
        </button>

      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">

        <StatsBadge
          label="Total de vacantes"
          value={total}
          variant="blue"
        />

        <StatsBadge
          label="Vacantes abiertas"
          value={abiertas}
          variant="green"
        />

        <StatsBadge
          label="Vacantes cerradas"
          value={cerradas}
          variant="red"
        />

      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row sm:items-end gap-3">

        {/* Buscar */}
        <label className="flex-1 block">

          <span className="block text-sm font-medium text-slate-700 mb-1">
            Buscar por puesto
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ej. Desarrollador, Contador..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </label>

        {/* Estado */}
        <label className="w-full sm:w-48 block">

          <span className="block text-sm font-medium text-slate-700 mb-1">
            Estado
          </span>

          <select
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(
                event.target.value as Vacancy['estado'] | ''
              )
            }
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option value="abierta">Abiertas</option>
            <option value="cerrada">Cerradas</option>
          </select>

        </label>

        {/* Limpiar */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors"
          >
            Limpiar filtros
          </button>
        )}

      </div>

      {/* Cargando */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-500">

          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />

          <span>
            Cargando vacantes...
          </span>

        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">

          <p className="text-red-700 font-medium">
            No se pudieron cargar las vacantes
          </p>

          <p className="text-red-500 text-sm mt-1">
            {(error as Error)?.message ||
              'Verifica que json-server esté ejecutándose en el puerto 3001.'}
          </p>

        </div>
      )}

      {/* Sin resultados */}
      {!isLoading &&
        !isError &&
        vacancies.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl text-center py-14 px-6">

            <p className="text-slate-700 font-medium">
              {hasFilters
                ? 'No se encontraron vacantes con los filtros aplicados.'
                : 'No hay vacantes registradas.'}
            </p>

            <p className="text-slate-400 text-sm mt-1">
              {hasFilters
                ? 'Prueba con otros criterios de búsqueda.'
                : 'Puedes crear la primera vacante con el botón “Nueva vacante”.'}
            </p>

          </div>
        )}

      {/* Tarjetas */}
      {!isLoading &&
        !isError &&
        vacancies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            {vacancies.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}

          </div>
        )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        title={
          editingVacancy
            ? `Editar: ${editingVacancy.puesto}`
            : 'Nueva vacante'
        }
        onClose={() => setModalOpen(false)}
      >

        <VacancyForm
          vacancy={editingVacancy}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
          error={submitError}
        />

      </Modal>

    </div>
  );
}

export default VacanciesPage;