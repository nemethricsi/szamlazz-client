import type { QueriedInvoice } from './types.js';
/**
 * @throws {Error} carrying the raw body when the response is not a `<szamla>` document.
 */
export declare const decodeQueriedInvoice: (response: string) => QueriedInvoice;
