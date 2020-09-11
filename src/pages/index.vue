<template lang="pug">
  div
    img.mb-4(src="~assets/img/fairshare-pie.png" width="250")

    p FairShare entsteht aus der Idee, eine Simulation zur Verteilung der Anteile einer Firma (im weiteren *die Firma* genannt) mit möglichst einfachen Regeln zu haben. Dabei sollen folgende Ziele erreicht werden:

    ul
      li Anteile der Firma verteilen sich mit der Zeit auf alle, die mitmachen.
      li Die Firma überlebt möglichst lange.
      li Unternehmergeist lohnt sich.
      li Gründen und Aufbauen lohnt sich.
      li Auch für Späteinsteiger lohnt sich der Einstieg.

    p Bei FairShare geht es um die Verteilung der Anteile eines Unternehmens. Wie am Jahresende Gewinne verteilt werden, beantwortet Fairshare nicht. Das gehört in einen Gesellschaftervertrag.

    h3 Demo
    nuxt-link(to="demo") Probier aus, wie es funktioniert

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({})
export default class Index extends Vue {}
</script>
