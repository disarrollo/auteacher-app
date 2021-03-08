

//import User from './user';
//import store from '../store';
const { client, xml, jid } = require("@xmpp/client");



import moment from 'moment'

let brw = process.browser;
let xmpp = null;

export const state = () => ({
	jid: null,
	name:null,
	domain: 'xmpp.extandar.com',
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
    	commit('saveMessages',message.conversation_id);
    },
    insertConversation({commit,state}, payload){
    	commit('addConversation',payload);
    	commit('recoverMessages',payload.conversation_id);
    },

    sendMessage({commit,state}, payload){

	    console.log('enviando...')
	    
	    //Agregamos al front
	    payload.from = state.jid
	    payload.conversation_id = payload.to
	    const ahora = new Date()
	    payload._id = ahora.getTime()
	    
	    this.dispatch('chat/insertMessage',payload)
	    

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

    async addContact({commit,state}, payload){
    	console.log('adding contact to roster')
    	const {iqCaller} = this.xmpp
		const response = await iqCaller.request(
		  	xml(
			  	"iq", 
			  	{ type: "set" }, 
			  	xml(
			  		"query", "jabber:iq:roster",
			  		xml(
				  		"item", { jid: `${payload.jid}@${state.domain}`, name: payload.nickname}, 
			  		)
		  		)
	  		),
		  	30 * 1000, 
		);

		console.log('addContact response:')
		console.log(response)
    },

    async getRoster({commit,state}){

	    console.log('requesting roster...')
	    
	    const {iqCaller} = this.xmpp

	    /*
	    //Otro metodo que no funciono bien
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
		*/

		//Metodo que espera la stanza de respuesta para procesarla aqui mismo
		const response = await iqCaller.request(
		  xml("iq", { type: "get" }, xml("query", "jabber:iq:roster")),
		  30 * 1000, // 30 seconds timeout - default
		);

		console.log('procesing roster...')
		console.log(response)

		if(response.attrs.type==='result'){
			
			let query = response.getChild('query')

			if(query){
				
				let xmlns = query.attrs.xmlns

				if(xmlns=='jabber:iq:roster'){

					let roster = query.getChildren('item')
					
					console.log(roster.length+' contacts founded')

					for(let i in roster){
						let item = roster[i]
						
						let subscription = item.attrs.subscription
						console.log('subscription:'+subscription)

						let jid = item.attrs.jid
						jid = jid.split('@')[0]	
						
						let nickname = item.attrs.name?item.attrs.name:jid

						let conversation = {
							conversation_id : jid,
    						nickname : nickname
						}

						this.dispatch('chat/insertConversation', conversation) 
					}

				}else{
					console.log('ERROR - xmlns desconocido')
					console.log('xmlns:'+xmlns)
				}
				
			}else{
				console.log('ERROR -  No hay query:')
				console.log(response)		
			}
		}else{
			console.log('ERROR - response si not result:')
			console.log(response)

		}



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

  		//Evitar que se duplique el objeto
		if(this.xmpp){
			return
		}

		let device_id = window.localStorage.getItem('DVCID')?window.localStorage.getItem('DVCID'):'NODVCID'
    	xmpp = client({
			  //service: "ws://xmpp.extandar.com:5280/xmpp-websocket",
			  service: "wss://xmpp.extandar.com:5443/ws",
			  domain: "xmpp.extandar.com",
			  resource: "AuTeacherApp"+device_id,
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

	  		let from = stanza.attrs.from.split('@')[0]
		  	let to = stanza.attrs.to.split('@')[0]

	  		if(body && body.text()){

	  			let text = stanza.getChild("body")?stanza.getChild("body").text():null
	  			let hint = stanza.getChild("hint")?stanza.getChild("hint").text():null
	  			let body_type = stanza.getChild("body_type")?stanza.getChild("body_type").text():null

		  		let id = stanza.attrs.id

		  		console.log('id:'+id)

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
					//nickname: nickname
					hint: hint,
					body_type: body_type,
		  		}
		  		
		  		this.dispatch('chat/insertMessage',mensaje)
	  		}else{
	  			console.log("+++NO HAY BODY+++")
	  			
	  			let	requestText = stanza.getChild("request")?stanza.getChild("request").text():null
		  			
	  			if(requestText){
	  				if(requestText=='addToRoster'){
	  					console.log('IS REQUEST FOR ADD ROSTER ITEM')
	  					let jid = stanza.getChild("jid")
	  					if(jid){
	  						jid = jid.text()
	  					}else{
	  						console.log('jid NOT FOUND')
	  					}

	  					let nickname = stanza.getChild("nickname")
	  					if(nickname){
	  						nickname = nickname.text()
	  					}else{
	  						console.log('nickname NOT FOUND')
	  					}
	  					
	  					if(jid && nickname){
	  						console.log('Item to add:'+jid+':'+nickname)
	  						this.dispatch('chat/addContact', {jid:jid,nickname:nickname}) 
	  					}else{
	  						console.log("ERROR - INCOMPLETE DATA")
	  						console.log(stanza)
	  					}
						
	  				}else{
	  					console.log("ERROR - UNKNOW REQUEST:"+requestText)
	  				}
					
		  		}else{
		  			console.log("ERROR - MENSAJE NO COMPRENDIDO")
		  			console.log(stanza)	
		  		}

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
	  			
	}else if (stanza.is("presence")) {
		console.log('is presence')
		console.log(stanza)
	}else if (stanza.is("iq")) {
		console.log('is iq')
		
		if(stanza.attrs.type==='result'){
			/*
			console.log('is iq result')
			
			let query = stanza.getChild('query')

			if(query){
				console.log('child query founded')
				
				let xmlns = query.attrs.xmlns

				if(xmlns=='jabber:iq:roster'){
					console.log('is result of roster query')

					let roster = query.getChildren('item')
					
					for(let i in roster){
						let item = roster[i]
						
						let subscription = item.attrs.subscription
						console.log('subscription:'+subscription)	

						if(subscription=='from'){

							let jid = item.attrs.jid
							jid = jid.split('@')[0]
							console.log('jid:'+jid)	

							commit('addConversation',{
								conversation_id : jid,
        						nickname : jid
							});
						}
						
					}

				}else{
					console.log('xmlns desconocido')
					console.log('xmlns:'+xmlns)
				}
				
			}else{
				console.log('No hay query')
					
			}
			*/
		}else if(stanza.attrs.type==='set'){
			console.log('query is set')
		}else{
			console.log('stanza.attrs.type:')
			console.log(stanza.attrs.type)
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

xmpp.start()
.then(()=>{
	this.dispatch('chat/getRoster')
})
.catch(console.error);


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
  	saveMessages : (state, conversation_id) => {
  		console.log('saving messages...')
  		let c = state.conversations.find(element=>{
	    	return element._id == conversation_id
	    })
	    if(c!=undefined){
	    	let messages = JSON.stringify(c.messages)
  			window.localStorage.setItem('M-'+conversation_id,messages)	
	    }else{
	    	console.log('I can not save messages, conversation not found:'+conversation_id)
	    }

  	},

  	recoverMessages : (state, conversation_id) => {
  		console.log('recovering for:'+conversation_id)
  		let messages = window.localStorage.getItem('M-'+conversation_id)

  		if(messages){
  			let c = state.conversations.find(element=>{
		    	return element._id == conversation_id
		    })

	  		if(c!=undefined){
	  			c.messages = JSON.parse(messages)
	  		}else{
	  			console.log('I can not recover messages, conversation not found:'+conversation_id)
	  		}
  		}else{
  			console.log('There are not messages for:'+conversation_id)
  		}
  		
  	},
  	addConversation : (state, payload) => {

		let c = state.conversations.find(element=>{
	    	return element._id == payload.conversation_id
	    })
	    if(c == undefined){
	    	let c = {
				_id: payload.conversation_id,
				nickname: payload.nickname,
				icon: payload.conversation_id,
				newMessageCounter: 0,
				messages:[]
			}
	  		state.conversations.unshift(c)	
	    }
  		
  	},
  	addMessage: (state, message) => {
		
		console.log('addMessage')
		console.log(message)
		message.time = moment().format('LT')

    	let index = state.conversations.findIndex(element=>{
	    	return element._id == message.conversation_id
	    })
	    let c = null
    	if(index >= 0){
    		c = state.conversations[index]

    		//Si el mensaje es recibido y la conversacion no esta en el inicio
    		if(state.jid == message.to && index > 0){
	    		//Enviar la conversacion al inicio del arreglo
	    		c = state.conversations.splice(index,1)
	    		c = c[0]
		    	state.conversations.unshift(c)	
	    	}
    	}else{
    		//Hay que crear la conversacion al inicio del arreglo
    		c = {
    			_id: message.conversation_id,
				icon: message.from,
				nickname: message.nickname,
				newMessageCounter: 0,
				messages:[]
    		}
    		state.conversations.unshift(c)

    		//Verificar si hay mensajes previos a la misma conversacion

    		let savedMessages = window.localStorage.getItem('M-'+c._id)
    		if(savedMessages){
    			c.messages = JSON.parse(savedMessages)
    		}

    	}
    	let messageIndex = c.messages.findIndex((element)=>{
    		return element._id == message._id
    	})
    	if(messageIndex >= 0){
    		console.log('messageIndex:'+messageIndex)
    		c.messages.splice(messageIndex, 1, message)
    	}else{
    		c.messages.push(message)
    	
	    	//De aqui en adelande no usar index debia a que se ha reestructurado el arreglo
	    	//Si el mensaje es recibido
	    	if(state.jid == message.to){
	    		//Se incrementa el contador de mensajes nuevos
	    		c.newMessageCounter++	
	    		//Seteamos una alerta pendiente para emitir sonido y/o notificacion
	    		state.alert_pending = true
	    	}
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
