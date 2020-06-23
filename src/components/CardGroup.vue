<template lang="pug">
  div.d-flex.flex-wrap.align-content-stretch
    slot(name="default")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({})
export default class CardGroup extends Vue {}
</script>
