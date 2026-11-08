
import { Injectable } from '@angular/core';
import { ProductoInfo } from '../interfaces/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  url = 'http://localhost:8080/api/v1/producto/';

  // GET - Listar todos los productos
  async getAllProductos(): Promise<ProductoInfo[]> {
    const response = await fetch(this.url);

    if (!response.ok) {
      throw new Error('No se pudieron obtener los productos');
    }

    return (await response.json()) ?? [];
  }

  // POST - Crear producto
  async createProducto(
    producto: Omit<ProductoInfo, 'id'>
  ): Promise<ProductoInfo> {

    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      throw new Error('No se pudo crear el producto');
    }

    return await response.json();
  }

  // PUT - Actualizar producto
  async updateProducto(
    id: number,
    producto: Omit<ProductoInfo, 'id'>
  ): Promise<ProductoInfo> {

    const response = await fetch(`${this.url}${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      throw new Error('No se pudo actualizar el producto');
    }

    return await response.json();
  }

  // DELETE - Eliminar producto
  async deleteProducto(id: number): Promise<void> {

    const response = await fetch(`${this.url}${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('No se pudo eliminar el producto');
    }
  }


  // GET - Buscar producto por ID
  async getProductoById(id: number): Promise<ProductoInfo | null> {

    const response = await fetch(`${this.url}${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('No se pudo consultar el producto');
    }

    return await response.json();
  }



}
