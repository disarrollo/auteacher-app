


<template>

  
    
 	<v-col  :align="isRight?'end':'start'">

      	<v-card  class="d-inline-flex" max-width="80%" :style="messageStyles">
  
          <v-card-text class="py-1 pr-2 pl-3">
            {{message.body}} 
            <span class="text-caption pl-4">{{message.time}} </span>
            <v-icon small>
              {{icon}}
            </v-icon>
          </v-card-text>

        </v-card>

    </v-col>
  </v-row>
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
		message: Object
  },
  mounted(){
  	console.log('mounted message:'+this.message.status)
    if(this.message.status == 'delivered'){
      setTimeout(() => { 
        console.log('reading message...')
              this.readMessage(this.message)
              this.calculateNewMessages(this.message.conversation_id)
              this.setAlertPending(false)

        },500)  
      
    }
    
  },
  methods:{
    ...mapActions({
        
      }),

    ...mapMutations({ 
      readMessage : 'chat/readMessage',
      calculateNewMessages:  'chat/calculateNewMessages',
      setAlertPending:  'chat/setAlertPending',
    }),

   
    
  },
  computed: {
    ...mapState({
      jid: state => state.chat.jid,
    }),
    ...mapGetters({
      
    }),
    isRight(){
      return this.jid == this.message.from
    },
    messageStyles(){
      if(this.jid == this.message.from){
        return [
          {'background-color':'#dcf8c6'},
        ]  
      }
      
    },
    icon(){
      if(this.message.status == 'delivered'){
        return 'mdi-check'
      }else if(this.message.status == 'readed'){
        return 'mdi-check-all'
      }else{
        return ''
      }
      
    }
    

  },
}
</script>
<style>
  

</style>