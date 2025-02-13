import { Component } from '@angular/core';
import { ConformationService } from '../../Services/conformation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  constructor(public confirmationService: ConformationService) {}
}
