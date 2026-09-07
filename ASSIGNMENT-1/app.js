const isEven = require("./modules/isEven");
const logger = require("./modules/logger");

logger("Custom modules loaded successfully.");

const numbers = [10, 7, 24, 15];

numbers.forEach((number) => {
    if (isEven(number)) {
        console.log(`${number} is even.`);
    } else {
        console.log(`${number} is odd.`);
    }
});

logger("Module demonstration completed.");