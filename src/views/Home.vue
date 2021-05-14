<template>
  <div class="home">
    <h1>
      Hey {{user.name}}
    </h1>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import platform_info from "../lib/platform_info";
// const crypto = require('crypto');
import { mapState } from "vuex";
// import "@/lib/tinker";
export default {
  name: 'Home',
  components: {
  },
  computed: {
      ...mapState(['user'])
  },
  methods: {

  }
}
</script>
