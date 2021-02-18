
<template>
        
    <v-toolbar flat :style="topBarStyles">

      <v-list-item  class="px-0">

          <v-list-item-avatar>
            <v-avatar v-if="conversation.icon">
              <img
                :src="`avatars/${conversation.icon}.png`"
                alt="John"
              >
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="conversation.nickname"></v-list-item-title>
          </v-list-item-content>

      </v-list-item>

    </v-toolbar>

</template>

<script>

import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';

export default {
  
  components: {
    
  },

  data () {
    return {
        
    }
  },
  props: {
    conversation: Object
  },
  mounted(){
    
  },
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
    
    

    topBarStyles(){
      return [
        {'background-color':'#ededed'},
        {'height':'60px'},
        {}  
      ]
    }

  },
}
</script>
<style>
  

</style>