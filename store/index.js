let brw = process.browser;

  export const state = () => ({
    processing: false,
    info: null,
    error: null,
    warning: null,
    isInfoShowed: false,
    isErrorShowed: false,
    isWarningShowed: false,
    appVersion: '1.0.2',
    debugEnabled: false,
    //Modulos
    authEnabled: false
  })

  export const actions = {
    reload ({commit}, result_set)  {
      if(brw){
        location.reload()
      }
    },
  }

  export const mutations = {
    startProcessing (state) {
      state.processing = true;
    },
    stopProcessing (state) {
      state.processing = false;
    },
    /*
    setError (state, responseApi) {
      if(responseApi.data){
        let data = responseApi.data
        if(data.error){
          if(data.error.message){
            if(data.error.name && data.error.name=='InvalidJwtToken'){
              state.error = 'Acceso no autorizado';
              this.dispatch('auth/logout')
              this.$router.push('/login')
            }
            state.error = data.error.message;
          }else{
            state.error = data.error;
          }  
        }else{
          state.error = data;
        }
      }else{
        state.error = responseApi;
      }
      state.isErrorShowed = true
      //setTimeout(() => {
      //  state.error = null
      //},3000)
    },
    */
    setVersion:  (state, response) => {
      state.version = response.version
    },
    
    showError:  (state) => {
      state.isErrorShowed = true
    },
    hideError:  (state) => {
      state.isErrorShowed = false
    },
    setError: (state, value) => {
      state.error = value
      state.isErrorShowed = true
    },

    showInfo:  (state) => {
      state.isInfoShowed = true
    },
    hideInfo:  (state) => {
      state.isInfoShowed = false
    },
    setInfo: (state, value) => {
      state.info = value
      state.isInfoShowed = true
    },

    showWarning:  (state) => {
      state.isWarningShowed = true
    },
    hideWarning:  (state) => {
      state.isWarningShowed = false
    },
    setWarning: (state, value) => {
      state.info = value
      state.isWarningShowed = true
    },

    setDebug: (state, value) => {
      console.log('setDebug:'+value)
      state.debugEnabled = value
    },

    setAuthModule: (state, value) => {
      console.log('setAuthModule:'+value)
      state.authEnabled = value
    },

  }



export const getters = {
  //Esto no funciona por que el objeto vuetify es indefinido
  /*
  isMobile: (state) => (permiso) => {
    switch(this.$vuetify.breakpoint.name){
      case 'xs': return true
      case 'sm': return true
      case 'md': return false
      case 'lg': return false
      case 'xl': return false
    }
    return false
  },
  */
  
};


  


