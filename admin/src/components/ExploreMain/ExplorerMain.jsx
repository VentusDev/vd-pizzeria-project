import React, { useEffect, useState } from 'react';
import './ExploreMain.css';
import { allCategoriesName, itemsMainData } from '@/utils/variables';
import { useItemStore } from '@/store/itemStore';
import { v4 as uuidv4 } from 'uuid';
import { useVarStore } from '@/store/varStore';

const ExploreMain = ({ category, setCategory, time }) => {
	const [mounted, setMounted] = useState(false);

	const { beUrl } = useVarStore();

	useEffect(() => {
		setTimeout(() => setMounted(true), time);
	});

	const [list, setList] = useState([]);

	const { fetchCurrentCategoryList } = useItemStore();

	const fetchList = async () => {
		const response = await fetchCurrentCategoryList();

		if (response.data.success) {
			setList(response.data.data.reverse());
		} else {
			toast.error(errorMessage);
		}
	};

	useEffect(() => {
		fetchList();
	}, []);

	return (
		mounted && (
			<div className='exploreMain FIAnim' id='exploreMain'>
				<h1>{itemsMainData.h1}</h1>
				<p className='exploreMainList'>{itemsMainData.p}</p>
				<div className='exploreMainList'>
					{list.map((item) => (
						<div
							onClick={() =>
								setCategory((prev) =>
									prev === item.name ? allCategoriesName : item.name
								)
							}
							key={uuidv4()}
							className='exploreMainListItem'
						>
							<img
								className={category === item.name ? 'active' : ''}
								src={beUrl + '/images/' + item.image}
								alt={item.name}
								loading='lazy'
								width='100'
								height='100'
							/>
							<p>{item.name}</p>
						</div>
					))}
				</div>
				<hr />
			</div>
		)
	);
};

export default ExploreMain;
