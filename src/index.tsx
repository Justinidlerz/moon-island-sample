import React, { createElement, useState } from "react";
import { createRoot } from "react-dom/client";
import ShadowRoot from "react-shadow";
import loadComponents from "./loadComponents";
import loadStyles from "./loadStyles";

const root = document.getElementById("root")!;
const rootNode = createRoot(root);
const ShadowDiv = ShadowRoot.div;

Promise.all([loadComponents(["Button", "Input"]), loadStyles()]).then(
  ([{ Button, Input }, styles]) => {
    const sheets = [new CSSStyleSheet()];
    sheets[0].replaceSync(styles);

    const App = () => {
      const [value, setValue] = useState("Switch");
      const [downloads, updateComponent] = useState<any[]>([]);

      return (
        <ShadowDiv styleSheets={sheets}>
          <Button.Group compact>
            <Input
              value={value}
              onChange={(e: any) => setValue(e.target.value)}
              placeholder="Input a component name of ant-design component library to load"
              style={{
                width: "calc(100% - 200px)",
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                loadComponents([value]).then((components) => {
                  updateComponent((comps) => [...comps, components[value]]);
                });
              }}
            >
              Load component
            </Button>
          </Button.Group>
          {downloads.map((comp, i) => createElement(comp, { key: `${i}` }))}
        </ShadowDiv>
      );
    };

    rootNode.render(createElement(App));
  }
);
