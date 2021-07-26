<template>
  <p class="testp">{{ message }}</p>
</template>

<script>
// import { fetchMessage } from '@/services/fetchers';
import axios from 'axios';

export default {
  data() {
    return {
      message: '',
    };
  },
  async created() {
    try {
      this.message = await this.fetchMessage();
    } catch (error) {
      this.message = 'server error :(';
    }
  },
  methods: {
    async fetchMessage() {
      const response = await axios.get('/message');
      console.log(response.data.message);
      return response.data.message;
    },
  },
};
</script>
<style lang="sass">
.testp
  padding: 10em 0
</style>
