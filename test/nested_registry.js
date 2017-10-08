var assert = require('assert')
let mocha = require( 'mocha' )
var cook = require('../')
let test_factory = require( "./test_factory" )

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

