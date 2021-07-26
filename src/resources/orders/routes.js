const express = require("express");
const ordersRouter = express.Router();

ordersRouter.get("/", (req, res) => {
  const { ordersList } = req.ordersDB;
  const queryContent = req.query;

  if (Object.keys(queryContent).length === 0)
    res.json({ OrdersList: ordersList });
  else res.json({ error: "No query accepted" });
});

ordersRouter.get("/criticals", (req, res) => {
  const { ordersList } = req.ordersDB;
  let currentTime = Date.now();
  let urgentList = ordersList.filter(
    (target) =>
      target.status === "pending" && currentTime - target.created_at > 600000
  );

  res.json({ UrgentOrder: urgentList });
});

ordersRouter.post("/", (req, res) => {
  const { postOrder, ordersList } = req.ordersDB;
  const { burgerList, patchBurger } = req.hamburgersDB;
  let newOrder = req.body;
  let error = false;
  for (const item of newOrder.items) {
    const targetBurger = burgerList.find(
      (target) => target.id === item.hamburger_id
    );
    if (!targetBurger) {
      error = true;
      res.json({ Error: `Burger with id <${item.hamburger_id}> not found` });
    }

    if (targetBurger.quantity < item.quantity) {
      error = true;
      res.json({
        Error: `${targetBurger.name} <id: ${item.hamburger_id}> availability: ${targetBurger.quantity}. You failed to order ${item.quantity}.`,
      });
    }
  }
  if (error === false) {
    newOrder.order_id = ordersList[ordersList.length - 1].order_id + 1;
    newOrder.status = "pending";
    newOrder.created_at = Date.now();
    postOrder(newOrder);
    for (const item of newOrder.items) {
      const targetBurger = burgerList.find(
        (target) => target.id === item.hamburger_id
      );
      (targetBurger.quantity = targetBurger.quantity - item.quantity),
        patchBurger(item.hamburger_id, targetBurger);
    }

    res.json({ newOrder });
  }
});

ordersRouter.delete("/:id", (req, res) => {
  const { deleteOrder, ordersList } = req.ordersDB;

  const target = ordersList.find(
    (target) => target.id === Number(req.params.id)
  );
  if (!target) res.json({ response: "Fail to delete, Id not found" });

  deleteOrder(Number(req.params.id));
  res.json({ response: "ok" });
});

ordersRouter.patch("/:id", (req, res) => {
  const { patchOrder, ordersList } = req.ordersDB;

  let updateTarget = ordersList.find(
    (target) => target.id === Number(req.params.id)
  );
  if (!updateTarget) res.json({ Error: "Target not find" });

  let toUpdateDetail = req.body;
  if (
    !Object.keys(toUpdateDetail).some((key) => key === "id" || key === "status")
  )
    return res.json({ Error: "You can only update the Status" });

  updateTarget = { ...updateTarget, ...req.body };
  patchOrder(Number(req.params.id), updateTarget);

  res.json({ updateTarget });
});

module.exports = ordersRouter;
