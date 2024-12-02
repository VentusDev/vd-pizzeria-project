import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import {
	USER_VERYFIKATION,
	MAIL_FOOTER,
	MAIL_HEADER,
	WELCOME_EMAIL,
	PASSWORD_RESET,
	PASSWORD_RESET_SUCCESS,
	ADD_PERMISSIONS,
	REQ_ADD_PERMISSIONS,
	REQ_SET_PERMISSIONS,
} from '../utils/emailTemplates.js';
import userModel from '../models/userModel.js';
import {
	customErrors,
	customInfo,
	resetPassUrl,
	verifyUrl,
	panelPath,
	addAminSlug,
} from '../utils/variables.js';

import transporter from '../utils/transporter.js';

const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error('uzupełnij wszystkie pola');
		}

		const userAlreadyExists = await userModel.findOne({ email });

		if (userAlreadyExists) {
			return res
				.status(400)
				.json({ success: false, message: customErrors.userAlreadyExists });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(
			100000 + Math.random() * 900000
		).toString();

		const user = new userModel({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
			address: {},
			cartData: {},
		});

		await user.save();
		generateTokenAndSetCookie(res, user._id);
		if (process.env.MODE === 'production') {
			var mailOptions = {
				from: process.env.EMAIL,
				to: user.email,
				subject: 'Potwierdzenie adresu email',
				html:
					MAIL_HEADER.replace('{headTitle}', 'Weryfikacja adresu email') +
					USER_VERYFIKATION.replace('{name}', name)
						.replace('{verificationCode}', verificationToken)
						.replace(
							'{mailPath}',
							process.env.REACT_APP_CLIENT_URL + `${verifyUrl}`
						) +
					MAIL_FOOTER,
			};
			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log(customInfo.emailSent + info.response);
				}
			});
		}
		return res.status(201).json({
			success: true,
			message: customInfo.userCreatedSuccessfully,
		});
	} catch (error) {
		res.status(400).json({ success: false, message: customErrors.signup });
	}
};

const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await userModel.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: customErrors.expiriedCode });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();
		if (process.env.MODE === 'production') {
			var mailOptions = {
				from: process.env.EMAIL,
				to: user.email,
				subject: 'Mail powitalny',
				html:
					MAIL_HEADER.replace('{headTitle}', 'Weryfikacja adresu email') +
					WELCOME_EMAIL.replace('{name}', user.name).replace(
						'{mailPath}',
						process.env.REACT_APP_CLIENT_URL
					) +
					MAIL_FOOTER,
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log(customInfo.emailSent + info.response);
				}
			});
		}
		return res.status(200).json({
			success: true,
			message: customInfo.emailSentSuccessfully,
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log(customErrors.inVeirfyEmail, error);
		res.status(500).json({ success: false, message: customErrors.serverError });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await userModel.findOne({ email });
		console.log(user);

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: customErrors.invalidCredentials });
		}

		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res
				.status(400)
				.json({ success: false, message: customErrors.invalidCredentials });
		}

		if (!user.isVerified) {
			const verificationToken = Math.floor(
				100000 + Math.random() * 900000
			).toString();

			user.verificationToken = verificationToken;
			user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
			user.save();

			if (process.env.MODE === 'production') {
				var mailOptions = {
					from: process.env.EMAIL,
					to: user.email,
					subject: 'Potwierdzenie adresu email',
					html:
						MAIL_HEADER.replace('{headTitle}', 'Weryfikacja adresu email') +
						USER_VERYFIKATION.replace('{name}', user.name)
							.replace('{verificationCode}', verificationToken)
							.replace(
								'{mailPath}',
								process.env.REACT_APP_CLIENT_URL + `${verifyUrl}`
							) +
						MAIL_FOOTER,
				};
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log(customInfo.emailSent + info.response);
					}
				});
			}
			return res
				.status(400)
				.json({ success: false, message: customErrors.usernNotVerified });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: customInfo.loggedSuccessfully,
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log(customErrors.inLogin, error);
		res
			.status(400)
			.json({ success: false, message: customErrors.invalidCredentials });
	}
};

