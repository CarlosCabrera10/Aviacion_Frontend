export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol: string;
  activo: boolean;
  contrasena: string;
}
