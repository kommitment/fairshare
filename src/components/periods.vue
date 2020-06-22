<template lang="pug">
  b-card
    div
      b-row.mb-3
        b-col
          h5 Periods
        b-col.col-auto
          b-btn(@click="onClickAddPeriod")
            b-icon(icon="plus" aria-hidden="true")
      b-card(v-if="!periods.length")
        b-card-text.text-center No periods yet. Use the&nbsp;
          b-icon(icon="plus")
          | &nbsp;button or add a founder.
      template(v-for="(period, periodsIndex) in periods")
        b-card.mb-2(:title="period.date" :sub-title="periodsIndex === 0 ? 'Founding Phase' : ''")
          b-card-text
            b-link(v-if="isRemovePossible(periodsIndex)" @click="onClickRemove") remove
          b-card-group.mb-4
            template(v-for="(p, partnersIndex) in sortByPartnerName(period.partners)")
              b-card(:title="p.name" :sub-title="isPartnerFounder(p.name) ? 'founder' : 'partner'")
                b-card-text
                  div() Contribution {{p.work * 100}}%
                    b-form-input(type="range" min="0" max="1" step="0.05" :value="p.work" @input="onChangeWork(periodsIndex, partnersIndex, $event)")
                  div(v-if="p.returnedFairShares") Returned FairShares {{p.returnedFairShares * 100}}%
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Prop, Inject } from 'vue-property-decorator'
import { prop, sortBy } from 'ramda'
import getPartnersFromLatestPeriod from '@/lib/getPartnersFromLatestPeriod'

const sortByPartnerName = sortBy(prop('name'))

@Component({})
export default class Periods extends Vue {
  @Prop({ type: Array, default: [] }) periods!: Period[]
  @Inject() isPartnerFounder!: (partner: string) => boolean

  sortByPartnerName(partners: Partner[]): Partner[] {
    return sortByPartnerName(partners)
  }

  onChangeWork(periodsIndex: number, partnersIndex: number, work: number) {
    this.$emit('changeWork', periodsIndex, partnersIndex, work)
  }

  onClickAddPeriod() {
    this.addPeriod()
  }

  onClickRemove() {
    this.$emit('removePeriod')
  }

  isRemovePossible(periodsIndex: number): boolean {
    return this.periods.length > 1 && periodsIndex === this.periods.length - 1
  }

  addPeriod() {
    const date = `Year ${this.periods.length + 1}`
    const partners: Partner[] = getPartnersFromLatestPeriod(this.periods)
    this.$emit('addPeriod', { date, partners })
  }
}
</script>
