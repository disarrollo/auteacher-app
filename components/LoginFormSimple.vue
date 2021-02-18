<template>
  
  <div>

    <v-tabs
          v-model="tab"
          fixed-tabs
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab key="ingreso">Ingresar</v-tab>
          <v-tab key="registro">Registrarse</v-tab>

      </v-tabs>

      <v-tabs-items v-model="tab">
      <v-tab-item key="ingreso">

    <v-card  :loading="loading" class="py-6 px-6">

        <v-card-text>
          
            <v-form ref="loginFormRef" v-model="loginForm" >
              
              <v-row>
                <v-col cols=12 >

                  <v-text-field class="pt-0" ref="email" v-model="login_email" label="Ingresa tu email" :rules="emailRules" ></v-text-field>
                  
                </v-col>
                <v-col cols=12 > 
                  <v-text-field  
                  class="pt-0"
                      v-model="login_password"
                      :append-icon="showPasswordLogin ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="passwordRules"
                      :type="showPasswordLogin ? 'text' : 'password'"
                      label="Contraseña"
                      @click:append="showPasswordLogin = !showPasswordLogin"

                  ></v-text-field> 
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    v-model="aceptacionLogin"
                    :rules="[v => !!v || 'Debes aceptar para continuar!']"
                    label="Acepto los términos y condiciones del sitio así como la Política de Privacidad de la información!"
                    required
                  ></v-checkbox>
                </v-col>
              </v-row>

            </v-form>

            
          
        </v-card-text>
        <v-card-actions>
            <v-btn  @click="login" :disabled="!loginForm" :loading="loading">
              Continuar
            </v-btn>
        </v-card-actions>
        
        
        
    </v-card>

</v-tab-item>
<v-tab-item key="registro">

    <v-card :loading="loading" class="py-6 px-6">
      
        <v-card-text >
          <v-form ref="registerFormRef" v-model="registerForm" lazy-validation>
          <v-row>
                <v-col cols=12 md=6 class="py-0">
                  <v-text-field  label="Nombre" v-model="input_nombre" :rules="nameRules"></v-text-field>
                </v-col>
                <v-col cols=12 md=6 class="py-0">
                  <v-text-field  label="Apellido" v-model="input_apellido"></v-text-field>
                </v-col>
          </v-row>
          <v-row>
            <v-col cols=12 class="py-0">
              <v-text-field  ref="email" v-model="input_email" label="Ingresa tu email" :rules="emailRules" ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols=12 class="py-0">
              <v-text-field  ref="telefono" v-model="input_telefono" label="Número de celular" :rules="telRules" ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols=12 class="py-0">
              <v-text-field
                          v-model="input_password"
                          :append-icon="showPasswordRegistro ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="passwordRules"
                          :type="showPasswordRegistro ? 'text' : 'password'"
                          
                          label="Contraseña"
                          hint="Mínimo 8 caracteres"
                          :counter="8"
                          @click:append="showPasswordRegistro = !showPasswordRegistro"
                        ></v-text-field>
            </v-col>
            <v-col cols=12 class="py-0">
                <v-text-field
                  v-model="comprobacion_password"
                  :append-icon="showPasswordRegistro ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="passwordVerificationRules"
                  :type="showPasswordRegistro ? 'text' : 'password'"
                  label="Repite tu Contraseña"
                  hint="Mínimo 8 caracteres"
                  :counter="8"
                  @click:append="showPasswordRegistro = !showPasswordRegistro"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-checkbox
                  v-model="aceptacionRegistro"
                  :rules="[v => !!v || 'Debes aceptar para continuar!']"
                  label="Acepto los Términos y Condiciones del sitio así como la Política de Privacidad de la Información!"
                  required
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-form>
              
        </v-card-text>

        <v-card-actions>
            <v-btn  class="mt-6" @click="registrarUsuario" :disabled="!registerForm" :loading="loading">
              Continuar
              </v-btn>
        </v-card-actions>

        
      </v-card>
</v-tab-item>
</v-tabs-items>
  </div>
</template>


<script>
  import { mapActions, mapState, mapGetters, mapMutations} from 'vuex';

  export default { 
    name: 'Registro',
    components:{
    },
    data () {
      return {
        tab: null,

        nameRules: [
          v => !!v || 'El nombre es necesario',
        ],

        telRules: [
          v => !!v || 'El número de telefono es necesario',
        ],

        emailRules: [
          v => !!v || 'Por favor ingrese su email',
          v => /.+@.+/.test(v) || 'Ingrese un email válido',
        ],

        passwordRules: [
          v => !!v || 'Ingresa una contraseña',
          v => (v && v.length >= 8) || 'Mínimo 8 caracteres',
        ],

        passwordVerificationRules: [
          v => !!v || 'Ingresa una contraseña',
          v => (v && v == this.input_password) || 'No coinciden las contraseñas',
        ],

        loginForm:false,
        registerForm:false,

        showPasswordLogin:false,
        showPasswordRegistro: false,

        login_email: '',
        login_password: '',

        input_nombre:'',
        input_apellido:'', 
        input_email:'', 
        input_telefono:'', 
        input_password:'',
        comprobacion_password:'',
        aceptacionLogin: false,
        aceptacionRegistro: false,
        
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions({
        _login: 'auth/loginValidate',
        _registrarUsuario: 'auth/registerUser',
      }),
      ...mapMutations({
        hideLoginDialog:  'auth/hideLoginDialog',
      }),

      login(){
        //VALIDAMOS        
        if(this.$refs.loginFormRef.validate()){
            let payload = {
              method: 'password',
              email: this.login_email,
              password: this.login_password
            };
            
            this._login(payload)
            .then(result=>{
              this.$refs.loginFormRef.reset()
              this.hideLoginDialog()
            })
        }

      },

      registrarUsuario () {
        //VALIDAMOS        
        if(this.$refs.registerFormRef.validate()){
            console.log('listos para enviar')
            let payload = {
              nombre: this.input_nombre,
              apellido: this.input_apellido,
              email: this.input_email,
              password: this.input_password,
              telefono: this.input_telefono
            }

            this._registrarUsuario(payload)
            .then(result=>{
              this.$refs.registerFormRef.reset()
              this.hideLoginDialog()
            })
        } 
      },
      
    },
    computed:{
      ...mapState({
        loading: state => state.auth.loading,
      }),
      ...mapGetters({

      }),
      
    }
  }
</script>


<style>
  

</style>