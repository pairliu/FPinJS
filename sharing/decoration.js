const addLogging = fn => (...args) => {
  console.log(`entering ${fn.name}: (${args})`);
  const valueToReturn = fn(...args);
  console.log(`exiting ${fn.name}: ${valueToReturn}`);
  return valueToReturn;
};

const sum = (a, b) => a + b;
const sumWithLogging = addLogging(sum);
sumWithLogging(5, 10);
