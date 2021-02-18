export default function ({store, redirect}) {
	
	if(store.state.auth.identity.data.privileges.includes('LOGGED')){

	}else{
		console.log('No autorizado')
		return redirect('/login')
	}
}
