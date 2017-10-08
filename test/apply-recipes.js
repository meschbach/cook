var assert = require('assert')
let mocha = require( 'mocha' )
var cook = require('../')
let test_factory = require( "./test_factory" )

function inject_fields( ctor, fieldRecipeMap ){
	return async function( registry ) {
		let obj = new ctor()
		let promises = Object.keys( fieldRecipeMap ).map( async ( key ) => {
			let recipe = fieldRecipeMap[ key ]
			let value = await registry.get( recipe )
			obj[ key ] = value
			return value
		})
		await Promise.all( promises )
		return obj
	}
}

describe( "inject_fields factory", () => {
	describe( "with all recipes registered", () => {
		it( "news the constructor", async () => {
			let called_constructor = 0
			class ExampleConstructor {
				constructor() {
					called_constructor++
				}
			}

			let forward = "we go"
			const registry = new cook.Registry()
			registry.register( "forward", async () => { return forward } )
			registry.register( "subject", inject_fields( ExampleConstructor, { "other-field" : "forward" } ) )
			let result = await registry.get( "subject" )
			assert.equal( called_constructor, 1 )
		})

		it( "injects the recipes", async () => {
			let called_constructor = 0
			class ExampleConstructor {
				constructor() {
					called_constructor++
				}
			}

			let forward = "we go"
			const registry = new cook.Registry()
			registry.register( "forward", async () => { return forward } )
			registry.register( "subject", inject_fields( ExampleConstructor, { "other-field" : "forward" } ) )
			let result = await registry.get( "subject" )
			assert.equal( result["other-field"], forward )
		})
	})
})

