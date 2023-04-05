const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1
  // fs.readFile("text.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // Solution 2: Streams
  // const readable = fs.createReadStream("text.txt");
  // readable.on("data", (chunk) => {
  //   res.write(chunk);
  // });

  // readable.on("end", () => {
  //   res.end();
  // });

  // readable.on("error", (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end("File not found");
  // });

  // Solution 3
  const readable = fs.createReadStream("text.txt");
  readable.pipe(res); // readableSource.pipe(writableDest)
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening... ");
});
