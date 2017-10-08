# Cook

A framework dependency injection inspired framework from NodeJS.

## Example usage

```javascript
class Example {
	constructor() { }

	salutations() {
		return this.salutation
	}
}

const registry = new cook.Registry()
registry.register( "greeting", "Hello" )
registry.register( "example", cook.inject_fields( Example, { "salutation" : "greeting" } ) )
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
