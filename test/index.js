var assert = require('assert')
let mocha = require( 'mocha' )
var cook = require('../')
let test_factory = require( "./test_factory" )

describe( "given an empty registry", () => {
	it( "raises an error when a recipe isn't registered", async () => {
		let registry = new cook.Registry()
		var passed
		try {
			await registry.get( "nonexistent" )
			passed = false
		} catch( e ) {
			passed = true
		}
		assert( passed )
	})

	describe( "when a recipe is registered and requested", () => {
		var registry
		var factory_called = false
		var has_recipe

		var product
		var expected_product = {}

		beforeEach( ( ) => {
			let recipe = "example";
			registry = new cook.Registry()
			registry.register( recipe, () => {
				factory_called = true
				return expected_product
			})
			has_recipe = registry.has( recipe )

			product = registry.get( recipe )
		})

		it( "shows to have the recipe", () => {
			assert( has_recipe )
		})

		it( "invokes the factory", async () => {
			await product
			assert( factory_called )
		})

		it( "returns the product as a promise", async () => {
			assert( expected_product == await product )
		})
	})
})

