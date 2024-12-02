const replacePolishLetters = (str) => {
	const polishLetters = {
		ą: 'a',
		ć: 'c',
		ę: 'e',
		ł: 'l',
		ń: 'n',
		ó: 'o',
		ś: 's',
		ź: 'z',
		ż: 'z',
		Ą: 'A',
		Ć: 'C',
		Ę: 'E',
		Ł: 'L',
		Ń: 'N',
		Ó: 'O',
		Ś: 'S',
		Ź: 'Z',
		Ż: 'Z',
	};

	return str
		.replace(' ', '-')
		.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (match) => polishLetters[match]);
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

export { replacePolishLetters, convertDate };
