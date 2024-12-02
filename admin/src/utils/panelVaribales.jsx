import upload_area from '@/assets/upload_area.png';
import logout_icon from '@/assets/logout_icon.svg';
import rabish_icon from '@/assets/main_files/rabish_icon.svg';
import cart from '@/assets/cart.svg';

import profile_icon from '@/assets/main_files/profile_icon.png';
import parcel_icon from '@/assets/main_files/parcel_icon.png';
import www_icon from '@/assets/main_files/www_icon.svg';
import add_item_icon from '@/assets/main_files/add_item_icon.svg';
import order_icon from '@/assets/main_files/order_icon.svg';
import rabat_icon from '@/assets/main_files/rabat_icon.svg';
import Web from '@/assets/icons/Web';
import AddItem from '@/assets/icons/AddItem';
import Rabat from '@/assets/icons/Rabat';
import Order from '@/assets/icons/Order';

export const assets = {
	upload_area,
	logout_icon,
	rabish_icon,
	cart,
	profile_icon,
	parcel_icon,
	add_item_icon,
	www_icon,
	order_icon,
	rabat_icon,
};

export const panelPath = '/panel';

export const pagesLinks = [
	[
		'lista produktów',
		`${panelPath}/lista`,
		<AddItem />,
		'sprawdź swoje produkty i dodaj kolejne',
	],
	[
		'dodaj rabat i kategorię',
		`${panelPath}/dodaj`,
		<Rabat />,
		'przyznaj rabat i dodaj kategorię produktu',
	],
	[
		'zamówienia',
		`${panelPath}/zamowione`,
		<Order />,
		'zweryfikuj i ustal status zamówienia',
	],
	['strona główna', '/', <Web />, 'sprawdź swoją stronę www'],
];

export const authList = {
	list: `${panelPath}/lista`,
	add: `${panelPath}/dodaj`,
	orders: `${panelPath}/zamówione`,
};

export const addPage = {
	categoryTitle: 'dodaj lub edytuj kategorię',
};

export const customErrors = {
	emptyInputs: 'Uzupełnij wszystkie informacje!',
};
