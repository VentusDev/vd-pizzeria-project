import express from 'express'
import { authOrderMiddleware } from '../middleware/auth.js'
import { placeOrder, userOrders, listOrders, updateStatus, removeOrder, verifyOrderCode } from '../controllers/orderController.js'
import { orderSlug, userOrdersUrl } from '../variables.js'

const orderRoute = express.Router();

orderRoute.post('/place',authOrderMiddleware,placeOrder) 
orderRoute.post(orderSlug,verifyOrderCode)
orderRoute.post(userOrdersUrl,authOrderMiddleware,userOrders) 
orderRoute.get('/list',listOrders)
orderRoute.post('/status',updateStatus)
orderRoute.post('/remove',removeOrder)

export default orderRoute