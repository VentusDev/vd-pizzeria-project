import { useEffect, useState } from 'react';
import './SearchBox.scss';
import { useAdminStore } from '@/store/adminStore';
import loop_icon from './loop_icon.svg';
import procent_icon from './procent_icon.svg';
import toast from 'react-hot-toast';
import CustomSelect from '../../components/CustomSelect/CustomSelect';
import { v4 as uuidv4 } from 'uuid';
import Toggler from '../Toggler/Toggler';
import Input from '../../components/Input/Input';
import Percentage from '../../assets/icons/Percentage';
import Magnifying from '../../assets/icons/Magnifying';

function SearchBox() {
	const { setRabat, fetchMailList, setPermissions } = useAdminStore();
	const [list, setList] = useState([]);

	const fetchList = async () => {
		const response = await fetchMailList();

		if (response.data.success) {
			setList(response.data.data.sort());
		} else {
			toast.error('Problem z pobraniem danych');
			toast.success('Spróbuj odświeżyć stronę');
		}
	};

	useEffect(() => {
		fetchList();
	}, [list.length]);
	const [value, setValue] = useState('');

	const handleChange = (e) => {
		if (e.target.value == '10' || e.target.value == '100') {
			setValue(e.target.value);
		} else {
			if (e.target.value == '0') {
				e.preventDefault();
				return;
			}

			if (e.target.value.split('').length > 2) {
				e.preventDefault();
				return;
			}
		}
		setValue(e.target.value.replace(/[^0-9]/g, ''));
	};

	const [query, setQuery] = useState('');

	const [checkedData, setCheckedData] = useState([]);

	const [rabatExpirest, setRabatExpirest] = useState('');

	const [per, setPer] = useState(true);

	const handleChangeToggler = (e) => {
		setPer(!per);
	};

	const handleChangeSelect = (e) => {
		setRabatExpirest(e.target.value);
	};

	const convertDate = (dateStr) => {
		const date = new Date(dateStr);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
		return formattedDate;
	};

	const hours24 = 24 * 60 * 60 * 1000;
	let countRabatDays = Date.now() + rabatExpirest * hours24;

	let renderRabatDays = convertDate(new Date(countRabatDays));

	const handleChangeCheck = (e) => {
		if (e.target.id == 'all') {
			setCheckedData(list);
			let checkboxesArr = document.querySelectorAll("input[type='checkbox']");
			checkboxesArr.forEach((i) => (i.checked = true));
		} else {
			document.querySelector('#all').checked = false;
			setCheckedData(checkedData.filter((i) => i !== 'all'));
		}
		if (e.target.checked == true) {
			setCheckedData((checkedData) => [...checkedData, e.target.id]);
		}
		if (e.target.checked == false) {
			let newArr = checkedData;
			let index = newArr.indexOf(e.target.id);
			if (index !== -1) {
				newArr.splice(index, 1);
				setCheckedData(newArr);
			}
		}
	};

	const [rabatCode, setRabatCode] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (value == '') {
			toast.error('wpisz wartość przyznawanego rabatu');
			return;
		}
		if (checkedData.length < 1) {
			toast.error('musisz wybrać uzytkownika');
			return;
		}
		if (!rabatExpirest) {
			toast.error('zatwierdź czas trwania rabatu');
			return;
		}

		let rabatValue = (value / 100).toString().replace('0.', '.');
		let emailArr =
			list.length < checkedData.length
				? ['all']
				: checkedData.filter((item) => item !== 'all');
		let rabatCodeExpiresAt = rabatExpirest;
		try {
			const response = await setRabat(rabatValue, emailArr, rabatCodeExpiresAt);

			if (response.data.success) {
				toast.success(`Rabat ${value}% ustawiony pomyślnie`, {
					duration: 5000,
					position: 'bottom-center',
				});
				setCheckedData([]);
				setValue('');
				setRabatCode(response.data.rabatCode);

				let checkboxesArr = document.querySelectorAll("input[type='checkbox']");
				checkboxesArr.forEach((i) => (i.checked = false));
			} else {
				toast.error(errorMessage);
			}
		} catch (error) {
			toast.error('Problem z ustawieniem rabatu');
		}
	};

	const handleAdminSubmit = async (e) => {
		e.preventDefault();

		if (checkedData.length < 1) {
			toast.error('musisz wybrać uzytkownika');
			return;
		}

		if (window.confirm('na pewno chcesz zmienić uprawnienia?')) {
			let emailArr =
				list.length < checkedData.length
					? ['all']
					: checkedData.filter((item) => item !== 'all');

			try {
				const response = await setPermissions(emailArr, per);

				if (response.data.success) {
					toast.success(response.data.message, {
						duration: 5000,
						position: 'bottom-center',
					});
					setCheckedData([]);
					let checkboxesArr = document.querySelectorAll(
						"input[type='checkbox']"
					);
					checkboxesArr.forEach((i) => (i.checked = false));
					fetchList();
				} else {
					toast.error(errorMessage);
				}
			} catch (error) {
				toast.error('Problem z ustawieniem uprawnień');
			}
		}
	};

	const copyTextToClipboard = async (text) => {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(text);
		} else {
			document.execCommand('copy', true, text);
		}
	};

	const textToCopy = rabatCode;

	const handleCopyClick = (e) => {
		e.preventDefault(); //cause form
		copyTextToClipboard(textToCopy);
		toast.success('rabatskopiowanydo schowka');
	};

	if (!list.includes('all')) {
		list.unshift('all');
	}
	const options = [
		['', 'wybierz czas trwania rabatu'],
		['1', 'dzień'],
		['7', 'tydzień'],
		['30', 'miesiąc'],
	];
	return (
		<div>
			<form className='searchBox'>
				<p>Wybierz adresy e-mail, którym chcesz przyznać rabat</p>
				{rabatCode && (
					<div className='buttonBox'>
						<input
							className='rabatCode customInputs'
							value={textToCopy}
							disabled
						/>
						<button onClick={(e) => handleCopyClick(e)}>
							Skopiuj kod rabatowy
						</button>
					</div>
				)}

				{rabatExpirest && <p>rabat wygaśnie: {renderRabatDays}</p>}
				<div className='buttonBox'>
					<CustomSelect
						className='customInputs'
						onChange={handleChangeSelect}
						options={options}
						required
					/>
					<button className='disabled'>czas trwania rabatu</button>
				</div>

				<div className='buttonBox'>
					<div className='inputBox'>
						<Input
							icon={Percentage}
							className='customInputs'
							placeholder='Wpisz wysokość rabatu'
							value={value}
							onChange={handleChange}
							required
						/>
					</div>
					<button onClick={handleSubmit} type='submit'>
						zatwierdź
					</button>
				</div>

				<div className='buttonBox'>
					<p>
						Przyznaj lub odbierz wybranym użytkownikom uprawnenia administratora
					</p>
					<Toggler
						onClick={handleChangeToggler}
						title='zarządzaj uprawnieniami'
						state={per}
					/>
					<button onClick={handleAdminSubmit} type='submit'>
						{per ? 'przyznaj' : 'odbierz'}
					</button>
				</div>
			</form>

			<div className='list searchBox'>
				<div className='buttonBox'>
					<div className='inputBox'>
						<div className='iconBox'>
							<img
								src={loop_icon}
								alt='Wyszukaj adres email'
								className='icon'
							/>
						</div>
						<Input
							icon={Magnifying}
							className='customInputs'
							placeholder='Wyszukaj...'
							onChange={(e) => setQuery(e.target.value.toLowerCase())}
						/>
					</div>
				</div>
				{list
					.filter((asd) => asd[0].includes(query))
					.map((item, i) => (
						<div className='listItem' key={i}>
							<div
								className={`checkbox-wrapper ${
									item[1] == true ? 'admin' : item == 'all' ? 'all' : ''
								}`}
							>
								<input
									type='checkbox'
									id={item == 'all' ? item : item[0]}
									onChange={handleChangeCheck}
								/>
								<label htmlFor={item == 'all' ? item : item[0]}>
									<div className='tick_mark'></div>
								</label>
							</div>
							<p>{item == 'all' ? 'każdy uzytkownik' : item[0]}</p>
						</div>
					))}
			</div>
		</div>
	);
}
export default SearchBox;
