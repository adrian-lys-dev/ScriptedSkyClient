import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-add-publisher',
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './add-publisher.component.html',
  styleUrl: './add-publisher.component.scss'
})
export class AddPublisherComponent {
  
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ name: string }>();

  private fb = inject(FormBuilder);

  publisherForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  submitPublisher(): void {
    if (!this.publisherForm.valid) return;

    this.saved.emit({
      name: this.publisherForm.value.name ?? ''
    });
    this.onCancel();
  }

  onCancel(): void {
    this.close.emit();
  }

  get nameLength(): number {
    return this.publisherForm.get('name')?.value?.length ?? 0;
  }
}
