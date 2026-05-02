import products from './products.json';
import chocolates from './chocolates.json';
import addOns from './add-ons.json';
import basket from './basket.json';
import users from './users.json';
import adminLogin from './admin-login.json';
import orders from './orders.json';
import delivery from './delivery.json';
import dashboard from './dashboard.json';
import clients from './clients.json';

export const MOCK_DATA: Record<string, any> = {
  '/projects': products,
  '/type-of-chocolate': chocolates,
  '/add-ons': addOns,
  '/basket': basket,
  '/auth': clients, // This serves the clients list for admin
  '/auth/admin-login': adminLogin,
  '/auth/send-code': { status: 'success', message: 'Code sent' },
  '/auth/verify-code': adminLogin,
  '/orders': orders,
  '/delivery-price': delivery,
  '/statistics': dashboard,
  '/pdf': { message: 'PDF generated successfully' }
};
