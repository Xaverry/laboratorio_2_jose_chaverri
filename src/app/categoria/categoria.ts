
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CategoriaInfo } from '../interfaces/categoria';
import { CategoriaService } from '../services/categoria';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-categoria',
  imports: [ReactiveFormsModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
})
export class Categoria {

  categoriaService: CategoriaService = inject(CategoriaService);
  authService: AuthService = inject(AuthService);

  categoriaList = signal<CategoriaInfo[]>([]);

  categoriaEditando = signal<number | null>(null);

  categoriaBuscada = signal<CategoriaInfo | null>(null);

  idBusqueda = new FormControl<number | null>(null);

  categoriaForm = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
  });

  constructor() {
    this.cargarCategorias();
  }

  // GET - Consultar todas las categorías
  async cargarCategorias() {
    const categorias = await this.categoriaService.getAllCategorias();
    this.categoriaList.set(categorias);
  }

  // PUT - Preparar edición de categoría
  editarCategoria(categoria: CategoriaInfo) {

    if (!this.authService.esAdmin()) {
      alert('No tiene permisos para editar categorías');
      return;
    }

    this.categoriaEditando.set(categoria.id);

    this.categoriaForm.patchValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    });
  }

  // POST / PUT - Crear o actualizar categoría
  async guardarCategoria() {

    if (!this.authService.esAdmin()) {
      alert('No tiene permisos para guardar categorías');
      return;
    }

    const nombre = this.categoriaForm.value.nombre?.trim() ?? '';
    const descripcion = this.categoriaForm.value.descripcion?.trim() ?? '';

    if (!nombre || !descripcion) {
      alert('Debe completar el nombre y la descripción');
      return;
    }

    try {

      const id = this.categoriaEditando();

      if (id !== null) {

        await this.categoriaService.updateCategoria(id, {
          nombre,
          descripcion,
        });

        alert('Categoría actualizada correctamente');

      } else {

        await this.categoriaService.createCategoria({
          nombre,
          descripcion,
        });

        alert('Categoría creada correctamente');

      }

      this.cancelarEdicion();
      await this.cargarCategorias();

    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('No se pudo guardar la categoría');
    }

  }

  // Cancelar edición
  cancelarEdicion() {
    this.categoriaEditando.set(null);
    this.categoriaForm.reset();
  }

  // DELETE - Eliminar categoría
  async eliminarCategoria(categoria: CategoriaInfo) {

    if (!this.authService.esAdmin()) {
      alert('No tiene permisos para eliminar categorías');
      return;
    }

    const confirmar = confirm(
      `¿Está seguro de eliminar la categoría "${categoria.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    try {

      await this.categoriaService.deleteCategoria(categoria.id);

      if (this.categoriaEditando() === categoria.id) {
        this.cancelarEdicion();
      }

      await this.cargarCategorias();

      alert('Categoría eliminada correctamente');

    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert('No se pudo eliminar la categoría');
    }

  }

  // GET - Buscar categoría por ID
  async buscarCategoria() {

    const id = this.idBusqueda.value;

    if (id === null || id <= 0 || !Number.isInteger(id)) {
      alert('Ingrese un ID válido');
      return;
    }

    this.categoriaBuscada.set(null);

    try {

      const categoria = await this.categoriaService.getCategoriaById(id);

      this.categoriaBuscada.set(categoria);

      if (categoria === null) {
        alert('No se encontró una categoría con ese ID');
      }

    } catch (error) {
      console.error('Error al buscar categoría:', error);
      alert('No se pudo consultar la categoría');
    }

  }

}
