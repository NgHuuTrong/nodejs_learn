// class Calculator {
//   constructor() {}
//   add(a, b) {
//     return a + b;
//   }

//   multiply(a, b) {
//     return a * b;
//   }

//   divide(a, b) {
//     return a / b;
//   }
// }

// module.export = Calculator;

module.exports = {
  constructor() {
    console.log("Constructor");
  },
  add(a, b) {
    return a + b;
  },

  multiply(a, b) {
    return a * b;
  },

  divide(a, b) {
    return a / b;
  },
};
