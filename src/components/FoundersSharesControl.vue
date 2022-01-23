<template lang="pug">
  div
    b-row
      b-col
        h5 Gründer:innen-Anteile
    b-row
      b-col
        b-form(inline).mt-2.mb-4
          b-input.w-25.mr-2(type="range" min="0" :max="max" step="0.1" v-model.number="val")
          div {{val}}% behalten die Gründerinnen
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Watch, Prop } from 'vue-property-decorator'

@Component({})
export default class FoundersSharesControl extends Vue {
  @Prop({ type: Number, default: 0 }) value!: number
  @Prop({ type: Number, default: 0 }) max!: number
  val: number = 0

  mounted() {
    this.val = this.value
  }

  @Watch('value')
  onWatchValue() {
    this.val = this.value
  }

  @Watch('val')
  onChangeVal() {
    this.$emit('input', this.val)
  }
}
</script>
