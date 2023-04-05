const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 2;

setTimeout(() => console.log("Timer 1 finished"), 0);

console.log("Top-level finished");

fs.readFile("text.txt", "utf-8", () => {
  console.log("I/O polling finished");
  console.log("-------------------------");

  setImmediate(() => console.log("Immediate 3 finished"));
  setImmediate(() => console.log("Immediate 2 finished"));

  setTimeout(() => console.log("Timer 2 finished"), 0);

  process.nextTick(() => console.log("Next Ticks 2 finished"));

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
});
setImmediate(() => console.log("Immediate 1 finished"));
process.nextTick(() => console.log("Next Ticks 1 finished"));
