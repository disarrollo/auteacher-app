


<template>

    <v-toolbar flat :style="topBarStyles">

      <v-list-item class="px-0">

          <v-list-item-avatar @click="$emit('accountDrawerClick')">
            <v-avatar>
              <img  :src="`avatars/${jid}.jpeg`">
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="name"></v-list-item-title>
            <v-list-item-subtitle v-text="xmpp_status"></v-list-item-subtitle>
          </v-list-item-content>

      </v-list-item>

      <v-spacer />


      <v-menu
        rounded
        offset-y
      >

      <template v-slot:activator="{ on, attrs }">
        <v-btn icon 
          v-bind="attrs"
          v-on="on"
          >
        <v-icon >mdi-dots-vertical</v-icon>  
      </v-btn>
      </template>

      <v-list>
        <v-list-item link>
          <v-list-item-title >Configuración</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="$emit('onAddContact')">
          <v-list-item-title >Agregar contacto</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="cerrar">
          <v-list-item-title >Cerrar</v-list-item-title>
        </v-list-item>
      </v-list>

      </v-menu>
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
    
  },
  mounted(){
    
  },
  methods:{
    ...mapActions({
        logout: 'auth/logout',
        closeXmpp: 'chat/closeXmpp',
      }),

    ...mapMutations({ 
      
    }),
    cerrar(){
      this.logout()
      this.closeXmpp()
    }
   
    
  },
  computed: {
    ...mapState({
      jid: state => state.chat.jid,
      name: state => state.chat.name,
      xmpp_status: state => state.chat.xmpp_status,
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