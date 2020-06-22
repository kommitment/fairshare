<template lang="pug">
  b-form(inline @submit="onSubmit")
    div(v-show="showForm")
        b-form-input.mr-2(ref="name" v-model="name" placeholder="Name")
        b-btn-group
          b-btn(@click="onSubmit" variant="success" :disabled="name.length <= 0") OK
          b-btn(@click="onClickCancel" variant="outline-danger") Cancle
    div(v-if="!showForm")
      b-btn(@click="showForm=true") +
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Watch } from 'vue-property-decorator'

@Component({})
export default class newPersonForm extends Vue {
  showForm: boolean = false
  name: string = ''

  $refs!: {
    name: HTMLElement
  }

  onSubmit(event: Event) {
    event.preventDefault()
    this.$emit('submit', this.name)
    this.showForm = false
    this.name = ''
  }

  onClickCancel() {
    this.showForm = false
    this.name = ''
  }

  @Watch('showForm')
  watchShowForm() {
    this.$nextTick(() => {
      this.$refs.name.focus()
    })
    // if (!!this.showForm)
  }
}
</script>
