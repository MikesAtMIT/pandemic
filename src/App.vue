<template>
  <div id="app">
    <router-link :to="{ name: 'home' }">
      Home
    </router-link>
    <router-link :to="{ name: 'old' }">
      Old
    </router-link>
    <h1>Pandemic</h1>
    <router-view></router-view>
  </div>
</template>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
