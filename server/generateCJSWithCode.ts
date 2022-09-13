const generateCJSWithCode = (moduleName: string, code: string) => {
  return `var ${moduleName} = function (require, exports, module) {
        ${code}
    }`;
};

export default generateCJSWithCode;
