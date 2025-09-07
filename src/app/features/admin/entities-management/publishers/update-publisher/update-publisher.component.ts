import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Publisher } from '../../../../../shared/models/publisher';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-update-publisher',
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './update-publisher.component.html',
  styleUrl: './update-publisher.component.scss'
})
export class UpdatePublisherComponent implements OnInit {
  
  @Input() publisher?: Publisher;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ name: string; publisherId: number }>();

  private fb = inject(FormBuilder);

  publisherForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    if (this.publisher) {
      this.publisherForm.patchValue({
        name: this.publisher.name,
      });
    }
  }

  submitPublisher(): void {
    if (this.publisherForm.valid) {
      const updatedData = {
        name: this.publisherForm.get('name')?.value ?? '',
        publisherId: this.publisher?.id ?? 0
      };
      this.onCancel();
      this.saved.emit(updatedData);
    }
  }

  isUnchanged(): boolean {
    const currentName = this.publisherForm.get('name')?.value ?? '';
    return this.publisher?.name === currentName;
  }

  onCancel(): void {
    this.close.emit();
  }

  get nameLength(): number {
    return this.publisherForm.get('name')?.value?.length ?? 0;
  }
}
