<template>
  <div class="container-fluid">
    <b-button-group class="mb-3 game-menu">
      <b-button
        variant="danger"
      >
        <span class="font-weight-bold">Pandemic</span>
      </b-button>
      <b-button
        variant="outline-danger"
        @click="onNewGame"
        v-b-tooltip.hover
        title="New Game"
      >
        <b-icon-plus-square></b-icon-plus-square>
      </b-button>
      <b-button
        variant="outline-danger"
        v-b-modal.modal-save-game
        v-b-tooltip.hover
        title="Export Game"
      >
        <b-icon-download></b-icon-download>
      </b-button>
      <b-modal
        id="modal-save-game"
        title="Export Game"
        size="xl"
        hide-footer
      >
        <div class="d-flex align-items-center mb-2">
          Download a save game file
          <b-button
            @click="downloadGameState"
            size="sm"
            class="ml-2"
          >
            <b-icon-download></b-icon-download>
            Download
          </b-button>
        </div>
        <div class="d-flex align-items-center">
          Or copy the following and save it in a text file
          <b-button
            @click="copyGameState"
            size="sm"
            class="ml-2"
          >
            <b-icon-files></b-icon-files>
            Copy
          </b-button>
        </div>
        <div class="p-3 text-monospace save-game-container">
          {{ saveGameState }}
        </div>
      </b-modal>

      <b-button
        variant="outline-danger"
        v-b-modal.modal-load-game
        v-b-tooltip.hover
        title="Import Game"
      >
        <b-icon-upload></b-icon-upload>
      </b-button>
      <b-modal
        id="modal-load-game"
        title="Import Game"
        size="xl"
        ok-title="Import"
        @ok="loadGame"
      >
        <b-form-file
          v-model="loadGameFile"
          accept=".txt"
          placeholder="Choose a save game file..."
          drop-placeholder="Drop save game file here..."
          class="mb-3"
        ></b-form-file>
        <b-textarea
          v-model="loadGameState"
          rows="5"
          placeholder="Or paste in the saved game state"
        ></b-textarea>
      </b-modal>

      <b-button
        variant="outline-danger"
        @click="toggleGodMode"
        v-b-tooltip.hover
        title="God Mode"
      >
        <b-icon-lightning></b-icon-lightning>
      </b-button>
      <b-modal
        id="modal-new-game"
        title="Setup Game"
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
            <div class="col">
              {{ city.name }}
            </div>
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
    </b-button-group>

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
        :stack-names="stackNames"
        @move-card="(card, alt) => onMoveCard(stack, card, alt)"
        @god-mode-move-card="(card, dest) => onGodModeMoveCard(stack, card, dest)"
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
      loadGameFile: null,
      loadGameState: '',
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
    stackNames () {
      return this.stacks.map(stack => stack.name)
    },
    saveGameState () {
      return JSON.stringify({
        stacks: this.stacks,
        cardCount: this.cardCount,
        cities: this.cities,
      })
    },
  },
  methods: {
    ...mapActions([
      'addCity',
      'removeCity',
      'changeCityCount',
      'setShift',
      'toggleGodMode',
      'setCities',
    ]),
    async onNewGame () {
      let ok = true
      if (this.gameStarted) {
        ok = await this.$bvModal.msgBoxConfirm('This will clear the current game. Are you sure you want to start a new one?')
      }
      if (ok) {
        this.stacks = []
        this.cardCount = 0
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
      this.autoSave()
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
      this.autoSave()
    },
    onGodModeMoveCard (stack, card, destName) {
      const destination = this.stacks.find(stk => stk.name === destName)
      this.moveCard(card, stack, destination)
      this.clearEmptyStack()
      this.autoSave()
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
      this.autoSave()
    },
    async copyGameState () {
      await navigator.clipboard.writeText(this.saveGameState)
    },
    downloadGameState () {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.saveGameState))
      element.setAttribute('download', `pandemic save ${new Date().toISOString()}.txt`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    async loadGame () {
      let gameData
      if (this.loadGameFile) {
        gameData = JSON.parse(await this.loadGameFile.text())
        this.loadGameFile = null
      } else {
        gameData = JSON.parse(this.loadGameState)
        this.loadGameState = ''
      }
      this.loadGameData(gameData)
    },
    loadGameData (gameData) {
      this.stacks = gameData.stacks
      this.cardCount = gameData.cardCount
      this.setCities(gameData.cities)
      this.autoSave()
    },
    autoSave () {
      localStorage.saveGame = this.saveGameState
    },
    autoLoad () {
      if (localStorage.saveGame) {
        this.loadGameData(JSON.parse(localStorage.saveGame))
      }
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
    this.autoLoad()
  },
}
</script>

<style scoped>
.game-menu .btn {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: 0;
}
.game-menu .btn:first-child {
  border-bottom-left-radius: 1rem;
}
.game-menu .btn:last-child {
  border-bottom-right-radius: 1rem;
}
.board {
  display: flex;
  justify-content: center;
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
.save-game-container {
  max-height: 50vh;
  overflow: scroll;
}
</style>
