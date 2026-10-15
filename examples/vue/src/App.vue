<script setup lang="ts">
import { ref } from "vue";
import { Cascade, Reveal, vCascade, vReveal } from "@awesome-reveal/vue";
import PageSection from "./components/PageSection.vue";
const sides = ["top", "right", "bottom", "left"] as const;
const open = ref(false);
</script>

<template>
  <PageSection>
    <Reveal><h1>The default entrance</h1></Reveal>
  </PageSection>
  <PageSection><Reveal :from="{ opacity: 0 }">Pure fade</Reveal></PageSection>
  <PageSection
    v-for="side in sides"
    :key="side"
  >
    <Reveal :from="side"> From the {{ side }} </Reveal>
  </PageSection>
  <PageSection><Reveal :from="{ scale: 0.9 }">Scale only</Reveal></PageSection>
  <PageSection>
    <Reveal
      from="left"
      :style="{ rotate: '-3deg' }"
    >
      Keeps its own rotation
    </Reveal>
  </PageSection>
  <PageSection>
    <Reveal
      :keyframes="[
        {
          opacity: 0,
          transform: 'rotate(-10deg) scale(.8)',
          easing: 'ease-out',
        },
        { opacity: 1, transform: 'rotate(0deg) scale(1)' },
      ]"
    >
      Native keyframes
    </Reveal>
  </PageSection>
  <PageSection>
    <Cascade
      as="ul"
      :from="{ opacity: 0, y: 16 }"
    >
      <li>Fast</li>
      <li>Small</li>
      <li>Accessible</li>
    </Cascade>
  </PageSection>
  <PageSection>
    <Reveal
      as="h2"
      from="left"
    >
      A header
    </Reveal>
    <Reveal
      :from="{ opacity: 0 }"
      :delay="250"
    >
      Its content starts 250 ms later
    </Reveal>
  </PageSection>
  <PageSection>
    <ul v-cascade="{ from: 'left', interval: 120 }">
      <li>A directive</li>
      <li>on your own</li>
      <li>list</li>
    </ul>
  </PageSection>
  <PageSection>
    <h2 v-reveal="{ from: { opacity: 0, blur: 8 } }">A directive on your own element</h2>
  </PageSection>
  <PageSection>
    <button
      :aria-expanded="open"
      @click="open = !open"
    >
      Toggle
    </button>
    <Reveal
      :when="open"
      :hidden="!open"
      :from="{ opacity: 0 }"
    >
      Manual entrance
    </Reveal>
  </PageSection>
</template>
