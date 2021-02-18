export default function ({store, redirect}) {
	console.log('mid guest')
	console.log(store.state.auth.identity.data.privileges.includes('LOGGED'))
	if(store.state.auth.identity.data.privileges.includes('LOGGED')){
		console.log('mid guest redirect')
		return redirect('/')
	}else{
		console.log('no esta LOGGED')
	}

}
