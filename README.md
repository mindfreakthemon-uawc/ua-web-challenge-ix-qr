# Lisp-like.lang 

## Code example

```
(define (fib n)
	(if (= n 1) 0
		(if (= n 2) 1
			(+ (fib (- n 1)) (fib (- n 2)) )
		)	
	)
)

(fib 6) // 5
```

## EBNF

```
<IDENTIFIER> = /[a-z][a-z0-9_]*/i

<TEXT> = /[^"]+/
<NUMBER_LITERAL> = "0" | /[1-9][0-9]+/ [ "." /[0-9]*[1-9]/ ]
<STRING_LITERAL> = '"' <TEXT> '"'
<BOOLEAN_LITERAL> = "true" | "false"
<ANY_LITERAL> = <NUMBER_LITERAL> | <STRING_LITERAL> | <BOOLEAN_LITERAL> | "(" <ANY_LITERAL> ")"

<OPERATOR> = "<" | ">" | "<=" | ">=" | "+" | "-" | "*" | "/" | "^" | "=" | "==" | "!=" | "&" | "|" | "&&" | "||" | "!" | "~" 

<VAR_REFERENCE_EXPRESSION> = <IDENTIFIER>
<VAR_ASSIGNMENT_EXPRESSION_> = "(" "set" <IDENTIFIER> <EXPRESSION> ")"
<OPERATION_EXPRESSION> = "(" <OPERATOR> { <EXPRESSION> } ")"
<CONDITIONAL_EXPRESSION> = "(" "if" <EXPRESSION> <EXPRESSION> [ <EXPRESSION> ] ")" 
<FUNCTION_CALL_EXPRESSION> = "(" <VAR_REFERENCE_EXPRESSION> { <EXPRESSION> } ")"
<FUNCTION_DECLARATION_EXPRESSION> "(" "define" "(" <IDENTIFIER> { <VAR_REFERENCE_EXPRESSION> } ")" { <EXPRESSION> } ")"
<EXPRESSION> = <ANY_LITERAL> | <CONDITIONAL_EXPRESSION> | <VAR_REFERENCE_EXPRESSION> | <FUNCTION_CALL_EXPRESSION> | <OPERATION_EXPRESSION> | <FUNCTION_DECLARATION_EXPRESSION>
```

## Runtime library

