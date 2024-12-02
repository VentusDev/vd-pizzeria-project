import React, { useState } from 'react';
import { addData, categories, url, urlImg } from '@/utils/variables';
import { assets } from '@/assets/assets';
import { toast } from 'react-hot-toast';
import './ItemCard.scss';
import { useAdminStore } from '../../store/adminStore';
import { useDashStore } from '../../store/dashStore';
import { v4 as uuidv4 } from 'uuid';
import { customErrors } from '../../utils/panelVaribales';
/* import { useVarStore } from '../../store/varStore'; */

const ItemCard = ({
	postData,
	fetchList,
	add = false,
	edit,
	updateDefaultItem,
	removeDefaultItem,
	setDefaultTrue,
	allowedInputs,
	className = '',
}) => {
	const { name, description, price, category, _id, img } = postData
		? postData
		: '';

	const [image, setImage] = useState(false);

	const [data, setData] = useState({
		name: name,
		description: description,
		price: price,
		category: category,
	});

	const onChangeHandler = (e) => {
		if (disabled) {
			toast.error('jeśli chcesz edytować przedmiot włącz edycję');
			return;
		}
		const name = e.target.name;
		const value = e.target.value;
		setData((data) => ({ ...data, [name]: value }));
	};
	const { setCurrentEl } = useAdminStore();

	const { dashState } = useDashStore();

	/* const { cloudName, cloudKey, cloudUrl } = useVarStore(); */

	const handleEdit = (e) => {
		if (_id) {
			setCurrentEl(!edit ? _id : '');
			setDefaultTrue(false);
		} else {
			setCurrentEl('');
			setDefaultTrue(!edit);
		}
	};

	const [errors, setErrors] = useState({});

	const validateForm = () => {
		let formErrors = {};
		let isValid = true;

		for (let key in data) {
			if (allowedInputs.includes[key]) {
				if (!data[key]) {
					isValid = false;
					formErrors[key] = 'Pole jest wymagane';
				}
			}
		}

		setErrors(formErrors);
		return isValid;
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();

		try {
			
		if (validateForm()) {
			if (window.confirm(add ? 'dodajesz?' : 'potwierdzasz edycję?')) {
				/**cloudinary */
/* 				const cloudData = new FormData();
				cloudData.append('file', image);
				cloudData.append('upload_preset', cloudName);
				cloudData.append('cloud_name', cloudKey);

				const res = await fetch(cloudUrl, {
					method: 'POST',
					body: cloudData,
				});

				const uploadedImageURL = await res.json(); */

				/**cloudinary */

				const formData = new FormData();
				{
					allowedInputs.includes('name') && formData.append('name', data.name);
				}
				{
					allowedInputs.includes('description') &&
						formData.append('description', data.description);
				}
				{
					allowedInputs.includes('price') &&
						formData.append('price', Number(data.price));
				}
				{
					allowedInputs.includes('category') &&
						formData.append('category', data.category);
				}
				{
					allowedInputs.includes('image') && formData.append('image', image);
					//formData.append('img', uploadedImageURL.url);
				}
				{
					_id && formData.append('id', _id);
				}

				const response = await updateDefaultItem(_id, formData);

				if (response.data.success) {
					console.log(response);

					if (!add) {
						setCurrentEl(false);
					} else {
						setData({
							name: '',
							description: '',
							price: '',
							category: categories[0],
						});
						setImage(false);
					}
					toast.success(response.data.message);
					await fetchList();
					setDefaultTrue(false);
				} else {
					toast.error(response.data.message);
				}
			}
		} else {
			toast.error(customErrors.emptyInputs);
		}
		} catch (error) {
			console.log(error);
			
			if(error?.response?.data){
				toast.error(error.response.data.message)
			}

		}

	};

	const removeItem = async (itemId) => {
		const response = await removeDefaultItem(itemId);
		if (response.data.success) {
			toast.success(response.data.message);
		} else {
			toast.error(response.data.message);
		}
		await fetchList();
	};
	let allowEdit = edit ? 'allowEdit' : '';
	let disabled = edit ? '' : 'editDisabled';
	let imageId = edit ? 'image' : '';

	let placeholderImage = postData?.image
		? `${url}${urlImg}${postData.image}`
		: img
		? `${url}${urlImg}${postData.image}`
		: assets.upload_area;

	const cellsName = {
		name: 'nazwa',
		description: 'opis',
		price: 'cena',
		category: 'kategoria',
	};
	return (
		<form
		/* onClick={handleEdit} */
			onSubmit={onSubmitHandler}
			className={` products-row ${className} addForm ${allowEdit}`}
		>
			{allowedInputs.includes('name') && (
				<div className='product-cell image'>
					<div className={`addImgUpload flexCol ${disabled}`}>
						<p>{edit && (!add ? 'zmień zdjęcie' : addData.addPhoto)}</p>
						<label htmlFor='image'>
							<img
								src={image ? URL.createObjectURL(image) : placeholderImage}
								alt={assets.upload_area}
							/>
						</label>
						<input
							className={`${disabled}`}
							onChange={(e) => setImage(e.target.files[0])}
							type='file'
							id={imageId}
							hidden
						/>
					</div>
				</div>
			)}
			{allowedInputs.includes('name') && (
				<div className='product-cell status-cell name'>
					<textarea
						className={`${disabled} itemName`}
						onChange={onChangeHandler}
						value={data.name}
						type='text'
						name='name'
						placeholder={addData.typeItemName}
						required
					/>
				</div>
			)}
			{allowedInputs.includes('category') && (
				<div className='product-cell category '>
					{!dashState && (
						<span className='cell-label'>{cellsName.category}</span>
					)}
					<select
						className={`${disabled} transparent`}
						onChange={onChangeHandler}
						value={data.category}
						name='category'
					>
						{categories.map((item, i) => (
							<option key={uuidv4()} value={item.replace(' ', '-')}>
								{item}
							</option>
						))}
					</select>
				</div>
			)}
			{allowedInputs.includes('price') && (
				<div className='product-cell price transparent'>
					{!dashState && <span className='cell-label'>{cellsName.price}</span>}
					<input
						className={`${disabled} `}
						onChange={(e) => onChangeHandler(e)}
						value={data.price}
						type='number'
						name='price'
						placeholder={addData.typeItemPrice}
						required
					/>
				</div>
			)}
			{allowedInputs.includes('description') && (
				<textarea
					className={`product-cell description  transparent`}
					readonly={disabled ? true : false}
					value={data.description}
					onChange={onChangeHandler}
					placeholder={addData.typeItemDesc}
					name='description'
					required
				/>
			)}

			{edit ? (
				<button className={`actionButton ${disabled}`} type='submit'>
					{!add ? addData.acceptEdit : addData.addBtn}
				</button>
			) : (
				''
			)}

			<div className='editRemoveBox'>
				<button
					type='button'
					title='edytuj'
					className={`editButton ${edit ? 'edit' : ''}`}
					onClick={handleEdit}
				>
					<svg
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
						<g
							id='SVGRepo_tracerCarrier'
							strokeLinecap='round'
							strokeLinejoin='round'
						></g>
						<g id='SVGRepo_iconCarrier'>
							{' '}
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z'
								fill='currentColor'
							></path>{' '}
						</g>
					</svg>
				</button>
				{!add && !edit && (
					<button
						type='button'
						title='usuń'
						className={`removeButton`}
						onClick={(e) => {
							if (window.confirm('na pewno chcesz usunąć przedmiot?')) {
								removeItem(_id);
								e.target.parentElement.classList.add('hidden');
							}
						}}
					>
						<svg
							fill='currentColor'
							height='20px'
							width='20px'
							version='1.1'
							id='Capa_1'
							xmlns='http://www.w3.org/2000/svg'
							xmlns:xlink='http://www.w3.org/1999/xlink'
							viewBox='0 0 460.775 460.775'
							xml:space='preserve'
						>
							<g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
							<g
								id='SVGRepo_tracerCarrier'
								strokeLinecap='round'
								strokeLinejoin='round'
							></g>
							<g id='SVGRepo_iconCarrier'>
								{' '}
								<path d='M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z'></path>{' '}
							</g>
						</svg>
					</button>
				)}
			</div>
		</form>
	);
};

export default ItemCard;
