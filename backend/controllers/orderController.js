import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import transporter from '../utils/transporter.js';
import {
	customErrors,
	customInfo,
	orderSlug,
	orderAminSlug,
} from '../utils/variables.js';

import {
	ORDER_VERYFIKATION,
	NEW_ORDER_VERYFIKATION,
	MAIL_HEADER,
	MAIL_FOOTER,
} from '../utils/emailTemplates.js';

const placeOrder = async (req, res) => {
	const verificationCode = Math.floor(
		100000 + Math.random() * 900000
	).toString();

	try {
		let rabatValue = 0;
		if (req.body.userId) {
			const user = await userModel.findById(req.body.userId);
			if(user){
				rabatValue = user?.rabat ? user.rabat.rabatValue : 0;
			}

		}
		const itemsArr = req.body.items;

		const newOrder = new orderModel({
			userId: req.body.userId,
			date: Date.now(),
			items: itemsArr,
			amount: req.body.amount,
			address: req.body.address,
			verified: req.body.userId ? true : false,
			rabat: rabatValue,
			verificationCode,
			verificationCodeExpiresAt: Date.now() + 60 * 60 * 1000,
		});

		await newOrder.save();

		if (req.body.userId) {
			const user = await userModel.findById(req.body.userId);
			if(user){
				user.rabat = {};
				user.cartData = {};
				if (req.body.address) {
					user.address = req.body.address;
				}
				await user.save();
			}

		}

		if (process.env.MODE === 'production') {
			let itemsForMail = '';

			itemsArr.map((item) => {
				itemsForMail += '<p>' + item.name + ' x ' + item.quantity + '</p>';
			});
	
			var mailOptions = {
				from: process.env.EMAIL,
				to: req.body.address.email,
				subject: 'Kod weryfikacyjny dla zamówienia',

				html:
					MAIL_HEADER.replace('{headTitle}', 'Weryfikacja zamówienia') +
					ORDER_VERYFIKATION.replace('{verificationCode}', verificationCode)
						.replace('{mailPath}', process.env.REACT_APP_CLIENT_URL + `/${orderSlug}`)
						.replace('{itemsForMail}', itemsForMail)
						.replace('{headTitle}', 'Weryfikacja zamówienia') +
					MAIL_FOOTER,
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					return res.json({ success: true, message: 'shortPassMess' });
				}
			});
		
			//res.json({ success: true, message: customInfo.orderSuccess });

			const admins = await userModel.find({
				isAdmin: true,
			});

			if (admins.length > 0) {
				admins.forEach((mail) => {
					let email = mail.email ? mail.email : mail;
					var mailOptions = {
						from: process.env.EMAIL,
						to: email,
						subject: 'Kod weryfikacyjny dla nowego zamówienia',

						html:
							MAIL_HEADER.replace('{headTitle}', 'Nowe zamówienie') +
							NEW_ORDER_VERYFIKATION.replace(
								'{verificationCode}',
								verificationCode
							)
								.replace(
									'{mailPath}',
									process.env.REACT_APP_CLIENT_URL + orderAminSlug
								)
								.replace('{itemsForMail}', itemsForMail) +
							MAIL_FOOTER,
					};
					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							console.log(error);
						} else {
							return res.json({ success: true, message: 'shortPassMess' });
						}
					});
				});
			}
		}
		return res.json({ success: true, message: customInfo.orderSuccess });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: customErrors.orderFiled });
	}
};

const verifyOrderCode = async (req, res) => {
	const { verificationCode, email } = req.body;

	try {
		const veryfiedOrder = await orderModel.findOne({
			verified: true,
			verificationCode: verificationCode,
		});

		if (veryfiedOrder) {
			return res.status(200).json({
				success: true,
				message: customInfo.orderAllreadyVeryried,
				verified: true,
				data: veryfiedOrder,
			});
		}

		const order = await orderModel.findOne({
			verificationCode: verificationCode,
			verificationCodeExpiresAt: { $gt: Date.now() },
		});

		if (!order) {
			return res
				.status(400)
				.json({ success: false, message: customErrors.expiriedCode });
		}

		if (order.address.email === email) {
			order.verified = true;

			await order.save();
			return res.status(200).json({
				success: true,
				message: customInfo.orderVerifiedSuccess,
				verified: true,
			});
		} else {
			return res
				.status(400)
				.json({ success: false, message: customErrors.failedData });
		}
	} catch (error) {
		console.log(customErrors.inVeirfyEmail, error);
		res.status(500).json({ success: false, message: customErrors.serverError });
	}
};

const userOrders = async (req, res) => {
	let orderId = req.body.userId ? req.body.userId : '';
	let codeId = req.body.codeId;
	let email = req.body.email;

	try {
		if (req.body.userId) {
			const orders = await orderModel.find({ userId: orderId });
			if (orders) {
				return res.json({ success: true, data: orders });
			}
		}
		if (codeId && email) {
			const order = await orderModel.findOne({ verificationCode: codeId });

			if (!order) {
				return res.json({ success: false, message: customErrors.failedData });
			} else {
				if (order.address.email === email) {
					return res.json({ success: true, data: [order] });
				} else {
					return res.json({ success: false, message: customErrors.failedData });
				}
			}
		}

		if (orderId) {
			const orders = await orderModel.find({ userId: orderId });
			if (orders) {
				return res.json({ success: true, data: orders });
			}
		}
	} catch (error) {
		console.log(error);

		res.json({ success: false, message: customErrors.loadListField });
	}
};

const listOrders = async (req, res) => {
	try {
		const orders = await orderModel.find({});
		res.json({ success: true, data: orders });
	} catch (error) {
		res.json({ success: false, message: customErrors.loadListField });
	}
};

const updateStatus = async (req, res) => {
	try {
		await orderModel.findByIdAndUpdate(req.body.orderId, {
			status: req.body.status,
		});
		res.json({ success: true, message: customInfo.statusUpdated });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: customErrors.statusUpdateFiled });
	}
};

const removeOrder = async (req, res) => {
	try {
		await orderModel.findByIdAndDelete(req.body.orderId);
		res.json({ success: true, message: customInfo.orderRemoved });
	} catch {
		res.json({ success: false, message: customErrors.default });
	}
};

export {
	placeOrder,
	userOrders,
	listOrders,
	updateStatus,
	removeOrder,
	verifyOrderCode,
};
