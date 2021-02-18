<template>
  <div style="margin-bottom: 50px;">
    <v-bottom-navigation>
        <v-btn color="success" text @click="ping">
          ping
        </v-btn>

        <v-btn color="success" text @click="pingAnonimo">
          pingAnonimo
        </v-btn>

        <v-btn color="success" text @click="initIdentity">
          initIdentity
        </v-btn>

        <v-btn color="success" text @click="resetIdentity">
          resetIdentity
        </v-btn>
        <v-btn color="success" text @click="setCookie">
          setCookie
        </v-btn>
        <v-btn color="success" text @click="setIdentity">
          setIdentity
        </v-btn>
        <v-btn color="success" text @click="refreshToken">
          refreshToken
        </v-btn>
        <v-btn color="success" text @click="leerToken">
        leer Token
        </v-btn>
        
    </v-bottom-navigation>
    <div>
        <span>{{identity}}</span>
        <span>System bar:</span>
        <span>version:{{version}}</span>
    </div>

    <div class="d-flex flex-column">
        breakpoint.name:{{breakpoint}}<br>
        breakpoint.scrollBarWidth:{{scrollBarWidth}}
    </div>

     <p>
      EnvData: <br>
        {{envData}}
    </p>

    <p>
      token: <br>
        {{token}}
    </p>

  </div>
</template>

<script>

import {mapState,mapActions,mapMutations,mapGetters} from 'vuex';

export default {
  data () {
    return {
        token:null
    }
  },
  methods:{
    ...mapActions({
        ping: 'debug/ping',
        pingAnonimo: 'debug/pingAnonimo',

        initIdentity: 'auth/initIdentity',
        setCookie: 'auth/setCookie',
        resetIdentity: 'auth/resetIdentity',
        refreshToken: 'auth/refreshToken',
      }),
    ...mapMutations({
      setIdentity: 'auth/setIdentity',
    }),

    leerToken(){
      console.log('leyendo token')
        this.token = window.localStorage.getItem('USRTKN')
      },
    
  },
  computed: {
    ...mapState({
      version: state => state.version,
      identity: state => state.auth.identity,
    }),
    ...mapGetters({
      ableTo: 'auth/ableTo', 
    }),
    breakpoint(){
      return this.$vuetify.breakpoint.name
    },
    scrollBarWidth(){
      return this.$vuetify.breakpoint.scrollBarWidth
    },
    envData(){
      let data = {
        'AUTH_MODULE' : process.env.AUTH_MODULE        
      }
      return data 
    }

  },
}
</script>
