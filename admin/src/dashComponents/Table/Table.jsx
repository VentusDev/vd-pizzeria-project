import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ItemCard from '@/dashComponents/ItemCard/ItemCard';

/* import BackgroundAnimation from '../BackgroundAnimation/BackgroundAnimation'; */
/* mport NetworkErrorText from '../NetworkErrorText/NetworkErrorText.jsx';
import ItemSkeleton from '../Item/ItemSkeleton'; */

import { errorMessage } from '@/utils/variables';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore.js';

import { useItemStore } from '@/store/itemStore';
import { useAdminStore } from '@/store/adminStore';
import { useDashStore } from '../../store/dashStore';
import { dashVar } from '@/store/authVar';
import Add from '../../assets/icons/Add';
import Close from '../../assets/icons/Close';

const Table = ({ time = 500 }) => {
	const { dashState, query } = useDashStore();

	const { selectedValue } = useItemStore();

	const productsHeader = [
		['image', ''],
		['name', 'nazwa', 'sort'],
		['category', 'kategoria', 'sort'],
		['price', 'cena', 'sort'],
		['description', 'opis'],
	];

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setTimeout(() => setMounted(true), time);
	});

	const { netErr, dataLoading } = useAuthStore();

	const [list, setList] = useState([]);

	const { fetchItemsList } = useItemStore();

	const { imgState, updateItem, removeItem, setItemTrue, currentEl } =
		useAdminStore();

	const fetchList = async () => {
		const response = await fetchItemsList();
		if (response.data.success) {
			setList(response.data.data.reverse());
		} else {
			toast.error(errorMessage);
		}
	};

	useEffect(() => {
		fetchList();
	}, []);

	const handleSortItems = (str) => {
		let sortedData = [];
		if (str.includes('_down')) {
			let newStr = str.replace('_down', '');

			if (str.includes('price')) {
				sortedData = [...list].sort((a, b) => a[newStr] - b[newStr]);
			} else {
				sortedData = [...list].sort((a, b) =>
					b[newStr].localeCompare(a[newStr])
				);
			}
		} else {
			let newStr = str.replace('_up', '');
			if (str.includes('price')) {
				sortedData = [...list].sort((a, b) => b[newStr] - a[newStr]);
			} else {
				sortedData = [...list].sort((a, b) =>
					a[newStr].localeCompare(b[newStr])
				);
			}
		}
		setList(sortedData);
	};

	const [showAdd, setShowAdd] = useState(false);

	const handleShowAdd = (e) => {
		setShowAdd(!showAdd);
	};

	const [isDesktop, setIsDesktop] = useState(window.innerWidth > 950);

	const updateMedia = () => {
	  setIsDesktop(window.innerWidth > 950);
	};
  
	useEffect(() => {
	  window.addEventListener('resize', updateMedia);
	  return () => window.removeEventListener('resize', updateMedia);
	}, []);

	return (
		<>
		{(isDesktop||!dashState)&&	<button
				className={`actionButton add`}
				title='dodaj przedmiot'
				onClick={handleShowAdd}
			>
				{showAdd ? <Close /> : <Add />}
			</button>}
			<div
				className={`productsWrapper ${dashState ? 'tableView' : 'gridView'}`}
			>
				<ItemCard
					className={` ${showAdd ? '' : 'displayNone'}`}
					title='dodaj przedmiot'
					edit={showAdd && imgState.item}
					add={true}
					updateDefaultItem={updateItem}
					removeDefaultItem={removeItem}
					setDefaultTrue={setItemTrue}
					fetchList={fetchList}
					allowedInputs={['name', 'description', 'category', 'price', 'image']}
				/>
				<div className='products-header'>
					{productsHeader.map((item, i) => (
						<div className={`product-cell ${item[0]}`} key={uuidv4()}>
							{item[2] ? (
								<a
									className='sort-button'
									onClick={() => handleSortItems(item[0] + '_down')}
								>
									<svg
										className={`down ${item[0]}`}
										viewBox='0 0 16 16'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
										transform='matrix(-1, 0, 0, -1, 0, 0)'
									>
										<path
											d='M0 5H3L3 16H5L5 5L8 5V4L4 0L0 4V5Z'
											fill='currentColor'
										></path>{' '}
									</svg>
								</a>
							) : (
								''
							)}
							<span>{item[1]}</span>
							{item[2] ? (
								<a
									className='sort-button'
									onClick={() => handleSortItems(item[0] + '_up')}
								>
									<svg
										className='up'
										viewBox='0 0 16 16'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M0 5H3L3 16H5L5 5L8 5V4L4 0L0 4V5Z'
											fill='currentColor'
										></path>
									</svg>
								</a>
							) : (
								''
							)}
						</div>
					))}
				</div>
						<>
							{list
								.filter((item) => {
									if (selectedValue === dashVar.all) {
										return item;
									} else {
										return item.category === selectedValue;
									}
						
								})
								.filter((asd) => asd.name.includes(query))
								.map((item) => {
								
										
										
									
									return (
										<ItemCard
											setDefaultTrue={setItemTrue}
											removeDefaultItem={removeItem}
											fetchList={fetchList}
											key={uuidv4()}
											postData={item}
											edit={currentEl === item._id ? true : false}
											updateDefaultItem={updateItem}
											allowedInputs={[
												'name',
												'description',
												'category',
												'price',
												'image',
											]}
										/>
									);
								})}
						</>
			</div>
		</>
	);
};

export default Table;
