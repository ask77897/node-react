var express = require('express');
var router = express.Router();
var db = require('../db');

//카트 등록
router.post('/insert', function(req, res){
    const uid=req.body.uid;
    const bid=req.body.bid;
    let sql=`select * from cart where uid=? and bid=?`;
    db.get().query(sql, [uid, bid], function(err, rows){
        if(err) return console.log('cart1 : ', err)
        if(rows.length===0){
            sql=`insert into cart(uid, bid) value(?, ?)`;
            db.get().query(sql, [uid, bid], function(err, rows){
                if(err) return console.log('cart2 : ', err)
                res.send('0')
            })
        }else{
            sql=`update cart set qnt=qnt+1 where uid=? and bid=?`;
            db.get().query(sql, [uid, bid], function(err, rows){
                if(err) return console.log('cart3 : ', err)
                res.send('1')
            })
        }
    })
})

//카트 목록
router.get('/list.json', function(req, res){ //localhost:5000/cart/list.json?uid=blue&page=1&size=5
    const uid=req.query.uid;
    const page=req.query.page;
    const size=req.query.size;
    const sql=`call cart_list(?, ?, ?)`;
    db.get().query(sql, [uid, page, size], function(err, rows){
        if(err) return console.log('cart4 : ', err)
        res.send({list:rows[0], total:rows[1][0].total})
    });
});

//총합계
router.get('/sum', function(req, res){ //localhost:5000/cart/sum?uid=blue
    const uid=req.query.uid;
    const sql=`call cart_sum(?)`;
    db.get().query(sql, [uid], function(err, rows){
        if(err) return console.log("cart5 : ", err);
        res.send(rows[0][0]);
    });
});

//상품 삭제
router.post('/delete', function(req, res){
    const cid=req.body.cid
    const sql = `delete from cart where cid=?`;
    db.get().query(sql, [cid], function(err, rows){
        if(err) return console.log("cart6 : ", err), res.send('0');
        else res.send('1');
    });
});

//상품 수량 변경
router.post('/update', function(req, res){
    const cid=req.body.cid;
    const qnt=req.body.qnt;
    const sql=`update cart set qnt=? where cid=?`;
    db.get().query(sql, [qnt, cid], function(err, rows){
        if(err) return console.log("cart7 : ", err), res.send('0');
        else res.send('1');
    });
});

module.exports = router;