const createImports = (components: string[]) => {
  return components
    .map((name) => {
      const lowName = name.toLowerCase();
      return `export * from 'antd/es/${lowName}/index.js';
								export {default as ${name}} from 'antd/es/${lowName}/index.js';
				`;
    })
    .join("\n");
};

export default createImports;
