<template lang="pug">
  div(v-if="periods.length")
    b-row.mb-3
      b-col
        h5 Perioden
    template(v-for="(period, periodsIndex) in periods")
      card.mb-2.w-100
        b-row.mb-2
          b-col.col-auto
            h5 {{period.name}}
              span(v-if="periodsIndex === 0") &nbsp;
                b-badge(variant="light" pill) Gründungsphase
          b-col(v-if="periodsIndex === periods.length-1")
            b-btn-group.bg-white
              b-btn(variant="outline-secondary" @click="onClickAddPeriod")
                b-icon(icon="subtract" aria-hidden="true")
              b-btn(variant="outline-danger" v-if="isRemovePeriodPossible(periodsIndex)" @click="onClickRemovePeriod")
                b-icon(icon="trash-fill" aria-hidden="true")
        card-group.mb-4
          template(v-for="(p, partnersIndex) in period.partners")
            card.bg-white
              h5 
                b-icon(icon="person")
                span &nbsp; {{p.name}}
              b-badge {{isPartnerFounder(p.name) ? 'Gründerin' : 'Partnerin'}}
              div
                b-link
                  span(v-if="isRemovePartnerPossible(periodsIndex, p.name)" @click="onClickRemovePartner(periodsIndex, partnersIndex)") Entfernen
                  span(v-else) &nbsp;
                b-link
                  span(v-if="isLeavePossible(periodsIndex, p.name)" @click="onClickLeave(periodsIndex, partnersIndex)") Aussteigen
                  span(v-else) &nbsp;
                div Voll-/Teilzeit {{Math.round(p.work * 100)}}%
                  b-form-input(type="range" min="0" max="1" step="0.05" :value="p.work" @input="onChangeWork(periodsIndex, partnersIndex, $event)")
                div(v-if="p.returnedFairShares") Zurückgegebene FairShares {{p.returnedFairShares * 100}}%
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Prop, Inject } from 'vue-property-decorator'
import getPartnersFromLatestPeriod from '@/lib/getPartnersFromLatestPeriod'
import findIndexOfFirstPeriodInWhichPersonIsPartner from '@/lib/findIndexOfFirstPeriodInWhichPersonIsPartner'
import Card from '@/components/Card.vue'
import CardGroup from '@/components/CardGroup.vue'

@Component({
  components: {
    Card,
    CardGroup,
  },
})
export default class Periods extends Vue {
  @Prop({ type: Array, default: [] }) periods!: Period[]
  @Inject() isPartnerFounder!: (partner: string) => boolean

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

  onClickLeave(periodsIndex: number, partnersIndex: number) {
    this.$emit('leave', periodsIndex, partnersIndex)
  }

  isRemovePeriodPossible(periodsIndex: number): boolean {
    return this.periods.length > 1 && periodsIndex === this.periods.length - 1
  }

  isRemovePartnerPossible(periodsIndex: number, name: string): boolean {
    return (
      !this.isPartnerFounder(name) &&
      periodsIndex ===
        findIndexOfFirstPeriodInWhichPersonIsPartner(name, this.periods)
    )
  }

  isLeavePossible(periodsIndex: number, name: string): boolean {
    return (
      periodsIndex >
      findIndexOfFirstPeriodInWhichPersonIsPartner(name, this.periods)
    )
  }

  addPeriod() {
    const name = `Jahr ${this.periods.length + 1}`
    const partners: Partner[] = getPartnersFromLatestPeriod(this.periods)
    this.$emit('addPeriod', { name, partners })
  }
}
</script>
