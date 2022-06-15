<template>
  <div class="container-fluid">
    <h1>Pandemic</h1>
    <div class="buttons">
      <b-button
        @click="start"
        variant="danger"
      >
        Start
      </b-button>
    </div>
    <div
      v-if="Object.keys(deck).length"
      class="board"
    >
      <stack
        name="Cities"
        :cards="deck"
        epidemic
        @epidemic="onEpidemic"
      ></stack>
      <stack
        name="Deck"
        :cards="deck"
        @draw="onDraw"
        :active="stacks.length === 0"
      ></stack>
      <stack
        v-for="(stack, index) in stacks"
        :key="index"
        :name="`Stack ${index + 1}`"
        :cards="stack"
        @draw="onDraw"
        :active="index === (stacks.length - 1)"
      ></stack>
      <stack
        name="Discard"
        :cards="discard"
        removable
        @remove="onRemove"
      ></stack>
      <stack
        name="Removed"
        :cards="removed"
      ></stack>
    </div>
  </div>
</template>

<script>
import Stack from '@/components/Stack'

export default {
  name: 'HomeView',
  components: {
    Stack,
  },
  data () {
    return {
      cities: {
        'new york': 3,
        washington: 3,
        london: 3,
        cairo: 3,
        istanbul: 3,
        tripoli: 3,
        jacksonville: 3,
        'sao paulo': 3,
        lagos: 3,
      },
      deck: {},
      discard: {},
      stacks: [],
      removed: {},
    }
  },
  computed: {
    cityNames () {
      return Object.keys(this.cities).sort()
    },
  },
  methods: {
    start () {
      this.deck = {}
      this.discard = this._makeStack()
      this.stacks = []
      this.removed = this._makeStack()
      for (const city in this.cities) {
        this.$set(this.deck, city, this.cities[city])
      }
    },
    _makeStack () {
      const stack = {}
      for (const city in this.cities) {
        stack[city] = 0
      }
      return stack
    },
    _getStack () {
      if (this.stacks.length) {
        return this.stacks[this.stacks.length - 1]
      } else {
        return this.deck
      }
    },
    _cleanStacks () {
      if (this.stacks.length && !Object.values(this.stacks[this.stacks.length - 1]).some(count => count > 0)) {
        this.stacks.pop()
      }
    },
    draw (city) {
      const stack = this._getStack()
      if (stack[city] > 0) {
        stack[city]--
        this.discard[city]++
      } else {
        this.$bvToast('Error')
      }
      this._cleanStacks()
    },
    epidemic (city) {
      this.deck[city]--
      this.discard[city]++
      this.stacks.push(this.discard)
      this.discard = this._makeStack()
    },
    remove (city) {
      if (this.discard[city] > 0) {
        this.discard[city]--
        this.removed[city]++
      } else {
        this.$bvToast('Error')
      }
    },
    onDraw (city) {
      this.draw(city)
    },
    onEpidemic (city) {
      this.epidemic(city)
    },
    onRemove (city) {
      this.remove(city)
    },
  },
}
</script>

<style scoped>

</style>
