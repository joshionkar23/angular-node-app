import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
	{
		path: 'auth',
		canActivate: [guestGuard],
		loadComponent: () => import('./features/auth/auth.page').then((m) => m.AuthPageComponent)
	},
	{
		path: 'dashboard',
		canActivate: [authGuard],
		loadComponent: () =>
			import('./features/dashboard/dashboard.page').then((m) => m.DashboardPageComponent)
	},
	{
		path: 'cart',
		canActivate: [authGuard],
		loadComponent: () => import('./features/cart/cart.page').then((m) => m.CartPageComponent)
	},
	{
		path: 'checkout',
		canActivate: [authGuard],
		loadComponent: () => import('./features/checkout/checkout.page').then((m) => m.CheckoutPageComponent)
	},
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
	{ path: '**', redirectTo: 'dashboard' }
];
