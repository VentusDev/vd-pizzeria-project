import express from 'express';
import {
	addCategory,
	listCategories,
	removeCategory,
    updateCategory
} from '../controllers/categoryController.js';
import { adminMiddleware } from '../middleware/auth.js';
import uploadImageHandler  from '../middleware/uploadImageMiddleware.js';


const categoryRoute = express.Router();
categoryRoute.post('/add',adminMiddleware,uploadImageHandler,addCategory)
categoryRoute.post('/remove', adminMiddleware, removeCategory);
categoryRoute.post('/list', listCategories);
categoryRoute.post('/update',adminMiddleware,uploadImageHandler,updateCategory)

export default categoryRoute;
