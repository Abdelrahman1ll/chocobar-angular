import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { LoginService } from './login.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, NgClass, ToastMessageComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService],
})
export class LoginComponent {
  loadingLogin = false;
  loadingVerify = false;

  userform: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
  });

  codeControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);
  showCodeInput = false;
  submitted = false;
  toastType: 'success' | 'error' | 'warning' = 'success';
  toastMessage = '';
  showToast = false;
  @Output() close = new EventEmitter<void>();

  constructor(@Inject(LoginService) private loginService: LoginService) {}

  closeModal() {
    this.close.emit();
  }

  login() {
    this.submitted = true;

    if (this.userform.invalid) return;

    const { name, phone } = this.userform.value;
    localStorage.setItem('login_phone', phone);
    this.loadingLogin = true;
    this.loginService.loginCode(name!, phone!).subscribe({
      next: () => {
        this.showCodeInput = true;

        // تعطيل الحقول بدون التأثير على حالة الفورم
        this.userform.get('name')?.disable();
        this.userform.get('phone')?.disable();

        this.submitted = false;
        this.loadingLogin = false;
        this.toastType = 'success';
        this.toastMessage = 'تم تسجيل الدخول بنجاح';
        this.showToast = true;
      },
      error: (err) => {
        this.loadingLogin = false;
        this.toastType = 'error';
        this.toastMessage = 'فشل تسجيل الدخول';
        this.showToast = true;
      },
    });
  }

  verifyCode() {
    this.submitted = true;

    if (this.codeControl.invalid) return;

    const phone = localStorage.getItem('login_phone');
    const otp = this.codeControl.value;

    if (!phone || !otp) return;
    this.loadingVerify = true;
    this.loginService.verifyCode(phone, otp).subscribe({
      next: (response: any) => {
        const user = response.existingUser || response.user;
        const token = response.accessToken;
        const newToken = response.refreshToken;
        if (!user || !token) {
          this.toastType = 'error';
          this.toastMessage = 'فشل تسجيل الدخول';
          this.showToast = true;
          return;
        }
        
        document.cookie = `accessToken=${token}; path=/; max-age=3600; SameSite=Lax`;

        const days180 = 180 * 24 * 60 * 60;

        document.cookie = `refreshToken=${newToken}; path=/; max-age=${days180}; SameSite=Lax`;
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(user)
        )}; path=/; max-age=${days180}; SameSite=Lax`;

        this.userform.reset();
        this.codeControl.reset();
        localStorage.removeItem('login_phone');
        this.loadingVerify = false;
        this.submitted = false;
        this.toastType = 'success';
        this.toastMessage = 'تم التحقق من الكود بنجاح';
        this.showToast = true;
        setTimeout(() => {
          this.closeModal();
          window.location.reload();
        }, 1000);
      },
      error: () => {
        this.loadingVerify = false;
        this.toastType = 'error';
        this.toastMessage = 'فشل التحقق من الكود';
        this.showToast = true;
      },
    });
  }
}
