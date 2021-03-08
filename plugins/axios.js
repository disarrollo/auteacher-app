export default function ({ $axios, redirect, store }) {
  $axios.onRequest(request => {
    //Agregamos el token a cada solicitud
    if (window.localStorage.getItem('USRTKN')) {
      request.headers.common['Authorization'] = 'Bearer '+window.localStorage.getItem('USRTKN')
    }
    if(process.env.DATABASE){
      request.headers.common['BUSINESS_KEY'] = process.env.DATABASE
    }
    
  })

  $axios.onResponse(response => {
    //Procesamos las respuetas en busqueda de acciones
    if(response && response.data && response.data.actions ){
       response.data.actions.forEach(element=>{

        if(element.commit){
          store.commit(element.commit,element.data)
        }
        
        if(element.action){
          store.dispatch(element.action,element.data)
        } 
        
       })

    }
  })
  
  $axios.onError(error => {
	  if(error.response && error.response.data && error.response.data.error && error.response.data.error.message){
      if(error.response.data.error.name=='InvalidJwtToken'){
        //Si el error es de token invalido borrarmos el token de usuario actual
        console.log("Error grave!!! InvalidJwtToken deberia estar controlado")
        store.dispatch('auth/resetUser')
        store.dispatch('auth/initIdentity')
        store.commit('setError','Ocurrió un error inesperado, intente nuevamente.')

      }else if(error.response.data.error.name=='ExtandarException'){
        
        if(error.response.data.error.message.internal_code){
          
          if(error.response.data.error.message.internal_code == 'INVALID_CODE'){
            //CODIGO INVALIO PUEDE INTENTAR OTRA VEZ
            store.commit('auth/setValidationCode','')

          }if(['TOKEN_UNAUTHENTICATED','TOKEN_REVOKED','TOKEN_DONT_EXIST','TOKEN_INVALID']
            .includes(error.response.data.error.message.internal_code)){
            
            console.log(error.response.data.error.message.internal_code)
            //Si el error es de token invalido borrarmos el token de usuario actual
            
            store.dispatch('auth/resetUser')
            store.dispatch('auth/initIdentity')
            if(error.response.data.error.message.info){
              store.commit('setError',error.response.data.error.message.info)  
            }else{
              store.commit('setError','Sorry, try again')
            }
            redirect('/sorry')
            

          }else if(error.response.data.error.message.internal_code == 'MAX_LOGIN_TRIES'){
            //MAXIMA CANTIDAD DE INTENTOS
            store.commit('auth/restartAuthenticationProcess')

          }else if(error.response.data.error.message.internal_code == 'ACTIVE_EMAIL_LOGIN_REQUEST'){
            //YA EXISTE UNA SOLICITUD EN CURSO POR EMAIL
            store.commit('auth/setAuthenticationState','email_sent')

          }else if(error.response.data.error.message.internal_code == 'ACTIVE_SMARTPHONE_LOGIN_REQUEST'){
            //YA EXISTE UNA SOLICITUD EN CURSO POR SMS
            store.commit('auth/setAuthenticationState','sms_sent')

          }else if(error.response.data.error.message.internal_code == 'WITHOUT_EMAIL_LOGIN_REQUEST'){
            //SE ENVIO A VALIDACION SIN HABER SOLICITUD ACTIVA
            store.commit('auth/restartAuthenticationProcess')

          }else if(error.response.data.error.message.internal_code == 'ALREADY_AUTHENTICATED'){

          }else if(error.response.data.error.message.internal_code == 'INCOMPLETED_INPUT'){

          }else if(error.response.data.error.message.internal_code == 'EMAIL_NO_EXIST'){
          
          }else {
            //OTROS ERRORES
            //store.dispatch('auth/resetUser')
            //store.dispatch('auth/verifyUser')
          }
          console.log('internal_code:'+error.response.data.error.message.internal_code)
        }

        if(error.response.data.error.message.info){
          store.commit('setError',error.response.data.error.message.info)
        }else{
          store.commit('setError',error.response.data.error.message)
        }
      }else{
        store.commit('setError','Ocurrió un error inesperado')
        console.log('error.response.data.error.name:'+error.response.data.error.name)
      }
	  }else{
      console.log('Error sin formato:')
      console.log(error)
    }

	//Con el return evita que se genere la excepción y por lo tanto la captura
  	//return error.response.data.error.message

  	/*
    if(error.response.status === 550) {
      redirect('/sorry')
    }
    */
  })

}