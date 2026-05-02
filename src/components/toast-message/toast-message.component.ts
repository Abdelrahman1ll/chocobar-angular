// ✅ toast-message.component.ts
import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toast-message',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.css',
})
export class ToastMessageComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' = 'success';
  @Input() duration: number = 3000;
  @Output() closed = new EventEmitter<void>();
  ngOnInit() {
    setTimeout(() => {
      this.closed.emit();
    }, this.duration);
  }
}
