import express from 'express'
import { addItems,itemsList,removeItem, updateItem, itemsCat } from '../controllers/itemsController.js'
import { adminMiddleware } from '../middleware/auth.js';
import uploadImageHandler  from '../middleware/uploadImageMiddleware.js';


const itemsRoute = express.Router();

itemsRoute.post('/add',adminMiddleware,uploadImageHandler,addItems)
itemsRoute.get('/list',itemsList)
itemsRoute.get('/categories',itemsCat)
itemsRoute.post('/remove',adminMiddleware,removeItem)
itemsRoute.post('/update',adminMiddleware,uploadImageHandler,updateItem)





export default itemsRoute;