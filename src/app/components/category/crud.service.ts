import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(
    private readonly http: HttpClient,
    @Inject(Injector) private injector: Injector
  ) {}
  url: string = `http://localhost:3000/api/v2/`;

  getAll(resource: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}${resource}?ambiente=1`);
  }
  getById(id: string, resource: string): Observable<any> {
    return this.http.get<any>(`${this.url}${resource}/${id}?ambiente=1`);
  }
  update(id: string, payload: any, resource: string): Observable<any> {
    return this.http.patch<any>(
      `${this.url}${resource}/${id}?ambiente=1`,
      payload
    );
  }
  create(payload: any, resource: string): Observable<any> {
    payload.ambienteId = 1;
    return this.http.post<any>(`${this.url}${resource}?ambiente=1`, payload);
  }
  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }
  showMessage(msg: string, isError: boolean = false): void {
    isError
      ? this.toastrService.error(`${msg}`, 'Operação não efetuada.')
      : this.toastrService.info(`${msg}`, 'Operação efetuada com sucesso.');
  }
}
