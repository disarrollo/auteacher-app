<template>
  <v-app dark>
    
    <v-main>
      <nuxt />
    </v-main>

    <div v-if="debugEnabled">
      <DebugBar></DebugBar>
    </div>

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

    
  },
  methods:{
    ...mapActions({
        initIdentity: 'auth/initIdentity',
      }),

    ...mapMutations({

    }),
    
  },

  computed: {
    ...mapState({
      
      identity: state => state.auth.identity,
      debugEnabled: state => state.debugEnabled,
      
    }),
    ...mapGetters({
      
      isLogged: 'auth/isLogged', 
      
    }),

  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
