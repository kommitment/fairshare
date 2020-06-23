<template lang="pug">
  div.border.rounded.p-2.mr-2.mb-2
    slot(name="default")

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({})
export default class Card extends Vue {}
</script>

<style type="text/scss" scoped>
div.border {
  width: 10em;
}
</style>
