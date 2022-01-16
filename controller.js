const axios = require("axios");
const cheerio = require("cheerio");

let finalData = {};
let htmlData;
const fetchdata = async () => {
  let url = "https://www.chessgames.com/chessecohelp.html";
  let data = await axios
    .get(url)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      console.log(err);
    });
  const $ = cheerio.load(data);
  const tableElement = $("tr");
  htmlData = tableElement.text();
  tableElement.each((idx, el) => {
    let row = $(el).text();
    const opening = {
      name: "",
      moves: "",
    };
    let code = row.slice(0, 3);
    row = row.slice(3);
    let splitIdx;
    for (let i = 1; i < row.length; i++) {
      if (row[i] === "1" && row[i - 1] === "\n") {
        splitIdx = i;
        break;
      }
    }
    opening.name = row.slice(0, splitIdx);
    opening.moves = row.slice(splitIdx);
    finalData[code] = opening;
  });
  return finalData;
};

const nextMove = async (code, givenMoves) => {
  let allMoves = finalData[code].moves;
  allMoves = allMoves.split(" ");
  let temp = [];
  for (let i = 0; i < allMoves.length; i++) {
    if (!/^\d+$/.test(allMoves[i])) {
      temp.push(allMoves[i]);
    }
  }
  allMoves = temp;
  let lastMove = givenMoves[givenMoves.length - 1];
  for (let i = 0; i < allMoves.length; i++) {
    if (allMoves[i] === lastMove) {
      if (i + 1 == allMoves.length) return null;
      else {
        return allMoves[i + 1];
      }
    }
  }
  return null;
};

module.exports = {
  fetchdata,
  nextMove,
};
