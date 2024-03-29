// only emit console.log if in dev mode
const dev = process.env.NODE_ENV === "development";
console.log('mode', {node_env:process.env.NODE_ENV, dev})
const clog = (...args: any[]) => {
  // Only log in development mode
  if (dev) {
    console.debug(
      `%c${args[0]}`,
      "color: blue; font-weight: bold;",
     { message: args[1]}
    );
  }
};

export default clog;