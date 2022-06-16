<template>
  <div class="container-fluid">
    <b-button
      @click="newGame"
      variant="success"
    >
      New Game
    </b-button>
    <div class="board">
      <stack
        v-if="stacks.length"
        :stack="createStack('Cities')"
        show-names
      ></stack>
      <stack
        v-for="(stack, idx) in stacks"
        :key="idx"
        :stack="stack"
        :alt="hasAlt(stack)"
        :active="idx === numStacks"
        @moveCard="(card, alt) => onMoveCard(stack, card, alt)"
      ></stack>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Stack from '@/components/Stack'

export default {
  name: 'Board',
  components: {
    Stack,
  },
  data () {
    return {
      stacks: [],
      cardCount: 0,
    }
  },
  computed: {
    ...mapState(['cities']),
    numStacks () {
      // exclude Deck, Discard
      return this.stacks.length - 2
    },
    discardIndex () {
      return this.stacks.length - 1
    },
    deck () {
      return this.stacks[0]
    },
    discard () {
      return this.stacks[this.discardIndex]
    },
  },
  methods: {
    ...mapActions(['addCity', 'setShift']),
    newGame () {
      this.stacks.push(this.createDeck())
      this.stacks.push(this.createStack('Discard'))
    },
    createDeck () {
      const deck = this.createStack('Deck')
      for (const city of this.cities) {
        for (let i = 0; i < city.count; i++) {
          this.cardCount++
          const card = {
            id: this.cardCount,
            cityName: city.name,
          }
          deck.cards.push(card)
        }
      }
      return deck
    },
    createStack (name) {
      return {
        name: name,
        cards: [],
      }
    },
    clearEmptyStack () {
      if (this.numStacks && !(this.stacks[this.numStacks].cards.length)) {
        this.stacks.splice(this.numStacks, 1)
      }
    },
    hasAlt (stack) {
      return stack.name === 'Deck'
    },
    onMoveCard (stack, card, alt) {
      let destName

      if (stack.name === 'Deck') {
        if (alt) {
          this.epidemic(card)
          return
        }
        destName = 'Discard'
      } else if (stack.name.startsWith('Stack ')) {
        destName = 'Discard'
      }

      const destination = this.stacks.find(stk => stk.name === destName)
      this.moveCard(card, stack, destination)
      this.clearEmptyStack()
    },
    moveCard (card, source, destination) {
      const idx = source.cards.indexOf(card)
      destination.cards.push(source.cards.splice(idx, 1)[0])
    },
    epidemic (card) {
      const newStack = this.createStack(`Stack ${this.numStacks + 1}`)
      this.moveCard(card, this.deck, newStack)

      while (this.discard.cards.length) {
        this.moveCard(this.discard.cards[0], this.discard, newStack)
      }

      this.stacks.splice(this.discardIndex, 0, newStack)
    },
  },
  mounted () {
    document.addEventListener('keydown', event => {
      if (event.key === 'Shift') {
        this.setShift(true)
      }
    })
    document.addEventListener('keyup', event => {
      if (event.key === 'Shift') {
        this.setShift(false)
      }
    })
  },
}
</script>

<style scoped>
.board {
  display: flex;
}
</style>
