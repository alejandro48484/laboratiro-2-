import { z } from 'zod';

export const vacancySchema = z.object({
  puesto: z
    .string()
    .min(3, 'El puesto debe tener al menos 3 caracteres'),

  departamento: z
    .string()
    .min(2, 'Selecciona un departamento'),

  modalidad: z.enum(['presencial', 'remoto', 'hibrido'], {
    message: 'Selecciona una modalidad válida',
  }),

  salario: z
    .coerce
    .number()
    .min(1, 'El salario debe ser mayor a 0'),

  fechaPublicacion: z
    .string()
    .min(1, 'La fecha de publicación es obligatoria'),

  estado: z.enum(['abierta', 'cerrada'], {
    message: 'Selecciona un estado válido',
  }),

  candidatos: z
    .coerce
    .number()
    .int('Debe ser un número entero')
    .min(0, 'Los candidatos no pueden ser negativos'),
});

export type VacancyFormValues = z.infer<typeof vacancySchema>;