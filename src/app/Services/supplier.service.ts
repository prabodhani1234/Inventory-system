import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../Models/ApiResponse';
import { Supplier } from '../Models/Supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = 'http://localhost:5240/api/'; // Replace with your actual API endpoint
    
      constructor(private http: HttpClient) {}
    
      createSupplier(supplier: Supplier): Observable<ApiResponse<Supplier>> {
        debugger;
        return this.http.post<ApiResponse<Supplier>>(`${this.apiUrl}Location/CreateLocation`, supplier);
      }
  
      deleteSuppliers(suppCode: string): Observable<ApiResponse<any>> {
          return this.http.delete<ApiResponse<any>>(
            `${this.apiUrl}Location/DeleteLocation/?loca_Code=${suppCode}`
          ).pipe(
            catchError((error) => {
              throw error;
            })
          );
        }
  
        getSuppliers(type: number = 0, isActive: boolean = true): Observable<ApiResponse<Location[]>> {
            const params = new HttpParams()
              .set('type', type.toString())
              .set('isActive', isActive.toString());
            debugger;
            return this.http.get<ApiResponse<Location[]>>(`${this.apiUrl}Location/GetAllLocations`, { params });
          }
}
