export interface Vuelo {
  idVuelo?: number;
  idAlumno: number;
  idTutor: number;
  idAvioneta: number;
  fecha: string;        // yyyy-MM-dd
  horaBloque?: string;  // Bloque seleccionado en el front (8-10, 10-12, etc.)
  horaInicio?: string;  // HH:mm
  horaFin?: string;     // HH:mm
  idEspacioVuelo?: number;
  estado?: 'Programado' | 'Completado' | 'Cancelado';
  observacion?: string;
  hora: number;       // Duración en horas
  nombreEspacio?: string;
  // Campos adicionales para mostrar en lista
  nombreAlumno?: string;
  nombreTutor?: string;
  codigoAvioneta?: string;
}