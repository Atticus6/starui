---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "四达时代组件库"
  text: "描述"
  tagline: 基于 Vue3 + TS 开发的组件库
  actions:
    - theme: brand
      text: 开始使用
      link: /components/

features:
  - icon: 📚
    title: 功能覆盖和兼容性
    details: 组件库能够广泛覆盖 Element Plus 的功能，并且与 Element Plus 的 API 兼容。可以作为 Element Plus 的替代品，提供相同的功能和使用体验，方便用户迁移和使用。
  - icon: 📦
    title: 易用性和简化开发流程
    details: 组件库提供简洁明了的 API 和组件结构，使开发人员能够快速上手并高效构建界面，减少开发时间和工作量。部分组件兼容多种开发范式。
  - icon: 🌹
    title: 文档和示例丰富
    details: 在线文档包含详细的组件文档和示例，以展示你的组件库的功能和使用方法。提供清晰的示例代码、演示和解释，帮助用户理解每个组件的用途、属性和事件，并能够快速集成到他们的项目中。
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme';
import contributors from '../../contributors.json'


const members = contributors.map(item=>({
    avatar: item.avatar,
    name: item.name,
}))

</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      核心成员介绍
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>
<HomeContributors/>
