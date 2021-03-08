


<template>
	    	
	<div>
    
    <v-container class="px-16">
      
      <v-row  class="py-0 my-1" no-gutters
      v-for = "message in conversation.messages" :key="message._id">
        <Message :message="message" />
      </v-row>
      
    </v-container>
		

	</div>
  
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
  
  created(){
  	console.log('created conversation:'+this.conversation._id)
    this.recoverMessages(this.conversation._id)
  },

  mounted(){
    console.log('mounted conversation:'+this.conversation._id)
    this.$emit('bajar')
  },
  watch:{
    counter(){
      if(this.counter>0){
        setTimeout(() => { 
            if(this.counter>0){
              this.$emit('bajar')
            }
            
        },200)   
      }
    },
  },

  methods:{
    ...mapActions({
        
      }),

    ...mapMutations({ 
      resetMessageCounter:  'chat/resetMessageCounter',
      recoverMessages:  'chat/recoverMessages',
      
    }),

    
  },
  computed: {
    ...mapState({
      
    }),
    ...mapGetters({
      getCurrentConversation: 'chat/getCurrentConversation', 
    }),

    counter(){
      return this.conversation.newMessageCounter
    }

  },
}
</script>
<style>
  

</style>