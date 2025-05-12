const createId = (): string => {
  return crypto.randomUUID();
};

const currentDate = (): string => {
  return new Date().toISOString();
};

const utils = {
  createId,
  currentDate,
};

export default utils;
