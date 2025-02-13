import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiResponse } from '../Models/Category';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject = new BehaviorSubject<ApiResponse<any> | null>(null);
  alert$ = this.alertSubject.asObservable();

  showAlert(response: ApiResponse<any>, duration: number = 5000): void {
    this.alertSubject.next(response);
    
    setTimeout(() => {
      this.hideAlert();
    }, duration);
  }

  hideAlert(): void {
    this.alertSubject.next(null);
  }
}
