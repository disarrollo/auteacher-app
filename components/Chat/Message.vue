


<template>

  
  <v-row > 
 	<v-col  :align="isRight?'end':'start'">

      	<v-card  class="d-inline-flex" max-width="80%" :style="messageStyles">
          
          

          <v-card-text class="py-1 pr-2 pl-3">

          
          <p style="display:inline;" :class="textClass">
            <!-- Imagen -->
            <v-img
              v-if="message.body_type && message.body_type=='imagen'"
              :src="imgSrc"
              max-width="300px"
            ></v-img>
            <!-- Audio -->

            <span v-else-if="message.body_type && message.body_type=='audio'">
              <!-- Opcion con html-->
              <!--
              <audio  controls>
                <source :src="'/audio/'+message.body" type="audio/mp3" />
                <p>Your user agent does not support the HTML5 Audio element.</p>
              </audio>
              -->
              <!-- Segunda opion -->
              
                {{texto}}
                <v-btn
                  icon
                  small
                  @click="escuchar"
                >
                  <v-icon  >mdi-play</v-icon>
                </v-btn>
              
            </span>
            <!-- Texto -->
            <span v-else >{{texto}} </span>
            
          </p>
          

          <div max-width="30px" style="display:inline; height: 30px">
            <span style="font-size: 10px; color: gray " class="pl-4">{{message.time}} </span>
            <v-icon small v-if="isRight">
              {{icon}}
            </v-icon>
          </div>

            
          </v-card-text>

        </v-card>
        <v-btn
          v-if="showHelp"
          elevation="1"
          icon
          x-small
          height="16px"
          width="16px"
          style="margin-top: -10px; background-color: #e0d06c"
          @click="help"
        >
          <v-icon style="font-size: 12px" >mdi-help</v-icon>
        </v-btn>
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
      	helped: false,
        audioMessage: null
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

    help(){
      this.helped = true
      setTimeout(() => { 
          this.helped = false
      },5000)  
      
    },
    escuchar(){
      if(this.audioMessage == null){
        console.log('inicializa sonido')
         this.audioMessage = new Audio('/audio/'+this.message.body);
      }
      var playPromise = this.audioMessage.play();
    }
    
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
    showHelp(){
      return this.message.hint || this.message.body_type=='audio'
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
      
    },
    texto(){
        if(this.helped){
          if(this.message.body_type=='audio'){
            return "Escucha esto:"      
          }else{
            return this.message.hint  
          }
        }else{
          if(this.message.body_type=='audio'){
            return "Listen it:"
          }else{
            return this.message.body  
          }
        }
    },
    imgSrc(){
      if(this.helped){
        return "/material/"+this.message.hint
      }
      return "/material/"+this.message.body
    },
    textClass(){
      if(this.helped){
        return "font-italic"
      }
      return null
      
    }
    
    

  },
}
</script>
<style>
  

</style>