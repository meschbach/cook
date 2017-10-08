# Cuisinier

A framework dependency injection inspired framework from NodeJS.

## Example usage

```javascript
const cuisinier = require( 'cuisinier' )

class Example {
	constructor() { }

	salutations() {
		return this.salutation
	}
}

const registry = new cuisinier.Registry()
registry.register( "greeting", "Hello" )
registry.register( "example", cuisinier.inject_fields( Example, { "salutation" : "greeting" } ) )
console.log( registry.get( "example" ).salutations() )
```

Outputs:
```text
Hello
```

## State of this projects

It's young, it's new, it needs a better user facing facade.

## License

MIT license.
