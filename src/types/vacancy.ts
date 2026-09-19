export interface Vacancy {
  id: number;
  puesto: string;
  departamento: string;
  modalidad: 'presencial' | 'remoto' | 'hibrido';
  salario: number;
  fechaPublicacion: string;
  estado: 'abierta' | 'cerrada';
  candidatos: number;
}