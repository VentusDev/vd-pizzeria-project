import userModel from '../models/userModel.js';
import { addedMessage, removedMessage } from '../variables.js';
import { customErrors } from '../utils/variables.js';

const addToCart = async (req, res) => {
	try {
		let userData = await userModel.findOne({ _id: req.body.userId });

		let cartData = await userData?.cartData;

		if (!cartData[req.body.itemId]) {
			cartData[req.body.itemId] = 1;
		} else {
			cartData[req.body.itemId] += 1;
		}

		await userModel.findByIdAndUpdate(req.body.userId, { cartData });

		res.json({ success: true, message: addedMessage });
	} catch (error) {
		console.log(error);

		res.json({ success: false, message: customErrors.default });
	}
};

const removeFromCart = async (req, res) => {
	try {
		let userData = await userModel.findById(req.body.userId);
		let cartData = await userData.cartData;
		if (cartData[req.body.itemId] > 0) {
			cartData[req.body.itemId] -= 1;
		}
		await userModel.findByIdAndUpdate(req.body.userId, { cartData });
		res.json({ success: true, message: removedMessage });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: customErrors.default });
	}
};

const getCart = async (req, res) => {
	try {
		let userData = await userModel.findById(req.body.userId);
		let cartData = await userData?.cartData;

		res.json({ success: true, cartData });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: customErrors.default });
	}
};

const updateCart = async (req, res) => {
	try {
		let userData = await userModel.findById(req.body.userId);
		if (userData && req.body.cartItems) {
			await userModel.findByIdAndUpdate(req.body.userId, {
				cartData: req.body.cartItems,
			});
		}
		res.json({ success: true, message: removedMessage });
	} catch (error) {
		res.json({ success: false, message: customErrors.default });
	}
};

export { addToCart, removeFromCart, getCart, updateCart };
