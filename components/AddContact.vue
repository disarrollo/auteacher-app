<template>
  <v-navigation-drawer 
      v-model="drawer"
      width="34%"
      fixed
      app
    >

  	<v-app-bar color="#01bfa5" dark height="100" flat >
      <v-btn  icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>Agregar Contacto</v-toolbar-title>
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
<v-form ref="addContactForm" v-model="addContactForm" >
          <v-text-field  ref="telefono" v-model="input_add_contact_telefono" label="Número de celular" :rules="telRules" ></v-text-field>
          <v-text-field  label="Nombre" v-model="input_nickname" :rules="nicknameRules"></v-text-field>

          <v-btn @click="addContact">Enviar</v-btn>
</v-form>
          
        </v-col>
        
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script>

import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';

export default {
	
  
  props: {
    drawer: Boolean
  },
  data () {
    return {
      addContactForm: null,
      telRules: [
          v => !!v || 'El número de telefono es necesario',
      ],
      nicknameRules: [
          v => !!v || 'El nombre de telefono es necesario',
      ],
      input_add_contact_telefono: null,
      input_nickname: null
    }
  },
  mounted(){
  	
  },
  methods:{
    ...mapActions({
        
      }),

    ...mapMutations({ 
      addConversation:  'chat/addConversation',
    }),

    addContact(){
      let payload = {
        conversation_id : this.input_add_contact_telefono,
        nickname : this.input_nickname
      }
      this.addConversation(payload)
    }
    
  },
  computed: {
    ...mapState({
      jid: state => state.chat.jid,
      name: state => state.chat.name,
    }),
    ...mapGetters({
      
    }),


  },
}
</script>
<style>
  

</style>