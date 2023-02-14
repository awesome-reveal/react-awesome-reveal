declare global {
  module "astro" {
    export type InferGetStaticParamsType<T> = T extends () => Promise<infer R>
      ? R extends Array<infer U>
        ? U extends { params: infer P }
          ? P
          : never
        : never
      : never;

    export type InferGetStaticPropsType<T> = T extends () => Promise<infer R>
      ? R extends Array<infer U>
        ? U extends { props: infer P }
          ? P
          : never
        : never
      : never;
  }
}
