var assert = require('assert')
let mocha = require( 'mocha' )
var cook = require('../')

function test_factory( result ) {
	var invocation = function() {
		invocation.calls++
		return result
	}
	invocation.calls = 0
	return invocation
}

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

describe( "given a nested regsitery", () => {
	beforeEach( () => {
		this.upstream = new cook.Registry()
		this.registry = new cook.NestedRegistry( this.upstream )
	})

	describe( "when the local reigstry doesn't have a recipe", () => {
		describe( "and the upstream does", () => {
			let name = "upstream"
			let example = {}

			beforeEach( () => {
				this.factory = test_factory( example )
				this.upstream.register( name, this.factory )
			})

			it( "has the recipe", () => { assert( this.registry.has( name ) ) } )

			it( "asks the factory", async () => {
				await this.registry.get( name )
				assert( this.factory.calls == 1 )
			} )

			it( "provides the value", async () => {
				assert( await this.registry.get( name ) == example )
			} )
		})

		describe( "and neither does the upstream", () => {
			let example = "unregistered"

			it( "doesn't have the recipe", () => {
				assert( !this.registry.has( example ) )
			} )

			it( "errors when attempting to execute the recipe", async () => {
				var faulted = false
				try {
					await this.registry.get( example )
				}catch( e ) {
					faulted = true
				}
				assert( faulted )
			} )
		})
	})

	describe( "when the local reigstry has a recipe", () => {
		describe( "and the upstream does", () => {
			let example = "both"
			let local_product = {}, upstream_product = 42

			beforeEach( () => {
				this.local_factory = test_factory( local_product )
				this.registry.register( example, this.local_factory )
				this.upstream_factory = test_factory( upstream_product )
				this.upstream.register( example, this.upstream_factory )

				this.product = this.registry.get( example )
			} )

			it( "has the recipe", () => { assert( this.registry.has( example ) ) } )
			it( "asks the local factory", async () => {
				await this.product
				assert.equal( this.local_factory.calls, 1 )
			})

			it( "provides the local product",  async () => {
				assert.equal( await this.product, local_product )
			})

			it( "doesn't ask the upstream factory", async () => {
				await this.product
				assert.equal( this.upstream_factory.calls, 0 )
			})
		})

		describe( "and the upstream doesn't", () => {
			let example = "both"
			let local_product = {}, upstream_product = 42

			beforeEach( () => {
				this.local_factory = test_factory( local_product )
				this.registry.register( example, this.local_factory )

				this.product = this.registry.get( example )
			} )

			it( "has the recipe", () => { assert( this.registry.has( example ) ) } )
			it( "asks the local factory", async () => {
				await this.product
				assert.equal( this.local_factory.calls, 1 )
			})

			it( "provides the local product",  async () => {
				assert.equal( await this.product, local_product )
			})
		})
	})
})

describe( "inject_array", () => {
	describe( "when given an empty array", () => {
		it( "provides the apply function with an empty array", async () => {
			let registry = new cook.Registry()
			var result
			await cook.inject_array( registry, [], async ( output ) => {
				result = output
			})

			assert.deepEqual( result, [] )
		})
	})

	describe( "when given a single recipe", () => {
		it( "provides a single object in the array", async () => {
			let name = "up"
			let example_result = "down"
			let registry = new cook.Registry()
			registry.register( name, async () => { return example_result } )
			var result
			await cook.inject_array( registry, [ "up" ], async ( output ) => {
				result = output
			})

			assert.deepEqual( result, [ example_result ] )
		})
	})

	describe( "when given two arguments", () => {
		it( "provides both objects", async () => {
			let first_name = "Mark"
			let last_name = "Eschbach"

			let registry = new cook.Registry()
			registry.register( "first", async () => { return first_name } )
			registry.register( "last", async () => { return last_name } )
			var result
			await cook.inject_array( registry, [ "first", "last" ], async ( output ) => {
				result = output
			})

			assert.deepEqual( result, [ first_name, last_name ] )
		})
	})
})

describe( "memoize factory", () =>{

	describe( "when given a funciton", () => {
		beforeEach( () => {
			this.called = 0
			this.subject = cook.memoize( async () => {
				this.called++
				return this.called
			})
		} )

		it( "provides a constructed object the first time", async () => {
			assert.equal( await this.subject(), 1 )
		})

		it( "provides the same object the second time", async () => {
			assert.equal( await this.subject(), await this.subject() )
		})
	})
})

