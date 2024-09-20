const getDifferentBit = (origin, target) => {
  let differentBits = 0;
  let position;

  for (let i = 0; i < origin.length; i++) {
    if (origin[i] !== target[i]) {
      differentBits++;
      position = i;
    }
  }

  return differentBits === 1 ? position : null;
};

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const binary = (variables, decimal) => {
  const binaryString = decimal.toString(2);

  return "0".repeat(variables - binaryString.length) + binaryString;
};

module.exports = {
  read: readline,
  binary: binary,
  getDifferentBit: getDifferentBit,
};
