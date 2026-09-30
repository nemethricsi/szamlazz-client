import type { InvoiceOptions, InvoiceQuery, LineItem, QueriedInvoice, QueryOptions, ReverseInvoiceOptions, KeyAuth, CredentialAuth, InvoiceItemResponse } from './types.js';
export declare class Client {
    readonly key?: string;
    readonly username?: string;
    readonly password?: string;
    readonly apiUrl = "https://www.szamlazz.hu/szamla/";
    constructor(auth: KeyAuth | CredentialAuth);
    /**
     * @throws {SzamlazzError} when szamlazz.hu reported an error code, so callers can
     *   branch on {@link SzamlazzError.code} / {@link SzamlazzError.category}.
     */
    private decodeResponse;
    private sendRequest;
    private authAttributes;
    generateInvoice(options: InvoiceOptions, items?: Array<LineItem>): Promise<InvoiceItemResponse>;
    /**
     * Creates a correction invoice (helyesbítő számla) for an existing invoice.
     *
     * Unlike a reversal/storno, the original invoice stays valid; the original
     * and the correction invoice are valid together. The `items` must describe
     * the correction deltas — typically the original line items with negated
     * amounts, followed by the corrected line items. Partner details, payment
     * method and currency cannot be changed by a correction invoice.
     *
     * Each call produces a brand-new invoice with its own number — nothing is
     * edited in place — and that number is returned in the response.
     *
     * `invoice` must always be the ORIGINAL invoice number, even when applying
     * several corrections. A correction invoice is not itself correctable: the
     * API rejects an attempt to correct a correction (error 222, "a helyesbítő
     * számla által hivatkozott számla nem helyesbíthető"). The same original may
     * be corrected repeatedly, and the original plus all of its corrections are
     * jointly valid:
     *
     * ```ts
     * const inv = await client.generateInvoice(opts, items)          // E-001
     * const c1  = await client.correctInvoice(inv.invoice.number, opts, deltas) // → E-002, refs E-001
     * const c2  = await client.correctInvoice(inv.invoice.number, opts, more)   // → E-003, refs E-001
     * ```
     *
     * To "reverse" a corrected invoice, issue one more correction (again against
     * the original) whose deltas negate the current net state — storno via
     * {@link reverseInvoice} is not allowed once an invoice has been corrected.
     *
     * @param invoice The number of the ORIGINAL invoice being corrected — never a
     *   previous correction invoice.
     */
    correctInvoice(invoice: string, options: InvoiceOptions, items?: Array<LineItem>): Promise<InvoiceItemResponse>;
    /**
     * Creates a reversal/storno invoice that fully voids an existing invoice.
     *
     * Note: an invoice that has already been corrected — and any correction
     * invoice in its chain — cannot be stornoed; szamlazz.hu rejects the request.
     * Use {@link correctInvoice} with negated deltas to undo a correction instead.
     */
    reverseInvoice(invoice: string, options: ReverseInvoiceOptions): Promise<InvoiceItemResponse>;
    /**
     * Validates the credentials by querying an invoice number that cannot exist.
     *
     * Returns `true` when szamlazz.hu accepted the credentials (it answers with
     * {@link SzamlazzErrorCode.MissingData} because the invoice is not found) and
     * `false` when it rejected them.
     *
     * Anything else — an unpaid subscription ({@link SzamlazzErrorCode.SubscriptionProblem}),
     * maintenance, a blocked account — is thrown as a {@link SzamlazzError} rather
     * than reported as bad credentials, since those need a different response from
     * the caller.
     *
     * @throws {SzamlazzError} when the request failed for a reason unrelated to the credentials.
     */
    testConnection(): Promise<boolean>;
    /**
     * Looks up a document szamlazz.hu has already issued.
     *
     * Identify it by its invoice number, by the `orderNumber` given to
     * {@link generateInvoice}, or by the `externalId` — the latter two only find
     * the document if they were set when it was created. Where several documents
     * share an order number, szamlazz.hu returns the most recent one.
     *
     * **Returns `null` when no such document exists** instead of throwing.
     * szamlazz.hu reports a missing document with
     * {@link SzamlazzErrorCode.MissingData}, the same code it uses for a request
     * that left out a required field, and this client is the only layer that
     * knows a lookup was what it sent — so callers would otherwise all have to
     * special-case code 7 to ask a question whose negative answer is not an
     * error. Every other failure still throws.
     *
     * The response carries no link to the document: the customer-account URL that
     * {@link generateInvoice} derives `pdfUrl` from is only handed out when the
     * document is created. Pass `{ pdf: true }` to get the PDF bytes inline instead.
     *
     * Only documents issued through szamlazz.hu itself can be retrieved this way.
     *
     * @throws {SzamlazzError} when the request failed for any reason other than the document not existing.
     * @throws {TypeError} when `query` names no document or more than one — that would otherwise
     *   come back from szamlazz.hu as code 7 and be reported as a confident "not found".
     */
    findInvoice(query: InvoiceQuery, options?: QueryOptions): Promise<QueriedInvoice | null>;
}
export default Client;
export * from './types.js';
export * from './errors.js';
