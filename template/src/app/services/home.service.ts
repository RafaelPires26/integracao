import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HomeService {

  private apiClientes = `http://localhost:3000/clientes`
  private apiEstados  = `http://localhost:3000/estados`
  private apiCep      = `https://viacep.com.br/ws/`

  
  constructor (private client: HttpClient) { }

  getCliente(id: any) {
      return this.client.get(this.apiClientes + '/' + id);
  }

  getEstados() {
    return this.client.get(this.apiEstados);
  }

  getClienteAll() {
    return this.client.get(this.apiClientes);
  }

  getCep(data: string) {
    return this.client.get(this.apiCep + data + '/json/');
  }

  salvarCliente(obj: any) {
      return this.client.post(this.apiClientes, obj);
  }

  atualizarCliente(obj: any) {
      return this.client.put(this.apiClientes + '/' + obj.id, obj);
  }

  removerCliente(obj: any) {
    return this.client.delete(this.apiClientes + '/' + obj);
}

}
