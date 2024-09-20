const { read, binary, getDifferentBit } = require("./util.js");

const pairUp = (groups) => {
  const pairGroups = [];
  //[ [{pair: "0,1", binary: "000-"}] ]

  for (let i = 0; i < groups.length - 1; i++) {
    for (let j = 0; j < groups[i].length; j++) {
      const pairs = [];

      for (let k = 0; k < groups[i + 1].length; k++) {
        const bitPosition = getDifferentBit(
          groups[i][j].min.binary,
          groups[i + 1][k].min.binary
        );

        if (bitPosition !== null) {
          pairObject = {
            pair: groups[i][j].min.minterm + "," + groups[i + 1][k].min.minterm,
            binary: groups[i][j].min.binary.replaceAt(bitPosition, "-"),
          };

          pairs.push(pairObject);
        }
      }

      pairGroups.push(pairs);
      //{ ones: 0, min: { minterm: 0, binary: '0000' } }
      //[
      //{ ones: 1, min: { minterm: 1, binary: '0001' } },
      //{ ones: 1, min: { minterm: 2, binary: '0010' } },
      //{ ones: 1, min: { minterm: 4, binary: '0100' } },
      //{ ones: 1, min: { minterm: 8, binary: '1000' } }
      //]
    }
  }

  console.log(pairGroups);
};

const group = (variables, minterms) => {
  const orderedGroups = [];
  const groups = [];
  let maxOnes = 0;

  for (let minterm of minterms) {
    const minBinary = binary(variables, +minterm);
    const ones = minBinary.split("1").length - 1;
    const mintermObject = {
      minterm: +minterm,
      binary: minBinary,
    };

    if (ones > maxOnes) {
      maxOnes = ones;
    }

    groups.push({
      ones,
      min: mintermObject,
    });
  }

  for (let i = 0; i <= maxOnes; i++) {
    let onesGroup = groups.filter((obj) => obj.ones === i);
    orderedGroups.push(onesGroup);
  }

  return orderedGroups;
};

(() => {
  String.prototype.replaceAt = function (index, replacement) {
    return (
      this.substring(0, index) +
      replacement +
      this.substring(index + replacement.length)
    );
  };

  console.log("Welcome to the Quine McCluskey Algorithm!");
  read.question("Enter number of variables: ", (vars) => {
    read.question("Enter minterms as (0,1,2,4): ", (mins) => {
      const variables = vars;
      const minterms = mins.split(",");

      const groups = group(variables, minterms);
      pairUp(groups);

      read.close();
    });
  });
})();
