<template>
  <div>
    <b-button
      :id="`card-${card.id}`"
      class="p-card mx-1 px-0"
      @click="onClick"
      :variant="godMode ? 'success' : disabled ? 'secondary' : (alt && shift) ? 'danger' : 'primary'"
      :disabled="disabled"
    >
      <template v-if="godMode">
        {{ card.id }}
      </template>
    </b-button>
    <b-popover
      :target="`card-${card.id}`"
      triggers="focus"
      :disabled="!godMode"
    >
      <h5>Move card to</h5>
      <b-button
        v-for="stack in stackNames"
        :key="stack"
        size="sm"
        block
        @click="onGodModeClick(stack)"
      >
        {{ stack }}
      </b-button>
    </b-popover>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Card',
  props: {
    card: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    alt: {
      type: Boolean,
      default: false,
    },
    stackNames: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(['shift', 'godMode']),
    disabled () {
      return !(this.godMode || this.active || (this.alt && this.shift))
    },
  },
  methods: {
    onClick () {
      if (this.godMode) {
        return
      }
      this.$emit('click', this.card, this.alt && this.shift)
    },
    onGodModeClick (stackName) {
      this.$emit('god-mode-click', this.card, stackName)
    },
  },
}
</script>

<style scoped>
.p-card {
  width: 30px;
  height: 40px;
  font-size: 0.8rem;
}
</style>
