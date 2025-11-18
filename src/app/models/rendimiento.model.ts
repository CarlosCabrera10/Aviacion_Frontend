export interface Rendimiento {
  idRendimiento?: number;
  idVuelo: number;

  puntajeGeneral?: number;
  tecnicaAterrizaje?: number;
  maniobras?: number;
  comunicacionRadio?: number;
  seguimientoInstrucciones?: number;
  puntualidad?: number;
  comportamiento?: number;

  comentarios?: string;
  fecha?: string;
}
