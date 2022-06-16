<template>
  <b-button
    class="p-card mx-1"
    @click="onClick"
    :variant="disabled ? 'secondary' : (alt && shift) ? 'danger' : 'primary'"
    :disabled="disabled"
  >
    {{ card.id }}
  </b-button>
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
  },
  computed: {
    ...mapState(['shift']),
    disabled () {
      return !(this.active || (this.alt && this.shift))
    },
  },
  methods: {
    onClick () {
      this.$emit('click', this.card, this.alt && this.shift)
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
