
<template>
  <div>
    <v-btn text @click="getRoster">
      Lista
    </v-btn>
  </div>
</template>

<script>

import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';

export default {
  data () {
    return {
        token:null
    }
  },
  methods:{
    ...mapActions({
        getRoster: 'chat/getRoster',
      }),
    ...mapMutations({
      
    }),

    
  },
  computed: {
    ...mapState({
      
    }),
    ...mapGetters({
      ableTo: 'auth/ableTo', 
    }),

  },
}
</script>
