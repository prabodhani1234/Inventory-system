import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, Category } from '../Models/Category';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:5240/api/'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}Category/CreateCategory`, category);
  }


  // getCategories(): Observable<Category[]> {
  //   return this.http.get<Category[]>(`${this.apiUrl}Category/CreateCategory`);
  // }

  // deleteCategories(catCode: string): Observable<void> {
  //   debugger;
  //   // Using template literals to create the URL with the catCode
  //   return this.http.delete<void>(`${this.apiUrl}Category/DeleteCategory/?cat_Code=${catCode}`);
  // }
  deleteCategories(catCode: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}Category/DeleteCategory/?cat_Code=${catCode}`
    ).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
  
  // deleteCategories(cat_Code: any): Observable<void> {
  //   debugger;
  //   return this.http.delete<void>(`${this.apiUrl}Category/DeleteCategory/?cat_Code=${cat_Code}`);
  // }

  getCategories(type: number = 0, isActive: boolean = true): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams()
      .set('type', type.toString())
      .set('isActive', isActive.toString());
    
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}Category/GetAllCategories`, { params });
  }
  
}
