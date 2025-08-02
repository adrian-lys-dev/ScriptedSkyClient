import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Avatar } from '../../../../shared/models/user/avatar';

@Component({
  selector: 'app-avatar-selector',
  imports: [CommonModule],
  templateUrl: './avatar-selector.component.html',
  styleUrl: './avatar-selector.component.scss'
})
export class AvatarSelectorComponent {
  @Input() availableAvatars: Avatar[] = [];
  @Output() avatarSelected = new EventEmitter<Avatar>();
  @Output() close = new EventEmitter<void>();

  selectAvatar(avatar: Avatar) {
    this.avatarSelected.emit(avatar);
  }

  closeModal() {
    this.close.emit();
  }

}
