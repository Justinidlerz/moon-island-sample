import express from "express";
import { build } from "esbuild";
import fs from "fs";
import path from "path";
import { createServer } from "vite";
import createImports from "./createImports";
import generateCJSWithCode from "./generateCJSWithCode";
import { ErrorRequestHandler } from "express-serve-static-core";

const run = async () => {
  const app = express();
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf-8");

  const vite = await createServer({
    root: path.join(__dirname, ".."),
    server: { middlewareMode: true },
    optimizeDeps: {},
    appType: "custom",
  });

  app.get("/styles", async (req, res, next) => {
    try {
      const moduleName = req.query.moduleName;

      if (typeof moduleName !== "string") {
        throw new Error("Require module name is required.");
      }

      res.type("applications/javascript");
      res.send(
        generateCJSWithCode(
          moduleName,
          `module.exports = ${JSON.stringify(
            fs.readFileSync(
              path.join(__dirname, "../node_modules/antd/dist/antd.css"),
              "utf-8"
            )
          )}`
        )
      );
    } catch (e) {
      next(e);
    }
  });

  app.get("/components", async (req, res, next) => {
    try {
      const components = req.query.names;
      const moduleName = req.query.moduleName;

      if (typeof moduleName !== "string") {
        throw new Error("Require module name is required.");
      }

      if (typeof components !== "string") {
        throw new Error("Component names is required.");
      }

      const imports = createImports(components.split(","));

      const result = await build({
        bundle: true,
        format: "cjs",
        minify: true,
        write: false,
        stdin: {
          contents: imports,
          loader: "js",
          resolveDir: __dirname,
        },
        external: ["react", "react-dom"],
      });

      res.type("application/javascript");
      res.send(
        generateCJSWithCode(
          moduleName,
          result.outputFiles.map((file) => file.text).join("\n")
        )
      );
    } catch (e) {
      next(e);
    }
  });

  const errorHandler: ErrorRequestHandler = (error, request, response) => {
    console.log(`error ${error.message}`);
    const status = error.status || 500;
    response.status(status).send(error.message);
  };

  app.use(vite.middlewares);

  app.get("/", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const appHtml = await vite.transformIndexHtml(url, html);

      res.type("html");
      res.send(appHtml);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
  app.use(errorHandler);

  const port = 3000;

  app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
  });
};

run();
