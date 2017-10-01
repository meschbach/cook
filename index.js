// vim: set ft=javascript tabstop=4 softtabstop=4 shiftwidth=4 autoindent:

function env_factory( name ){
	return function() {
		return process.env[ name ]
	}
}


class Registry {
	constructor() {
		this.recipes = {}
	}

	register( recipe, factory ) {
		if( !factory ) { throw new Error( "Factory missing" ) }

		this.recipes[ recipe ] = factory
	}

	has( recipe ) {
		return !!this.recipes[ recipe ]
	}

	async get( name ) {
		let factory = this.recipes[name]
		if( !factory ) throw new Error( "No such factory " + factory )
		return factory( this )
	}
}

class NestedRegistry {
	constructor( upstream ) {
		if( !upstream ) throw new Error( "upstream registry must exist" )
		this.local = new Registry()
		this.upstream = upstream
	}

	register( recipe, factory ) {
		this.local.register( recipe, factory )
	}

	has( recipe ) {
		return this.local.has( recipe ) || this.upstream.has( recipe )
	}

	get( recipe ) {
		var registry
		if( this.local.has( recipe ) ) {
			registry = this.local
		} else {
			registry = this.upstream
		}
		return registry.get( recipe )
	}
}

exports.Registry = Registry
exports.NestedRegistry = NestedRegistry

exports.memoize = function memoize( work ) {
	var needsResult = true
	var result
	return async function( parameters ) {
		if( needsResult ) {
			result = await work( parameters )
			needsResult = false
		}
		return result
	}
}

async function inject_array( from, recipes, apply ){
	let futures = recipes.map( ( recipe ) => {
		return from.get( recipe )
	})
	let needed = await Promise.all( futures )
	return await apply( needed )
}

exports.inject_array = inject_array

