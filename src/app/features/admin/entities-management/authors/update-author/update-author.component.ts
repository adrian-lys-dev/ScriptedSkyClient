import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Author } from '../../../../../shared/models/author';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-update-author',
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './update-author.component.html',
  styleUrl: './update-author.component.scss'
})
export class UpdateAuthorComponent implements OnInit {
  
  @Input() author?: Author;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ name: string; authorId: number }>();

  private fb = inject(FormBuilder);

  authorForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    if (this.author) {
      this.authorForm.patchValue({
        name: this.author.name,
      });
    }
  }

  submitAuthor(): void {
    if (this.authorForm.valid) {
      const updatedData = {
        name: this.authorForm.get('name')?.value ?? '',
        authorId: this.author?.id ?? 0
      };
      this.onCancel();
      this.saved.emit(updatedData);
    }
  }

  isUnchanged(): boolean {
    const currentName = this.authorForm.get('name')?.value ?? '';
    return this.author?.name === currentName;
  }

  onCancel(): void {
    this.close.emit();
  }

  get nameLength(): number {
    return this.authorForm.get('name')?.value?.length ?? 0;
  }
}
