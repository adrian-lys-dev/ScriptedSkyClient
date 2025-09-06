import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Genre } from '../../../../../shared/models/genre';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-update-genre',
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './update-genre.component.html',
  styleUrl: './update-genre.component.scss'
})
export class UpdateGenreComponent implements OnInit {

  @Input() genre?: Genre;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ name: string; genreId: number }>();

  private fb = inject(FormBuilder);

  genreForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    if (this.genre) {
      this.genreForm.patchValue({
        name: this.genre.name,
      });
    }
  }

  submitGenre(): void {
    if (this.genreForm.valid) {
      const updatedData = {
        name: this.genreForm.get('name')?.value ?? '',
        genreId: this.genre?.id ?? 0
      };
      this.onCancel();
      this.saved.emit(updatedData);
    }
  }

  isUnchanged(): boolean {
    const currentName = this.genreForm.get('name')?.value ?? '';
    return this.genre?.name === currentName;
  }

  onCancel(): void {
    this.close.emit();
  }

  get nameLength(): number {
    return this.genreForm.get('name')?.value?.length ?? 0;
  }
}