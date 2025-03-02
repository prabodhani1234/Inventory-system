import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubCategory } from '../Models/SubCategory';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../Models/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private apiUrl = 'http://localhost:5240/api/'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  createSubCategory(
    subCategory: SubCategory
  ): Observable<ApiResponse<SubCategory>> {
    debugger;
    return this.http.post<ApiResponse<SubCategory>>(
      `${this.apiUrl}SubCategory/CreateSubCategory`,
      subCategory
    );
  }

  deleteCategories(
    catCode: string,
    SubCatCode: string
  ): Observable<ApiResponse<any>> {
    return this.http
      .delete<ApiResponse<any>>(
        `${this.apiUrl}Category/DeleteCategory/?cat_Code=${catCode}&subCat_Code=${SubCatCode}`
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  getSubCategories(
    type: number = 0,
    isActive: boolean = true,
    catCode: string
  ): Observable<ApiResponse<SubCategory[]>> {
    const params = new HttpParams()
      .set('type', type.toString())
      .set('isActive', isActive.toString())
      .set('cat_Code', catCode);
    debugger;
    return this.http.get<ApiResponse<SubCategory[]>>(
      `${this.apiUrl}SubCategory/GetAllSubCategories`,
      { params }
    );
  }
}
