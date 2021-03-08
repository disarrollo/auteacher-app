<template>
  <v-app dark>
    
    <v-main>
      <nuxt />
    </v-main>

    <div v-if="debugEnabled">
      <DebugBar></DebugBar>
    </div>

    <v-snackbar v-model="isInfoDialogShowed">
        {{ info }}
        <v-btn color="success" text @click="hideInfo">
          Close
        </v-btn>
      </v-snackbar>
      
      <v-snackbar v-model="isErrorDialogShowed">
        {{ error }}
        <v-btn color="error" text @click="hideError">
          Close
        </v-btn>
      </v-snackbar>

      <v-snackbar v-model="isWarningDialogShowed">
        {{ warning }}
        <v-btn color="info" text @click="hideWarning">
          Close
        </v-btn>
      </v-snackbar>
      

  </v-app>
</template>

<script>
  import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';
export default {
  
  props: {
    
  },
  data () {
    return {
      
    }
  },
  head () {
    const title = 'Profesor title'
    return {
      title
    }
  },
  mounted(){
    this.initIdentity()
    this.searchUpdates()
  },
  methods:{
    ...mapActions({
        searchUpdates: 'searchUpdates',
        initIdentity: 'auth/initIdentity',
      }),

    ...mapMutations({
      showError: 'showError',
      hideError: 'hideError',
      showInfo: 'showInfo',
      hideInfo: 'hideInfo',
      showWarning: 'showWarning',
      hideWarning: 'hideWarning',
      showLoginDialog:  'auth/showLoginDialog',
      setAlertPending:  'chat/setAlertPending',
      setCurrentConversation:  'chat/setCurrentConversation',
    }),
    
  },

  computed: {
    ...mapState({
      processing: state => state.processing,
      error: state => state.error,
      info: state => state.info,
      warning: state => state.warning,

      isErrorShowed: state => state.isErrorShowed,
      isWarningShowed: state => state.isWarningShowed,
      isInfoShowed: state => state.isInfoShowed,

      identity: state => state.auth.identity,
      debugEnabled: state => state.debugEnabled,
      
    }),
    ...mapGetters({
      
      isLogged: 'auth/isLogged', 
      
    }),

    isErrorDialogShowed:{
      get(){
        return this.isErrorShowed
      },
      set(value){
        if(value){
          this.showError()
        }else{
          this.hideError()
        }
        
      }
    },
    isInfoDialogShowed:{
      get(){
        return this.isInfoShowed
      },
      set(value){
        if(value){
          this.showInfo()
        }else{
          this.hideInfo()
        }
        
      }
    },

    isWarningDialogShowed:{
      get(){
        return this.isWarningShowed
      },
      set(value){
        if(value){
          this.showWarning()
        }else{
          this.hideWarning()
        }
        
      }
    },

  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
