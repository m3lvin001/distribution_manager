require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const cors = require("cors");

const { pool } = require("./connection");
const { stkPush } = require("./stk");
const { accessTokenGenerator } = require("./accessTokenGenerator");
const { createDatabase } = require('./dbInit')
const app = express();
const port = process.env.PORT || 5000;
createDatabase();
//middleware configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/", express.static(path.join(__dirname, "/front-end/build")));

//creating database pool connection
pool.getConnection((err, conn) => {
  if (err) throw err;
  console.log(conn.state);
});
//add item
app.post(`/add-product`, (req, res) => {
  console.log(req.body);
  const { price, product, category, image } = req.body;
  let sql = `INSERT INTO items(title,price,category,image) VALUES('${product}',${price},'${category}','${image}')`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.end();
  });
});
//adds product to cut
app.post(`/add-to-cart`, (req, res) => {
  console.log(req.body);
  const { customerId, itemId, price, quantity } = req.body;
  let sql = `INSERT INTO cart(customerId,itemId,price) VALUES(${customerId},${itemId},${price})`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.end();
  });
});
//get all products
app.get(`/all-products`, (req, res) => {
  pool.query(`SELECT * FROM items;`, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
//delete product
app.post("/delete-product", (req, res) => {
  pool.query(
    `DELETE FROM items WHERE id=${req.body.productId}`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});
//gets all orders
app.get(`/all-orders`, (req, res) => {
  pool.query(
    `SELECT * FROM orders WHERE DS='waiting' order by id DESC;`,
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
    }
  );
});
//get all deliverers
app.get(`/all-deliverers`, (req, res) => {
  pool.query(`SELECT * FROM deliverer;`, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});
//get all delivered orders
app.get(`/delivered-orders/:user/:sort`, (req, res) => {
  let sql = "";
  const { user, sort } = req.params;
  if (user == "vendor") {
    sql = `SELECT * FROM orders WHERE DS='delivered' AND PS="paid";`;
  } else {
    sql = `SELECT * FROM orders WHERE DS='delivered' AND PS="paid" AND delivererId=${sort};`;
  }
  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

//gets order for specific deliverers
app.get(`/all-orders/:user`, (req, res) => {
  const { user } = req.params;
  let sql = `SELECT * FROM orders WHERE DS ='waiting' AND delivererId=${user};`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

//gets order for specific deliverers
app.get(`/client-orders/:user`, (req, res) => {
  const { user } = req.params;
  let sql = `SELECT * FROM orders WHERE customerId=${user} order by id DESC;`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});
//gets all the items matching and order
app.get(`/items/:orderId`, (req, res) => {
  pool.query(
    `SELECT * FROM items WHERE orderId=${req.params.orderId};`,
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
    }
  );
});
//gets account details  for each user
app.get(`/account-details/:user/:id`, (req, res) => {
  pool.query(
    `SELECT * FROM ${req.params.user} WHERE id=${req.params.id};`,
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
    }
  );
});
//gets order items
app.get(`/order-items/:orderId`, (req, res) => {
  pool.query(
    `SELECT * FROM orderItems WHERE orderId=${req.params.orderId};`,
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
    }
  );
});
//gets user-address
app.get(`/user-address/:customerId`, (req, res) => {
  pool.query(
    `SELECT * FROM customers WHERE id =${req.params.customerId};`,
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
    }
  );
});
//gets newspaper
app.get(`/newspapers`, (req, res) => {
  pool.query(
    `SELECT * FROM items WHERE category='newspaper';`,
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
    }
  );
});

//assign delivere
app.post(`/assign`, (req, res) => {
  console.log(req.body);
  pool.query(
    `UPDATE orders SET delivererId=${req.body.delivererId},delivererName='${req.body.delivererName}' WHERE id=${req.body.orderId};`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

//gets magazines
app.get(`/magazines`, (req, res) => {
  pool.query(
    `SELECT * FROM items WHERE category='magazine';`,
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
    }
  );
});
//checks cart
app.get(`/incart/:id`, (req, res) => {
  pool.query(
    `SELECT EXISTS(SELECT * FROM cart WHERE itemId=${req.params.id}) AS incart;`,
    (err, result) => {
      if (err) throw err;
      console.log(result[0].incart);
      // let cartResponse = {
      //   incart: result[0].incart,
      // };
      res.json(result);
    }
  );
});

//get cart items
app.get(`/cart-items`, (req, res) => {
  pool.query(`SELECT * FROM cart;`, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
//move to order items
app.post(`/move-to-order-items`, (req, res) => {
  pool.query(
    `SELECT * FROM cart WHERE customerId=${req.body.customerId};`,
    (err, result) => {
      if (err) throw err;
      let r = result;
      for (let i = 0; i < r.length; i++) {
        let sql = `INSERT INTO orderItems(orderId,itemId,price,quantity) VALUES(${req.body.orderId},${r[i].itemId},${r[i].price},${r[i].quantity})`;
        pool.query(sql, (err, result) => {
          if (err) throw err;
        });
      }
      res.end();
    }
  );
});

//update quantity
app.post(`/update-quantity`, (req, res) => {
  pool.query(
    `UPDATE cart SET quantity =${req.body.q} WHERE id=${req.body.id};`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});
//confirm order
app.get(`/confirm-order/:orderId`, (req, res) => {
  console.log("Confirm order recieved");
  pool.query(
    `UPDATE orders SET DS='delivered',PS='paid' WHERE id=${req.params.orderId};`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});
//remove cart item
app.post(`/remove-cart-item`, (req, res) => {
  pool.query(`DELETE FROM cart WHERE id=${req.body.id};`, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
//get product details
app.get(`/product-details/:id`, (req, res) => {
  pool.query(
    `SELECT * FROM items WHERE id =${req.params.id};`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

//STK ROUTES

app.post("/stk_callback", (req, res, next) => {
  console.log("##==========stk Response============##\n\n");
  console.log(prettyjson.render(req.body), "\n\n");

  console.log(
    `MerchantRequestId: ${req.body.Body.stkCallback["MerchantRequestID"]}`
  );
  console.log(
    `CheckoutRequestID: ${req.body.Body.stkCallback["CheckoutRequestID"]}`
  );
  console.log(`ResultCode:${req.body.Body.stkCallback["ResultCode"]}`);
  console.log(`ResultCode:${req.body.Body.stkCallback["ResultDesc"]}`);

  let MerchantRequestID = req.body.Body.stkCallback["MerchantRequestID"];
  let ResultCode = req.body.Body.stkCallback["ResultCode"];
  let CheckoutRequestID = req.body.Body.stkCallback["CheckoutRequestID"];

  let sql = "";

  if (ResultCode == 0) {
    const data = req.body.Body.stkCallback["CallbackMetadata"].Item;
    const search = (searchKey, arr) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].Name == searchKey) {
          return arr[i].Value;
        }
      }
    };

    let AMOUNT = search("Amount", data);
    let RECEIPT = search("MpesaReceiptNumber", data);
    let TRANSACTIN_DATE = search("TransactionDate", data);
    let PHONE = search("PhoneNumber", data);

    console.log(`AMOUNT: ${AMOUNT}`);
    console.log(`RECEIPT: ${RECEIPT}`);
    console.log(`TRANSACTIN_DATE: ${TRANSACTIN_DATE}`);
    console.log(`PHONE: ${PHONE} \n`);

    sql = dbsql.completeTransaction(
      MerchantRequestID,
      CheckoutRequestID,
      AMOUNT,
      RECEIPT,
      TRANSACTIN_DATE,
      PHONE
    );
  } else {
    console.warn("Unable to complete request.\n Rolling back");
    sql = `DELETE FROM transactions WHERE MerchantRequestID='${MerchantRequestID}' AND CheckoutRequestID='${CheckoutRequestID}';`;
  }

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).end();
  });
});

//new order
app.post(`/new-order`, (req, res, next) => {
  console.log(req.body);

  const {
    customerId,
    orderDescription,
    amount,
    paymentMode,
    physicalAddress,
  } = req.body;

  let sql = `INSERT INTO orders(customerId,orderDescription,amount,paymentMode,physicalAddress) VALUES(${customerId},'${orderDescription}',${amount},'${paymentMode}','${physicalAddress}')`;
  pool.query(sql, (err, result, field) => {
    if (err) throw err;
    console.log(result);
    next();
  });
},
  //generate Token
  accessTokenGenerator,
  //STK push
  stkPush
);

//clear cart
app.post(`/clear-cart`, (req, res) => {
  console.log(req.body);
  let sql = `DELETE FROM cart WHERE customerId=${req.body.customerId};`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.end();
  });
});
//update user details
app.post(`/update/:user/:userId`, (req, res) => {
  console.log(req.body);
  const { firstname, lastname, phone, email, physicalAddress } = req.body;
  pool.query(
    `UPDATE ${req.params.user} SET firstname='${firstname}',lastname='${lastname}',phone='${phone}',email='${email}',physicalAddress='${physicalAddress}' WHERE id=${req.params.userId};`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});
//register user details
app.post(`/add-user/:user`, (req, res) => {
  console.log(req.body);
  const { firstname, lastname, phone, email, physicalAddress, pass } = req.body;
  pool.query(
    `INSERT INTO ${req.params.user} (firstname, lastname, phone, email, physicalAddress,pass) VALUES('${firstname}','${lastname}','${phone}','${email}','${physicalAddress}','${pass}');`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

//update user details
app.post(`/update-key/:user/:userId`, (req, res) => {
  console.log(req.body);
  const { pass, current } = req.body;
  pool.query(
    `SELECT EXISTS(SELECT * FROM ${req.params.user} WHERE id =${req.params.userId} AND pass='${current}') AS available;`,
    (err, result) => {
      if (err) throw err;
      console.log(result[0].available);
      if (result[0].available) {
        pool.query(
          `UPDATE ${req.params.user} SET pass='${pass}' WHERE id=${req.params.userId};`,
          (err, result) => {
            if (err) throw err;
            res.json("Changes susccessful");
          }
        );
      } else {
        res.json("Wrong details please enter correct details");
      }
    }
  );
});

//User Login
app.post(`/auth-user/:user`, (req, res) => {
  console.log(req.body);
  const { pass, email } = req.body;
  pool.query(
    `SELECT EXISTS(SELECT * FROM ${req.params.user} WHERE email='${email}' AND pass='${pass}') AS available;`,
    (err, result) => {
      if (err) throw err;
      console.log(result[0].available);
      let available = result[0].available;
      if (available) {
        pool.query(
          `SELECT * FROM ${req.params.user} WHERE email='${email}' AND pass='${pass}';`,
          (err, result) => {
            if (err) throw err;
            let userId = result[0].id;
            res.json({ available, userId });
          }
        );
      } else {
        res.json({ available });
      }
    }
  );
});

//For any other unmatched request
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/front-end/build", "index.html"));
});
//set to listen to port 5000 || environment port
app.listen(port, () => console.log("Listenning to port:", port));
