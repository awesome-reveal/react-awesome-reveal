# Chaining Multiple Animations

To chain together multiple animations, set the `cascade` prop to `true`:

```jsx
<Fade cascade>
  <p>I enter first...</p>
  <p>...then comes my turn...</p>
  <p>...and finally you see me!</p>
</Fade>
```

This is _almost_ equivalent to

```jsx
<Fade>
  <p>I enter first...</p>
</Fade>
<Fade delay={1000}>
  <p>...then comes my turn...</p>
</Fade>
<Fade delay={2000}>
  <p>...and finally you see me!</p>
</Fade>
```

with the exception that, since each `Fade` component creates an isolated visibility context, in the second snippet every `p` will be shown only if they are inside the viewport (after the specified delay).
