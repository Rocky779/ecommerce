const express = require("express");
require('dotenv').config();
const app = express();
app.use(express.static("public"));
app.use(express.json());
const stripe = require('stripe')
app.get("/",function(req, res){
    res.sendFile("index.html",{root:'public'});
  }
);
app.get("/success",function(req, res){
    res.sendFile("success.html",{root:'public'});
  }
);
app.get("/cancel",function(req, res){
    res.sendFile("cancel.html",{root:'public'});
  }
);
let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;
app.post("/stripe-checkout", async (req, res) => {
    const lineItems = req.body.items.map((item) => {
    const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
    console.log("item-price:", item.price);
    console.log("unitAmount:", unitAmount);
    return{
        price_data: {
            currency: "usd",
            product_data: {
            name: item.title,
            images: [item.productImg],
            },
            unit_amount: unitAmount,
            },
            quantity: 3
    };
  });  
  console.log("lineItems:", lineItems);
  const session = await stripeGateway.checkout. sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${DOMAIN}/success`,
    cancel_url: `${DOMAIN}/cancel`,
    line_items: lineItems,
    billing_address_collection: "required",
});
res.json(session.url);
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
