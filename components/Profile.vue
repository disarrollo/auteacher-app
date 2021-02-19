<template>
  <div>
  	<v-app-bar color="#01bfa5" dark height="100" flat >
      <v-btn  icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>Mi cuenta</v-toolbar-title>
    </v-app-bar>

    <v-container style="background-color:#ededed">
      <v-row >
        <v-col class="text-center py-6">
          <v-avatar size="200">
            <img  :src="`avatars/${jid}.jpeg`">
          </v-avatar>

        </v-col>
      </v-row>
      <v-row style="background-color:#fff">
        <v-col class="px-10">
          {{name}}
        </v-col>
        
      </v-row>

    </v-container>

    <v-footer padless>
          <div class="px-6 py-2">
            <p class="mb-0">
              2021 — <strong>Auteacher</strong>
            </p>
            <p class="my-0">
              <span class="text-caption grey--text">Version {{appVersion}}</span>    
            </p>
          
          </div>
    </v-footer>

  </div>
</template>

<script>

import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';

export default {
	
  
  props: {
    
  },
  data () {
    return {
      
      
    }
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
      jid: state => state.chat.jid,
      name: state => state.chat.name,
      appVersion: state => state.appVersion,
    }),
    ...mapGetters({
      
    }),
    

  },
}
</script>
<style>
  

</style>