import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Input from '@/components/Input/Input.jsx';
import { useAuthStore } from '@/store/authStore.js';
import {
	formData,
	signUp,
	dontHaveAccount,
	forgotPass,
	remindPass,
	welcomeTitle,
	loginBtnText,
	loginBtnTextAnimate,
	loginPagesLinks,
} from './loginVar.js';
import Button from '@/components/Button/Button.jsx';
import { useCartStore } from '../../store/cartStore.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import './LoginPages.scss';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const checkAdmin = false;

	const { login, isLoading, error, beUrl, isAdmin } = useAuthStore();
	const API_GET_CART_URL =
		import.meta.env.MODE === 'development'
			? beUrl + loginPagesLinks.urlCartGet
			: loginPagesLinks.urlCartGet;
	const getCartData = useCartStore();
	const { mergeCartItems } = useCartStore();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const res = await login(email, password, checkAdmin);
			if (res?.data.success) {
				getCartData.execute();
				const fechedData = await axios.post(API_GET_CART_URL);

				if (fechedData.data.cartData) {
					const userCartDataArr = fechedData.data?.cartData;
					let inCartItems = '';
					userCartDataArr.map((item) => {
						inCartItems += item.name + ' x ' + item.quantity + '\n ';
					});
					if (
						window.confirm(
							'Przed zalogowaniem w koszyku już coś się znajdowało: \n\n' +
								inCartItems +
								'\nCzy chcesz zaktualizować koszyk?'
						)
					) {
						if (getCartData.cartItems) {
							const mergedArray = [
								...userCartDataArr,
								...getCartData.cartItems,
							].reduce((acc, obj) => {
								const existing = acc.find((item) => item._id === obj._id);
								if (existing) {
									existing.quantity += obj.quantity;
								} else {
									acc.push({ ...obj });
								}
								return acc;
							}, []);

							let mergedCart = '';
							mergedArray.map((item) => {
								mergedCart += item.name + ' x ' + item.quantity + '\n ';
							});
							if (
								window.confirm(
									'Czy potwierdzasz zaktualizowany stan koszyka? \n\n' +
										mergedCart
								)
							) {
								mergeCartItems(mergedArray);
							}
						}
					}
				}
			}
		} catch (error) {
			toast.error(error.response?.data?.message);
			console.log(error);
		}
	};

	return (
		<div className='cardContent'>
			<div className='formBox'>
				<h2 className='title textTogradient'>{welcomeTitle}</h2>

				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type='email'
						placeholder={formData.emailPlaceholder}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<Input
						icon={Lock}
						type='password'
						placeholder={formData.passwordPlaceholder}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<div className='linksBox'>
						<Link
							to={loginPagesLinks.forgotPass}
							className='animationLink'
							data-replace={remindPass}
						>
							<span>{forgotPass}</span>
						</Link>
					</div>
					{error && <p className='textError'>{error}</p>}

					<Button
						text={loginBtnText}
						animateText={loginBtnTextAnimate}
						animate={isLoading}
						color={'0'}
					></Button>
				</form>
			</div>
			<div className='infoBox'>
				<p className='infoText'>
					{dontHaveAccount}
					{'   '}
					<Link
						to={loginPagesLinks.signup}
						className='animationLink'
						data-replace={signUp}
					>
						<span>{signUp}</span>
					</Link>
				</p>
			</div>
		</div>
	);
};
export default LoginPage;
