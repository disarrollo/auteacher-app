<template>
  
    <v-dialog v-model="isShowed" hide-overlay
 :fullscreen="isMobile" max-width="600" transition="dialog-bottom-transition">

      <v-toolbar
          dark
          color="primary"
        >
          
          <v-toolbar-title>Bienvenido!</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
            icon
            dark
            @click="hideLoginDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          </v-toolbar-items>
        </v-toolbar>


        <LoginFormSimple/>
    </v-dialog>

    
</template>

<script>


import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';
  
export default {
  
  components: {
    
  },
  data () {
    return {}
  },
  mounted(){
    
  },
  
  async asyncData ({ $content }) {    
    
  },


  methods:{
    ...mapActions({
        
    }),

    ...mapMutations({
      showLoginDialog:  'auth/showLoginDialog',
      hideLoginDialog:  'auth/hideLoginDialog',
    }),
    
  },
  computed: {
    ...mapState({
      isLoginFormShowed: state => state.auth.isLoginFormShowed,
    }),
    ...mapGetters({
      
    }),
    
    
    isMobile(){
      switch(this.$vuetify.breakpoint.name){
        case 'xs': return true
        case 'sm': return true
        case 'md': return false
        case 'lg': return false
        case 'xl': return false
      }
    
    },
    isShowed:{
      get(){
        return this.isLoginFormShowed
      },
      set(value){
        if(value){
          this.showLoginDialog()
        }else{
          this.hideLoginDialog()
        }
        
      }
    },
    
  },
}
</script>
