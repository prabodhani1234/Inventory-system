import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css',
})
export class ButtonsComponent {
  @Input() isSubmitting = false;
  @Input() isInvalid = false;

  @Output() delete = new EventEmitter<void>();
  @Output() clean = new EventEmitter<void>();

  onDelete() {
    this.delete.emit();
  }

  onClean() {
    this.clean.emit();
  }
}
