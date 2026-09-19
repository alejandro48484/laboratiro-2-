import type { Vacancy } from '../types/vacancy';

interface VacancyCardProps {
  vacancy: Vacancy;
  onEdit: (vacancy: Vacancy) => void;
  onDelete: (id: number) => void;
}

export default function VacancyCard({
  vacancy,
  onEdit,
  onDelete,
}: VacancyCardProps) {
  const salario = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    maximumFractionDigits: 0,
  }).format(vacancy.salario);

  const fecha = new Date(
    `${vacancy.fechaPublicacion}T00:00:00`
  ).toLocaleDateString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const modalidadTexto = {
    presencial: 'Presencial',
    remoto: 'Remoto',
    hibrido: 'Híbrido',
  };

  const esAbierta = vacancy.estado === 'abierta';

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 truncate">
            {vacancy.puesto}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {vacancy.departamento}
          </p>
        </div>

        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
            esAbierta
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {esAbierta ? 'Abierta' : 'Cerrada'}
        </span>
      </div>

      {/* Información */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Modalidad
          </span>

          <span className="font-medium text-slate-700">
            {modalidadTexto[vacancy.modalidad]}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Salario
          </span>

          <span className="font-semibold text-slate-900">
            {salario}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Candidatos
          </span>

          <span className="font-medium text-slate-700">
            {vacancy.candidatos}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Publicada
          </span>

          <span className="text-slate-700">
            {fecha}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(vacancy)}
          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => onDelete(vacancy.id)}
          className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}