const logout = async (req, res) => {
	res.clearCookie('token');
	req.body.userId = '';
	req.userId = '';
	res
		.status(200)
		.json({ success: true, message: customInfo.loggedSuccessfully });
};

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await userModel.findOne({ email });

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: customErrors.userNotFound });
		}
		if (user.resetPasswordToken) {
			if (process.env.MODE === 'production') {
				var mailOptions = {
					from: process.env.EMAIL,
					to: user.email,
					subject: 'Przypomnienie hasła',
					html:
						MAIL_HEADER.replace('{headTitle}', 'Przypomnienie hasła') +
						PASSWORD_RESET.replace('{name}', user.name).replace(
							'{mailPath}',
							`${process.env.REACT_APP_CLIENT_URL}${resetPassUrl}/${user.resetPasswordToken}`
						) +
						MAIL_FOOTER,
				};
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log(customInfo.emailSent + info.response);
					}
				});
			}
			return res
				.status(200)
				.json({ success: true, message: customInfo.sentCodeToEmail });
		} else {
			const resetToken = crypto.randomBytes(20).toString('hex');
			const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

			user.resetPasswordToken = resetToken;
			user.resetPasswordExpiresAt = resetTokenExpiresAt;

			await user.save();
			if (process.env.MODE === 'production') {
				var mailOptions = {
					from: process.env.EMAIL,
					to: user.email,
					subject: 'Przypomnienie hasła',
					html:
						MAIL_HEADER.replace('{headTitle}', 'Przypomnienie hasła') +
						PASSWORD_RESET.replace('{name}', user.name).replace(
							'{mailPath}',
							`${process.env.REACT_APP_CLIENT_URL}${resetPassUrl}/${resetToken}`
						) +
						MAIL_FOOTER,
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log(customInfo.emailSent + info.response);
					}
				});
			}
			return res
				.status(200)
				.json({ success: true, message: customInfo.sentCodeToEmail });
		}
	} catch (error) {
		res
			.status(400)
			.json({ success: false, message: customErrors.invalidCredentials });
	}
};

const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await userModel.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: customInfo.expiriedCode });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();
		if (process.env.MODE === 'production') {
			var mailOptions = {
				from: process.env.EMAIL,
				to: user.email,
				subject: 'Hasło pomyślnie zresetowane',
				html:
					MAIL_HEADER.replace('{headTitle}', 'Przypomnienie hasła') +
					PASSWORD_RESET_SUCCESS.replace('{name}', user.name).replace(
						'{mailPath}',
						`${process.env.REACT_APP_CLIENT_URL}${resetPassUrl}/${user.resetPasswordToken}`
					) +
					MAIL_FOOTER,
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log(customInfo.emailSent + info.response);
				}
			});
		}
		return res
			.status(200)
			.json({ success: true, message: customInfo.resetSuccessfull });
	} catch (error) {
		res
			.status(400)
			.json({ success: false, message: customErrors.invalidCredentials });
	}
};

const setAddressData = async (req, res) => {
	try {
		const { token } = req.params;
		const { address } = req.body;

		const user = await userModel.findOne({
			token: token,
		});

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: customErrors.address });
		}

		user.address = address;
		await user.save();
		if (process.env.MODE === 'production') {
			var mailOptions = {
				from: process.env.EMAIL,
				to: user.email,
				subject: 'Zmiana domyślnego adresu dostawy',
				html:
					MAIL_HEADER.replace('{headTitle}', 'Przypomnienie hasła') +
					PASSWORD_RESET.replace('{name}', user.name).replace(
						'{mailPath}',
						process.env.REACT_APP_CLIENT_URL
					) +
					MAIL_FOOTER,
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log(customInfo.emailSent + info.response);
				}
			});
		}
		return res
			.status(200)
			.json({ success: true, message: customInfo.resetSuccessfull });
	} catch (error) {
		console.log(error.message);
		res
			.status(400)
			.json({ success: false, message: customErrors.invalidCredentials });
	}
};

const checkAuth = async (req, res) => {
	try {
		const user = await userModel.findById(req.userId).select('-password');
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: customErrors.userNotFound });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log(customErrors.inCheckAuth, error);
		res
			.status(400)
			.json({ success: false, message: customErrors.invalidCredentials });
	}
};

const userEmails = async (req, res) => {
	try {
		const users = await userModel.find({});
		let emailsArr = [];
		Object.entries(users).map(([item, i]) => {
			if (!emailsArr.includes(i['email'])) {
				emailsArr.push([i['email'], i['isAdmin']]);
			}
		});

		res.json({ success: true, data: emailsArr });
	} catch (error) {
		res.json({ success: false, message: customErrors.invalidCredentials });
	}
};

