import * as React from "react";
import * as ReactDOM from "react-dom";
import dynamicLoader from "./dynamicLoader";

const moduleMap: Record<string, any> = {
  react: React,
  "react-dom": ReactDOM,
};

const sharedRequire = (moduleName: string) => {
  if (!moduleMap[moduleName]) {
    throw new Error("Missing external module in mapping");
  }

  return moduleMap[moduleName];
};

const loadComponents = (components: string[]): Promise<Record<string, any>> => {
  return dynamicLoader(
    {
      names: components.join(","),
    },
    "components"
  ).then((fn) => {
    const module: any = {
      exports: {},
    };

    fn(sharedRequire, {}, module);

    return module.exports;
  });
};

export default loadComponents;
