import React from 'react';
import SearchBox from '@/dashComponents/SearchBox/SearchBox';
import CategoryList from '@/dashComponents/CategoryList/CategoryList';
import './AddPage.scss';

const AddPage = () => {
	return (
		<>
			<div className='addPage'>
				<SearchBox />
				<div className='productsWrapper tableView'>
					<CategoryList />
				</div>
			</div>
		</>
	);
};

export default AddPage;
