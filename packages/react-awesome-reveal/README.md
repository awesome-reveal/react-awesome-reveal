# react-awesome-reveal

Version 5 of `react-awesome-reveal` re-exports `@awesome-reveal/react`. It gives `Reveal`, `Cascade`, `useReveal`, `useCascade` and their types, and it loads its stylesheet automatically.

```tsx
import { Reveal } from "react-awesome-reveal";

<Reveal from="left">Hello</Reveal>;
```

Two setups need a step for the stylesheet:

- In an Astro island, import `react-awesome-reveal/reveal.css` in the page or in the layout that renders the island.
- In the Next.js Pages Router with webpack, add `@awesome-reveal/react` to `transpilePackages` in the Next.js config. That package imports the stylesheet.

For the API and the migration from version 4, read the [React documentation](https://www.npmjs.com/package/@awesome-reveal/react). The package includes the `migrating-from-v4` agent skill. The license is MIT.
