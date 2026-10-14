<script setup lang="ts">
import { Reveal } from "../../src";
import { defaultKeyframes } from "@awesome-reveal/test-utils/entrance-fixtures";
</script>

<template>
  <Reveal
    as="section"
    :keyframes="defaultKeyframes"
    style="color: red"
  >
    <p>hello</p>
  </Reveal>
</template>
