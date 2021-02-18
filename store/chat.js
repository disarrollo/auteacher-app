

//import User from './user';
//import store from '../store';
const { client, xml, jid } = require("@xmpp/client");



import moment from 'moment'

let brw = process.browser;
let xmpp = null;

export const state = () => ({
	jid: null,
	name:null,
	alert_pending: false,
	current_conversation_id: null,
	xmpp_status: 'offline',
  	conversations: [
  		/*
  		{
  			_id: '579991111111110',
			icon:'579991111111110',
			nickname:'Amanda',
			messages:[
				from: from,
				to: to,
				type:'normal',
				body: text,
				status: 'readed',
				time: '',
			]
  		},
  		*/
  	],
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

    insertMessage({commit,state}, message){
    	commit('addMessage',message);
    },

    sendMessage({commit,state}, payload){

	    console.log('enviando...')
	    
	    //Agregamos al front
	    payload.from = state.jid
	    payload.conversation_id = payload.to
	    const ahora = new Date()
	    payload._id = ahora.getTime()
	    
	    commit('addMessage',payload);

	    //Enviamos al servidor
		const messageXmpp = xml(
		    "message",
		    { 
		    	type: "chat", 
		    	to: `${payload.to}@xmpp.extandar.com`,
		    	from: `${payload.from}@xmpp.extandar.com`
		    },
		    xml("body", {}, payload.body),
		)

		this.xmpp.send(messageXmpp).
		then(()=>{
			setTimeout(() => { 
	            commit('deliverMessage',payload);
	        },200)  
		})

    },

    async getRoster({commit,state}){

	    console.log('enviando...')
	    
	    const {iqCaller} = this.xmpp

	    //Enviamos al servidor
		const messageXmpp = xml(
		    "iq",
		    { 
		    	type: "get", 
		    	id: state.jid,
		    	from: `${state.jid}@xmpp.extandar.com`
		    },
		    xml("query", 'jabber:iq:roster'),
		)

		console.log(messageXmpp)

		//this.xmpp.send(messageXmpp);


		const response = await iqCaller.request(
  xml("iq", { type: "get" }, xml("query", "jabber:iq:roster")),
  30 * 1000, // 30 seconds timeout - default
);

console.log('response:');
console.log(response);

    },

    //Lo que debe pasar cuando el cliente xmpp se pone online
    onOnline({commit,state}){
    	console.log('onOnline')
    	commit('setXmppStatus',this.xmpp.status);
    	this.dispatch('chat/sendPresence')
		
    },

    //Lo que debe pasar cuando el cliente xmpp se pone online
    onOffline({commit,state}){
    	console.log('onOffline')
    	commit('setXmppStatus',this.xmpp.status);
    },

    closeXmpp({commit,state}){
    	console.log('closeXmpp')
		this.xmpp.stop()
		.then(()=>{
			console.log('xmpp closed')
		})
		.catch(console.error);
    },

    xmppStatus({commit,state}){
    	const  status = this.xmpp.status
    	console.log('xmppStatus:'+status)
		return status
    },

    async sendPresence({commit,state}){
    	console.log('sendPresence')
    	await this.xmpp.send(xml("presence"));
    },

    initXmpp({commit,state}, payload){
  
  		console.log('initXmpp...')
  		console.log(payload)

  		commit('setJid',payload.jid);
  		commit('setName',payload.name);

    	xmpp = client({
			  //service: "ws://xmpp.extandar.com:5280/xmpp-websocket",
			  service: "wss://xmpp.extandar.com:5443/ws",
			  domain: "xmpp.extandar.com",
			  resource: "AuTeacherApp",
			  username: state.jid,
			  password: payload.password,
		});


xmpp.on("error", (err) => {
 	console.log('iniciar error')
  	console.error(err);
});

xmpp.on("offline", () => {
	console.log("offline");
	this.dispatch('chat/onOffline')
});

xmpp.on("stanza", async (stanza) => {
	console.log("+++Stanza+++")
	
	  if (stanza.is("message")) {
	  	
	  	if(stanza.attrs.type==='chat'){
	  		//Es un mensaje
	  		console.log("+++Mensaje+++")
	  		console.log(stanza)
	  		let body = stanza.getChild("body")

	  		if(body && body.text()){

	  			let text = stanza.getChild("body").text()

		  		let id = stanza.attrs.id

		  		console.log('id:'+id)

		  		let from = stanza.attrs.from.split('@')[0]
		  		let to = stanza.attrs.to.split('@')[0]

		  		let nickname = from
		  		if(stanza.getChild("nickname")){
		  			nickname = stanza.getChild("nickname").text()	
		  		}

		  		let mensaje = {
		  			_id : id,
		  			from: from,
					to: to,
					type:'normal', //?? depende commo se solicita la respuesta (texto|opcion multiple, etc)
					body: text,
					status: 'delivered',
					conversation_id: from,
					nickname: nickname
		  		}
		  		


		  		this.dispatch('chat/insertMessage',mensaje)
	  		}else{
	  			console.log("+++NO HAY BODY+++")
	  			console.log(stanza)
	  		}
	  	}if(stanza.attrs.type==='error'){
	  		console.log("+++Error en stanza +++")
	  		console.log(stanza)
	  	}else{
	  		console.log('is message but not chat')
	  		console.log('type:'+stanza.attrs.type)
	  		console.log('from:'+stanza.attrs.from)
		  	console.log('to:'+stanza.attrs.to)
		  	console.log(stanza)
	  	}
	  		
	}else{
	  	console.log('is not message')
	  	console.log(stanza)
	}

});

xmpp.on("online", async (address) => {
  // Makes itself available
  console.log('xmpp on online')
  //await this.xmpp.send(xml("presence"));
  this.dispatch('chat/onOnline')
});

xmpp.start().catch(console.error);


this.xmpp = xmpp
console.log('...ok iniciar')

},

    

};

export const getters = {
	getCurrentConversation: (state) => {
	    return state.conversations.find(element=>{
	    	return element._id == state.current_conversation_id
	    })
	},

};

export const mutations = {
	setJid: (state, value) => {
    	state.jid = value;
  	},
  	setName: (state, value) => {
    	state.name = value;
  	},
  	setXmppStatus: (state, value) => {
    	state.xmpp_status = value;
  	},
  	setCurrentConversation: (state, value) => {
    	state.current_conversation_id = value;
  	},
  	addConversation : (state, value) => {
  		state.conversations.push(value)
  	},
  	addMessage: (state, message) => {
		
		console.log('addMessage')
		console.log(message)
		message.time = moment().format('LT')

    	let c = state.conversations.find(element=>{
	    	return element._id == message.conversation_id
	    })
    	if(c == undefined){
    		//Hay que crear la conversacion
    		c = {
    			_id: message.conversation_id,
				icon: message.from,
				nickname: message.nickname,
				newMessageCounter: 0,
				messages:[]
    		}
    		state.conversations.push(c)    		
    	}
    	c.messages.push(message)
    	if(state.jid == message.to){
    		c.newMessageCounter++	
    		state.alert_pending = true
    	}
    	
  	},
  	setAlertPending: (state, value) => {
    	state.alert_pending = value;
  	},
  	resetMessageCounter: (state, conversation_id) => {
  		
  		let c = state.conversations.find(element=>{
	    	return element._id == conversation_id
	    })
	    if(c != undefined){
	    	c.newMessageCounter = 0;
	    }
    	
  	},
  	calculateNewMessages: (state, conversation_id) => {
  		console.log('calculateNewMessages')
  		let c = state.conversations.find(element=>{
	    	return element._id == conversation_id
	    })

  		if(c != undefined){

  			let m = c.messages.filter(element=>{
		    	return status == 'delivered'
		    })
console.log('calculateNewMessages:'+m.length)
	    	c.newMessageCounter = m.length;
	    }

  	},
  	readMessage: (state, message) => {
  		console.log('readMessage')
 

  		let c = state.conversations.find(element=>{
	    	return element._id == message.conversation_id
	    })

	    if(c != undefined){
	    	console.log('conversation founded')
		    let m = c.messages.find(element=>{
		    	return element._id == message._id
		    })
		    if(m != undefined){
		    	console.log('message founded:'+message._id)
		    	m.status = 'readed'
		    }
	    }

  	},

  	deliverMessage: (state, message) => {
  		console.log('deliverMessage')

  		let c = state.conversations.find(element=>{
	    	return element._id == message.conversation_id
	    })

	    if(c != undefined){
	    	console.log('conversation founded')
		    let m = c.messages.find(element=>{
		    	return element._id == message._id
		    })
		    if(m != undefined){
		    	console.log('message founded:'+message._id)
		    	m.status = 'delivered'
		    }
	    }

  	},
};
