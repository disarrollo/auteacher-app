<template>
  
	
  <v-card>
    <v-card-title>{{title}}</v-card-title>

    <v-card-text v-if="authentication_state=='init'">
      <div v-if="metodo == 'password'">

        <v-form ref="passwordFormRef" v-model="passwordForm" >
          <v-text-field  ref="emailp" v-model="email" label="Ingresa tu email" :rules="emailRules" ></v-text-field> 
          <v-text-field  v-model="password" label="Ingresa tu contraseña"></v-text-field> 
        </v-form>

        <v-btn  @click="validarPassword" :disabled="!canAuthenticate" :loading="loading">
          Continuar
        </v-btn>
      </div>

      <div v-if="metodo == 'email'">
        <v-form ref="emailFormRed" v-model="emailForm" >
          <v-text-field  v-model="email" label="Ingresa tu email" :rules="emailRules" :loading="loading"
          :disabled="loading">
          </v-text-field> 
        </v-form>
        <v-btn  @click="solicitarIngresoEmail" :disabled="!canAuthenticate" :loading="loading">
          Continuar
        </v-btn>

      </div>

      <div v-if="metodo == 'celular'">
        <v-form ref="celularFormRef" v-model="celularForm" >
          <v-text-field  v-model="celular" label="Ingresa tu Celular"></v-text-field> 
        </v-form>
        <v-btn  @click="solicitarIngresoCelular" :disabled="!canAuthenticate" :loading="loading">
          Continuar
        </v-btn>

      </div>
      

      
      <div class="d-flex flex-column">
        <br>
        <div class="text-center text-caption" text-align="center">- O -</div>
        <br>

        <v-btn v-if="metodo!='password'" text @click="metodo = 'password'">
          Prefieres ingresar con contraseña?
        </v-btn>

        <v-btn v-if="metodo!='celular'" text @click="metodo = 'celular'">
          Prefieres ingresar con celular?
        </v-btn>

        <v-btn v-if="metodo!='email'" text @click="metodo = 'email'">
          Prefieres ingresar con email?
        </v-btn>

      </div>
      
    </v-card-text>

    <v-card-text v-if="authentication_state=='email_sent'">
        Ingresa el código de verificación que enviamos a tu email.

      <v-text-field v-model="validationCode" 
      class="codigo"
      :loading="true"
      autocomplete="off"
      @keyup="changeValidationCode"
      >
  
        <template v-slot:progress>
          <v-progress-linear
            :value="progressCode"
            :color="colorCode"
            absolute
            height="7"
          ></v-progress-linear>
        </template>

      </v-text-field>

      <p>Te en cuenta que al realizar el proceso de ingreso al portal estás aceptando nuestros <a  @click="setTerminosYCondiciones(true)">Terminos y Condiciones</a> así como nuestra <a  @click="setPoliticaPrivacidad(true)">Política de Privacidad.</a></p>

      <v-checkbox 
      v-model="dispositivo_seguro"
      label="Este dispositivo es seguro"
    ></v-checkbox>

      <v-btn  @click="validarEmail" :disabled="!canValidate" :loading="loading">
        Continuar
      </v-btn>

    </v-card-text>


    <v-card-text v-if="authentication_state=='ask_for_names'">

      <v-form ref="nombresFormRef" v-model="nombresForm" >
        <v-text-field  v-model="input_nombre" label="Nombres"></v-text-field> 
        <v-text-field  v-model="input_apellido" label="Apellidos"></v-text-field> 
      </v-form>

      <v-btn  @click="iniciarGuardarNombres" :disabled="!canGuardarNombres" :loading="loading">
        Continuar
      </v-btn>

    </v-card-text>
    

  </v-card>

</template>


