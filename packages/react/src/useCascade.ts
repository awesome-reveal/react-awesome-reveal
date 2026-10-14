"use client";

import {
  type CascadeOptions,
  cascadeHiddenAttributes,
  createCascade,
} from "@awesome-reveal/core/adapter";

import { type RevealState, useBinding } from "./useReveal.js";

export type { CascadeOptions };

/** Reveals the direct element children of an existing element in sequence, through props that you spread on it. */
export function useCascade<T extends Element = HTMLElement>(
  options: CascadeOptions = {},
): RevealState<T, "cascade"> {
  return useBinding<T, CascadeOptions, "cascade">(
    createCascade,
    options,
    cascadeHiddenAttributes["data-reveal"],
  );
}
