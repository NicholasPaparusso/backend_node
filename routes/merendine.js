const express = require('express');

const {getAll} = require('../database/merendine_db');
const router = express.Router();


router.get('/', async (req, res, next)=> {
    // console.log(req.token);
    try {
        const merendine = await getAll();
        res.json( merendine );
      } catch (error) {
        next(error);
      }
});

module.exports = router;
