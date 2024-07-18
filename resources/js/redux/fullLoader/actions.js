import types from './const'

const actOpenFullLoader = (message = "Cargando.") => {
	return {
		type:types.OPEN_FULL_LOADER,
		message
	}
}

const actCloseFullLoader = () => {
	return {
		type:types.CLOSE_FULL_LOADER
	}
}

export {
	actOpenFullLoader,
	actCloseFullLoader
}