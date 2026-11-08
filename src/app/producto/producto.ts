
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ProductoInfo } from '../interfaces/producto';
import { CategoriaInfo } from '../interfaces/categoria';

import { ProductoService } from '../services/producto';
import { CategoriaService } from '../services/categoria';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-producto',
  imports: [ReactiveFormsModule],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto {

  productoService: ProductoService = inject(ProductoService);
  categoriaService: CategoriaService = inject(CategoriaService);
  authService: AuthService = inject(AuthService);

  productoList = signal<ProductoInfo[]>([]);
  categoriaList = signal<CategoriaInfo[]>([]);

  productoEditando = signal<number | null>(null);

  productoForm = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    precio: new FormControl<number | null>(null),
    cantidadStock: new FormControl<number | null>(null),
    categoriaId: new FormControl<number | null>(null),
  });

  // Producto encontrado mediante búsqueda por ID
  productoBuscado = signal<ProductoInfo | null>(null);

  // Campo para ingresar el ID
  idBusqueda = new FormControl<number | null>(null);

  constructor() {
    this.cargarProductos();
    this.cargarCategorias();
  }

  // GET - Cargar productos
  async cargarProductos() {
    const productos = await this.productoService.getAllProductos();
    this.productoList.set(productos);
  }

  // GET - Cargar categorías para el selector
  async cargarCategorias() {
    const categorias = await this.categoriaService.getAllCategorias();
    this.categoriaList.set(categorias);
  }

  // PUT - Preparar edición de producto
  editarProducto(producto: ProductoInfo) {

    if (!this.authService.esAdmin()) {
      alert('No tiene permisos para editar productos');
      return;
    }

    this.productoEditando.set(producto.id);

    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      cantidadStock: producto.cantidadStock,
      categoriaId: producto.categoriaId,
    });

  }

  // Cancelar edición
  cancelarEdicion() {
    this.productoEditando.set(null);
    this.productoForm.reset();
  }

  // POST / PUT - Crear o actualizar producto
  async guardarProducto() {

    if (!this.authService.esAdmin()) {
      alert('No tiene permisos para guardar productos');
      return;
    }

    const nombre = this.productoForm.value.nombre?.trim() ?? '';
    const descripcion = this.productoForm.value.descripcion?.trim() ?? '';
    const precio = this.productoForm.value.precio;
    const cantidadStock = this.productoForm.value.cantidadStock;
    const categoriaId = this.productoForm.value.categoriaId;

    if (
      !nombre ||
      !descripcion ||
      precio === null ||
      precio === undefined ||
      cantidadStock === null ||
      cantidadStock === undefined ||
      categoriaId === null ||
      categoriaId === undefined
    ) {
      alert('Debe completar todos los campos');
      return;
    }

    if (
      !Number.isFinite(precio) ||
      precio < 0 ||
      !Number.isInteger(cantidadStock) ||
      cantidadStock < 0 ||
      !Number.isInteger(categoriaId) ||
      categoriaId <= 0
    ) {
      alert('Ingrese valores numéricos válidos');
      return;
    }

    const id = this.productoEditando();

    try {

      if (id !== null) {

        await this.productoService.updateProducto(id, {
          nombre,
          descripcion,
          precio,
          cantidadStock,
          categoriaId,
        });

        alert('Producto actualizado correctamente');

      } else {

        await this.productoService.createProducto({
          nombre,
          descripcion,
          precio,
          cantidadStock,
          categoriaId,
        });

        alert('Producto creado correctamente');

      }

      this.cancelarEdicion();
      await this.cargarProductos();

    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('No se pudo guardar el producto');
    }

  }

  // DELETE - Eliminar producto
  async eliminarProducto(producto: ProductoInfo) {

    if (!this.authService.esAdmin()) {
      alert('No tiene permisos para eliminar productos');
      return;
    }

    const confirmar = confirm(
      `¿Está seguro de eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    try {

      await this.productoService.deleteProducto(producto.id);

      // Si estamos editando ese producto, limpiamos el formulario
      if (this.productoEditando() === producto.id) {
        this.cancelarEdicion();
      }

      // Actualizamos el listado
      await this.cargarProductos();

      alert('Producto eliminado correctamente');

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('No se pudo eliminar el producto');
    }

  }

  // GET - Buscar producto por ID
  async buscarProducto() {

    const id = this.idBusqueda.value;

    if (id === null || id <= 0 || !Number.isInteger(id)) {
      alert('Ingrese un ID válido');
      return;
    }

    // Limpiamos el resultado anterior
    this.productoBuscado.set(null);

    try {

      const producto = await this.productoService.getProductoById(id);

      this.productoBuscado.set(producto);

      if (producto === null) {
        alert('No se encontró un producto con ese ID');
      }

    } catch (error) {
      console.error('Error al buscar producto:', error);
      alert('No se pudo consultar el producto');
    }

  }

}
