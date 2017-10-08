
module.exports = function test_factory( result ) {
	var invocation = function() {
		invocation.calls++
		return result
	}
	invocation.calls = 0
	return invocation
}

