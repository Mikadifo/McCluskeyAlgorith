const { read, binary, getDifferentBit } = require("./util.js");

const pairUp = (groups, lastGroups = []) => {
  let newGroups = [];

  for (let i = 0; i < groups.length - 1; i++) {
    const pairGroups = [];

    for (let j = 0; j < groups[i].length; j++) {
      const pairs = [];

      for (let k = 0; k < groups[i + 1].length; k++) {
        let groupObject = "";
        let nextGroupObject = "";

        if (Object.keys(groups[i][j]).includes("minterm")) {
          groupObject = groups[i][j];
          nextGroupObject = groups[i + 1][k];
        } else {
          groupObject = groups[i][j].min;
          nextGroupObject = groups[i + 1][k].min;
        }

        const bitPosition = getDifferentBit(
          groupObject.binary,
          nextGroupObject.binary
        );

        if (bitPosition !== null) {
          const pairBinary = groupObject.binary.replaceAt(bitPosition, "-");

          if (
            pairGroups.filter((pair) => pair.binary === pairBinary).length === 0
          ) {
            pairObject = {
              minterm: groupObject.minterm + "," + nextGroupObject.minterm,
              binary: pairBinary,
            };

            pairs.push(pairObject);
          }
        }
      }

      pairGroups.push(...pairs);
    }

    if (pairGroups.length > 0) {
      newGroups.push(pairGroups);
    }
  }

  if (newGroups.length === 0) {
    return lastGroups;
  }

  return pairUp(newGroups, newGroups);
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
      const newGroups = pairUp(groups);
      console.log("-----------");
      console.log(newGroups);

      read.close();
    });
  });
})();
