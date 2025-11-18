import { Avioneta } from './avioneta.model'; // Ajusta la ruta según tu proyecto

export interface Mantenimiento {
  idMantenimiento?: number;
  avioneta?: Avioneta;  // <-- referencia a la otra tabla
  descripcion: string;
  tipo: string;
  estado: 'En_proceso' | 'Finalizado' | 'Pausado';
  notas?: string;
  fechaInicio: string; // ISO string
  fechaFin?: string;
}
