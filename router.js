const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.get(/\//, async (req, res) => {
  let finalData = await controller.fetchdata();
  let url = req.url;
  url = url.split("/");
  let temp = [];
  for (let i = 0; i < url.length; i++) {
    if (url[i] !== "") temp.push(url[i]);
  }
  url = temp;
  if (url.length === 0) {
    res.send(finalData);
  } else if (url.length === 1) {
    res.send(
      "<h1>" + finalData[url[0]].name + "</h1>" + finalData[url[0]].moves
    );
  } else if (url.length > 1) {
    let code = url[0];
    let move = await controller.nextMove(code, url);
    if (move === null) {
      res.send("No move found");
    } else {
      res.send(move);
    }
  } else {
    res.send("Page Not found");
  }
});

module.exports = router;
