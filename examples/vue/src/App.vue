<script setup lang="ts">
import { ref } from "vue";
import { Reveal, vReveal } from "@awesome-reveal/vue";
import {
  blur,
  defineKeyframes,
  enter,
  fade,
  pop,
  scale,
  slide,
  spring,
} from "@awesome-reveal/vue/keyframes";

import PageSection from "./components/PageSection.vue";

const spin = defineKeyframes<{ turns?: number }>(({ turns = 1 }) => ({
  keyframe: (progress) => {
    const t = 1 - (1 - progress) ** 3;
    return { opacity: t, transform: `rotate(${(1 - t) * turns * 360}deg) scale(${t})` };
  },
}));

const directions = ["up", "down", "left", "right"] as const;
const bounces = [0, 0.3, 0.6];
const shown = ref(false);
const color = ref("black");
</script>

<template>
  <PageSection>
    <Reveal>
      <h1>The default keyframes</h1>
    </Reveal>
  </PageSection>
  <PageSection>
    <Reveal :keyframes="fade()">
      <h1>fade</h1>
    </Reveal>
  </PageSection>
  <PageSection v-for="direction in directions" :key="direction">
    <Reveal as="h1" :keyframes="slide({ direction, distance: 40 })" :once="false">
      slide {{ direction }}, every time it enters the viewport
    </Reveal>
  </PageSection>
  <PageSection>
    <Reveal as="h1" :keyframes="pop()" :once="false">pop</Reveal>
  </PageSection>
  <PageSection v-for="bounce in bounces" :key="bounce">
    <Reveal
      as="h1"
      :keyframes="scale({ from: 0.5, easing: spring({ bounce }) })"
      :duration="1000"
      :once="false"
    >
      scale with a spring, bounce {{ bounce }}
    </Reveal>
  </PageSection>
  <PageSection>
    <Reveal as="ul" :keyframes="enter({ x: -24 })" :stagger="100">
      <li>I enter first...</li>
      <li>...then comes my turn...</li>
      <li>...and finally you see me!</li>
    </Reveal>
  </PageSection>
  <PageSection>
    <Reveal as="h1" :keyframes="spin({ turns: 2 })" :duration="1000">
      A custom defineKeyframes animation
    </Reveal>
  </PageSection>
  <PageSection>
    <h2 v-reveal="{ keyframes: blur({ from: 16 }) }">
      Revealed with the v-reveal directive, no wrapper
    </h2>
  </PageSection>
  <PageSection>
    <h2 v-reveal="{ keyframes: slide(), once: false }" :style="`color: ${color}`">
      v-reveal keeps the element hidden when Vue patches its style
    </h2>
    <button type="button" @click="color = color === 'black' ? 'teal' : 'black'">
      Change the color
    </button>
  </PageSection>
  <PageSection>
    <button type="button" @click="shown = !shown">Toggle</button>
    <Reveal :keyframes="scale()" :when="shown">
      <p>Revealed manually with `when`</p>
    </Reveal>
    <p v-reveal="{ keyframes: fade(), when: shown }">Revealed manually with v-reveal and `when`</p>
  </PageSection>
</template>
