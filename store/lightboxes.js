

export const state = () => ({
  registro: false,
  ingreso: false,
  terminosycondiciones: false,
  politicaprivacidad: false,
  salir:false,

})

export const actions = {
    
};

export const getters = {
  
  
};

export const mutations = {
  
  setRegistro: (state,data) => {
    state.registro = data
  },
  setIngreso: (state,data) => {
    state.ingreso = data
  },
  setSalir: (state,data) => {
    state.salir = data
  },
  setTerminosYCondiciones: (state,data) => {
    state.terminosycondiciones = data
  },
  setPoliticaPrivacidad: (state,data) => {
    state.politicaprivacidad = data
  },

};
