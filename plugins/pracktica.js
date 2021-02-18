
export default function ({redirect, store }) {
  
  if(process.env.DEBUG_ENABLED && process.env.DEBUG_ENABLED=='true'){
  	store.commit('setDebug',true)
  }

  if(process.env.AUTH_MODULE && process.env.AUTH_MODULE=='true'){
  	store.commit('setAuthModule',true)	
  }

  if(store.state.authEnabled){
  	store.commit('auth/setIdentity')	
  	
  }
  

}