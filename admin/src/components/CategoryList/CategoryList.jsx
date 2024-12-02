import React, { useState, useEffect } from 'react';
import { errorMessage } from '@/utils/variables';
import { toast } from 'react-hot-toast';
import { useAdminStore } from '@/store/adminStore.js';
import './CategoryList.css';
import DefaultCard from '../DefaultCard/DefaultCard';
import { useItemStore } from '../../store/itemStore';
import { v4 as uuidv4 } from 'uuid';

const CategoryList = () => {
	const [list, setList] = useState([]);

	const { fetchCategoryList } = useItemStore();
	const { delateFocus, updateCategory, removeCategory } = useAdminStore();

	const fetchList = async () => {
		const response = await fetchCategoryList();
		if (response.data.success) {
			setList(response.data.data.reverse());
		} else {
			toast.error(errorMessage);
		}
	};

	useEffect(() => {
		fetchList();
	}, []);

	const [currentEl, setCurrentEl] = useState('');

	return (
		<>
			<div className='listBox'>
				{list.map((item) => (
					<DefaultCard
						removeDefaultItem={removeCategory}
						fetchList={fetchList}
						key={uuidv4()}
						postData={item}
						edit={currentEl === item._id ? true : false}
						setCurrentEl={setCurrentEl}
						setDefaultTrue={delateFocus}
						updateDefaultItem={updateCategory}
						allowedInputs={['name', 'image']}
					/>
				))}
			</div>
		</>
	);
};

export default CategoryList;
