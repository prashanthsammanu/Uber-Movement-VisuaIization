// TWEENS
const withTween = (d) => {
  // define interpolation
  // d3.interpolate returns a function which we call i
  let i = d3.interpolate(0, x.bandwidth());

  // return a function which takes in a time ticker t
  return function (t) {
    // return the value from passing the ticker into the interpolation
    return i(t);
  };
};
