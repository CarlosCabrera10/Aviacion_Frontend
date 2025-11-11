export interface Vuelo {
  idVuelo?: number;
  idAlumno: number;
  idTutor: number;
  idAvioneta: number;
  fecha: string; // yyyy-MM-dd
  hora: string;  // HH:mm
  estado?: 'Programado' | 'Completado' | 'Cancelado';
  observacion?: string;

  // Campos adicionales para mostrar en lista
  nombreAlumno?: string;
  nombreTutor?: string;
  codigoAvioneta?: string;
}
