import dynamicLoader from "./dynamicLoader";

const loadStyles = (): Promise<string> => {
  return dynamicLoader().then((fn) => {
    const module = {
      exports: "",
    };
    fn(() => {}, {}, module);

    return module.exports;
  });
};

export default loadStyles;
