import { Routes } from '@angular/router';
import { AdminGuard } from './Admin/admin.guard';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent() {
      return import('./home/home.component').then((m) => m.HomeComponent);
    },
  },
  {
    path: 'montage',
    loadComponent() {
      return import('./montage/montage.component').then(
        (m) => m.MontageComponent
      );
    },
  },
  {
    path: 'basket',
    loadComponent() {
      return import('./basket/basket.component').then((m) => m.BasketComponent);
    },
  },
  {
    path: 'add-montage',
    canActivate: [AdminGuard],
    loadComponent() {
      return import('./Admin/add-montage/add-montage.component').then(
        (m) => m.AddMontageComponent
      );
    },
  },
  {
    path: 'all-orders',
    canActivate: [AdminGuard],
    loadComponent() {
      return import('./Admin/all-orders/all-orders.component').then(
        (m) => m.AllOrdersComponent
      );
    },
  },
  {
    path: 'clients',
    canActivate: [AdminGuard],
    loadComponent() {
      return import('./Admin/clients/clients.component').then(
        (m) => m.ClientsComponent
      );
    },
  },
  {
    path: 'delivery',
    canActivate: [AdminGuard],
    loadComponent() {
      return import('./Admin/delivery/delivery.component').then(
        (m) => m.DeliveryComponent
      );
    },
  },
  {
    path: 'payment-page',
    loadComponent() {
      return import('./payment-page/payment-page.component').then(
        (m) => m.PaymentPageComponent
      );
    },
  },
  {
    path: 'order-success',
    loadComponent() {
      return import('./order-success/order-success.component').then(
        (m) => m.OrderSuccessComponent
      );
    },
  },
  {
    path: 'order-statistics',
    loadComponent() {
      return import('./order-statistics/order-statistics.component').then(
        (m) => m.OrderStatisticsComponent
      );
    },
  },
  {
    path: '**',
    loadComponent() {
      return import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      );
    },
  },
];
