<template lang="pug">
  div
    b-row.mb-3
      b-col
        h5 Persons
      b-col.col-auto
        new-person-form(@submit="onSubmitNewPersonForm")
    b-card(v-if="!partnerNames.length")
      b-card-text.text-center No persons yet. Use the&nbsp;
        b-icon(icon="plus")
        | &nbsp;button.
    b-card-group.mb-4
      template(v-for="(p, idx) in partnerNames" deck)
        b-card(:title="p")
          b-card-text
            b-link(@click="onClickType(p)") {{isFounder(p) ? 'founder' : 'partner'}}<br/>
            template(v-for="period in periodNames")
              b-link(v-if="!isPartnerInPeriod(p, period)" @click="onAddPartnerToPeriod(p, period)") {{period}}
              | &nbsp;
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Prop, Inject } from 'vue-property-decorator'
import { includes, prop, without, sortBy, concat } from 'ramda'
import newPersonForm from '@/components/newPersonFom.vue'

const sortByPartnerName = sortBy(prop('name'))

@Component({
  components: {
    newPersonForm,
  },
})
export default class Persons extends Vue {
  @Prop({ type: Array, default: [] }) partnerNames!: string[]
  @Prop({ type: Array, default: [] }) founderNames!: string[]
  @Prop({ type: Array, default: [] }) periodNames!: string[]
  @Inject() isPartnerInPeriod!: (partner: string, period: string) => boolean

  showNewEmptyPerson: boolean = false
  newPersonName: string = ''

  sortByPartnerName(partners: Partner[]): Partner[] {
    return sortByPartnerName(partners)
  }

  isFounder(partner: string): boolean {
    return includes(partner, this.founderNames)
  }

  onClickType(partnerName: string) {
    // first person is founder which cannot be changed
    if (this.partnerNames.length === 1) return
    // founder cannot be changed if there are no other founders
    if (this.isFounder(partnerName) && this.founderNames.length === 1) return

    this.$emit(
      'changedFounders',
      this.isFounder(partnerName)
        ? without([partnerName], this.founderNames)
        : concat([partnerName], this.founderNames)
    )
  }

  onSubmitNewPersonForm(name: string) {
    this.$emit('addPerson', name)
  }

  onAddPartnerToPeriod(partnerName: string, periodName: string) {
    this.$emit('addPartnerToPeriod', partnerName, periodName)
  }
}
</script>
