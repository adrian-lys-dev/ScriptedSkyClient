import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Review } from '../../../../shared/models/review/review';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-review',
  imports: [CommonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-review.component.html',
  styleUrl: './edit-review.component.scss'
})
export class EditReviewComponent implements OnInit {

  @Input() review?: Review;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ rating: number; reviewText: string }>();

  private fb = inject(FormBuilder);

  rating = 0;
  hoverRating = 0;

  reviewForm = this.fb.group({
    review: ['', [Validators.required, Validators.maxLength(800)]],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  ngOnInit(): void {
    if (this.review) {
      this.reviewForm.patchValue({
        review: this.review.reviewText,
        rating: this.review.rating
      });
      this.rating = this.review.rating;
    }
  }

  setRating(value: number): void {
    this.rating = value;
    this.reviewForm.patchValue({ rating: value });
  }

  setHover(value: number): void {
    this.hoverRating = value;
  }

  clearHover(): void {
    this.hoverRating = 0;
  }

  SubmitUpdatedReview(): void {
    if (this.reviewForm.valid) {
      const updatedData = {
        rating: this.reviewForm.get('rating')?.value ?? 0,
        reviewText: this.reviewForm.get('review')?.value ?? '',
        reviewId: this.review?.id
      };
      this.onCancel();
      this.saved.emit(updatedData);
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  isUnchanged(): boolean {
    if (!this.review) {
      return true;
    }

    const currentReview = this.reviewForm.get('review')?.value;
    const currentRating = this.reviewForm.get('rating')?.value;

    return currentReview === this.review.reviewText && currentRating === this.review.rating;
  }

  get reviewLength(): number {
    return this.reviewForm.get('review')?.value?.length ?? 0;
  }
}
