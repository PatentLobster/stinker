<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="h-screen flex bg-gray-50 overflow-hidden">

    <NavBar/>

    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">

      <main class="flex-1 flex overflow-hidden">
        <div class="flex-1 flex xl:overflow-hidden">
          <!-- Primary column -->
          <section aria-labelledby="primary-heading" class="min-w-0 flex-1 h-full flex flex-col overflow-hidden lg:order-last">
            <h1 id="primary-heading" class="sr-only">Account</h1>
            <router-view />
          </section>

          <!-- Secondary column (hidden on smaller screens) -->
<!--          <aside class="hidden lg:block lg:flex-shrink-0 lg:order-first">-->
<!--            <div class="h-full relative flex flex-col w-96 border-r border-gray-200 bg-white">-->
<!--              &lt;!&ndash; Your content &ndash;&gt;-->
<!--            </div>-->
<!--          </aside>-->
        </div>
      </main>
    </div>
  </div>
</template>

<script>

import NavBar from "@/components/NavBar";

export default {
  name: 'app',
  components: {
     NavBar
  }
}
</script>