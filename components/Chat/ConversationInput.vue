<template>
        

<v-toolbar flat width="100%" :style="topBarStyles"> 

<!--    <v-form style="background-color: yellow" width="100%">-->
    <v-container fluid >
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="message"
            :append-outer-icon="message ? 'mdi-send' : null"
            :prepend-icon="prepend_icon"
            
            type="text"
            @click:append-outer="sendMessage"
            @click:prepend="prependClick"
            @keydown.enter="sendMessage"

            rounded
            solo
            dense
            flat 
      
            placeholder = "Escribe un mensaje"

            class="mb-n6 pb-0"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  <!--</v-form>-->

</v-toolbar>
    
  
</template>

<script>

import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';

export default {
  
  components: {
    
  },

  data () {
    return {
        message: null,
        marker: true,
        prepend_icon: null
    }
  },
  props: {
    conversation: Object
  },
  mounted(){
    
  },
  methods:{
    ...mapActions({
        _sendMessage: 'chat/sendMessage',
      }),

    ...mapMutations({ 
      
    }),
    
    sendMessage(){
      console.log(this.message)
      let payload = {
            to: this.conversation._id,
            type:'normal',
            body: this.message,
            time: '9:06 AM',
            status: null  
      }

      this._sendMessage(payload)
      .then(()=>{
        this.message = null
      })
      this.$emit('bajar')
    },

    prependClick(){

    },

    
   
    
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
        
      ]
    }

  },
}
</script>
<style>
  

</style>