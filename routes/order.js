const express = require('express');
const {createOrder, createOrderItems,reduceItemQuantity} = require('../database/order_db');

const router = express.Router();


router.post('/', async (req, res, next)=> {
    const userId = req.body.userId;
    const totale = req.body.totale;
    const items = req.body.items;

    const orderId = await createOrder(userId,totale);

    if(orderId > 0){

      const isItemQtyReduced = await reduceItemQuantity(items);

      if(isItemQtyReduced.warningCount === 0){
        try{
          const orderItems = await createOrderItems(items,orderId);
          res.json(orderItems.warningCount === 0);
        }catch(error){
          next(error);
        }
      }

    }
});

module.exports = router;
