/* eslint-disable import/prefer-default-export */
const generateCoordinates = (min, max) => ({
  x: Math.floor(
    Math.random() * (max - min + 1),
  ) + min,
  z: Math.floor(
    Math.random() * (max - min + 1),
  ) + min,
});

export {
  generateCoordinates,
};
