const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

try {
  const artifactsPath = path.resolve(__dirname, "artifacts");

  fs.removeSync(artifactsPath);

  const contractPath = path.resolve(__dirname, "contracts", "Campaign.sol");
  const contractSource = fs.readFileSync(contractPath, "utf-8");

  const input = {
    language: "Solidity",
    sources: {
      "Campaign.sol": {
        content: contractSource,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    "Campaign.sol"
  ];

  fs.ensureDirSync(artifactsPath);

  for (let contract in output) {
    fs.outputJSONSync(
      path.resolve(artifactsPath, contract + ".json"),
      output[contract]
    );
  }
} catch (e) {
  console.error(e);
}
