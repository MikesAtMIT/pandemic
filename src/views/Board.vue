<template>
  <div class="container-fluid">
    <b-button
      variant="success"
      @click="onNewGame"
    >
      New Game
    </b-button>
    <b-modal
      id="modal-new-game"
      title="Set up game"
      @ok="newGame"
    >
      <div class="container-fluid">
        <b-form @submit.prevent="onAddCity">
          <b-form-input
            v-model="newCity"
            placeholder="Add new city..."
          ></b-form-input>
        </b-form>
        <div
          v-for="city in cities"
          :key="city.name"
          class="row row-city-setup my-1"
        >
          <div class="col">{{ city.name }}</div>
          <div class="col">
            <b-button-group>
              <b-button
                size="sm"
                @click="changeCityCount({ cityName: city.name, count: -1 })"
              >
                -
              </b-button>
              <b-button
                variant="outline-dark"
                disabled
                size="sm"
                class="city-setup-count"
              >
                {{ city.count }}
              </b-button>
              <b-button
                size="sm"
                @click="changeCityCount({ cityName: city.name, count: 1 })"
              >
                +
              </b-button>
            </b-button-group>
          </div>
          <div class="col">
            <b-button
              size="sm"
              @click="removeCity(city.name)"
            >
              ×
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>

    <div class="board">
      <stack
        v-if="gameStarted"
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
      newCity: '',
    }
  },
  computed: {
    ...mapState(['cities']),
    gameStarted () {
      return !!this.stacks.length
    },
    numStacks () {
      // exclude Deck, Discard, Removed
      return this.stacks.length - 3
    },
    discardIndex () {
      return this.stacks.length - 2
    },
    deck () {
      return this.stacks[0]
    },
    discard () {
      return this.stacks[this.discardIndex]
    },
  },
  methods: {
    ...mapActions([
      'addCity',
      'removeCity',
      'changeCityCount',
      'setShift',
    ]),
    async onNewGame () {
      let ok = true
      if (this.gameStarted) {
        ok = await this.$bvModal.msgBoxConfirm('This will clear the current game. Are you sure you want to start a new one?')
      }
      if (ok) {
        this.stacks = []
        this.$bvModal.show('modal-new-game')
      }
    },
    onAddCity () {
      this.addCity({ name: this.newCity, count: 3, highlight: false })
      this.newCity = ''
    },
    newGame () {
      this.stacks.push(this.createDeck())
      this.stacks.push(this.createStack('Discard'))
      this.stacks.push(this.createStack('Removed'))
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
      return stack.name === 'Deck' || stack.name === 'Discard'
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
      } else if (stack.name === 'Discard' && alt) {
        destName = 'Removed'
      } else {
        return
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
.row-city-setup {
  display: flex;
  align-items: center;
}
.row-city-setup:hover {
  background-color: #e4f4ff;
}
.city-setup-count {
  width: 30px;
}
</style>
