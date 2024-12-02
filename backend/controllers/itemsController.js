import itemsModel from '../models/itemsModel.js';
//import fs from 'fs';
import { customInfo, customErrors } from '../utils/variables.js';
import categoryModel from '../models/categoryModel.js';

const addItems = async (req, res) => {
	let image_filename = req.file ? `${req.file.filename}` : 'default.png';

	const items = new itemsModel({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		category: req.body.category,
		image: image_filename,
	});
	try {
		await items.save();
		res.json({ success: true, message: customInfo.itemAdded });
	} catch (error) {
		res.json({ success: false, message: customErrors.default });
	}
};

const itemsList = async (req, res) => {
	try {
		const items = await itemsModel.find({});
		res.json({ success: true, data: items });
	} catch (error) {
		res.json({ success: false, message: customErrors.default });
	}
};

const itemsCat = async (req, res) => {
	try {
		const items = await itemsModel.find({});
		let catArr = [];
		Object.entries(items).map(([item, i]) => {
			if (!(i['category'] == 'undefined') && !catArr.includes(i['category'])) {
				catArr.push(i['category']);
			}
		});

		const category = await categoryModel.find({});

		const filteredArray = category.filter((item) => catArr.includes(item.name));

		res.json({ success: true, data: filteredArray });
	} catch (error) {
		res.json({ success: false, message: customErrors.default });
	}
};

const removeItem = async (req, res) => {
	try {
		const item = await itemsModel.findById(req.body.id);
		if (item.image !== 'default.png') {
			console.log(item);
			//fs.unlink(`uploads/${item.image}`,()=>{})
		}

		await itemsModel.findByIdAndDelete(req.body.id);
		res.json({ success: true, message: customInfo.itemRemoved });
	} catch {
		res.json({ success: false, message: customErrors.default });
	}
};

const updateItem = async (req, res) => {
	try {
		await itemsModel.findByIdAndUpdate(req.body.id, {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			category: req.body.category,
		});
		if (req.file) {
			await itemsModel.findByIdAndUpdate(req.body.id, {
				image: req.file.filename,
				img: req.body.img,
			});
		}
		res.json({ success: true, message: customInfo.default });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: 'error' });
	}
};

export { addItems, itemsList, removeItem, updateItem, itemsCat };
