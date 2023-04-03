fs = require("fs");
http = require("http");
url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

///////////// Server /////////////

const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/card.html`,
  "utf-8"
);
const productsTemplate = fs.readFileSync(
  `${__dirname}/templates/products.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/overview" || pathname === "/") {
    // Overview page
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const cardsHtml = dataObj.map((ele) => replaceTemplate(cardTemplate, ele));
    const output = overviewTemplate.replace("%PRODUCT_CARDS%", cardsHtml);
    res.end(output);
  } else if (pathname === "/product" && Number(query.id) < dataObj.length) {
    // Product page
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const product = dataObj.find((ele) => ele.id === Number(query.id));
    const output = replaceTemplate(productsTemplate, product);
    res.end(output);
  } else if (pathname === "/api") {
    // API
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  } else {
    // Not found page
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
