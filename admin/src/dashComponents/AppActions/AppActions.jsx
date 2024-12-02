import React, { useEffect, useState } from 'react';
import { useDashStore } from '@/store/dashStore';
import { useItemStore } from '@/store/itemStore';
import toast from 'react-hot-toast';
import './AppActions.scss';
import SearchBar from '@/dashComponents/SearchBar/SearchBar';
import CustomSelect from '@/components/CustomSelect/CustomSelect';

const AppActions = () => {
	const fields = {
		name: 'kategorie',
		all: 'wszystkie',
		close: 'zamknij',
	};

	const [list, setList] = useState([{ name: fields.all }]);

	const { fetchCategoryList } = useItemStore();

	const { dashState, setDash, setFilter, filterState } = useDashStore();


	const handleToggleItemView = () => {
		setDash();
	};

	const handleToggleFilter = () => {
		setFilter();
	};
	const fetchList = async () => {
		const response = await fetchCategoryList();
		if (response.data.success) {
			setList(response.data.data.reverse());
		} else {
			toast.error('errorMessage');
		}
	};

	useEffect(() => {
		fetchList();
	}, []);

	const { selectedValue, toggleValue } = useItemStore();

	const handleChange = (event) => {
		toggleValue(event.target.value);
	};

	const defaultVal = [{ name: fields.all }];

	return (
		<div className='appContent-actions'>
			<SearchBar />

			<div className='appContentActionsWrapper'>
				<div className='filterButtonWrapper'>
					<button onClick={handleToggleFilter} className='actionButton filter'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
							className='feather feather-filter'
						>
							<polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' />
						</svg>
					</button>
					<div className={`filterMenu ${filterState ? 'active' : ''}`}>
						<label>{fields.name}</label>

						<CustomSelect
							onChange={handleChange}
							value={selectedValue}
							options={[...defaultVal, ...list]}
						/>

						<button onClick={handleToggleFilter} className='actionButton'>
							{fields.close}
						</button>
					</div>
				</div>

				<button
					className={`actionButton list ${dashState && 'active'}`}
					title='List View'
					onClick={handleToggleItemView}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='feather feather-list'
					>
						<line x1='8' y1='6' x2='21' y2='6' />
						<line x1='8' y1='12' x2='21' y2='12' />
						<line x1='8' y1='18' x2='21' y2='18' />
						<line x1='3' y1='6' x2='3.01' y2='6' />
						<line x1='3' y1='12' x2='3.01' y2='12' />
						<line x1='3' y1='18' x2='3.01' y2='18' />
					</svg>
				</button>
				<button
					className={`actionButton grid ${!dashState && 'active'}`}
					title='Grid'
					onClick={handleToggleItemView}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='feather'
					>
						<rect x='3' y='3' width='7' height='7' />
						<rect x='14' y='3' width='7' height='7' />
						<rect x='14' y='14' width='7' height='7' />
						<rect x='3' y='14' width='7' height='7' />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default AppActions;
