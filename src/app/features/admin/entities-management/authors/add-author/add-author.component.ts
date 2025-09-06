import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-add-author',
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './add-author.component.html',
  styleUrl: './add-author.component.scss'
})
export class AddAuthorComponent {

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ name: string }>();

  private fb = inject(FormBuilder);

  authorForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  submitAuthor(): void {
    if (!this.authorForm.valid) return;

    this.saved.emit({
      name: this.authorForm.value.name ?? ''
    });
    this.onCancel();
  }

  onCancel(): void {
    this.close.emit();
  }

  get nameLength(): number {
    return this.authorForm.get('name')?.value?.length ?? 0;
  }

}
