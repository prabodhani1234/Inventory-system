import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmationDialog {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConformationService {

  private confirmationSubject = new BehaviorSubject<ConfirmationDialog | null>(null);
  confirmation$ = this.confirmationSubject.asObservable();
  
  private resolveCallback!: (value: boolean) => void;

  show(options: ConfirmationDialog): Promise<boolean> {
    this.confirmationSubject.next(options);
    
    return new Promise((resolve) => {
      this.resolveCallback = resolve;
    });
  }

  respond(response: boolean) {
    this.resolveCallback(response);
    this.confirmationSubject.next(null);
  }
}
