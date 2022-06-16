<template>
  <div class="stack">
    <h2>{{ stack.name }}</h2>
    <div
      v-for="city in cities"
      :key="city.name"
      class="city-row"
      :class="city.highlight ? 'highlight' : ''"
      @mouseover="() => onMouseover(city.name)"
      @mouseleave="() => onMouseleave(city.name)"
    >
      <span v-if="showNames">{{ city.name }}</span>
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
import { mapState, mapActions } from 'vuex'
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
      default: false,
    },
    showNames: {
      type: Boolean,
      default: false,
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
    ...mapActions(['setHighlight']),
    onClick (card, alt) {
      this.$emit('moveCard', card, alt)
    },
    onMouseover (cityName) {
      this.setHighlight({ cityName, highlight: true })
    },
    onMouseleave (cityName) {
      this.setHighlight({ cityName, highlight: false })
    },
  },
}
</script>

<style scoped>
.stack {
  width: 150px;
  text-align: left;
}
.city-row {
  height: 50px;
  display: flex;
  align-items: center;
}
.city-row.highlight {
  background-color: #e4f4ff;
}
</style>
