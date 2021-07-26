let hamburgersDB = {
  burgerList: [
    {
      id: 8,
      name: "Vegetarian Burger",
      quantity: 10,
      restaurant: "Indian Burgers",
      web: "https://www.cookwithmanali.com/vegetarian-burger-indian-style/",
      description:
        "With summer around the corner, I had to share a vegetarian burger recipe with you guys. Actually I plan to share more in the next month but I thought I will start with this Indian style Vegetarian Burger aka Masala Burger!",
      ingredients: [
        "american cheese",
        "burger sauce",
        "french mustard",
        "pickes",
        "onion",
        "Veggies",
      ],
    },
    {
      id: 9,
      name: "Fat Santa",
      quantity: 5,
      restaurant: "Sky City Hamilton",
      web: "https://skycityhamilton.co.nz/eat-drink/eat-burger/",
      description: "A Christmas themed burger",
      ingredients: [
        "chicken thigh",
        "champagne ham",
        "sage and onion stuffing",
        "gravy mash",
        "lettuce",
        "tomato",
        "cranberry sauce",
      ],
    },
    {
      id: 10,
      name: "Blondie",
      quantity: 3,
      restaurant: "Yankys",
      web: "http://yankyslambton.co.za/menu/",
      description: "Delicious steak burger",
      ingredients: [
        "steak",
        "BBQ sauce",
        "bacon",
        "egg",
        "cheese",
        "lettuce",
        "tomato",
        "onion",
        "gerkins",
      ],
    },
    {
      id: 11,
      name: "Monster Burger",
      quantity: 50,
      restaurant: "Yankys",
      web: "http://yankyslambton.co.za/menu/",
      description: "Massive meaty burger - the size of a dinner plate",
      ingredients: [
        "250g patty",
        "bacon",
        "cheese",
        "2 eggs",
        "steak",
        "BBQ sauce",
        "lettuce",
        "tomato",
        "onion",
        "gerkins",
      ],
    },
  ],
  postBurger: (newBurger) => {
    hamburgersDB.burgerList = [...hamburgersDB.burgerList, newBurger];
  },
  patchBurger: (id, updatedBurger) => {
    hamburgersDB.burgerList = hamburgersDB.burgerList.map((target) => {
      if (target.id === id) return updatedBurger;
      else return target;
    });
  },
};

let ordersDB = {
  ordersList: [
    {
      order_id: 1,
      items: [
        { hamburger_id: 9, quantity: 2 },
        { hamburger_id: 10, quantity: 1 },
      ],
      status: "pending",
      created_at: 1627020599070,
    },
    {
      order_id: 2,
      items: [
        { hamburger_id: 8, quantity: 2 },
        { hamburger_id: 9, quantity: 1 },
      ],
      status: "served",
      created_at: 1627020599070,
    },
  ],
  postOrder: (newOrder) => {
    ordersDB.ordersList = [...ordersDB.ordersList, newOrder];
  },
  deleteOrder: (id) => {
    ordersDB.ordersList = ordersDB.ordersList.map((target) => {
      if (target.id !== id) return target;
    });
  },
  patchOrder: (id, updatedOrder) => {
    ordersDB.ordersList = ordersDB.ordersList.map((target) => {
      if (target.id === id) return updatedOrder;
      else return target;
    });
  },
};

const express = require("express");
const morgan = require("morgan");

const hamburgersRouter = require("./resources/hamburgers/routes");
const ordersRouter = require("./resources/orders/routes");

const app = express();
const port = 3030;

app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  req.hamburgersDB = hamburgersDB;
  req.ordersDB = ordersDB;

  next();
});

app.use("/hamburgers", hamburgersRouter);
app.use("/orders", ordersRouter);

app.listen(port, () => {
  console.log("Server is running");
});
