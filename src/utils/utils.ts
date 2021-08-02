export const parser = (input: string) => {
  const output = input.split('\n').filter((val) => val !== '');
  const splitEach = output.map((val) =>
    val.match(/([^\dx\s][\w\s'.,/-]+)+/g)?.join(' '),
  );
  const toObjectArray = splitEach.map((val) => ({ name: val }));
  return toObjectArray;
};

export const validateInput = (input: string) => {
  const regexTest = new RegExp(/(\dx\s+|\d\s+)(.*)/g);
  return regexTest.test(input);
};

export function splitIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, curr) => [...acc, ...curr], []);
}

export function uniqueArray<T>(arr: T[], uniqueBy: keyof T) {
  const result: T[] = [];
  const map = new Map();
  arr.forEach((item) => {
    if (!map.has(item[uniqueBy])) {
      map.set(item[uniqueBy], true); // set any value to Map
      result.push(item);
    }
  });
  return result;
}

export function generateArray(length: number): string[] {
  return new Array(length).fill(null).map((v, i) => i.toString());
}
