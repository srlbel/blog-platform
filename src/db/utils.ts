const createId = (): string => {
  return Bun.randomUUIDv7();
};

const currentDate = (): string => {
  return new Date().toISOString();
};

const utils = {
  createId,
  currentDate,
};

export default utils;
