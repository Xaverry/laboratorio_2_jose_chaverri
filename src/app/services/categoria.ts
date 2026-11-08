import { Injectable } from '@angular/core';
import { CategoriaInfo } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {

  url = 'http://localhost:8080/api/v1/categoria/';

  async getAllCategorias(): Promise<CategoriaInfo[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  async createCategoria(categoria: Omit<CategoriaInfo, 'id'>): Promise<CategoriaInfo> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoria),
    });

    if (!response.ok) {
      throw new Error('No se pudo crear la categoría');
    }

    return await response.json();
  }

  
  async updateCategoria(
    id: number,
    categoria: Omit<CategoriaInfo, 'id'>
  ): Promise<CategoriaInfo> {

    const response = await fetch(`${this.url}${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoria),
    });

    if (!response.ok) {
      throw new Error('No se pudo actualizar la categoría');
    }

    return await response.json();
  }

  
  async deleteCategoria(id: number): Promise<void> {

    const response = await fetch(`${this.url}${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('No se pudo eliminar la categoría');
    }

  }

  
  async getCategoriaById(id: number): Promise<CategoriaInfo | null> {

    const response = await fetch(`${this.url}${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('No se pudo consultar la categoría');
    }

    return await response.json();
  }

}