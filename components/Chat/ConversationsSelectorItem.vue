
<template>
	    	
	 <v-list-item   style="border-bottom: 1px solid #dadada" @click="setCurrentConversation(conversation._id)">

      <v-list-item-icon class="my-2">

          <v-badge
            color="green"
            :value="counter>0"
            avatar
            bordered
            overlap
            
            offset-y="20"
          >

          <template v-slot:badge>
            <span style="line-height: 18px;">{{counter}}</span>
          </template>

              <v-avatar v-if="conversation.icon">
                <img
                  :src="`avatars/${conversation.icon}.png`"
                >
              </v-avatar>
              <v-avatar v-else-if="conversation.nickname" >
               <span class="white--brown headline">{{conversation.nickname.substring(0,1)}}</span>
              </v-avatar>

              <v-avatar v-else="conversation._id" >
               <span class="white--brown headline">{{conversation._id.substring(0,1)}}</span>
              </v-avatar>
          </v-badge>

      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title v-text="conversation.nickname"></v-list-item-title>

        <v-list-item-subtitle v-text="lastMessageBody"></v-list-item-subtitle>
        
      </v-list-item-content>

      <v-list-item-action>
        <div class="text-caption blue-grey--text">{{lastMessageTime}}</div>
        
      </v-list-item-action>
  </v-list-item>
  
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
		  conversation: Object,
  },
  mounted(){
  	
  },
  methods:{
    ...mapActions({
        
      }),

    ...mapMutations({ 
      setCurrentConversation:  'chat/setCurrentConversation',
    }),

   
    
  },
  computed: {
    ...mapState({
      
    }),
    ...mapGetters({
      
    }),
    lastMessageBody(){
      if(this.conversation.messages.length>0){
        return this.conversation.messages[this.conversation.messages.length-1].body  
      }else{
        return ''
      }
      
    },
    lastMessageTime(){
      if(this.conversation.messages.length>0){
        return this.conversation.messages[this.conversation.messages.length-1].time  
      }else{
        return ''
      }
      
    },
    counter(){
      return this.conversation.newMessageCounter
    }
    

  },
}
</script>
<style>
  

</style>