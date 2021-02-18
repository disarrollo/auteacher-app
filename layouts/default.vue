<template>
  <v-app>


<Profile @close="accountDrawer=false" :drawer="accountDrawer"/>
<AddContact @close="addContactDrawer=false" :drawer="addContactDrawer"/>

      <v-container fluid class="py-0 px-0" >

        <v-row no-gutters >
          <v-col cols="4" style="border-right: 1px solid #dadada"> 

            <v-container align="start" class="fill-height py-0 px-0"  >  
            <v-row no-gutters align="start" class="fill-height" >
              <v-col cols="12" width='100%' height='60' >

              <ChatHeader @accountDrawerClick="accountDrawer=!accountDrawer"
                @onAddContact="addContactDrawer=!addContactDrawer"
              />
              </v-col>
              <v-col cols="12" align="start" class="overflow-y-auto" style="height: calc(100vh - 60px);">
                <ConversationsSelector/>
              
              </v-col>
            </v-row>            
           </v-container>

          </v-col>

          <v-col  cols="8" style="display:'table-column';   height: calc(100vh);" >


            <v-container align="start" class="fill-height py-0 px-0"  >  
            <v-row v-for="c in conversations" :key="c._id" 
            v-if="selectedConversation && selectedConversation._id == c._id" no-gutters align="start" class="fill-height" >
              <v-col cols="12" width='100%' height='60' >
              <ConversationHeader :conversation="c"/>
              <!--
              <div style="z-index:9999;position: absolute;top: 100px; height: 100px;width: 100px;">
 mensajesLenght:{{mensajesLength}}
              </div>
-->
              </v-col>
              <v-col :ref="`rightContainer${c._id}`" :id="`rightContainer-${c._id}`" cols="12" align="start" class="overflow-y-auto" style="height: calc(100vh - 120px);">

                <!--
                      <div id="inicio" ref="inicio"> inicio </div>
                <v-btn @click="bajar">Bajar</v-btn>
                <v-btn @click="updateScrollHeight">Hight: {{scrollHeight}}</v-btn>
                    
                    <v-btn @click="subir">Subir</v-btn>
                    <div id="final" ref="final"> final </div>
                -->

                <div style="
                      background-color: #e5ddd5; 
                      position: absolute;
                      width: 100%;
                      height: calc(100vh - 120px);
                      " ></div>

                      <div style="
                      background-image: url('/wa-background.png');
                      background-size: 30%;  
                      background-repeat: repeat; 
                      position: absolute;
                      opacity: 0.075;
                      width: 100%;
                      height: calc(100vh - 120px);
                      " ></div>
                      <Conversation  @alertar="alertar" :conversation="c" @bajar="bajar"/>   
              </v-col>
              <v-col cols="12" width='100%' height='60' >
              <ConversationInput :conversation="c" @bajar="bajar" />
              </v-col>
            </v-row>  
            <v-row v-if="!selectedConversation" no-gutters align="start" class="fill-height" >
              <v-col class="text-center">
                Aún no tienes conversaciones.
                
              </v-col>
            </v-row>         
           </v-container>

          </v-col>

        </v-row>
      </v-container>
      
  </v-app>

</template>



<script>



import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';
  
