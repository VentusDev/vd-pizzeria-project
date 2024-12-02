import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import React, { useEffect, useState } from 'react';
import { pagesLinks, authList } from './utils/variables.jsx';
import { replacePolishLetters } from './utils/functions.js';

import Home from '@/pages/PublicPages/Home/Home';
import Cart from '@/pages/PublicPages/Cart/Cart';
import PlaceOrder from '@/pages/PublicPages/PlaceOrder/PlaceOrder';
import MyOrders from '@/pages/PublicPages/MyOrders/MyOrders';
import SignUpPage from './pages/LoginPages/SignUpPage';

import LoginPage from './pages/LoginPages/LoginPage';
import ForgotPasswordPage from './pages/LoginPages/ForgotPasswordPage';
import EmailVerificationPage from './pages/LoginPages/EmailVerificationPage';
import ResetPasswordPage from './pages/LoginPages/ResetPasswordPage';

import DashboardPage from './pages/AuthPages/DashboardPage/DashboardPage.jsx';

import ListPage from '@/pages/AuthPages/ListPage/ListPage';

import AddPage from '@/pages/AuthPages/AddPage/AddPage';
import OrdersPage from '@/pages/AuthPages/OrdersPage/OrdersPage';
import NotAdminPage from '@/pages/NotAdminPage';

import ScrollToTop from './components/ScrollTop/ScrollTop';
import { Toaster } from 'react-hot-toast';

import 'react-loading-skeleton/dist/skeleton.css';
import ClientLayout from './layouts/ClientLaytous';
import PanelLayout from './layouts/PanelLayout';
import Loader from './components/Loader/Loader';

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, []);
	return (
		<>
			{isAuthenticated && user.isVerified && user.isAdmin ? (
				<div className='FIAnim adminBox'>{children}</div>
			) : (
				<NotAdminPage />
			)}
		</>
	);
};

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (user && !user.isVerified) {
		return <Navigate to={pagesLinks.verifyEmail} replace />;
	}
	if (user?.isAdmin) {
		return <Navigate to='/panel' replace />;
	}
	if (isAuthenticated && user?.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
	const { checkAuth, user, isCheckingAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	const [rabat, setRabat] = useState(0);

	useEffect(() => {
		if (user?.rabat?.rabatValue) {
			setRabat(user.rabat.rabatValue);
		} else {
			setRabat(0); 
		}
	}, [user]);

	//if (isCheckingAuth) return <Loader />

	return (
		<>
			<Routes>
				<Route element={<ClientLayout />}>
					<Route path='/' element={<Home />} />
				</Route>

				<Route element={<ClientLayout />}>
					<Route
						path={`/${pagesLinks.cart}`}
						element={<Cart setRabat={setRabat} rabat={rabat} />}
					/>
				</Route>

				<Route element={<ClientLayout />}>
					<Route
						path={`/${pagesLinks.order}`}
						element={<PlaceOrder rabat={rabat} />}
					/>
				</Route>

				<Route element={<ClientLayout />}>
					<Route path={`/${pagesLinks.myorders}`} element={<MyOrders />} />
				</Route>

				<Route element={<ClientLayout />}>
					<Route path='/not-admin' element={<NotAdminPage />} />
				</Route>

				<Route element={<PanelLayout />}>
					<Route
						path='/panel'
						element={
							<ProtectedRoute>
								<DashboardPage />
							</ProtectedRoute>
						}
					/>
				</Route>

				<Route element={<PanelLayout />}>
					<Route
						path={replacePolishLetters(authList.add)}
						element={
							<ProtectedRoute>
								<AddPage />
							</ProtectedRoute>
						}
					/>
				</Route>

				<Route element={<PanelLayout />}>
					<Route
						path={replacePolishLetters(authList.list)}
						element={
							<ProtectedRoute>
								<ListPage />
							</ProtectedRoute>
						}
					/>
				</Route>
				<Route element={<PanelLayout />}>
					<Route
						path={replacePolishLetters(authList.orders)}
						element={
							<ProtectedRoute>
								<OrdersPage />
							</ProtectedRoute>
						}
					/>
				</Route>

				<Route element={<ClientLayout />}>
					{' '}
					<Route
						path={pagesLinks.signup}
						element={
							<RedirectAuthenticatedUser>
								<SignUpPage />
							</RedirectAuthenticatedUser>
						}
					/>
				</Route>

				<Route element={<ClientLayout />}>
					<Route
						path={pagesLinks.login}
						element={
							<RedirectAuthenticatedUser>
								<LoginPage />
							</RedirectAuthenticatedUser>
						}
					/>
				</Route>

				<Route element={<ClientLayout />}>
					<Route
						path={pagesLinks.verifyEmail}
						element={<EmailVerificationPage />}
					/>
				</Route>
				<Route element={<ClientLayout />}>
					{' '}
					<Route
						path={pagesLinks.forgotPass}
						element={
							<RedirectAuthenticatedUser>
								<ForgotPasswordPage />
							</RedirectAuthenticatedUser>
						}
					/>
				</Route>
				<Route element={<ClientLayout />}>
					<Route
						path={`${pagesLinks.resetPass}/:token`}
						element={
							<RedirectAuthenticatedUser>
								<ResetPasswordPage />
							</RedirectAuthenticatedUser>
						}
					/>
				</Route>

				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>

			<ScrollToTop />
			<Toaster />
		</>
	);
}

export default App;
