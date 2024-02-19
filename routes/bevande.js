const express = require('express');

const {getAllBevande,getAll} = require('../database/bevande_db');
const router = express.Router();


router.get('/', async (req, res, next)=> {
    // console.log(req.token);
    try {
        const bevande = await getAll();
        res.json( bevande );
      } catch (error) {
        next(error);
      }
});

module.exports = router;
