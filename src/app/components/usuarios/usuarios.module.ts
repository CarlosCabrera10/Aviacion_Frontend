import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosListComponent } from './usuarios-list.component';
import { UsuariosFormComponent } from './usuarios-form.component';

@NgModule({
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    UsuariosListComponent,
    UsuariosFormComponent // ✅ Se importan, no se declaran
  ]
})
export class UsuariosModule {}
