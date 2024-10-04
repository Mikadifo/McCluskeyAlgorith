const { read, binary, getDifferentBit } = require("./util.js");

const getExpressionFromImplicants = (implicants) => {
  let expression = [];

  implicants.forEach((implicant) => {
    let essentialExpression = "";
    for (let i = 0; i < implicant.length; i++) {
      if (implicant[i] === "1") {
        essentialExpression += String.fromCharCode(65 + i);
      }

      if (implicant[i] === "0") {
        essentialExpression += String.fromCharCode(65 + i) + "'";
      }
    }

    expression.push(essentialExpression);
  });

  return expression.join(" + ");
};

const findEssentialImplicants = (groups, minterms) => {
  const essentials = new Set();
  const usedMinterms = new Set();

  for (let minterm of minterms) {
    const implicants = groups.filter((group) =>
      group.minterm.split(",").includes(minterm)
    );

    console.log("IMPLICANTS OF MINTERM ", minterm, ":");
    console.log(implicants, "\n");

    if (implicants.length === 1) {
      const mintermstoadd = implicants[0].minterm.split(",");
      mintermstoadd.forEach((min) => usedMinterms.add(min));
      essentials.add(implicants[0].binary);
    }
  }

  return {
    essentials,
    missingMinterms: minterms.filter((minterm) => !usedMinterms.has(minterm)),
  };
};

const pairUp = (groups, lastGroups = [], notTakenCare = []) => {
  console.log("PAIRS");
  console.log(JSON.stringify(groups, null, 2));

  let newGroups = [];
  let notGrouped = [];

  //Iterates over each element (group of ones) but the last one
  for (let i = 0; i < groups.length; i++) {
    const pairGroups = [];

    //Iterates over each element/group's minterms
    for (let j = 0; j < groups[i].length; j++) {
      if (i < groups.length - 1) {
        const pairs = [];

        //Iterates over the next element/group's array to check for the bit difference
        for (let k = 0; k < groups[i + 1].length; k++) {
          let groupObject = groups[i][j];
          let nextGroupObject = groups[i + 1][k];

          const bitPosition = getDifferentBit(
            groupObject.binary,
            nextGroupObject.binary
          );

          if (bitPosition !== null) {
            const pairBinary = groupObject.binary.replaceAt(bitPosition, "-");

            if (
              pairGroups.filter((pair) => pair.binary === pairBinary).length ===
              0
            ) {
              pairObject = {
                minterm: groupObject.minterm + "," + nextGroupObject.minterm,
                binary: pairBinary,
              };

              pairs.push(pairObject);
            }

            groups[i][j].takenCare = true;
            groups[i + 1][k].takenCare = true;
          }
        }

        pairGroups.push(...pairs);
      }

      if (!groups[i][j].takenCare) {
        notGrouped.push({
          minterm: groups[i][j].minterm,
          binary: groups[i][j].binary,
        });
      }
    }

    if (pairGroups.length > 0) {
      newGroups.push(pairGroups);
    }
  }

  console.log(notGrouped, "NOT TAKEN CARE OF");

  if (newGroups.length === 0) {
    return [...lastGroups.flat(), ...notTakenCare];
  }

  return pairUp(newGroups, newGroups, [...notTakenCare, ...notGrouped]);
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
      ...mintermObject,
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

      console.log(newGroups, "FINAL GROUP\n");
      const implicants = findEssentialImplicants(newGroups, minterms);
      console.log(implicants.essentials, "ESSENTIALS");
      const essentialsExpression = getExpressionFromImplicants(
        implicants.essentials
      );
      //TODO: missing to choose the no essentials from the table
      const remainingExpression = "";
      console.log(implicants.missingMinterms);

      console.log("SOLUTION:");
      console.log(essentialsExpression + " + " + remainingExpression);

      read.close();
    });
  });
})();
