import React, { useState } from 'react';

import { allCategoriesName } from '@/utils/variables';

import Header from '@/components/Header/Header';
import ExploreMain from '@/components/ExploreMain/ExplorerMain';
import AppDownload from '@/components/AppDownload/AppDownload';
import ItemsDisplay from '@/components/ItemsDisplay/ItemsDisplay';

import './Home.css';

const Home = () => {
	const [category, setCategory] = useState(allCategoriesName);

	const delayComponents = {
		header: 500,
		category: 500,
		menu: 2000,
		app: 3000,
	};

	return (
		<>
			<Header time={delayComponents.header} />
			<ExploreMain
				category={category}
				setCategory={setCategory}
				time={delayComponents.category}
			/>
			<ItemsDisplay category={category} time={delayComponents.menu} />
			<AppDownload time={delayComponents.app} />
		</>
	);
};

export default Home;
