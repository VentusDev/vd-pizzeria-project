import React, { useEffect, useState } from 'react';
import './NavSidebar.scss';
import BurgerMenu from '@/components/BurgerMenu/BurgerMenu';
import { useDashStore } from '@/store/dashStore';
import { useAuthStore } from '@/store/authStore';

import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import LogOut from '@/assets/icons/LogOut';
import Cookies from 'js-cookie';
import Toggler from '@/dashComponents/Toggler/Toggler';
import LogIn from '@/assets/icons/LogIn';
import toast from 'react-hot-toast';

const NavSidebar = ({ pagesLinks }) => {
	const [openMenu, setOpenMenu] = useState(false);
	let close = openMenu ? 'close' : '';

	const { setMode, modeState } = useDashStore();

	const handleToggleMode = () => {
		document.documentElement.classList.toggle('vdPanelLight');
		document.documentElement.classList.toggle('vdPanel');
		setMode();
	};

	const { logout } = useAuthStore();

	const handleLogout = () => {
		if (window.confirm('na pewno chcesz się wylogować?')) {
			localStorage.removeItem('cartData');
			logout();
			Cookies.remove('token');
			navigate('/');
			window.location.reload();
		}
	};

	useEffect(() => {
		if (modeState) {
			document.documentElement.classList.add('vdPanelLight');
			document.documentElement.classList.remove('vdPanelremove');
		} else {
			document.documentElement.classList.add('vdPanel');
			document.documentElement.classList.remove('vdPanelLight');
		}
	}, []);

	const { user } = useAuthStore();

	const handleToast = () => {
		if(!user){
			toast.error('najpierw się zaloguj, żeby zobaczyć co i jak. ;)')
		}


		
		
	}

	return (
		<nav className={`${close}`}>
			<div className='navHeader'>
				<BurgerMenu
					variant={'arrow1'}
					setOpenMenu={setOpenMenu}
					openMenu={openMenu}
					customClass='burger'
				/>
				<span className='userName'>{user && user.name}</span>
			</div>
			<div className='menuItems'>
				<ul className='navLinks'>
					{pagesLinks.map((item, i) => (
						<li>
							{' '}
							<Link  to={pagesLinks.length===i+1||user?item[1]:'/panel'} className='pagesLinks' key={uuidv4()} onClick={handleToast}>
								{/* <img className='' src={item[2]} loading='lazy' alt={item[1]} /> */}
								{item[2]}

								<span className='linkName'>{item[0]}</span>
							</Link>{' '}
						</li>
					))}
				</ul>

				<ul className='logoutMode'>
					<li>
						{user ? (
							<Link alt='wyloguj' onClick={handleLogout}>
								<span className='linkName'>wyloguj</span>{' '}
								<div className='logOut'>
									<LogOut />{' '}
								</div>
							</Link>
						) : (
							<Link alt='wyloguj' to='/login'>
								<span className='linkName'>zaloguj się</span>{' '}
								<div className='logOut'>
									{' '}
									<LogIn />
								</div>
							</Link>
						)}
					</li>

					<li className='mode'>
						<a title='zmień motyw' onClick={handleToggleMode}>
							<span className='linkName'>motyw</span>
						</a>

						<Toggler
							onClick={handleToggleMode}
							title='zmień motyw'
							state={modeState}
						/>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default NavSidebar;
