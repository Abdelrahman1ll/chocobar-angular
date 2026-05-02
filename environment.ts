/*
 * =========================================================================
 * CHANGE LOG: environment.ts
 * =========================================================================
 * WHY: This file was created to fix the "Could not resolve '../../../environment'" 
 * error that was causing the build to fail. It provides the base API URL 
 * required by the application's services.
 * لماذا: تم إنشاء هذا الملف لإصلاح خطأ "Could not resolve '../../../environment'" 
 * الذي كان يسبب فشل البناء. وهو يوفر رابط الـ API الأساسي الذي تتطلبه خدمات التطبيق.
 * -------------------------------------------------------------------------
 * OLD CODE: None (New file created to resolve build failure)
 * =========================================================================
 */
export const environment = {
  production: false,
  API: 'http://localhost:3000'
};
