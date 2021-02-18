
<template>
	    	
	<v-app-bar color="deep-purple accent-4" dark dense>
      <v-btn v-if="back" icon @click="onBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>{{title}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="reload" icon @click="onReload">
        <v-icon>mdi-autorenew</v-icon>
      </v-btn>

      <v-btn v-if="nuevo" icon @click="onNew">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn v-if="close" icon @click="onClose">
        <v-icon>mdi-close</v-icon>
      </v-btn>

    </v-app-bar>
  
</template>

<script>

import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';

export default {
	name: 'NavCrud',
  components: {
    
  },

  data () {
    return {
      	
    }
  },
  props: {
		title: String,
		nuevo: Boolean,
		reload: Boolean,
    close: Boolean,
    back: Boolean
	
    },
  mounted(){
  	
  },
  methods:{
    ...mapActions({
        
      }),

    ...mapMutations({ 
      
    }),

    onBack(){
        this.$router.back();
    },

    onReload(){
    	this.$emit('onReload');
    },

    onNew(){
    	this.$emit('onNew');
    },

    onClose(){
      this.$emit('onClose');
    },
    
  },
  computed: {
    ...mapState({
      
    }),
    ...mapGetters({
      
    }),
    

  },
}
</script>
<style>
  

</style>