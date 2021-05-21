<template>
  <div class="px-4 py-5 sm:px-6 divide-y">
    <div class="mb-2">
      <h2 class="text-lg leading-6 font-medium text-gray-900">
        {{ command.name }}
      </h2>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        {{ command.description }}
      </p>
    </div>
    <div class=" divide-y">
      <div class="sm:col-span-6 py-4"
           v-for="arg, i in command.definition.arguments" :key="i">
        <label :for="arg.name"
               class=" block text-md font-medium text-blue-gray-900">
          {{ arg.name }}
          <span
              class="relative text-xs left-2 bottom-2 font-xs" :class="(arg.is_required) ? 'text-red-500' : 'text-gray-500'"
          >
          {{ arg.is_required ? "*Required." : "Not required." }}
        </span>
        </label>
        <p>
          {{ arg.description }} <br/>
        </p>

        <div class="mt-1 flex rounded-md shadow-sm">
                        <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-blue-gray-300 bg-blue-gray-50 text-blue-gray-500 sm:text-sm">
                          {{ arg.name }}
                        </span>
          <input type="text" :name="arg.name" :id="arg.name"
                 :v-model="arguments[arg.name]"
                 @change="argument_update"
                 @keyup="argument_update"
                 class="flex-1 block w-full min-w-0 border-blue-gray-300 rounded-none rounded-r-md text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500">
        </div>
      </div>
      <button
          @click="execute_command"
           class="inline-flex justify-self-center items-center my-2 ml-auto mr-0 px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Execute
        <LightningBoltIcon
            class="ml-2 -mr-0.5 h-4 w-4"
        />
      </button>
    </div>

  </div>

</template>

<script>
import { LightningBoltIcon } from '@heroicons/vue/outline'
export default {
  name: "Command",
  props: ['command'],
  components: {
    LightningBoltIcon
  },
  data()  {
    return {
      arguments: {},
    }
  },
  computed: {
  },
  methods: {
    argument_update(e) {
      if (!this.arguments[e.target.id]) {
        this.arguments[e.target.id] = new Object();
      }
      this.arguments[e.target.id].value = e.target.value

    },
    execute_command() {
      let parsed = this.command.usage.toString().split(` `).slice(1);
      for (const arg in this.arguments) {
        parsed = parsed.map((v) => {
          if (v.includes(arg)) {
            return this.arguments[arg].value
          } else {
            return v;
          }
        })
      }
      parsed = parsed.filter((v,i) => {
        return v !== this.command.usage.toString().split(` `).slice(1)[i]
      })
      parsed.unshift(this.command.usage.toString().split(` `)[0])
      this.$emit('exec', parsed)
    }
  },
  mounted() {
  },
  watch: {
    command: function() {
      this.arguments = {}
    }
  }
}
</script>
