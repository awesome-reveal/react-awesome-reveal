import type { RehypePlugins } from "astro";
import type { Options } from "rehype-autolink-headings";

const options: Options = {};

export default ["rehype-autolink-headings", options] as RehypePlugins[number];
