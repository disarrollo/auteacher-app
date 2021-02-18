//import User from './user';
//import store from '../store';

let brw = process.browser;
import jwtDecode from "jwt-decode";

export const state = () => ({
  identity: {
    uid:null,
    data:{
      tratamiento: null,
      privileges:[],
      //authenticated: false,
      //anonimo: true,
      device: null,
      empresa: null
    }
  },
  loading:false,
  //authentication_state:'init',//init, email_sent, ask_for_names, telephone_sent, 
  validation_code:'',
  validation_code_length:4,

  metodo : 'email', //email, celular, password, despues google, facebook, etc
  email : '',
  password : '',
  celular: '',
  dispositivo_seguro: false,

  isLoginFormShowed: false
})


export const actions = {


    resetUser ({commit})  {
      //Reinicia solo el usuario
      console.log('resetUser...')
      if(brw){
        window.localStorage.removeItem('USRTKN');
        commit('setIdentity');
      }
    },

    //Devuelve true si se debe permitir el proceso de login
    /*
    loginStart({commit,state}){
      //Verificaciones
      if(brw){
        
        if(window.localStorage.getItem('USRTKN')){
          if(state.identity.data.authenticated){
            console.log('Autenticado') 
            if(!state.identity.data.tratamiento){
              console.log('No tiene tratamiento') 
              commit('setAuthenticationState','ask_for_names');
              return true
            }
            
          }else{
            commit('setAuthenticationState','init');
            return true
          }
          
        }else{
          commit('setAuthenticationState','init');
          this.dispatch('auth/initIdentity')
          return true
        }
        
      }
      return false
    },
    */

    resetIdentity ({commit})  {
      //Reinicia el usuario y dispositivo (Solo en desarrollo)
      console.log('resetIdentity...')
      if(brw){
        window.localStorage.removeItem('DVCID');
        window.localStorage.removeItem('USRTKN');
        commit('setIdentity');
      }
    },
    initIdentity ({commit})  {
      console.log('initIdentity...')
      if(brw){
        let device_id = window.localStorage.getItem('DVCID')
        if(device_id){
          this.dispatch('auth/verifyUser')
        }else{
          this.dispatch('auth/registerDevice')
        }
      }
    },
    verifyUser ({commit})  {
      console.log('verifyUser...')
      if(brw){
        let user_id = window.localStorage.getItem('USRTKN')
        if(user_id){
          //Ya hay un usuario registrado, hay que setearlo
          commit('setIdentity');
          
        }else{
          this.dispatch('auth/registerNewUser')
        }
      }
    },
    setCookie ({commit})  {

    },
    registerDevice ({commit})  {
      console.log('registerDevice...')
      if(brw){
          let data = {}

          if(window.navigator.platform)
            data.platform = window.navigator.platform
          if(window.navigator.deviceMemory)
            data.deviceMemory = window.navigator.deviceMemory
          if(window.navigator.language)
            data.language = window.navigator.language
          if(window.screen && window.screen.width && window.screen.height)
            data.screen = window.screen.width + 'x' + window.screen.height
          if(window.navigator.userAgent)
            data.userAgent = window.navigator.userAgent
          commit('showLoading');
          this.$axios.post(process.env.AUTH_API_URL+'d/register', data)
            .then(response => {
              if(response.data.result_set){
                this.dispatch('auth/registerDeviceCallback',response.data.result_set)
              }
            })
            .catch(response => {
                
            })
            .finally(() => {
              commit('hideLoading');     
            })
      }
      
    },
    registerDeviceCallback ({commit},result_set)  {
      //setDeviceId
      console.log(result_set)
      window.localStorage.setItem('DVCID', result_set)
      
      console.log('device registered!')
      this.dispatch('auth/verifyUser')
    },

    registerNewUser ({commit})  {
      console.log('registerNewUser...')
      
      let identity_token = null
      let payload = {}
      let device_id = window.localStorage.getItem('DVCID')
      if(device_id)
        payload.device_id = device_id
      
      payload.universe = process.env.UNIVERSE

      commit('showLoading');
      this.$axios.post(process.env.AUTH_API_URL+'c/customer', payload)
        .then(response => {
            if(response.data.result_set){
              this.dispatch('auth/registerNewUserCallback',response.data.result_set)
            }
          })
          .catch(response => {
              
          })
          .finally(() => {
              commit('hideLoading');
          })
    },

    registerNewUserCallback ({commit}, result_set)  {
      //setUsrToken
      window.localStorage.setItem('USRTKN', result_set)
      console.log('user registered');
      commit('setIdentity');

    },

    registerUser ({commit},payload)  {
      console.log('registerUser...')

      commit('showLoading');
      this.$axios.post(process.env.AUTH_API_URL+'r/customer', payload)
        .then(response => {
            if(response.data.result_set){
              this.dispatch('auth/registerUserCallback',response.data.result_set)
            }
          })
          .catch(response => {
              
          })
          .finally(() => {
              commit('hideLoading');
          })
    },

    registerUserCallback ({commit}, result_set)  {
      //setUsrToken
      window.localStorage.setItem('USRTKN', result_set)
      console.log('user registered');
      commit('setIdentity');
      this.$router.push('/')
    },

    refreshToken ({commit})  {
      console.log('refreshToken...')
      commit('showLoading');
      this.$axios.post(process.env.AUTH_API_URL+'t/refresh')
        .then(response => {
            if(response.data.result_set){
              this.dispatch('auth/refreshTokenCallback',response.data.result_set)
            }
          })
          .catch(response => {
              
          })
          .finally(() => {
              commit('hideLoading');
          })
    },

    refreshTokenCallback ({commit,state}, result_set)  {
      //setUsrToken
      console.log('token refreshed!');
      window.localStorage.setItem('USRTKN', result_set)
      commit('setIdentity');

    },

    loginRequest ({commit}, payload)  {
      console.log('loginRequest...')
      
      let device_id = window.localStorage.getItem('DVCID')
      if(device_id){
        payload.device_id = device_id
      }
      payload.universe = process.env.UNIVERSE
      commit('showLoading');
      this.$axios.post(process.env.AUTH_API_URL+'login_request', payload)
        .then(response => {
            if(response.data.result_set){
              this.dispatch('auth/loginRequestCallback',response.data.result_set)
            }
          })
          .catch(response => {

          })
          .finally(() => {
              commit('hideLoading');
          })
    },

    loginRequestCallback ({commit}, result_set)  {
      //setUsrToken
      //window.localStorage.setItem('USRTKN', result_set)
      //console.log('loginRequestCallback: user updated');
      //commit('setIdentity');

    },

    loginValidate ({commit}, payload)  {
      console.log('loginValidate...')
      
      let device_id = window.localStorage.getItem('DVCID')
      if(device_id){
        payload.device_id = device_id
      }
      payload.universe = process.env.UNIVERSE
      commit('showLoading');
      this.$axios.post(process.env.AUTH_API_URL+'login_validate', payload)
        .then(response => {
            if(response.data.result_set){
              this.dispatch('auth/loginValidateCallback',response.data.result_set)
            }
          })
          .catch(response => {
              
          })
          .finally(() => {
             commit('hideLoading'); 
          })
    },

    loginValidateCallback ({commit}, result_set)  {
      //setUsrToken
      window.localStorage.setItem('USRTKN', result_set)
      console.log('loginValidateCallback: user updated');
      commit('setIdentity');

      this.$router.push('/')

    },


    logout ({commit,state}) {

        let payload = {}
        let device_id = window.localStorage.getItem('DVCID')
        if(device_id){
          payload.device_id = device_id
        }
        //Extraemos el token por que se va a eliminar
        if (window.localStorage.getItem('USRTKN')) {
          let token = window.localStorage.getItem('USRTKN')
          payload.token = token

          //ESTA FUNCIONA AFECTA LA INSTANCIA AXIOS GLOBAL Y QUEDA PEGADO EL VALOR
          //this.$axios.setHeader('Authorization', `Bearer ${token}`)
        }

        this.$axios.post(process.env.AUTH_API_URL+'logout', payload)
        
        commit('restartAuthenticationProcess');
        this.dispatch('auth/resetUser')
        this.dispatch('auth/initIdentity')

        this.$router.push('/login')

    },

    

};

