<script setup lang="ts">
import type { RevealOptions } from "../../src";
import { vReveal } from "../../src";

defineProps<{ options?: RevealOptions; color?: string }>();
</script>

<template>
  <div
    v-reveal="options"
    :style="color ? `color: ${color}` : undefined"
  >
    <span>a</span>
    <span>b</span>
  </div>
</template>
