<template>
  <Header/>
  <div class="page-view">
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>
<script>
import Header from './components/Header'

export default {
  name: "App",
  components: {Header}
}
</script>
