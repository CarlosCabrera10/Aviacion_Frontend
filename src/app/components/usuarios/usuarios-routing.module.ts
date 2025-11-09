import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosListComponent } from './usuarios-list.component';
import { UsuariosFormComponent } from './usuarios-form.component';

const routes: Routes = [
  { path: '', component: UsuariosListComponent },
  { path: 'nuevo', component: UsuariosFormComponent },
  { path: 'editar/:id', component: UsuariosFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
