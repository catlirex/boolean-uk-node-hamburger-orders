const express = require("express");
const hamburgersRouter = express.Router();

hamburgersRouter.get("/", (req, res) => {
  const { burgerList } = req.hamburgersDB;
  const queryContent = req.query;

  if (Object.keys(queryContent).length === 0)
    res.json({ HamburgerList: burgerList });
  if (!Object.keys(queryContent).some((key) => key === "with"))
    res.json({ Error: "Query not found" });
  if (queryContent.with) {
    let filterBurgerList = burgerList.filter((target) =>
      target.ingredients.some((ingredient) => ingredient === queryContent.with)
    );

    res.json({ filterBurgerList });
  }
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
