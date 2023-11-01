var express = require('express');
var router = express.Router();
var db = require('../db');

//리뷰목록
router.get('/list.json', function(req, res){ //localhost:5000/review/list.json?bid=59
    const bid=req.query.bid;
    const page=req.query.page ? req.query.page : 1;
    const size=req.query.size ? req.query.size : 5;
    const sql=`call review_list(?, ?, ?)`;
    db.get().query(sql, [bid, page, size], function(err, rows){
        if(err) return console.log("review1 : ", err)
        else res.send({list:rows[0], total:rows[1][0].total})
    });
});


module.exports = router;