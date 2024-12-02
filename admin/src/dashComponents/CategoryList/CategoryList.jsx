import React, { useState, useEffect } from 'react';
import { errorMessage } from '@/utils/variables';
import { toast } from 'react-hot-toast';
import { useAdminStore } from '@/store/adminStore.js';
import './CategoryList.scss';
import { useItemStore } from '../../store/itemStore';
import ItemCard from '../ItemCard/ItemCard';
import { v4 as uuidv4 } from 'uuid';

const CategoryList = () => {
	const [list, setList] = useState([]);

	const { fetchCategoryList } = useItemStore();
	const { updateCategory, removeCategory, setItemTrue, currentEl, imgState, setCatTrue } =
		useAdminStore();
	
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

	return (
		<>
		       <ItemCard title='dodaj kategorię' fetchList={fetchList} edit={imgState.cat}  add={true} updateDefaultItem={updateCategory} removeDefaultItem={removeCategory} setDefaultTrue={setCatTrue} allowedInputs={['name','image']}/>
			{list.map((item) => (
				<ItemCard
					removeDefaultItem={removeCategory}
					fetchList={fetchList}
					key={uuidv4()}
					postData={item}
					setDefaultTrue={setItemTrue}
					edit={currentEl === item._id ? true : false}
					updateDefaultItem={updateCategory}
					allowedInputs={['name', 'image']}
				/>
			))}
		</>
	);
};

export default CategoryList;
