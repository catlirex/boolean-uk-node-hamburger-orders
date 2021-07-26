const express = require("express");
const hamburgersRouter = express.Router();

hamburgersRouter.get("/", (req, res) => {
  const { burgerList } = req.hamburgersDB;
  const queryContent = req.query;

  if (Object.keys(queryContent).length === 0)
    res.json({ HamburgerList: burgerList });
  else res.json({ error: "No query accepted" });
});

hamburgersRouter.post("/", (req, res) => {
  const { postBurger } = req.hamburgersDB;
  postBurger(req.body);

  const response = {
    route: req.originalUrl,
    method: req.method,
    body: req.body,
  };

  res.json({ response });
});

hamburgersRouter.patch("/:id", (req, res) => {
  const { patchBurger, burgerList } = req.hamburgersDB;

  let updateTarget = burgerList.find(
    (target) => target.id === Number(req.params.id)
  );
  if (!updateTarget) res.json({ Error: "Burger not find" });

  updateTarget = { ...updateTarget, ...req.body };
  patchBurger(Number(req.params.id), updateTarget);

  res.json({ updateTarget });
});

module.exports = hamburgersRouter;
