<template>
  <div class="text-xl text-center">
      artisan
      <span class="px-2 text-purple-700">
         {{command_obj.command}}
      </span>
    <span
        v-for="arg in command_obj.arguments"
        :key="arg"
        class="px-2 text-green-600"
    >
          {{arg}}
      </span>
    <span
        v-for="option in command_obj.options"
        :key="option"
        class="px-2 text-blue-600"
    >
          {{option}} {{(option.value) ? option.value : ''}}
      </span>
  </div>
  <div class="px-4 py-5 sm:px-6  divide-y overflow-y-scroll max-h-full mb-2">
    <div class="mb-2">
      <h2 class="text-lg leading-6 font-medium text-gray-900">
        {{ command.name }}
      </h2>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        {{ command.description }}
      </p>
    </div>
    <div class="mb-4 divide-y">
      <div class="sm:col-span-6 py-4"
           v-for="(arg, i) in command.definition.arguments" :key="i">
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

      <div class="sm:col-span-6 py-4"
           v-for="(arg, i) in command.definition.options" :key="i">
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
        <div v-if="arg.accept_value === true" class="mt-1 flex rounded-md shadow-sm">
                        <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-blue-gray-300 bg-blue-gray-50 text-blue-gray-500 sm:text-sm">
                          {{ arg.name }}
                        </span>
          <input type="text" :name="arg.name" :id="arg.name"
                 :v-model="options[arg.name]"
                 @change="option_update"
                 @keyup="option_update"
                 class="flex-1 block w-full min-w-0 border-blue-gray-300 rounded-none rounded-r-md text-blue-gray-900 sm:text-sm focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div v-else class="mt-1 flex rounded-md py-2">
          <Switch

              v-model="options[arg.name]"
              :id="arg.name"
              @click="option_check"
              :class="[options[arg.name] ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500']">
            <span class="sr-only">Use setting</span>
            <span aria-hidden="true" :class="[options[arg.name] ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']" />
          </Switch>
          <span class="inline-flex items-center px-3 text-blue-gray-500 sm:text-sm">
            {{ arg.name }}
          </span>
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
import { Switch } from '@headlessui/vue'

export default {
  name: "Command",
  props: ['command'],
  components: {
    LightningBoltIcon,
    Switch,
  },
  data()  {
    return {
      arguments: {},
      options: {}
    }
  },
  computed: {
    command_obj() {
      let parsed = this.command.usage.toString().split(` `).slice(1);
      for (const arg in this.arguments) {
        parsed = parsed.map((v) => {
          if (v.includes(`<${arg}>`)) {
            return this.arguments[arg].value
          } else {
            return v;
          }
        })
      }
      parsed = parsed.filter((v,i) => {
        return v !== this.command.usage.toString().split(` `).slice(1)[i]
      })
      let options = [];
      for (const option in this.options) {
        if(this.options[option] !== undefined && this.options[option].value !== undefined) {
            options.push(`${option}=${this.options[option].value}`)
          } else {
            if (this.options[option])
              options.push(option)
          }
        }
      return {
        command: this.command.usage.toString().split(` `)[0],
        arguments: parsed,
        options
      }
    }
  },
  methods: {
    argument_update(e) {
      if (!this.arguments[e.target.id]) {
        this.arguments[e.target.id] = new Object();
      }
      this.arguments[e.target.id].value = e.target.value

    },
    option_update(e) {
      if( this.options[e.target.id] === true ) {
        // this.options(e.target.id);
        this.options[e.target.id] = false;
        delete this.options[e.target.id]
      } else {
        if (!this.options[e.target.id]) {
          this.options[e.target.id] = new Object();
        }
        this.options[e.target.id].value = e.target.value
      }
    },
    option_check(e) {
      if (this.options[e.target.id] === false) {
        this.options.splice(e.target.id, e.target.id)
      }
    },
    execute_command() {
      let parsed = this.command.usage.toString().split(` `).slice(1);
      for (const arg in this.arguments) {
        parsed = parsed.map((v) => {
          if (v.includes(`<${arg}>`)) {
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
      for (const option in this.options) {
        if(this.options[option].value) {
          parsed.push(`${option}=${this.options[option].value}`)
        } else {
          if (this.options[option])
          parsed.push(option)
        }
      }
      this.$emit('exec', parsed)
    }
  },
  mounted() {
  },
  watch: {
    command: function() {
      this.arguments = {}
      this.options = {}
    }
  }
}
</script>
