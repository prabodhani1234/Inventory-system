import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ApiResponse } from '../Models/ApiResponse';
import { Location } from '../Models/Location';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

   private apiUrl = 'http://localhost:5240/api/'; // Replace with your actual API endpoint
  
    constructor(private http: HttpClient) {}
  
    createLocation(location: Location): Observable<ApiResponse<Location>> {
      debugger;
      return this.http.post<ApiResponse<Location>>(`${this.apiUrl}Location/CreateLocation`, location);
    }

    deleteLocations(locaCode: string): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(
          `${this.apiUrl}Location/DeleteLocation/?loca_Code=${locaCode}`
        ).pipe(
          catchError((error) => {
            throw error;
          })
        );
      }

      getLocations(type: number = 0, isActive: boolean = true): Observable<ApiResponse<Location[]>> {
          const params = new HttpParams()
            .set('type', type.toString())
            .set('isActive', isActive.toString());
          debugger;
          return this.http.get<ApiResponse<Location[]>>(`${this.apiUrl}Location/GetAllLocations`, { params });
        }
        
}
