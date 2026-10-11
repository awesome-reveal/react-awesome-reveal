<script setup lang="ts">
import { Reveal } from "../../src";
import { slide } from "../../src/keyframes";
</script>

<template>
  <Reveal as="section" :keyframes="slide()" style="color: red">
    <p>hello</p>
  </Reveal>
</template>
