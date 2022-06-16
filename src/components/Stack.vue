<template>
  <div class="stack">
    <h2>{{ name }}</h2>
    <div
      v-for="city in sortedCities"
      :key="city[0]"
      class="city-row"
    >
      <template v-if="nameOnly">
        <span>{{ city[0] }}</span>
      </template>
      <template v-else>
        <template v-if="city[1]">
          <span
            v-for="(foo, idx) in new Array(city[1])"
            :key="idx"
            v-b-tooltip.hover-.right
            :title="city[0]"
          >
            <b-button
              size="sm"
              @click="onClick(city[0])"
              :disabled="!active && !removable && !epidemic"
              class="mx-1"
              :variant="epidemic ? 'danger' : active ? 'primary' : removable ? 'dark' : 'secondary'"
            >
              &nbsp;
            </b-button>
          </span>
        </template>
      </template>
      &nbsp;
    </div>
  </div>
</template>

<script>

export default {
  name: 'Stack',
  props: {
    name: {
      type: String,
      required: true,
    },
    cards: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    epidemic: {
      type: Boolean,
      default: false,
    },
    removable: {
      type: Boolean,
      default: false,
    },
    nameOnly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sortedCities () {
      const citiesArray = []
      for (const city in this.cards) {
        citiesArray.push([city, this.cards[city]])
      }
      return citiesArray.sort((a, b) => {
        if (a[0] < b[0]) {
          return -1
        } else if (a[0] > b[0]) {
          return 1
        } else {
          return 0
        }
      })
    },
  },
  methods: {
    onClick (city) {
      if (this.epidemic) {
        this.$emit('epidemic', city)
      } else if (this.removable) {
        this.$emit('remove', city)
      } else {
        this.$emit('draw', city)
      }
    },
  },
}

</script>

<style scoped>
.stack {
  text-align: left;
  display: inline-block;
  margin: 0 1rem;
}
.city-row {
  height: 2rem;
}
.btn-epidemic {
  float: right;
}
</style>
