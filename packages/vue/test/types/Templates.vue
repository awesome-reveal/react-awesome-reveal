<script setup lang="ts">
import { Cascade, Reveal, vCascade, vReveal } from "../../src";
</script>

<template>
  <div v-reveal="{ duration: 300, when: true }" />
  <Reveal
    as="ul"
    :keyframes="[{ opacity: 0 }, {}]"
    when
  >
    <li>one</li>
    <li>two</li>
  </Reveal>
  <Reveal from="left" />
  <Reveal :from="{ x: '-100%', rotate: -5, blur: '0.5rem' }" />
  <Cascade
    as="ul"
    :interval="120"
    from="left"
  >
    <li>one</li>
    <li>two</li>
  </Cascade>
  <ul v-cascade="{ interval: 120, when: true }" />
  <Reveal v-slot="{ revealed }">
    <!-- @vue-expect-error The slot prop is a boolean. -->
    {{ revealed.toUpperCase() }}
  </Reveal>
  <Cascade v-slot="{ revealed }">
    <!-- @vue-expect-error The slot prop is a boolean. -->
    {{ revealed.toUpperCase() }}
  </Cascade>
</template>
