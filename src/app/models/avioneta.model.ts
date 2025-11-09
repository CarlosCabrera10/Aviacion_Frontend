export interface Avioneta {
  idAvioneta?: number;
  codigo: string;
  modelo: string;
  horasVuelo?: number;
  estado?: 'Activo' | 'Mantenimiento';
}
