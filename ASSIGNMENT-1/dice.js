const crypto = require("crypto");

function rollDice() {
    return crypto.randomInt(1, 7);
}

const numberOfRolls = Number(process.argv[2]) || 5;

if (numberOfRolls <= 0 || !Number.isInteger(numberOfRolls)) {
    console.log("Please provide a positive whole number of rolls.");
    process.exit(1);
}

console.log(`Rolling the dice ${numberOfRolls} time(s)...`);

for (let i = 1; i <= numberOfRolls; i++) {
    console.log(`Roll ${i}: Dice Rolled: ${rollDice()}`);
}