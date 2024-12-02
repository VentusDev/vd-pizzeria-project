import jwt from 'jsonwebtoken';
import { customErrors } from '../utils/variables.js';
import userModel from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		console.log('bad login');
		return res
			.status(401)
			.json({ success: false, message: customErrors.badLoginAgain });
	}
	try {
		console.log('its okay');
		const token_decode = jwt.verify(token, process.env.JWT_SECRET);

		if (!token_decode)
			return res
				.status(401)
				.json({ success: false, message: 'Unauthorized - invalid token' });
		if (token_decode) {
			req.body.userId = token_decode.userId;
			req.userId = token_decode.userId;
		}

		next();
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: customErrors.default });
	}
};

const authOrderMiddleware = async (req, res, next) => {
	const token = req.cookies.token;

	try {
		if (token) {
			const token_decode = jwt.verify(token, process.env.JWT_SECRET);

			req.body.userId = token_decode.userId;
		} else {
			req.body.userId = '';
		}

		next();
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: customErrors.default });
	}
};

const adminMiddleware = async (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		return res.json({ success: false, message: customErrors.badLoginAgain });
	}
	try {
		const token_decode = jwt.verify(token, process.env.JWT_SECRET);

		req.body.userId = token_decode.userId;
		const user = await userModel.findOne({
			_id: req.body.userId,
			isAdmin: true,
		});

		if (!user) {
			return res.json({ success: false, message: customErrors.badLoginAgain });
		}else{
			if (token_decode) {
				req.body.userId = token_decode.userId;
				req.userId = token_decode.userId;
			}
		}
		next();
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: customErrors.default });
	}
};

export { authMiddleware, adminMiddleware, authOrderMiddleware };
