import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl } from '@angular/forms';

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent implements ControlValueAccessor, OnInit  {

  @Input() placeholder = 'Upload an image';
  @Input() initialImageUrl: string | null = null;

  file: File | null = null;
  previewUrl: string | null = null;

  private onChange: any = () => { };
  private onTouched: any = () => { };

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    if (!this.file && this.initialImageUrl) {
      this.previewUrl = this.initialImageUrl;
    }
  }

  get control(): FormControl {
    return this.controlDir.control as FormControl;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.file = input.files[0];
    this.onChange(this.file);
    this.onTouched();

    if (this.file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.file);
    } else {
      this.previewUrl = null;
    }

    input.value = '';
  }


  removeFile(event: Event) {
    event.stopPropagation();
    this.file = null;
    this.previewUrl = this.initialImageUrl;
    this.onChange(null);
    this.onTouched();
  }


  writeValue(obj: any): void {
    this.file = obj;
    if (obj instanceof File) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(obj);
    } else {
      this.previewUrl = null;
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

}
