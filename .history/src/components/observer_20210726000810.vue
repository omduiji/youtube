<template>
  <div class="observer" />
</template>

<script>
export default {
  props: ['options'],
  name: 'observer',
  data() {
    return {
      observer: null,
    };
  },
  mounted() {
    // this.startObserver();
    const options = this.options || {};
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting && entry.intersectionRatio > 0) {
        this.$emit('intersect');
      }
    }, options);

    this.observer.observe(this.$el);
  },
  destroyed() {
    this.observer.disconnect();
  },
};
</script>
<style lang="sass">
$medium: 900px

.observer
  display: none
  @media (min-width: $medium)
    display: block
    width: 0px
</style>
