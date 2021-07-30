export const parser = (input: string) => {
  const output = input.split('\n').filter((val) => val !== '');
  const splitEach = output.map((val) => val.match(/[^\dx\s]+/g)?.join(' '));
  const toObjectArray = splitEach.map((val) => ({ name: val }));
  return toObjectArray;
};

export const validateInput = (input: string) => {
  const regexTest = new RegExp(/(\dx\s+|\d\s+)(.*)/g);
  return regexTest.test(input);
};
