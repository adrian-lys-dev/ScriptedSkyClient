import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-add-genre',
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './add-genre.component.html',
  styleUrl: './add-genre.component.scss'
})
export class AddGenreComponent {

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ name: string }>();

  private fb = inject(FormBuilder);

  genreForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  submitGenre(): void {
    if (!this.genreForm.valid) return;

    this.saved.emit({
      name: this.genreForm.value.name ?? ''
    });
    this.onCancel();
  }

  onCancel(): void {
    this.close.emit();
  }

  get nameLength(): number {
    return this.genreForm.get('name')?.value?.length ?? 0;
  }

}
