var express = require('express');
var router = express.Router();
var db = require('../db');

//주문자 정보 저장
router.post('/insert/purchase', function(req, res){
    const uid=req.body.uid;
    const rname=req.body.uname;
    const rphone=req.body.phone;
    const raddress1=req.body.address1;
    const raddress2=req.body.address2;
    const sum=req.body.sum;
    let sql=`insert into purchase(uid, rname, rphone, raddress1, raddress2, sum) values(?, ?, ?, ?, ?, ?)`;
    db.get().query(sql, [uid, rname, rphone, raddress1, raddress2, sum], function(err, rows){
        if(err) {
            console.log("order1 : ", err)
            res.send('0')
        }
        else{
            sql = `select last_insert_id() last from purchase`;
            db.get().query(sql, function(err, rows){
                console.log("order1-1 : ", err)
                //console.log(rows[0].last);
                res.send(rows[0].last.toString());
            });
        }
    });
});

//주문상품 등록
router.post('/insert', function(req, res){
    const cid=req.body.cid;
    const pid=req.body.pid;
    const bid=req.body.bid;
    const qnt=req.body.qnt;
    const price=req.body.price;
    let sql=`insert into orders(pid, bid, qnt, price) values(?, ?, ?, ?)`;
    db.get().query(sql, [pid, bid, qnt, price], function(err, rows){
        if(err){
            console.log("order2 : ", err)
            res.send('0')
        }else{
            sql=`delete from cart where cid=?`;
            db.get().query(sql, [cid], function(err,rows){
                console.log("order2-1 : ", err)
                res.send('1')
            });
        }
    });
});

//주문목록
router.get('/list/purchase.json', function(req, res){ //localhost:5000/orders/list/purchase.json?uid=blue
    const uid=req.query.uid;
    const page=req.query.page ? req.query.page : 1;
    const size=req.query.size ? req.query.size : 5;
    const sql=`call purchase_list(?, ?, ?)`;
    db.get().query(sql, [uid, page, size], function(err, rows){
        if(err) return console.log("order3 : ", err);
        res.send({list:rows[0], total:rows[1][0].total});
    });
});

//주문상품목록
router.get('/list/order.json', function(req, res){ //localhost:5000/orders/list/order.json?pid=39
    const pid=req.query.pid;
    const sql=`call orders_list(?)`;
    db.get().query(sql, [pid], function(err, rows){
        if(err) return ("order4 : ", err);
        res.send(rows[0]);
    })
});

//주문상품목록(관리자용)
router.get('/list.json', function(req, res){ //localhost:5000/orders/list.json
    const page=req.query.page ? req.query.page : 1;
    const size=req.query.size ? req.query.size : 3;
    const query=req.query.qeury ? req.query.query : '';
    const sql=`call purchase_all(?, ?, ?)`;
    db.get().query(sql, [query, page, size], function(err, rows){
        if(err) return console.log("order5 : ", err)
        res.send({list:rows[0], total:rows[1][0].total})
    })
})

module.exports = router;