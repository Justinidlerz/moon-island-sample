type RequireFn = (id: string) => any;
type CommonJsModule = (require: RequireFn, exports: any, module: any) => void;

const dynamicLoader = (
  params?: Record<string, any>,
  type: "styles" | "components" = "styles"
): Promise<CommonJsModule> => {
  const moduleName = `__DYNAMIC_MODULE_${Date.now()}__`;

  return new Promise((resolve) => {
    const script = document.createElement("script");
    const searchParams = new URLSearchParams({
      moduleName,
      ...params,
    }).toString();

    script.src = `/${type}?${searchParams}`;

    script.addEventListener("load", () => {
      if (moduleName in window) {
        const module: any = window[moduleName as any];

        resolve(module);
      }
    });

    document.body.appendChild(script);
  });
};

export default dynamicLoader;