const setPermissions = async (req, res) => {
	const { emailArr, per, userId } = req.body;

	console.log(req.body);
	console.log(per);

	try {
		let usersArr = [];
		if (emailArr?.length > 0) {
			let emailDosentExistArr = [];
			for (const mail of emailArr) {
				const userExists = await userModel.findOne({ email: mail });
				if (!userExists) {
					emailDosentExistArr.push(mail);
				}
			}
			let emailsArr = [];
			if (emailDosentExistArr[0] == 'all') {
				usersArr = await userModel.find({});

				Object.entries(usersArr).map(([item, i]) => {
					if (!emailsArr.includes(i['email'])) {
						emailsArr.push(i['email']);
					}
				});
			} else if (emailDosentExistArr.length > 0) {
				return res.status(400).json({
					success: false,
					message:
						customErrors.userDosentExists +
						': ' +
						emailDosentExistArr.join(', '),
				});
			}
		} else {
			return res.status(400).json({
				success: false,
				message: customErrors.userDosentExists,
			});
		}

		let sendEmailArr = usersArr.length > 1 ? usersArr : emailArr;

		await sendEmailArr.forEach(async (mail) => {
			let email = mail.email ? mail.email : mail;

			const user = await userModel.findOne({ email: email });

			if (!user) {
				return res.status(400).json({
					success: false,
					message: customErrors.userDosentExists,
				});
			}

			if (!user.isMaster) {
				user.isAdmin = per;
				user.save();
			}

			if (process.env.MODE === 'production'&&!user.isMaster) {
				var mailOptions = {
					from: process.env.EMAIL,
					to: email,
					subject: per
						? 'Przyznano uprawnienia admina'
						: 'Odebrano uprawnienia administratora',
					html:
						MAIL_HEADER.replace(
							'{headTitle}',
							per ? 'Nowe uprawnienia' : 'Odebrane uprawnienia'
						) +
						REQ_SET_PERMISSIONS.replace('{name}', user.name)
							.replace(
								'{infoOne}',
								per
									? 'Pomyślnie przyznano Ci uprawnienia administratora. ;)'
									: 'Niestety uprawnienia administratora zostały odebrane. ;('
							)
							.replace(
								'{infoTwo}',
								per
									? 'Teraz śmiało możesz korzystać z naszego panelu:'
									: 'Jeśli chcesz poznać okoliczności skontaktuj się z administratorem'
							)
							.replace('{mailPath}', process.env.REACT_APP_CLIENT_URL) +
						MAIL_FOOTER,
				};
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log(customInfo.emailSent + info.response);
					}
				});
			}
		});



		res.status(201).json({
			success: true,
			message: customInfo.permissionsAddedSuccessfully,
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

const addPermissions = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await userModel.findOne({ email });

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: customErrors.invalidCredentials });
		}
		if (user.isAdmin === true) {
			return res
				.status(400)
				.json({ success: false, message: customErrors.userAlreadyIsAdmin });
		} else {
			if (process.env.MODE === 'production') {
				var mailOptions = {
					from: process.env.EMAIL,
					to: user.email,
					subject: 'Prośba o przyznanie uprawnień administratora',
					html:
						MAIL_HEADER.replace(
							'{headTitle}',
							'Przyznanie większych uprawnień'
						) +
						ADD_PERMISSIONS.replace('{name}', user.name).replace(
							'{mailPath}',
							process.env.REACT_APP_CLIENT_URL + `${panelPath}`
						) +
						MAIL_FOOTER,
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log(customInfo.emailSent + info.response);
					}
				});

				const admins = await userModel.find({
					isAdmin: true,
				});

				if (admins.length > 0) {
					admins.forEach((mail) => {
						let email = mail.email ? mail.email : mail;
						var mailOptions = {
							from: process.env.EMAIL,
							to: email,
							subject: 'Prośba o przyznanie uprawnień administratora',

							html:
								MAIL_HEADER.replace('{headTitle}', 'Przyznanie uprawnień') +
								REQ_ADD_PERMISSIONS.replace('{userName}', user.name)
									.replace('{userMail}', user.email)
									.replace(
										'{mailPath}',
										process.env.REACT_APP_CLIENT_URL + addAminSlug
									) +
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
			return res.status(200).json({
				success: true,
				message: customInfo.emailSentSuccessfully,
				user: {
					...user._doc,
					password: undefined,
				},
			});
		}
	} catch (error) {
		console.log(customErrors.inVeirfyEmail, error);
		res.status(500).json({ success: false, message: customErrors.serverError });
	}
};

export {
	login,
	signup,
	verifyEmail,
	logout,
	forgotPassword,
	resetPassword,
	checkAuth,
	setAddressData,
	userEmails,
	addPermissions,
	setPermissions,
};
