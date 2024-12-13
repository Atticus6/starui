<script setup lang="ts">
import { ref } from "vue";
import { useData } from "vitepress";

const defaultAuthor = "wonglt";
const { frontmatter } = useData();

const contributorsArr = [
  frontmatter.value?.author,
  ...(frontmatter.value.contributors || []),
].filter((x) => x);
const contributors = ref(contributorsArr);

function reName(name: string) {
  return name || "wonglt";
}

function getAvatarUrl(name: string) {
  return `https://github.com/${reName(name)}.png`;
}
function getGithubLink(name: string) {
  return `https://github.com/${reName(name)}`;
}

function isNotEmpty(arr: string | string[]) {
  return Array.isArray(arr) && arr.length;
}
</script>

<template>
  <div v-if="isNotEmpty(contributors)" class="container">
    <div v-for="contributor of contributors" :key="contributor" class="item">
      <img :src="getAvatarUrl(contributor)" class="avatar" />
      {{ contributor }}
    </div>
  </div>
  <div v-else class="container">
    <img :src="getAvatarUrl(defaultAuthor)" class="avatar" />
    {{ "Wonglt" }}
  </div>
</template>

<style lang="css" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.item {
  display: flex;
  justify-content: center;
  gap: 4px;
}
.avatar {
  width: 24px;
  height: 24px;
  border-radius: 100%;
}
</style>
