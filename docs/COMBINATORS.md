# Combinators

The `composer` module offers a number of combinators to define compositions:

| Combinator | Description | Example |
| --:| --- | --- | 
| [`action`](#action) | action | `composer.action('echo')` |
| [`function`](#function) | function | `composer.function(({ x, y }) => ({ product: x * y }))` |
| [`literal` or `value`](#literal) | constant value | `composer.literal({ message: 'Hello, World!' })` |
| [`composition`](#composition) | named composition | `composer.composition('myCompositionName', myComposition)` |
| [`empty`](#empty) | empty sequence | `composer.empty()`
| [`sequence` or `seq`](#sequence) | sequence | `composer.sequence('hello', 'bye')` |
| [`let`](#let) | variable declarations | `composer.let({ count: 3, message: 'hello' }, ...)` |
| [`mask`](#mask) | variable hiding | `composer.let({ n }, composer.while(_ => n-- > 0, composer.mask(composition)))` |
| [`if` and `if_nosave`](#if) | conditional | `composer.if('authenticate', 'success', 'failure')` |
| [`while` and `while_nosave`](#while) | loop | `composer.while('notEnough', 'doMore')` |
| [`dowhile` and `dowhile_nosave`](#dowhile) | loop at least once | `composer.dowhile('fetchData', 'needMoreData')` |
| [`repeat`](#repeat) | counted loop | `composer.repeat(3, 'hello')` |
| [`try`](#try) | error handling | `composer.try('divideByN', 'NaN')` |
| [`finally`](#finally) | finalization | `composer.finally('tryThis', 'doThatAlways')` |
| [`retry`](#retry) | error recovery | `composer.retry(3, 'connect')` |
| [`retain` and `retain_catch`](#retain) | persistence | `composer.retain('validateInput')` |

The `action`, `function`, and `literal` combinators construct compositions respectively from actions, functions, and constant values. The other combinators combine existing compositions to produce new compositions.

## Shorthands

Where a composition is expected, the following shorthands are permitted:
 - `name` of type `string` stands for `composer.action(name)`,
 - `fun` of type `function` stands for `composer.function(fun)`,
 - `null` stands for the empty sequence `composer.empty()`.

## Primitive combinators

Some of these combinators are _derived_ combinators: they are equivalent to combinations of other combinators. The `composer` module offers a `composer.lower` method (see [COMPOSER.md](#COMPOSER.md)) that can eliminate derived combinators from a composition, producing an equivalent composition made only of _primitive_ combinators. The primitive combinators are: `action`, `function`, `composition`, `sequence`, `let`, `mask`, `if_nosave`, `while_nosave`, `dowhile_nosave`, `try`, and `finally`.

## Action

`composer.action(name, [options])` is a composition with a single action named _name_. It invokes the action named _name_ on the input parameter object for the composition and returns the output parameter object of this action invocation.

The action _name_ may specify the namespace and/or package containing the action following the usual OpenWhisk grammar. If no namespace is specified, the default namespace is assumed. If no package is specified, the default package is assumed.

Examples:
```javascript
composer.action('hello')
composer.action('myPackage/myAction')
composer.action('/whisk.system/utils/echo')
```
The optional `options` dictionary makes it possible to provide a definition for the action being composed.
```javascript
// specify the code for the action as a function
composer.action('hello', { action: function () { return { message: 'hello' } } })

// specify the code for the action as a function reference
function hello() {
    return { message: 'hello' }
}
composer.action('hello', { action: hello })

// specify the code for the action as a string
composer.action('hello', { action: "const message = 'hello'; function main() { return { message } }" })


// specify the code and runtime for the action
composer.action('hello', {
    action: {
        kind: 'nodejs:8',
        code: "function () { return { message: 'hello' } }"
    }
})

// specify a file containing the code for the action
composer.action('hello', { filename: 'hello.js' })

// specify a sequence of actions
composer.action('helloAndBye', { sequence: ['hello', 'bye'] })
```
The action may be defined by providing the code for the action as a string, as a Javascript function, or as a file name. Alternatively, a sequence action may be defined by providing the list of sequenced actions. The code (specified as a string) may be annotated with the kind of the action runtime.

### Environment capture in actions

Javascript functions used to define actions cannot capture any part of their declaration environment. The following code is not correct as the declaration of `name` would not be available at invocation time:
```javascript
let name = 'Dave'
composer.action('hello', { action: function main() { return { message: 'Hello ' + name } } })
```
In contrast, the following code is correct as it resolves `name`'s value at composition time.
```javascript
let name = 'Dave'
composer.action('hello', { action: `function main() { return { message: 'Hello ' + '${name}' } }` })
```

## Function

`composer.function(fun)` is a composition with a single Javascript function _fun_. It applies the specified function to the input parameter object for the composition.
 - If the function returns a value of type `function`, the composition returns an error object.
 - If the function throws an exception, the composition returns an error object. The exception is logged as part of the conductor action invocation.
 - If the function returns a value of type other than function, the value is first converted to a JSON value using `JSON.stringify` followed by `JSON.parse`. If the resulting JSON value is not a JSON dictionary, the JSON value is then wrapped into a `{ value }` dictionary. The composition returns the final JSON dictionary.
 - If the function does not return a value and does not throw an exception, the composition returns the input parameter object for the composition converted to a JSON dictionary using `JSON.stringify` followed by `JSON.parse`.

Examples:
```javascript
composer.function(params => ({ message: 'Hello ' + params.name }))
composer.function(function () { return { error: 'error' } })

function product({ x, y }) { return { product: x * y } }
composer.function(product)
```

### Environment capture in functions

Functions intended for compositions cannot capture any part of their declaration environment. They may however access and mutate variables in an environment consisting of the variables declared by the [composer.let](#composerletname-value-composition_1-composition_2-) combinator discussed below.

The following is not legal:
```javascript
let name = 'Dave'
composer.function(params => ({ message: 'Hello ' + name }))
```
The following is legal:
```javascript
composer.let({ name: 'Dave' }, composer.function(params => ({ message: 'Hello ' + name })))
```

## Literal

`composer.literal(value)` and its synonymous `composer.value(value)` output a constant JSON dictionary. This dictionary is obtained by first converting the _value_ argument to JSON using `JSON.stringify` followed by `JSON.parse`. If the resulting JSON value is not a JSON dictionary, the JSON value is then wrapped into a `{ value }` dictionary.

The _value_ argument may be computed at composition time. For instance, the following composition captures the date at the time the composition is encoded to JSON:
```javascript
composer.sequence(
    composer.literal(Date()),
    composer.action('log', { action: params => ({ message: 'Composition time: ' + params.value }) }))
```

JSON values cannot represent functions. Applying `composer.literal` to a value of type `'function'` will result in an error. Functions embedded in a `value` of type `'object'`, e.g., `{ f: p => p, n: 42 }` will be silently omitted from the JSON dictionary. In other words, `composer.literal({ f: p => p, n: 42 })` will output `{ n: 42 }`.

In general, a function can be embedded in a composition either by using the `composer.function` combinator, or by embedding the source code for the function as a string and later using `eval` to evaluate the function code.

## Composition

`composition(name, composition)` returns a composition consisting of the invocation of the composition named `name` and of the declaration of the composition named `name` defined to be `composition`.

```javascript
composer.if('isEven', 'half', composer.composition('tripleAndIncrement', composer.sequence('triple', 'increment')))
```
In this example, the `composer.sequence('triple', 'increment')` composition is given the name `tripleAndIncrement` and the enclosing composition references the `tripleAndIncrement` composition by name. In particular, deploying this composition actually deploys two compositions:
- a composition named `tripleAndIncrement` defined as `composer.sequence('triple', 'increment')`, and
- a composition defined as `composer.if('isEven', 'half', 'tripleAndIncrement')` whose name will be specified as deployment time.

Importantly, the behavior of the second composition would be altered if we redefine the `tripleAndIncrement` composition to do something else, since it refers to the composition by name.

## Empty

`composer.empty()` is a shorthand for the empty sequence `composer.sequence()`. It is typically used to make it clear that a composition, e.g., a branch of an `if` combinator, is intentionally doing nothing.

## Sequence

`composer.sequence(composition_1, composition_2, ...)` chains a series of compositions (possibly empty).

The input parameter object for the composition is the input parameter object of the first composition in the sequence. The output parameter object of one composition in the sequence is the input parameter object for the next composition in the sequence. The output parameter object of the last composition in the sequence is the output parameter object for the composition.

If one of the components fails (i.e., returns an error object), the remainder of the sequence is not executed. The output parameter object for the composition is the error object produced by the failed component.

An empty sequence behaves as a sequence with a single function `params => params`. The output parameter object for the empty sequence is its input parameter object unless it is an error object, in which case, as usual, the error object only contains the `error` field of the input parameter object.

## Let

`composer.let({ name_1: value_1, name_2: value_2, ... }, composition_1_, _composition_2_, ...)` declares one or more variables with the given names and initial values, and runs a sequence of compositions in the scope of these declarations.

The initial values must be valid JSON values. In particular, `composer.let({ foo: undefined })` is incorrect as `undefined` is not representable by a JSON value. On the other hand, `composer.let({ foo: null })` is correct. For the same reason, initial values cannot be functions, e.g., `composer.let({ foo: params => params })` is incorrect.

Variables declared with `composer.let` may be accessed and mutated by functions __running__ as part of the following sequence (irrespective of their place of definition). In other words, name resolution is [dynamic](https://en.wikipedia.org/wiki/Name_resolution_(programming_languages)#Static_versus_dynamic). If a variable declaration is nested inside a declaration of a variable with the same name, the innermost declaration masks the earlier declarations.

For example, the following composition invokes composition `composition` repeatedly `n` times.
```javascript
composer.let({ i: n }, composer.while(() => i-- > 0, composition))
```
Variables declared with `composer.let` are not visible to invoked actions. However, they may be passed as parameters to actions as for instance in:
```javascript
composer.let({ n: 42 }, () => ({ n }), 'increment', params => { n = params.n })
```

In this example, the variable `n` is exposed to the invoked action as a field of the input parameter object. Moreover, the value of the field `n` of the output parameter object is assigned back to variable `n`.

## Mask

`composer.mask(composition)` is meant to be used in combination with the `let` combinator. It makes it possible to hide the innermost enclosing `let` combinator from _composition_. It is typically used to define composition templates that need to introduce variables.

For instance, the following function is a possible implementation of a repeat loop:
```javascript
function loop(n, composition) {
    return .let({ n }, composer.while(() => n-- > 0, composer.mask(composition)))
}
```
This function takes two parameters: the number of iterations _n_ and the _composition_ to repeat _n_ times. Here, the `mask` combinator makes sure that this declaration of _n_ is not visible to _composition_. Thanks to `mask`, the following example correctly returns `{ value: 12 }`.
```javascript
composer.let({ n: 0 }, loop(3, loop(4, () => ++n)))
```
While composer variables are dynamically scoped, the `mask` combinator alleviates the biggest concern with dynamic scoping: incidental name collision.

## If

`composer.if(condition, consequent, [alternate])` runs either the _consequent_ composition if the _condition_ evaluates to true or the _alternate_ composition if not.

A _condition_ composition evaluates to true if and only if it produces a JSON dictionary with a field `value` with value `true`. Other fields are ignored. Because JSON values other than dictionaries are implicitly lifted to dictionaries with a `value` field, _condition_ may be a Javascript function returning a Boolean value. An expression such as `params.n > 0` is not a valid condition (or in general a valid composition). One should write instead `params => params.n > 0`. The input parameter object for the composition is the input parameter object for the _condition_ composition.

The _alternate_ composition may be omitted. If _condition_ fails, neither branch is executed.

The output parameter object of the _condition_ composition is discarded, one the choice of a branch has been made and the _consequent_ composition or _alternate_ composition is invoked on the input parameter object for the composition. For example, the following composition divides parameter `n` by two if `n` is even:
```javascript
composer.if(params => params.n % 2 === 0, params => { params.n /= 2 })
```
The `if_nosave` combinator is similar but it does not preserve the input parameter object, i.e., the _consequent_ composition or _alternate_ composition is invoked on the output parameter object of _condition_. The following example also divides parameter `n` by two if `n` is even:
```javascript
composer.if_nosave(params => { params.value = params.n % 2 === 0 }, params => { params.n /= 2 })
```
In the first example, the condition function simply returns a Boolean value. The consequent function uses the saved input parameter object to compute `n`'s value. In the second example, the condition function adds a `value` field to the input parameter object. The consequent function applies to the resulting object. In particular, in the second example, the output parameter object for the condition includes the `value` field.

While, the `if` combinator is typically more convenient, preserving the input parameter object is not free as it counts toward the parameter size limit for OpenWhisk actions. In essence, the limit on the size of parameter objects processed during the evaluation of the condition is reduced by the size of the saved parameter object. The `if_nosave` combinator omits the parameter save, hence preserving the parameter size limit.

## While

`composer.while(condition, body)` runs _body_ repeatedly while _condition_ evaluates to true. The _condition_ composition is evaluated before any execution of the _body_ composition. See [composer.if](#composerifcondition-consequent-alternate) for a discussion of conditions.

A failure of _condition_ or _body_ interrupts the execution. The composition returns the error object from the failed component.

The output parameter object of the _condition_ composition is discarded and the input parameter object for the _body_ composition is either the input parameter object for the whole composition the first time around or the output parameter object of the previous iteration of _body_. However, if `while_nosave` combinator is used, the input parameter object for _body_ is the output parameter object of _condition_. Moreover, the output parameter object for the whole composition is the output parameter object of the last _condition_ evaluation.

For instance, the following composition invoked on dictionary `{ n: 28 }` returns `{ n: 7 }`:
```javascript
composer.while(params => params.n % 2 === 0, params => { params.n /= 2 })
```
For instance, the following composition invoked on dictionary `{ n: 28 }` returns `{ n: 7, value: false }`:
```javascript
composer.while_nosave(params => { params.value = params.n % 2 === 0 }, params => { params.n /= 2 })
```

## Dowhile

`composer.dowhile(condition, body)` is similar to `composer.while(body, condition)` except that _body_ is invoked before _condition_ is evaluated, hence _body_ is always invoked at least once.

Like `while_nosave`, `dowhile_nosave` does not implicitly preserve the parameter object while evaluating _condition_.

## Repeat

`composer.repeat(count, body)` invokes _body_ _count_ times.

## Try

`composer.try(body, handler)` runs _body_ with error handler _handler_.

If _body_ returns an error object, _handler_ is invoked with this error object as its input parameter object. Otherwise, _handler_ is not run.

## Finally

`composer.finally(body, finalizer)` runs _body_ and then _finalizer_.

The _finalizer_ is invoked in sequence after _body_ even if _body_ returns an error object.

## Retry

`composer.retry(count, body)` runs _body_ and retries _body_ up to _count_ times if it fails. The output parameter object for the composition is either the output parameter object of the successful _body_ invocation or the error object produced by the last _body_ invocation.

## Retain

`composer.retain(body)` runs _body_ on the input parameter object producing an object with two fields `params` and `result` such that `params` is the input parameter object of the composition and `result` is the output parameter object of _body_.

If _body_ fails, the output of the `retain` combinator is only the error object (i.e., the input parameter object is not preserved). In constrast, the `retain_catch` combinator always outputs `{ params, result }`, even if `result` is an error result.
