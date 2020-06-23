<template lang="pug">
  div
    b-row.mb-3
      b-col
        h5 Periods
      b-col.col-auto
        b-btn(@click="onClickAddPeriod")
          b-icon(icon="plus" aria-hidden="true")
    card.w-100(v-if="!periods.length")
      div.text-center No periods yet. Use the&nbsp;
        b-icon(icon="plus")
        | &nbsp;button or add a founder.
    template(v-for="(period, periodsIndex) in periods")
      card.mb-2.w-100
        h5 {{period.name}}
        p(v-if="periodsIndex === 0") Founding Phase
        div
          b-link(v-if="isRemovePeriodPossible(periodsIndex)" @click="onClickRemovePeriod") remove
        card-group.mb-4
          template(v-for="(p, partnersIndex) in period.partners")
            card
              h5 {{p.name}}
              div {{isPartnerFounder(p.name) ? 'founder' : 'partner'}}
              div
                b-link
                  span(v-if="isRemovePartnerPossible(periodsIndex, isPartnerFounder(p.name))" @click="onClickRemovePartner(periodsIndex, partnersIndex)") remove
                  span(v-else) &nbsp;
                div Contribution {{p.work * 100}}%
                  b-form-input(type="range" min="0" max="1" step="0.05" :value="p.work" @input="onChangeWork(periodsIndex, partnersIndex, $event)")
                div(v-if="p.returnedFairShares") Returned FairShares {{p.returnedFairShares * 100}}%
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Prop, Inject } from 'vue-property-decorator'
import { prop, sortBy } from 'ramda'
import getPartnersFromLatestPeriod from '@/lib/getPartnersFromLatestPeriod'
import Card from '@/components/card.vue'
import CardGroup from '@/components/cardGroup.vue'

const sortByPartnerName = sortBy(prop('name'))

@Component({
  components: {
    Card,
    CardGroup,
  },
})
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

  onClickRemovePeriod() {
    this.$emit('removePeriod')
  }

  onClickRemovePartner(periodsIndex: number, partnersIndex: number) {
    this.$emit('removePartner', periodsIndex, partnersIndex)
  }

  isRemovePeriodPossible(periodsIndex: number): boolean {
    return this.periods.length > 1 && periodsIndex === this.periods.length - 1
  }

  isRemovePartnerPossible(_periodsIndex: number, isFounder: boolean): boolean {
    return !isFounder
  }

  addPeriod() {
    const name = `Year ${this.periods.length + 1}`
    const partners: Partner[] = getPartnersFromLatestPeriod(this.periods)
    this.$emit('addPeriod', { name, partners })
  }
}
</script>
