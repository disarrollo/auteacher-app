


<template>
	    	
	
		<v-list>

			<v-list-item-group
		        v-model="selectedItem"
		        active-class="conversationSelected"
		      >

			<div v-for="conversation in conversations">
				<ConversationsSelectorItem :conversation="conversation" 
        @onSelectConversation="$emit('onSelectConversation')"/>
			</div>
			</v-list-item-group>
		</v-list>
	
  
</template>

<script>

import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';

export default {
	
  components: {
    
  },

  data () {
    return {
      	selectedItem:null
    }
  },
  props: {
		//title: String,
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
      conversations: state => state.chat.conversations,
    }),
    ...mapGetters({
      
    }),
    

  },
}
</script>
<style>
  
.conversationSelected{
	background-color: #ededed;

}
</style>