| Function        | Description                                                                                                 |
|:----------------|:------------------------------------------------------------------------------------------------------------|
| (log a b ...)   | Logs arguments into console                                                                                 |
| E               | Returns Euler's number (approx. 2.718)                                                                      |
| LN2             | Returns the natural logarithm of 2 (approx. 0.693)                                                          |
| LN10            | Returns the natural logarithm of 10 (approx. 2.302)                                                         |
| LOG2E           | Returns the base-2 logarithm of E (approx. 1.442)                                                           |
| LOG10E          | Returns the base-10 logarithm of E (approx. 0.434)                                                          |
| PI              | Returns PI (approx. 3.14)                                                                                   |
| SQRT1_2         | Returns the square root of 1/2 (approx. 0.707)                                                              |
| SQRT2           | Returns the square root of 2 (approx. 1.414)                                                                |
| (abs x)         | Returns the absolute value of a number.                                                                     |
| (acos x)        | Returns the arccosine of a number.                                                                          |
| (acosh x)       | Returns the hyperbolic arccosine of a number.                                                               |
| (asin x)        | Returns the arcsine of a number.                                                                            |
| (asinh x)       | Returns the hyperbolic arcsine of a number.                                                                 |
| (atan x)        | Returns the arctangent of a number.                                                                         |
| (atanh x)       | Returns the hyperbolic arctangent of a number.                                                              |
| (atan2 y, x)    | Returns the arctangent of the quotient of its arguments.                                                    |
| (cbrt x)        | Returns the cube root of a number.                                                                          |
| (ceil x)        | Returns the smallest integer greater than or equal to a number.                                             |
| (clz32 x)       | Returns the number of leading zeroes of a 32-bit integer.                                                   |
| (cos x)         | Returns the cosine of a number.                                                                             |
| (cosh x)        | Returns the hyperbolic cosine of a number.                                                                  |
| (exp x)         | Returns Ex, where x is the argument, and E is Euler's constant (2.718…), the base of the natural logarithm. |
| (expm1 x)       | Returns subtracting 1 from exp(x).                                                                          |
| (floor x)       | Returns the largest integer less than or equal to a number.                                                 |
| (fround x)      | Returns the nearest single precision float representation of a number.                                      |
| (hypot x y ...) | Returns the square root of the sum of squares of its arguments.                                             |
| (imul x, y)     | Returns the result of a 32-bit integer multiplication.                                                      |
| (log x)         | Returns the natural logarithm (loge, also ln) of a number.                                                  |
| (log1p x)       | Returns the natural logarithm of 1 + x (loge, also ln) of a number.                                         |
| (log10 x)       | Returns the base 10 logarithm of a number.                                                                  |
| (log2 x)        | Returns the base 2 logarithm of a number.                                                                   |
| (max x y ...)   | Returns the largest of zero or more numbers.                                                                |
| (min x y ...)   | Returns the smallest of zero or more numbers.                                                               |
| (pow x, y)      | Returns base to the exponent power, that is, baseexponent.                                                  |
| (random )       | Returns a pseudo-random number between 0 and 1.                                                             |
| (round x)       | Returns the value of a number rounded to the nearest integer.                                               |
| (sign x)        | Returns the sign of the x, indicating whether x is positive, negative or zero.                              |
| (sin x)         | Returns the sine of a number.                                                                               |
| (sinh x)        | Returns the hyperbolic sine of a number.                                                                    |
| (sqrt x)        | Returns the positive square root of a number.                                                               |
| (tan x)         | Returns the tangent of a number.                                                                            |
| (tanh x)        | Returns the hyperbolic tangent of a number.                                                                 |
| (trunc x)       | Returns the integral part of the number x, removing any fractional digits                                   |


## Language constructs

| Construct                                                | Description                                                                                                            |
|:---------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------|
| (define (_F_ _a_ _b_ ...) _expression_ _expression_ ...) | Creates a function with arguments _a_, _b_, ..., assigns it to variable _F_ and returns it                             |
| (set _x_ _expression_)                                   | Sets variable _x_ to _expression_ result                                                                               |
| (if _conditional_expression_ _if_truthy_ _if_falsy_)     | Executes _conditional_expression_ and if the result is truthy, execute and return _if_truthy_, otherwise - _i f_falsy_ |
| (_F_ _a_ _b_ ...)                                        | Call function in variable _F_ with arguments _a_ _b_ ...                                                               |
| (< arg1 arg2)                                            | Performs < operation with arguments                                                                                    |
| (> arg1 arg2)                                            | Performs > operation with arguments                                                                                    |
| (<= arg1 arg2)                                           | Performs <= operation with arguments                                                                                   |
| (>= arg1 arg2)                                           | Performs >= operation with arguments                                                                                   |
| (+ arg1 arg2 ...)                                        | Performs + operation with arguments                                                                                    |
| (- arg1 arg2)                                            | Performs - operation with arguments                                                                                    |
| (* arg1 arg2 ...)                                        | Performs * operation with arguments                                                                                    |
| (/ arg1 arg2)                                            | Performs / operation with arguments                                                                                    |
| (^ arg1 arg2)                                            | Performs ^ operation with arguments                                                                                    |
| (= arg1 arg2)                                            | Performs = operation with arguments                                                                                    |
| (== arg1 arg2)                                           | Performs == operation with arguments                                                                                   |
| (!= arg1 arg2)                                           | Performs != operation with arguments                                                                                   |
| (& arg1 arg2)                                            | Performs & operation with arguments                                                                                    |
| (&#124; arg1 arg2)                                       | Performs &#124; operation with arguments                                                                               |
| (&& arg1 arg2)                                           | Performs && operation with arguments                                                                                   |
| (&#124;&#124; arg1 arg2)                                 | Performs &#124;&#124; operation with arguments                                                                         |
| (! arg1)                                                 | Performs ! operation with arguments                                                                                    |
| (~ arg1)                                                 | Performs ~ operation with arguments                                                                                    |
