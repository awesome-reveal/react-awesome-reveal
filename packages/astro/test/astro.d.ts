// tsc cannot read .astro files. `astro check` checks the component.
declare module "*.astro" {
  const Component: import("astro/runtime/server/index.js").AstroComponentFactory;
  export default Component;
}
