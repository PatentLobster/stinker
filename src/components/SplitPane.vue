<template>
  <div
    class="split-pane"
    :class="{ 'is-dragging': dragging }"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div class="split-pane-item" :style="{ width: splitLeft }">
    <slot name="left"></slot>
    </div>
    <div class="split-pane-gutter" @mousedown="dragStart"></div>
    <div class="split-pane-item" :style="{ width: splitRight }">
    <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SplitPane',
  data() {
    return {
      gutter: 0,
      split: 50,
      dragging: false,
    };
  },
  computed: {
    splitLeft: function () {
      return `calc(${this.split}% - ${this.gutter}px)`;
    },
    splitRight: function () {
      return `calc(${100 - this.split}% - ${this.gutter}px)`;
    },
  },
  methods: {
    dragStart(e) {
      this.dragging = true;
      this.startX = e.pageX;
      this.startSplit = this.split;
    },
    dragMove(e) {
      if (this.dragging) {
        const dx = e.pageX - this.startX;
        const totalWidth = this.$el.offsetWidth;
        this.split = this.startSplit + ~~((dx / totalWidth) * 100);
        const event = new Event('resize');
        window.dispatchEvent(event);
      }
    },
    dragEnd() {
      this.dragging = false;
      const event = new Event('resize');
      window.dispatchEvent(event);

    },
  },
};
</script>

<style lang="css">
.split-pane {
  display: flex;
  flex-direction: row;
  height: 80%;
}
.split-pane-item,
.split-pane-gutter {
  height: 80%;
}
.split-pane-gutter {
  background: #000;
  opacity: 0.2;
  z-index: 1;
  box-sizing: border-box;
  background-clip: padding-box;
  width: 11px;
  margin: 0 -5px;
  border-left: 5px solid rgba(255, 255, 255, 0);
  border-right: 5px solid rgba(255, 255, 255, 0);
  cursor: col-resize;
}
.split-pane-gutter:hover,
.split-pane-gutter:focus {
  border-left: 5px solid rgba(0, 0, 0, 0.5);
  border-right: 5px solid rgba(0, 0, 0, 0.5);
  transition: all 2s ease;
}
.is-dragging {
  cursor: col-resize;
}
</style>