import categoryModel from '../models/categoryModel.js';
import userModel from '../models/userModel.js';
//import fs from 'fs';
import { customErrors, customInfo } from '../utils/variables.js';

const addCategory = async (req, res) => {
	const { name } = req.body;
	const catAlreadyExists = await categoryModel.findOne({ name });

	if (catAlreadyExists) {
		return res
			.status(400)
			.json({ success: false, message: customErrors.categoryAlreadyExists });
	}

	let user = '';
	if (req.userId) {
		user = await userModel.findById(req.userId);
	}
	let image_filename = req.file.filename
		? `${req.file.filename}`
		: 'default.png';

	const categories = new categoryModel({
		name: name,
		image: image_filename,
		userId: user?._id,
	});
	try {
		await categories.save();
		res.json({ success: true, message: customInfo.catSavedSuccess });
	} catch (error) {
		console.log(error);

		res.json({ success: false, message: customErrors.catDosentSaved });
	}
};

const listCategories = async (req, res) => {
	try {
		const category = await categoryModel.find({});
		res.json({ success: true, data: category });
	} catch (error) {
		res.json({ success: false, message: customErrors.loadListField });
	}
};

const removeCategory = async (req, res) => {
	try {
		let user = '';
		if (req.userId) {
			user = await userModel.findById(req.userId);
		}

		const item = await categoryModel.findById(req.body.id);
		if (item.image !== 'default.png') {
			//fs.unlink(`uploads/${item.image}`,()=>{})
		}
		const { id } = user;
		if (user.isMaster || item.userId === id) {
			await categoryModel.findByIdAndDelete(req.body.id);
			res.json({ success: true, message: customInfo.categoryRemoved });
		} else {
			res.json({ success: false, message: customErrors.noPermissions });
		}
	} catch {
		res.json({ success: false, message: customErrors.default });
	}
};

const updateCategory = async (req, res) => {
	try {

		let user = '';
		if (req.userId) {
			user = await userModel.findById(req.userId);
		}
		const { id } = user;
		const item = await categoryModel.findById(req.body.id);
		if (user.isMaster || item.userId === id) {
			await categoryModel.findByIdAndUpdate(req.body.id, {
				name: req.body.name,
			});
			if (req.file) {
				await categoryModel.findByIdAndUpdate(req.body.id, {
					image: req.file.filename,
					img: req.body.img,
					userId: user?._id,
				});
			}
			res.json({ success: true, message: customInfo.categoryUpdated });
		} else {
			res.json({ success: false, message: customErrors.noPermissions });
		}

	} catch (error) {
		console.log(error);
		res.json({ success: false, message: customErrors.default });
	}
};

export { addCategory, listCategories, removeCategory, updateCategory };