export default {
  
  components: {
    
  },
  data () {
    return {
      scrollHeight: 'no hay',
      alertSound: null,
      accountDrawer: false,
      addContactDrawer: false
    }

  },
  mounted(){
    this.initIdentity()
  },
  watch:{
    alert_pending(){
      if(this.alert_pending){
        setTimeout(() => { 
            if(this.alert_pending){
              this.alertar()  
            }
            this.setAlertPending(false)
        },3000)   
      }
    },
    selectedConversation(){
      //this.bajar()
    },
    identity(){
      console.log('identity changed')
      if(this.isLogged){
        if(this.jid){
          let nombre = this.nombre ? this.nombre : this.jid
          this.initXmpp({'jid':this.jid,'name':nombre,'password':'123456789'})
        }else{
          console.log('No hay jid')
        }
       
      }
    }

  },
  async asyncData ({ $content }) {    
    
  },

  methods:{
    ...mapActions({
        initIdentity: 'auth/initIdentity',
        initXmpp: 'chat/initXmpp',
        logout: 'auth/logout',
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
    }),
    alertar(){
      console.log('alertar')

      if(this.alertSound == null){
        console.log('inicializa sonido')
         this.alertSound = new Audio('/hello.mp3');
      }

      var playPromise = this.alertSound.play();
        
    },

    subir(){

      let el = this.$refs.rightContainer
      el.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      console.log(el.scrollHeight)
    },

    bajar(){

      console.log('bajar')

      const selector = `rightContainer${this.selectedConversation._id}`

      //Cuando utilizamos referencias a objetos creados en un v-for quedan referencias dinamicas
      //asi sean unicas se genera un arreglo, por lo que se debe tomar el primer elemento
      const el = this.$refs[selector][0]
      

      if(el != undefined){

          //Utilizamos un timeout debido a que el scroll aumento luego que el arreglo de mensajes se modifique
          //Lo ideal seria escuchar el evento de cambio en el scroll
          //console.log(el)

          setTimeout(() => {
          
            el.scrollTo({
              top: el.scrollHeight,
              left: 0,
              behavior: 'smooth'
            });

          },100)            
      }

      
    },

    updateScrollHeight(){
      
      const selector = `rightContainer${this.selectedConversation._id}`      
      const el = this.$refs[selector][0]
      this.scrollHeight = el.scrollHeight  
      
    },


  },
  computed: {
    ...mapState({
      
      processing: state => state.processing,
      error: state => state.error,
      info: state => state.info,
      warning: state => state.warning,
      
      appVersion: state => state.appVersion,

      debugEnabled: state => state.debugEnabled,
      
      isErrorShowed: state => state.isErrorShowed,
      isWarningShowed: state => state.isWarningShowed,
      isInfoShowed: state => state.isInfoShowed,

      identity: state => state.auth.identity,
      jid: state => state.auth.identity.data.jid,
      nombre: state => state.auth.identity.data.nombre,

      conversations: state => state.chat.conversations,
      alert_pending: state => state.chat.alert_pending,

    }),
    ...mapGetters({
      ableTo: 'auth/ableTo', 
      isLogged: 'auth/isLogged', 
      isMobile: 'isMobile', 
      selectedConversation: 'chat/getCurrentConversation', 
    }),
    
    mensajesLength(){
      //Esto actua como un watcher sobre el tamaño del arreglo de mensajes para ejecutar bajar cuando cambia
      //this.bajar()
      /*
      if(this.selectedConversation){
        return this.selectedConversation.messages.length  
      }else{
        return null
      }
      */
      
    },

    nombre(){
      if(this.perfil && this.perfil.tratamiento){
        return this.perfil.tratamiento
      }else if(this.identity.data.tratamiento){
        return this.identity.data.tratamiento
      }
      return 'Mi cuenta'
    },
    
    title(){
      return 'Epica Bikes'
    },

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

    items () {
      let items = [
      {value:1},
      {value:2},
      {value:3},
      {value:4},
      {value:5},
      ]
      return items
    
      },

    heightLeft() {
      //return this.isDevice ? window.innerHeight + 'px' : 'calc(100vh - 80px)'
      return 'calc(100vh - 60px)'
    },
    heightRight() {
      //return this.isDevice ? window.innerHeight + 'px' : 'calc(100vh - 80px)'
      return 'calc(100vh - 120px)'
    },
    
    

    topBarStyles(){
      return [
        //{'background-color':'#ededed'},
        {'background-color':'blue'},
        {'height':'60px'},
        {}  
      ]
    }


  },
}
</script>
<style>


.toolbar-headers{
  background-color: "#ededed" !important; 
  height: "60px" !important;;
}


</style>