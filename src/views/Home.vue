<template>
  <div class="home container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center mt-3">
    <div class="bg-white shadow mx-auto overflow-hidden sm:rounded-lg">
      <div class="px-8 py-8 sm:px-6 divide-y divide-dotted">
        <div>
          <h1 class="text-4xl font-bold">
            Hey <span class="font-gochi"> {{user.name}} </span>
          </h1>
        </div>
        <div class="pt-4">
          <p>
            To get started make sure to select laravel project and php path in the
            <router-link
                to="/preferences"
                class="inline-flex items-center px-1 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              app preferences.
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
