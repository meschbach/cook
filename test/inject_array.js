var assert = require('assert')
let mocha = require( 'mocha' )
var cook = require('../')

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

