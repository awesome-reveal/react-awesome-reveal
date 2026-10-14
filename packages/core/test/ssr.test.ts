import { reveal, cascade } from "../src/index";
import { createReveal } from "../src/adapter";

it("imports and resolves selectors safely without browser globals", () => {
  expect(typeof document).toBe("undefined");
  reveal(".card").dispose();
  cascade(".features").dispose();
  const state = createReveal({ when: true });
  expect(state.revealed).toBe(false);
});
