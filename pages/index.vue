<template>

  <v-container>
    <v-card max-width="600" class="my-6 mx-auto">


      ingreso
    </v-card>
      
      


  </v-container>
  
</template>

<script>

import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';

import axios from 'axios'

export default {

  components: {},
  middleware: 'auth',

  data () {
    return {
      
    }
  },
/*
  async asyncData({ params }) {  
  },
*/

  methods:{
    ...mapActions({
        
      }),

    ...mapMutations({
      
    }),
    
  },
  computed: {
    ...mapState({
      
    }),
    ...mapGetters({
      
    }),

    bannerRatio(){
      
      switch(this.$vuetify.breakpoint.name){
        case 'xs': return 2
          case 'sm': return 2
          case 'md': return 3
          case 'lg': return 4
          case 'xl': return 4
      }
      
    }

  },
}
</script>

<style>
  
  .lightbox {
    box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 72px);
  }
  
</style>