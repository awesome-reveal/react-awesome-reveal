<script setup lang="ts">
import { Reveal, vReveal } from "../../src";
</script>

<template>
  <div v-reveal="{ duration: 300, once: false, when: true }" />
  <Reveal
    as="ul"
    :keyframes="[{ opacity: 0 }, {}]"
    once
    when
  >
    <li>one</li>
    <li>two</li>
  </Reveal>
  <Reveal from="left" />
  <Reveal :from="{ x: '-100%', rotate: -5, blur: '0.5rem' }" />
</template>
