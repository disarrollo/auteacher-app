<template>

  <div class="d-flex flex-column mb-6">

      <v-img :aspect-ratio="bannerRatio" src="/apretando.jpg">
        <div  class="d-flex flex-column white--text justify-center fill-height align-center">
          
            <h1 class="heading lightbox pa-3 mt-8" width="600">
              LO SENTIMOS ALGO SALIÓ MAL
            </h1>

            
        </div>
      </v-img>

  </div>
  
</template>

<script>

import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';

import axios from 'axios'

export default {

  components: {
    
  },
  
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