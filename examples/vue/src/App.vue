<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { Reveal, vReveal } from "@awesome-reveal/vue";
import { cascade, type RevealHandle } from "@awesome-reveal/core";
import PageSection from "./components/PageSection.vue";
const sides = ["top", "right", "bottom", "left"] as const;
const open = ref(false);
const list = ref<HTMLUListElement>();
let handle: RevealHandle | undefined;
onMounted(() => {
  if (list.value) handle = cascade(list.value, { interval: 80 });
});
onBeforeUnmount(() => handle?.dispose());
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
    <ul ref="list">
      <li>Fast</li>
      <li>Small</li>
      <li>Accessible</li>
    </ul>
  </PageSection>
  <PageSection>
    <h2 v-reveal="{ from: { opacity: 0, blur: 8 } }">A directive on your own element</h2>
  </PageSection>
  <PageSection>
    <button @click="open = !open">Toggle</button>
    <Reveal
      :when="open"
      :from="{ opacity: 0 }"
    >
      Manual entrance
    </Reveal>
  </PageSection>
</template>
