---
layout: ../../layouts/DocLayout.astro
title: Installation
sidenavOrder: 2
---

# Installation

## Steps

Inside your React project directory, run the following:

```shell
yarn add react-awesome-reveal @emotion/react
```

Or with `npm`:

```shell
npm install react-awesome-reveal @emotion/react
```

## Quick Start

Just import the `<Fade />` component and wrap the elements you want to animate with it.

For normal RESTful APIs with JSON data, first you need to create a `fetcher` function, which is just a wrapper of the native `fetch`:

```js
const fetcher = (...args) => fetch(...args).then((res) => res.json());
```

Then you can import `useSWR` and start using it inside any function components:

```js
import useSWR from "swr";

function Profile() {
  const { data, error } = useSWR("/api/user/123", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  // render data
  return <div>hello {data.name}!</div>;
}
```
