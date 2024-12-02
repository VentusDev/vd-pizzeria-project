import path from 'path';
import multer from 'multer';
import multerConfig from './multerConfig.js';
import sharp from 'sharp';
import itemsModel from '../models/itemsModel.js';
import categoryModel from '../models/categoryModel.js';

export default (req, res, next) => {
	const upload = multer(multerConfig).single('image');

	upload(req, res, async (err) => {
		if (err) {
			try {
				switch (err.code) {
					case 'LIMIT_INVALID_TYPE':
						throw new Error('Możliwe są zdjęcia w formacie PNG i JPEG');

					case 'LIMIT_FILE_SIZE':
						throw new Error('Zdjęcie jest za duże. Dopuszcza się max 2MB');

					default:
						throw new Error('Coś poszło nie tak. Spróbuj ponownie później');
				}
			} catch (err) {
				res.status(400).json({ message: err.message });
				return;
			}
		}

		try {

			if(req?.file?.originalname){
				let imageName = req?.file?.originalname;
				const imgCatAlreadyExists = await categoryModel.findOne({
					image: imageName,
				});
				const imgItemAlreadyExists = await itemsModel.findOne({
					image: imageName,
				});
				if (imgCatAlreadyExists || imgItemAlreadyExists) {
					const slug = Math.floor(10 + Math.random() * 90).toString();
	
					imageName = slug + '_' + req?.file?.originalname
				}
				const __dirname = path.resolve();
				const filename = `${imageName}`;
				const saveTo = path.resolve(__dirname, 'uploads');
				const filePath = path.join(saveTo, filename);
	
				await sharp(req.file.buffer)
					.resize({ width: 300 })
					/*           .resize(300, 300, {
				fit: sharp.fit.outside,
			  }) */
					//.jpeg({ quality: 95 })
					.toFile(filePath);
	
				req.file.filename = filename;
			}


			next();
		} catch (err) {
			res.status(400).json({ message: err.message });
			return;
		}
	});
};