<script>
  import { mapActions, mapState ,mapMutations} from 'vuex';

  export default { 
    name: 'LoginFormSimplePass',
    components:{
        
    },
    data () {
      return {
        
        emailRules: [
          v => !!v || 'Por favor ingrese su email',
          v => /.+@.+/.test(v) || 'Ingrese un email válido',
        ],
        passwordForm:false,
        emailForm:false,
        celularForm:false,
        nombresForm:false,

        input_nombre:'',
        input_apellido:'', 
        
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions({
        loginRequest: 'auth/loginRequest',
        loginValidate: 'auth/loginValidate',
        guardarNombres: 'auth/guardarNombres',
      }),
      ...mapMutations({
        setValidationCode: 'auth/setValidationCode',
        setMetodo: 'auth/setMetodo',
        setEmail: 'auth/setEmail',
        setPassword: 'auth/setPassword',
        setCelular: 'auth/setCelular',
        setDispositivoSeguro: 'auth/setDispositivoSeguro',
        setTerminosYCondiciones: 'lightboxes/setTerminosYCondiciones',
        setPoliticaPrivacidad: 'lightboxes/setPoliticaPrivacidad',
      }),

      validarPassword () {
        let payload = {
          metodo: this.metodo,
          email: this.email,
          password: this.password
        };
        this.loading = true
        
        this.loginValidate(payload)
          
      },
      solicitarIngresoEmail () {
        let payload = {
          metodo: this.metodo,
          email: this.email,
        };
        this.loginRequest(payload)  

      },

      validarEmail () {
        let payload = {
          metodo: this.metodo,
          code: this.validationCode,
          secure_device: this.dispositivo_seguro,
        };
        this.loginValidate(payload)  
      },

      changeValidationCode(){
        if(this.validationCode.length>this._validationCodeLengthRequired){
          this.validationCode = this.validationCode.substring(0,this._validationCodeLengthRequired)
        }
      },

      solicitarIngresoCelular () {
        let payload = {
          metodo: this.metodo,
          celular: this.celular,
        };
        this.loading = true
        this.loginRequest(payload)

      },
      counterValue(){
        console.log('counterValue')
      },
      iniciarGuardarNombres(){
        let payload = {
          nombre: this.input_nombre,
          apellido: this.input_apellido,
        };
        this.guardarNombres(payload)  
      }  
      
    },
    computed:{
      ...mapState({
        identity: state => state.auth.identity,
        loading: state => state.auth.loading,
        authentication_state: state => state.auth.authentication_state,
        _validationCode: state => state.auth.validation_code,
        _validationCodeLengthRequired: state => state.auth.validation_code_length,
        _metodo: state => state.auth.metodo,
        _email: state => state.auth.email,
        _password: state => state.auth.password,
        _celular: state => state.auth.celular,
        _dispositivo_seguro: state => state.auth.dispositivo_seguro,
      
      }),
      validationCode:{
        get(){
          return this._validationCode
        },
        set(value){
          this.setValidationCode(value)
        }
      },
      metodo:{
        get(){
          return this._metodo
        },
        set(value){
          this.setMetodo(value)
        }
      },
      email:{
        get(){
          return this._email
        },
        set(value){
          this.setEmail(value)
        },
      },
      password:{
        get(){
          return this._password
        },
        set(value){
          this.setPassword(value)
        },
      },
      celular:{
        get(){
          return this._celular
        },
        set(value){
          this.setCelular(value)
        },
      },
      dispositivo_seguro:{
        get(){
          return this._dispositivo_seguro
        },
        set(value){
          this.setDispositivoSeguro(value)
        },
      },



      canAuthenticate(){
        if(this.metodo == 'email'){
          if(this.email && this.emailForm){
            return true
          }  
        }
        else if(this.metodo == 'celular'  && this.celularForm){
          if(this.celular){
            return true
          }  
        }
        else if(this.metodo == 'password' && this.passwordForm){
          if(this.email && this.password){
            return true
          }  
        }
        
        return false
      },
      canValidate(){
        if(this.metodo == 'email'){
          if(this.validationCode && this.validationCode.length == this._validationCodeLengthRequired){
            return true
          }  
        }
        return false
      },

      progressCode () {
        return Math.min(100, this.validationCode.length * (100/this._validationCodeLengthRequired))
      },
      colorCode () {
        return ['error', 'warning', 'success'][Math.floor(this.progressCode / 40)]
      },
      
      title(){
        if(this.authentication_state=='init'){          
          return "Necesitamos saber quien eres";
        }else if(this.authentication_state=='email_sent'){ 
          if(this.identity.data.tratamiento){
            return this.identity.data.tratamiento+', revisa tu email!'
          }
          return "Revisa tu email!";
        }else if(this.authentication_state=='ask_for_names'){          
          return "Como te llamas?";
        }

        return "Hola!"
      },

      canGuardarNombres(){
        if(this.input_nombre && this.input_nombre.length > 3){
          return true
        }  
        return false
      },

      _texto(value){
        return value;
      }
      
    }
  }
</script>


<style>
  .codigo input{
    max-height: 70px;
    text-align: center;
  }
  .codigo{
    font-size: 60px;
  }

</style>