export const getters = {
  ableTo: (state) => (permiso) => {
    if(state.identity && state.identity.data){
      //Temporal
      return state.identity.data.privileges.includes(permiso)
      //Asi cuando haya gestion de privilegios
      //return state.identity.data.privileges.includes(permiso)
    }
    return false
  },
  /*
  isAuthenticated: (state) => {
      return state.identity && state.identity.data && state.identity.data.authenticated
  },
  */
  isLogged: (state) => {
      return state.identity.data.privileges.includes('LOGGED')
  },
  isSecureDevice: (state) => {
    if(state.identity.data.device){
      let device_id = window.localStorage.getItem('DVCID')
      return device_id == state.identity.data.device
    }
    return false
  },
};

export const mutations = {
  
  showLoading: (state) => {
    state.loading = true;
  },
  hideLoading: (state) => {
    state.loading = false;
  },

  showLoginDialog:  (state) => {
    state.isLoginFormShowed = true
  },
  hideLoginDialog:  (state) => {
    state.isLoginFormShowed = false
  },


  setAuthenticationState: (state, value) => {
    state.authentication_state = value;
  },
  setValidationCode: (state, value) => {
    state.validation_code = value;
  },
  setMetodo: (state, value) => {
    state.metodo = value;
  },
  setEmail: (state, value) => {
    state.email = value;
  },
  setPassword: (state, value) => {
    state.password = value;
  },
  setCelular: (state, value) => {
    state.celular = value;
  },
  
  setDispositivoSeguro: (state, value) => {
    state.dispositivo_seguro = value;
  },
  restartAuthenticationProcess: (state) => {
    state.authentication_state = 'init';
    state.validation_code = '';
    state.metodo = 'email';
    state.email = '';
    state.password = '';
    state.celular = '';
    state.dispositivo_seguro = false
  },
  
  setIdentity: (state) => {
    console.log('setIdentity')
    if( (brw && window.localStorage.getItem('USRTKN') ) ) {
      const token = window.localStorage.getItem('USRTKN') ;
      
      try{
        state.identity = jwtDecode(token);  
      }catch(error){
        console.log('setIdentity: error decodificando token:')  
        console.log(error)  
      }

      //Seteamos dispositivo seguro
      let device_id = window.localStorage.getItem('DVCID')
      if(device_id && device_id == state.identity.data.device ){
        state.dispositivo_seguro = true
      }

    } else {
      state.identity = {
        uid:null,
        data:{
          tratamiento: null,
          privileges:[],
          //authenticated: false,
          //anonimo: true,
          device: false,
          empresa: false 
        }
      }
    }
  },
  

};
