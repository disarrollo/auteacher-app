
//import User from './user';
//import store from '../store';

let brw = process.browser;

export const state = () => ({
  perfil: {
    direcciones: [],
    metodos_pago: []
  },
})

export const actions = {


    fetchPerfil ({commit})  {
      if(brw){
        return new Promise((resolve, reject) => {
          this.$axios.post(process.env.API_URL+'u/v/profile')
            .then(response => {
              if(response.data.result_set){
                this.dispatch('perfil/setPerfil',response.data.result_set)
              }
              resolve(response.data.result_set)
            })
            .catch(response => {
                console.log('Error:')
                console.log(response)
                reject(response)
            })
        });
      }
    },

    saveProfile ({commit},data)  {
      if(brw){
        return new Promise((resolve, reject) => {
          this.$axios.post(process.env.API_URL+'u/s/profile', data)
            .then(response => {
              if(response.data.result_set){
                this.dispatch('perfil/setPerfil',response.data.result_set)
              }
              resolve(response.data.result_set)
            })
            .catch(response => {
                console.log('Error:')
                console.log(response)
                reject(response)
            })
        });
      }
    },

    saveNewAddress ({commit},data)  {
      if(brw){
        return new Promise((resolve, reject) => {
          this.$axios.post(process.env.API_URL+'u/s/address', data)
            .then(response => {
              if(response.data.result_set){
                this.dispatch('perfil/setPerfil',response.data.result_set)
              }
              resolve(response.data.result_set)
            })
            .catch(response => {
                console.log('Error:')
                console.log(response)
                reject(response)
            })
        });
      }
    },

    deleteAddress ({commit},data)  {
      if(brw){
        return new Promise((resolve, reject) => {
          this.$axios.post(process.env.API_URL+'u/d/address', data)
              .then(response => {
                if(response.data.result_set){
                  this.dispatch('perfil/setPerfil',response.data.result_set)
                }
                resolve(response.data.result_set)
              })
              .catch(response => {
                  console.log('Error:')
                  console.log(response)
                  reject(response)
              })
        });
      }
    },

    selectAddress ({commit},data)  {
      if(brw){
        return new Promise((resolve, reject) => {
          this.$axios.post(process.env.API_URL+'u/select/address', data)
              .then(response => {
                if(response.data.result_set){
                  this.dispatch('perfil/setPerfil',response.data.result_set)
                }
                resolve(response.data.result_set)
              })
              .catch(response => {
                  console.log('Error:')
                  console.log(response)
                  reject(response)
              })
        });
      }
    },

    //Metodos de pago

    saveNewMetodo ({commit},data)  {
      if(brw){
        return new Promise((resolve, reject) => {
          this.$axios.post(process.env.API_URL+'u/s/payment', data)
            .then(response => {
              if(response.data.result_set){
                this.dispatch('perfil/setPerfil',response.data.result_set)
              }
              resolve(response.data.result_set)
            })
            .catch(response => {
                console.log('Error:')
                console.log(response)
                reject(response)
            })
        });
      }
    },

    deleteMetodo ({commit},data)  {
      if(brw){
        return new Promise((resolve, reject) => {
          this.$axios.post(process.env.API_URL+'u/d/payment', data)
              .then(response => {
                if(response.data.result_set){
                  this.dispatch('perfil/setPerfil',response.data.result_set)
                }
                resolve(response.data.result_set)
              })
              .catch(response => {
                  console.log('Error:')
                  console.log(response)
                  reject(response)
              })
        });
      }
    },

    selectMetodo ({commit},data)  {
      if(brw){
        return new Promise((resolve, reject) => {
          this.$axios.post(process.env.API_URL+'u/select/payment', data)
              .then(response => {
                if(response.data.result_set){
                  this.dispatch('perfil/setPerfil',response.data.result_set)
                }
                resolve(response.data.result_set)
              })
              .catch(response => {
                  console.log('Error:')
                  console.log(response)
                  reject(response)
              })
        });
      }
    },


    setPerfil ({commit,state},payload){
        commit('setPerfil',payload)
    },
    
    
};

export const getters = {
  getDirecciones: (state) => {
      return state.perfil.direcciones
  },
  getDireccionActual: (state) => {
       return state.perfil.direcciones.filter(element=>{
       	return element.actual
       })
  },
  getOtrasDirecciones: (state) => {
       return state.perfil.direcciones.filter(element=>{
        return !element.actual
       })
  },
  getMetodosPago: (state) => {
      return state.perfil.metodos_pago
  },
  getMetodoPagoActual: (state) => {

       return state.perfil.metodos_pago.find(element=>{
        return element.actual
       })
  },
};

export const mutations = {
  
  setPerfil: (state,data) => {
    state.perfil = data
  },

};
