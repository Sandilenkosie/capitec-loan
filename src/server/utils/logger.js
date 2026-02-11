const prefix = "[stubs]";

export const logger = {
  info: (...args) => console.info(prefix, ...args),
  warn: (...args) => console.warn(prefix, ...args),
  error: (...args) => console.error(prefix, ...args),
};

export default logger;
