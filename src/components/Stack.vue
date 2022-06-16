<template>
  <div class="stack">
    <h2>{{ stack.name }}</h2>
    <div
      v-for="city in cities"
      :key="city.name"
      class="city-row"
    >
      <card
        v-for="card in cardsByCity[city.name]"
        :key="card.id"
        :card="card"
        :alt="alt"
        :active="active"
        @click="onClick"
      ></card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Card from '@/components/Card'

export default {
  name: 'Stack',
  components: {
    Card,
  },
  props: {
    stack: {
      type: Object,
      required: true,
    },
    alt: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState(['cities']),
    cardsByCity () {
      const cardsByCity = {}
      for (const city of this.cities) {
        cardsByCity[city.name] = []
      }
      for (const card of this.stack.cards) {
        cardsByCity[card.cityName].push(card)
      }
      return cardsByCity
    },
  },
  methods: {
    onClick (card, alt) {
      this.$emit('moveCard', card, alt)
    },
  },
}
</script>

<style scoped>
.stack {
  width: 150px;
  border: 1px solid grey;
  margin: 1rem;
  text-align: left;
}
.city-row {
  height: 50px;
  display: flex;

}
</style>
