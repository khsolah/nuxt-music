<template>
  <i class="block">
    <svg class="w-full h-full">
      <use :href="`${require('../assets/icons/gen/index.svg')}#${name}`" />
    </svg>
  </i>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Icon',
  props: {
    name: String
  }
})
</script>
