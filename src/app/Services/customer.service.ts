import { Injectable } from '@angular/core';
import { ApiResponse } from '../Models/ApiResponse';
import { catchError, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Customer } from '../Models/Customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:5240/api/'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  createCustomers(customer: Customer): Observable<ApiResponse<Customer>> {
    debugger;
    return this.http.post<ApiResponse<Customer>>(
      `${this.apiUrl}Location/CreateLocation`,
      customer
    );
  }

  deleteCustomers(custCode: string): Observable<ApiResponse<any>> {
    return this.http
      .delete<ApiResponse<any>>(
        `${this.apiUrl}Location/DeleteLocation/?loca_Code=${custCode}`
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getCustomers(
    type: number = 0,
    isActive: boolean = true
  ): Observable<ApiResponse<Location[]>> {
    const params = new HttpParams()
      .set('type', type.toString())
      .set('isActive', isActive.toString());
    debugger;
    return this.http.get<ApiResponse<Location[]>>(
      `${this.apiUrl}Location/GetAllLocations`,
      { params }
    );
  }
}
