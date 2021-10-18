/// <reference types="react-scripts" />

/**
 * Defines a string dictionary.
 */
interface IStringDictionary<T> {
    [index: string]: T;
}

/**
* Defines a number dictionary.
*/
interface INumberDictionary<T> {
    [index: number]: T;
}

/**
* Defines a member that can have a value or be null.
*/
type Nullable<T> = null | T;

/**
* Defines a member that can have a value or be undefined.
*/
type Undefinable<T> = undefined | T;
