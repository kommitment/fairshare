<template lang="pug">
  b-form(@submit="onSubmit")
    div(v-show="isFormVisible")
        b-form-input.mr-2.mb-2(ref="name" v-model="name" placeholder="Name")
        b-btn-group
          b-btn(@click="onSubmit" variant="outline-success" :disabled="name.length <= 0") OK
          b-btn(@click="onClickCancel" variant="outline-danger") Cancle
    div(v-if="!isFormVisible")
      b-btn(variant="outline-secondary" @click="isFormVisible=true")
        b-icon(icon="person-plus" aria-hidden="true")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Watch, Prop } from 'vue-property-decorator'

@Component({})
export default class newPersonForm extends Vue {
  @Prop({ type: Boolean, default: false }) showForm!: boolean
  isFormVisible: boolean = false
  name: string = ''

  $refs!: {
    name: HTMLElement
  }

  mounted() {
    this.isFormVisible = this.showForm
  }

  onSubmit(event: Event) {
    event.preventDefault()
    this.$emit('submit', this.name)
    this.isFormVisible = false
    this.name = ''
  }

  onClickCancel() {
    this.isFormVisible = false
    this.name = ''
  }

  @Watch('isFormVisible')
  watchIsFormVisible() {
    this.$nextTick(() => {
      this.$refs.name.focus()
    })
  }
}
</script>
