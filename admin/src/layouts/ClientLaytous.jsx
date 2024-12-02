import { Outlet } from 'react-router-dom';

import '@/clinetIndex.scss';

import React, { useState, useEffect } from 'react';

import Navbar from '@/components/Navbar/Navbar';
import PopupPage from '@/components/PopupPage/PopupPage';
import Footer from '@/components/Footer/Footer';

const ClientLayout = () => {
	const [showPopupPage, setShowPopupPage] = useState(false);

	const delayComponents = {
		nav: 500,
		footer: 500,
	};

	useEffect(() => {
		document.documentElement.className = '';
	}, []);

	return (
		<div id='clientLayout'>
			{showPopupPage && (
				<PopupPage
					setShowPopupPage={setShowPopupPage}
					showPopupPage={showPopupPage}
				/>
			)}

			<Navbar time={delayComponents.nav} />

			<Outlet />

			<Footer
				setShowPopupPage={setShowPopupPage}
				time={delayComponents.footer}
			/>
		</div>
	);
};

export default ClientLayout;
