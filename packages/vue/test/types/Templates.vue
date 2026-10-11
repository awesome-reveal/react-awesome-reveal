<script setup lang="ts">
import { Reveal, vReveal } from "../../src";
import { slide } from "../../src/keyframes";
</script>

<template>
  <div v-reveal />
  <div v-reveal="{ keyframes: slide(), duration: 300, once: false, when: true }" />
  <!-- @vue-expect-error -->
  <div v-reveal="{ duration: 'slow' }" />
  <!-- @vue-expect-error -->
  <div v-reveal="{ unknown: true }" />

  <Reveal as="ul" :keyframes="slide()" :stagger="50" once when reduced-motion="never">
    <li>one</li>
  </Reveal>
  <!-- @vue-expect-error -->
  <Reveal :threshold="'half'" />
  <!-- @vue-expect-error -->
  <Reveal reduced-motion="sometimes" />
</template>
