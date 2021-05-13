<template>
 <div>
   <button @click="executeTinker">click me asshole</button>
    <input type="file" @change="handleFileChange"/>
   {{kaki}}
 </div>
</template>

<script>
import { spawn } from 'child_process';


export default {
  name: "Tinker",
  data: () => {
    return {
      kaki: 'ad',
      php_path: '',
      proc: null
    }
  },
  methods: {
    executeTinker(e) {
      console.log('here', e)
      const proc = spawn(`"${this.php_path}" -v`, {
        shell: true
      });
      proc.stderr.on('data', (data) => {
        console.error(data.toString());
        this.kaki = data.toString()
      })
      console.log(proc);
      proc.stdout.on('data', (data) => {
        console.log('data: ', data.toString());
        this.kaki = data.toString()
      })
      this.proc = proc;
    },
    handleFileChange(e) {
      // Whenever the file changes, emit the 'input' event with the file data.
      console.log(e.target.files[0].path);
      this.php_path = e.target.files[0].path;
    }

  },
  beforeUnmount() {
    // this.proc.kill('SIGTERM')
  }

}
</script>

