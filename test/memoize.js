var cook = require('../')
var assert = require('assert')

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

