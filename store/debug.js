//import User from './user';
//import store from '../store';

let brw = process.browser;

export const state = () => ({
  
})


export const actions = {

    ping({commit,state}){
      
      this.$axios.post(process.env.AUTH_API_URL+'ping')
        .then(response => {

          if(response.data.result_set){
            console.log(response.data.result_set)  
          }
        })
        .catch(response => {
            console.log(response)
        })
    },

    pingAnonimo({commit,state}){
      
      this.$axios.post(process.env.AUTH_API_URL+'ping_anonimo')
        .then(response => {
          if(response.data.result_set){
            console.log(response.data.result_set)  
          }
        })
        .catch(response => {
            console.log(response)
        })
    },

};

export const getters = {
 
};

export const mutations = {

};
