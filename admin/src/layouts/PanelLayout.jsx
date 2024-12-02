import { Outlet } from 'react-router-dom';

import '@/panelIndex.scss';

import React from 'react';

import { pagesLinks } from '@/utils/panelVaribales';

import Header from '../dashComponents/Header/Header';
import NavSidebar from '../dashComponents/NavSidebar/NavSidebar';

const PanelLayout = () => {
	const delayComponents = {
		nav: 1000,
		footer: 2000,
	};
	return (
		<div id='panelLayout'>
			<NavSidebar pagesLinks={pagesLinks} />

			<section className='dashboard'>
				<Header pagesLinks={pagesLinks} />

				<Outlet />
			</section>
		</div>
	);
};

export default PanelLayout;
