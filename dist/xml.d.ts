/**
 * Readers for the object form xmlbuilder2 produces from a szamlazz.hu response.
 *
 * Every value in that object arrives as text, and the same element can appear as
 * a bare string, as `{ $: string }` when it is CDATA, as `{}` when it is empty
 * (`<adoszam></adoszam>`), and as an array or a single object depending on how
 * many siblings it happens to have. These readers absorb that so the decoders
 * can read a response as if it were a plain record.
 */
/** Reads an XML text node, which xmlbuilder2 represents as a string or as `{ $: string }` for CDATA. */
export declare const textOf: (node: unknown) => string | undefined;
/** Like {@link textOf}, but treats an empty or whitespace-only element as absent. */
export declare const optionalTextOf: (node: unknown) => string | undefined;
/** Reads a numeric element, falling back to `fallback` when it is missing or unparsable. */
export declare const numberOf: (node: unknown, fallback?: number) => number;
/** Reads a boolean element. szamlazz.hu writes both `true`/`false` and `1`/`0`, depending on the field. */
export declare const booleanOf: (node: unknown) => boolean;
/**
 * Reads a repeated element as an array. xmlbuilder2 collapses a single
 * occurrence to the value itself, so an invoice with one line item would
 * otherwise be shaped differently from one with two.
 */
export declare const listOf: (node: unknown) => unknown[];
