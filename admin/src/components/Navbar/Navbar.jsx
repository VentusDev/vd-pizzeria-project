import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Navbar.scss';
import { assets } from '@/assets/assets.js';
import {
	brandData,
	loginBtnText,
	objMenu,
	objPages,
} from '@/utils/variables.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';
import { replacePolishLetters } from '@/utils/functions.js';
import BurgerMenu from '../BurgerMenu/BurgerMenu.jsx';
import { useCartStore } from '../../store/cartStore';
import Cookies from 'js-cookie';
import Cart from '../../assets/icons/Cart';
import VDlogo from '../../assets/icons/VDlogo';
import VentusDev from '../../assets/icons/VentusDev';

const Navbar = ({ time }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setTimeout(() => setMounted(true), time);
	});

	const { user, logout, isAuthenticated } = useAuthStore();

	const { cartItems } = useCartStore();

	const [shakeCart, setShakeCart] = useState(false);

	const sum =
		JSON.stringify(cartItems) === '{}'
			? 0
			: cartItems?.reduce((accumulator, currentObject) => {
					return accumulator + currentObject.quantity;
			  }, 0);

	const [menu, setMenu] = useState('start');
	const [openMenu, setOpenMenu] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [userName, setUserName] = useState('zaloguj się');
	const location = useLocation();

	const navigate = useNavigate();
	let activeClass = openMenu ? 'activeMenu' : '';
	let hideCart = openMenu;

	useEffect(() => {
		if (user) {
			setUserName(user.name);
		}
	}, [user]);

	useEffect(() => {
		setShakeCart(true);
		setOpenMenu(false);
		setTimeout(() => {
			setShakeCart(false);
		}, 500);
	}, [cartItems]);

	const handleChange = () => {
		setTimeout(setIsHovered(false), 2000);
	};

	const handleSetMenu = (item) => {
		setMenu(item);
		setOpenMenu(!openMenu);
	};

	const handleLogout = () => {
		if (window.confirm('wylogowujesz się?')) {
			localStorage.removeItem('cartData');
			setOpenMenu(!openMenu);
			logout();
			Cookies.remove('token');
			navigate('/');
			window.location.reload();
		}
	};
	const objPanel = { panel: '/panel' };
	const renderMenuList = user?.isAdmin
		? { ...objPanel, ...objPages }
		: objPages;

	return (
		mounted && (
			<>
				<Link to='/' className='logoBox FIAnim'>
					<VentusDev />
				</Link>
				<div className='navbar FIAnim'>
					<ul className={`navbarMenu ${activeClass}`}>
						{Object.entries(renderMenuList).map(([item, i]) => (
							<>
								<Link
									to={`${replacePolishLetters(renderMenuList[item])}`}
									key={uuidv4()}
									className={`${
										location.pathname ===
										replacePolishLetters(renderMenuList[item])
											? 'active'
											: ''
									}
							`}
									onClick={() => handleSetMenu(item)}
								>
									{renderMenuList[item].replace('/', '')}
								</Link>

								{renderMenuList[item].includes('/koszyk') && (
									<span
										key={uuidv4()}
										onClick={() => navigate('/koszyk')}
										className={`cart ${shakeCart ? 'shake' : ''} ${
											hideCart ? '' : ''
										}`}
										data-totalitems={sum}
									>
										<Cart key={uuidv4()} />
									</span>
								)}
							</>
						))}
						{Object.entries(objMenu).map(([item, i]) => (
							<a
								href={`/#${objMenu[item]}`}
								key={uuidv4()}
								className={`${menu === item ? 'active' : ''}`}
								onClick={() => handleSetMenu(item)}
							>
								{item}
							</a>
						))}
						<div className='navLogout' key='navLogout'>
						<VentusDev className='logoMenu' />
							{isAuthenticated ? (
								<img
									src={assets.logout_icon}
									alt='wyloguj'
									onClick={handleLogout}
									loading='lazy'
									width='60'
									height='60'
								/>
							) : (
								<img
									src={assets.login_icon}
									alt='zaloguj'
									onClick={() => {
										setOpenMenu();
										navigate('/login');
									}}
									loading='lazy'
									width='60'
									height='60'
								/>
							)}
						</div>
					</ul>
					<div
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={handleChange}
						className='navbarRight'
					>
						<div
							className='navProfile'
							onClick={() => {
								setOpenMenu();
								navigate('/login');
							}}
						>
							<VDlogo />
							<p>{user ? userName : loginBtnText}</p>
						</div>
						<a className={`logOutImg ${isHovered ? 'hoverImg' : ''}`}>
							{isAuthenticated ? (
								<img
									src={assets.logout_icon}
									alt='wyloguj'
									onClick={handleLogout}
									loading='lazy'
									width='60'
									height='60'
								/>
							) : (
								<img
									src={assets.login_icon}
									alt='zaloguj'
									onClick={() => {
										navigate('/login');
									}}
									loading='lazy'
									width='60'
									height='60'
								/>
							)}
						</a>
					</div>
					<BurgerMenu
						customClass='clientBurger'
						variant={'arrow1'}
						setOpenMenu={setOpenMenu}
						openMenu={openMenu}
					/>
				</div>
			</>
		)
	);
};

export default Navbar;
