<template lang="pug">
  div

    founders-shares-control(
      v-model="foundersShares"
      :max="maxFoundersShares"
    )

    persons(
      :partnerNames="partnerNames"
      :founderNames="founderNames"
      :periodNames="periodNames"
      @changedFounders="onChangedFounders"
      @addPerson="onAddPerson"
      @removePerson="onRemovePerson"
      @addPartnerToPeriod="onAddPartnerToPeriods"
    )
    periods(
      ref="periods"
      :periods="periods"
      @addPeriod="onAddPeriod"
      @changeWork="onChangeWork"
      @removePeriod="onRemovePeriod"
      @removePartner="onRemovePartner"
      @leave="onLeave"
    )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Provide, Watch } from 'vue-property-decorator'
import { includes, uniq, pluck, clone } from 'ramda'
import dataset from '@/datasets/default'
import sortPartnersInPeriods from '@/lib/sortPartnersInPeriods'
import extractPartnerNames from '@/lib/extractPartnerNames'
import extractFounderNames from '@/lib/extractFounderNames'
import addPartnerToPeriods from '@/lib/addPartnerToPeriods'
import removePartnerFromAllPeriods from '@/lib/removePartnerFromAllPeriods'
import removePartnerFromPeriodsBeginningWithIndex from '@/lib/removePartnerFromPeriodsBeginningWithIndex'
import FoundersSharesControl from '@/components/FoundersSharesControl.vue'
import Persons from '@/components/Persons.vue'
import Periods from '@/components/Periods.vue'
import calculateShares from '@/lib/calculateShares/'

@Component({
  components: {
    FoundersSharesControl,
    Persons,
    Periods,
  },
})
export default class PeriodsBuilder extends Vue {
  foundersShares: number = 6.5
  periods: Period[] = []
  partnerNames: string[] = []
  founderNames: string[] = []
  @Provide() isPartnerFounder = this.isFounder
  @Provide() isPartnerInPeriod = this.isPartnerNameInPeriod

  $refs!: {
    periods: Periods
  }

  mounted() {
    this.load()
  }

  load() {
    this.periods = sortPartnersInPeriods(dataset)
    this.partnerNames = extractPartnerNames(dataset).sort()
    this.founderNames = extractFounderNames(dataset).sort()
  }

  get periodNames(): string[] {
    return pluck('name', this.periods)
  }

  @Watch('periods')
  @Watch('foundersShares')
  onWatch() {
    const calculatedPeriods = calculateShares(
      this.periods,
      this.foundersShares / 100
    )
    this.$emit('update', calculatedPeriods)
  }

  isFounder(partner: string): boolean {
    return includes(partner, this.founderNames)
  }

  isPartnerNameInPeriod(partnerName: string, periodName: string): boolean {
    const period = this.periods.find(
      (p: Period): boolean => p.name === periodName
    )
    if (!period) return false
    const partner = period!.partners.find(
      (p: Partner) => p.name === partnerName
    )
    if (!partner) return false
    return true
  }

  get maxFoundersShares() {
    if (!this.periods.length) return 0
    const numberOfPartners = this.founderNames.length
    return Math.floor(100 / numberOfPartners)
  }

  onChangeWork(periodsIndex: number, partnersIndex: number, work: number) {
    this.periods[periodsIndex].partners[partnersIndex].work = work
  }

  onAddPerson(name: string) {
    // first person is founder
    if (this.partnerNames.length <= 0) {
      this.founderNames = uniq([...clone(this.founderNames), name]).sort()
    }
    this.partnerNames = uniq([...clone(this.partnerNames), name]).sort()
  }

  onChangedFounders(founders: string[]) {
    this.founderNames = clone(founders.sort())
  }

  onAddPeriod(period: Period) {
    this.periods.push(period)
  }

  onRemovePeriod() {
    this.periods = this.periods.slice(0, -1)
  }

  onRemovePartner(periodIndex: number, partnerIndex: number) {
    this.periods[periodIndex].partners.splice(partnerIndex, 1)
  }

  onRemovePerson(partnerName: string) {
    this.partnerNames = clone(
      this.partnerNames.filter((name: string): boolean => name !== partnerName)
    )
    this.founderNames = clone(
      this.founderNames.filter((name: string): boolean => name !== partnerName)
    )
    this.periods = removePartnerFromAllPeriods(partnerName, clone(this.periods))
  }

  onAddPartnerToPeriods(partnerName: string, periodName: string) {
    this.periods = addPartnerToPeriods(
      partnerName,
      periodName,
      clone(this.periods)
    )
  }

  onLeave(periodIndex: number, partnerIndex: number) {
    const p = clone(this.periods)
    p[periodIndex].partners[partnerIndex].returnedFairShares = 1
    this.periods = removePartnerFromPeriodsBeginningWithIndex(
      periodIndex + 1,
      p[periodIndex].partners[partnerIndex].name,
      p
    )
  }
}
</script>
