<template lang="pug">
  div
    b-row.mb-3
      b-col
        h5 Persons
    div(v-if="!partnerNames.length")
      p None yet. Add a founder:
      card
        new-person-form(@submit="onSubmitNewPersonForm" :showForm="true")
    card-group(v-else).mb-4
      template(v-for="(p, idx) in partnerNames")
        card.d-flex.flex-column.align-items-start
          h5
            b-icon(icon="person")
            span &nbsp; {{p}}
          div
            b-badge(@click="onClickType(p)" href="#" variant="primary") {{isFounder(p) ? 'founder' : 'partner'}}<br/>
          div
            b-link(v-for="(period, i) in periodNames" :key="i" v-if="!isPartnerInPeriod(p, period)" @click="onAddPartnerToPeriod(p, period)") {{period}}<br/>
          div.mt-auto
            b-btn-group.mt-3
              b-btn(variant="outline-danger" @click="onClickRemovePerson(p)")
                b-icon(icon="person-dash")
      div
        new-person-form(@submit="onSubmitNewPersonForm")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Prop, Inject } from 'vue-property-decorator'
import { includes, prop, without, sortBy, concat } from 'ramda'
import NewPersonForm from '@/components/newPersonFom.vue'
import Card from '@/components/Card.vue'
import CardGroup from '@/components/CardGroup.vue'

const sortByPartnerName = sortBy(prop('name'))

@Component({
  components: {
    NewPersonForm,
    Card,
    CardGroup,
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

  onClickRemovePerson(partnerName: string) {
    this.$emit('removePerson', partnerName)
  }
}
</script>
