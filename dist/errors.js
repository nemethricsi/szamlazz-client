import { convert } from 'xmlbuilder2';
import { textOf } from './xml.js';
/**
 * Error codes returned by szamlazz.hu in the `<hibakod>` element of the XML
 * response (and in the `szlahu_error_code` HTTP response header).
 *
 * The list is not exhaustive — szamlazz.hu documents only a subset of the codes
 * its system can emit, so always handle unknown codes gracefully. Compare
 * against {@link SzamlazzError.code}, which carries the raw numeric code
 * whether or not it is listed here.
 *
 * Sources:
 * - https://docs.szamlazz.hu/agent/basics/error-handling (current documentation)
 * - https://docs.szamlazz.hu/agent/querying_xml/response (code 7)
 * - Számla Agent PDF documentation v3.6 (codes 49, 52, 56, 250, 335-340, 395, 396)
 */
export var SzamlazzErrorCode;
(function (SzamlazzErrorCode) {
    /** Számla Agent internal error / maintenance. Nothing to fix on the caller's side. */
    SzamlazzErrorCode[SzamlazzErrorCode["SystemMaintenance"] = 1] = "SystemMaintenance";
    /** Invalid login name, password or Agent key. */
    SzamlazzErrorCode[SzamlazzErrorCode["LoginFailed"] = 3] = "LoginFailed";
    /**
     * Missing data. The message names what is missing. Also returned when a queried
     * document cannot be found — "unknown invoice number, order number or external identifier".
     */
    SzamlazzErrorCode[SzamlazzErrorCode["MissingData"] = 7] = "MissingData";
    /** The keystore password is required to issue an e-invoice with your own certificate. */
    SzamlazzErrorCode[SzamlazzErrorCode["KeystorePasswordRequired"] = 49] = "KeystorePasswordRequired";
    /** The VAT rate of a line item could not be interpreted. */
    SzamlazzErrorCode[SzamlazzErrorCode["UnparsableVatRate"] = 52] = "UnparsableVatRate";
    /** The XML was not sent as a file (probably posted as plain form input instead). */
    SzamlazzErrorCode[SzamlazzErrorCode["MissingXmlFile"] = 53] = "MissingXmlFile";
    /** E-invoicing is not enabled: not part of the subscription, or no certificate is set up. */
    SzamlazzErrorCode[SzamlazzErrorCode["EInvoiceNotEnabled"] = 54] = "EInvoiceNotEnabled";
    /** Signing the e-invoice failed — expired certificate or unreachable timestamp server. */
    SzamlazzErrorCode[SzamlazzErrorCode["EInvoiceSigningFailed"] = 55] = "EInvoiceSigningFailed";
    /**
     * The invoice was created, but the notification email could not be sent.
     * The document exists; only delivery failed.
     */
    SzamlazzErrorCode[SzamlazzErrorCode["InvoiceSavedButEmailFailed"] = 56] = "InvoiceSavedButEmailFailed";
    /** The XML could not be parsed. The response body contains the details. */
    SzamlazzErrorCode[SzamlazzErrorCode["XmlParseError"] = 57] = "XmlParseError";
    /** The order number is already used by another document of the same type. */
    SzamlazzErrorCode[SzamlazzErrorCode["DuplicateOrderNumber"] = 71] = "DuplicateOrderNumber";
    /** Számla Agent cannot run while the same user is logged in to szamlazz.hu in a browser. */
    SzamlazzErrorCode[SzamlazzErrorCode["BrowserSessionActive"] = 135] = "BrowserSessionActive";
    /**
     * The account cannot use Számla Agent right now. Typically an unpaid szamlazz.hu
     * subscription: the plan expired, an invoice towards szamlazz.hu is outstanding,
     * or a payment is late. The user has to log in to szamlazz.hu and settle it.
     */
    SzamlazzErrorCode[SzamlazzErrorCode["SubscriptionProblem"] = 136] = "SubscriptionProblem";
    /** Same as {@link DuplicateOrderNumber}, but the message also contains the duplicated order number. */
    SzamlazzErrorCode[SzamlazzErrorCode["DuplicateOrderNumberWithValue"] = 152] = "DuplicateOrderNumberWithValue";
    /** The user has access to more than one billing account. Use an Agent key instead. */
    SzamlazzErrorCode[SzamlazzErrorCode["MultipleAccountsNotAllowed"] = 164] = "MultipleAccountsNotAllowed";
    /** The invoice number prefix is empty or was not registered in the szamlazz.hu account. */
    SzamlazzErrorCode[SzamlazzErrorCode["InvalidInvoicePrefix"] = 202] = "InvalidInvoicePrefix";
    /** The billing account is not usable yet — the owner has not accepted the delegation invite. */
    SzamlazzErrorCode[SzamlazzErrorCode["DelegationNotAccepted"] = 250] = "DelegationNotAccepted";
    /** `nettoErtek` != `nettoEgysegar` * `mennyiseg`. The message names the product. */
    SzamlazzErrorCode[SzamlazzErrorCode["ItemNetValueMismatch"] = 259] = "ItemNetValueMismatch";
    /** `afaErtek` != `nettoErtek` * `afakulcs` / 100. The message names the product. */
    SzamlazzErrorCode[SzamlazzErrorCode["ItemVatValueMismatch"] = 260] = "ItemVatValueMismatch";
    /** `bruttoErtek` != `nettoErtek` + `afaErtek`. The message names the product. */
    SzamlazzErrorCode[SzamlazzErrorCode["ItemGrossValueMismatch"] = 261] = "ItemGrossValueMismatch";
    /** Same as {@link ItemNetValueMismatch}, but the message identifies the item by row number. */
    SzamlazzErrorCode[SzamlazzErrorCode["ItemNetValueMismatchByRow"] = 262] = "ItemNetValueMismatchByRow";
    /** Same as {@link ItemVatValueMismatch}, but the message identifies the item by row number. */
    SzamlazzErrorCode[SzamlazzErrorCode["ItemVatValueMismatchByRow"] = 263] = "ItemVatValueMismatchByRow";
    /** Same as {@link ItemGrossValueMismatch}, but the message identifies the item by row number. */
    SzamlazzErrorCode[SzamlazzErrorCode["ItemGrossValueMismatchByRow"] = 264] = "ItemGrossValueMismatchByRow";
    /** No such pro forma invoice — it was already deleted, or never existed. */
    SzamlazzErrorCode[SzamlazzErrorCode["ProFormaInvoiceNotFound"] = 335] = "ProFormaInvoiceNotFound";
    /** The prefix is already used for invoices, so it cannot be used as a receipt prefix. */
    SzamlazzErrorCode[SzamlazzErrorCode["ReceiptPrefixUsedByInvoices"] = 336] = "ReceiptPrefixUsedByInvoices";
    /** Invalid prefix format — only uppercase letters and digits are allowed. */
    SzamlazzErrorCode[SzamlazzErrorCode["InvalidPrefixFormat"] = 337] = "InvalidPrefixFormat";
    /** The call identifier used to create the receipt already exists. */
    SzamlazzErrorCode[SzamlazzErrorCode["DuplicateReceiptCallId"] = 338] = "DuplicateReceiptCallId";
    /** No such receipt number. */
    SzamlazzErrorCode[SzamlazzErrorCode["ReceiptNotFound"] = 339] = "ReceiptNotFound";
    /** The settled amount of the receipt differs from its gross total. */
    SzamlazzErrorCode[SzamlazzErrorCode["ReceiptPaymentMismatch"] = 340] = "ReceiptPaymentMismatch";
    /** Unaccepted VAT rate value. */
    SzamlazzErrorCode[SzamlazzErrorCode["InvalidVatRate"] = 395] = "InvalidVatRate";
    /** No date on the invoice may be earlier than 2010-01-01. */
    SzamlazzErrorCode[SzamlazzErrorCode["DateTooEarly"] = 396] = "DateTooEarly";
    /** The maximum number of data erasure codes for an item has been reached. */
    SzamlazzErrorCode[SzamlazzErrorCode["TooManyDataErasureCodes"] = 537] = "TooManyDataErasureCodes";
    /** Data erasure codes cannot be used in demo and test accounts. */
    SzamlazzErrorCode[SzamlazzErrorCode["DataErasureCodeNotAllowedInDemo"] = 538] = "DataErasureCodeNotAllowedInDemo";
    /** Data erasure codes are not enabled in the account settings. */
    SzamlazzErrorCode[SzamlazzErrorCode["DataErasureCodeNotEnabled"] = 539] = "DataErasureCodeNotEnabled";
})(SzamlazzErrorCode || (SzamlazzErrorCode = {}));
/**
 * Coarse grouping of {@link SzamlazzErrorCode} values, so business logic can
 * branch without enumerating every code.
 */
export var SzamlazzErrorCategory;
(function (SzamlazzErrorCategory) {
    /** A problem on szamlazz.hu's side. The same request may succeed later. */
    SzamlazzErrorCategory["Service"] = "service";
    /** The credentials were rejected or cannot be used as provided. */
    SzamlazzErrorCategory["Authentication"] = "authentication";
    /** The account blocks the operation: unpaid subscription, missing feature, disabled setting. */
    SzamlazzErrorCategory["Account"] = "account";
    /** The request data is wrong. Sending it again unchanged will fail again. */
    SzamlazzErrorCategory["Validation"] = "validation";
    /** The referenced document does not exist. */
    SzamlazzErrorCategory["NotFound"] = "not_found";
    /** The code is not documented by szamlazz.hu (or none was returned at all). */
    SzamlazzErrorCategory["Unknown"] = "unknown";
})(SzamlazzErrorCategory || (SzamlazzErrorCategory = {}));
const categories = {
    [SzamlazzErrorCode.SystemMaintenance]: SzamlazzErrorCategory.Service,
    [SzamlazzErrorCode.LoginFailed]: SzamlazzErrorCategory.Authentication,
    [SzamlazzErrorCode.MissingData]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.KeystorePasswordRequired]: SzamlazzErrorCategory.Account,
    [SzamlazzErrorCode.UnparsableVatRate]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.MissingXmlFile]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.EInvoiceNotEnabled]: SzamlazzErrorCategory.Account,
    [SzamlazzErrorCode.EInvoiceSigningFailed]: SzamlazzErrorCategory.Account,
    [SzamlazzErrorCode.InvoiceSavedButEmailFailed]: SzamlazzErrorCategory.Service,
    [SzamlazzErrorCode.XmlParseError]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.DuplicateOrderNumber]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.BrowserSessionActive]: SzamlazzErrorCategory.Authentication,
    [SzamlazzErrorCode.SubscriptionProblem]: SzamlazzErrorCategory.Account,
    [SzamlazzErrorCode.DuplicateOrderNumberWithValue]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.MultipleAccountsNotAllowed]: SzamlazzErrorCategory.Authentication,
    [SzamlazzErrorCode.InvalidInvoicePrefix]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.DelegationNotAccepted]: SzamlazzErrorCategory.Account,
    [SzamlazzErrorCode.ItemNetValueMismatch]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.ItemVatValueMismatch]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.ItemGrossValueMismatch]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.ItemNetValueMismatchByRow]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.ItemVatValueMismatchByRow]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.ItemGrossValueMismatchByRow]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.ProFormaInvoiceNotFound]: SzamlazzErrorCategory.NotFound,
    [SzamlazzErrorCode.ReceiptPrefixUsedByInvoices]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.InvalidPrefixFormat]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.DuplicateReceiptCallId]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.ReceiptNotFound]: SzamlazzErrorCategory.NotFound,
    [SzamlazzErrorCode.ReceiptPaymentMismatch]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.InvalidVatRate]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.DateTooEarly]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.TooManyDataErasureCodes]: SzamlazzErrorCategory.Validation,
    [SzamlazzErrorCode.DataErasureCodeNotAllowedInDemo]: SzamlazzErrorCategory.Account,
    [SzamlazzErrorCode.DataErasureCodeNotEnabled]: SzamlazzErrorCategory.Account,
};
/** True when `code` is one of the error codes documented by szamlazz.hu. */
export const isKnownErrorCode = (code) => code in categories;
/** Category of an error code, {@link SzamlazzErrorCategory.Unknown} for undocumented ones. */
export const errorCategory = (code) => categories[code] ?? SzamlazzErrorCategory.Unknown;
/** An error reported by szamlazz.hu itself, carrying its `<hibakod>` error code. */
export class SzamlazzError extends Error {
    name = 'SzamlazzError';
    /**
     * The raw numeric error code from the response. Compare it against
     * {@link SzamlazzErrorCode} — it is `0` when szamlazz.hu reported a failure
     * without a code.
     */
    code;
    /** Coarse classification of {@link code}, for business logic that does not care about exact codes. */
    category;
    /** The unmodified response body, for logging and for codes whose details only appear there. */
    response;
    constructor(code, message, response) {
        super(message);
        this.code = code;
        this.category = errorCategory(code);
        this.response = response;
    }
}
/** Narrows an unknown value caught in a `catch` block to a {@link SzamlazzError}. */
export const isSzamlazzError = (e) => e instanceof SzamlazzError;
/** szamlazz.hu form-encodes the `szlahu_error` header, so spaces arrive as `+`. */
const decodeHeader = (value) => {
    try {
        return decodeURIComponent(value.replace(/\+/g, ' '));
    }
    catch {
        return value;
    }
};
const fromXml = (response) => {
    let root;
    try {
        const doc = convert(response, { format: 'object' });
        root = Object.values(doc).find((v) => v && typeof v === 'object');
    }
    catch {
        return undefined;
    }
    if (!root)
        return undefined;
    const code = textOf(root.hibakod);
    const message = textOf(root.hibauzenet);
    const failed = textOf(root.sikeres) === 'false';
    // Every response schema (invoice, receipt, pro forma, ...) reports failures the same way:
    // <sikeres>false</sikeres> with an optional <hibakod> and <hibauzenet>.
    if (!failed && !code)
        return undefined;
    return new SzamlazzError(Number(code ?? 0) || 0, message ?? `szamlazz.hu request failed (code ${code ?? 'unknown'})`, response);
};
const fromHeaders = (response, headers) => {
    const code = headers.get('szlahu_error_code');
    if (!code)
        return undefined;
    const message = headers.get('szlahu_error');
    return new SzamlazzError(Number(code) || 0, message ? decodeHeader(message) : `szamlazz.hu request failed (code ${code})`, response);
};
/**
 * Plain-text error format used when `valaszVerzio` is 1 or unset:
 * `[ERR] message ---------- t.getMessage(): ...` — only the part before the
 * separator is meaningful, the rest is a Java stack trace.
 */
const fromPlainText = (response) => {
    const match = /\[ERR\]\s*([\s\S]*?)(?:\s*-{5,}|$)/.exec(response);
    if (!match)
        return undefined;
    return new SzamlazzError(0, match[1].trim(), response);
};
/**
 * Extracts the error szamlazz.hu reported, if any.
 *
 * Errors arrive in three shapes depending on the endpoint and `valaszVerzio`:
 * as `<hibakod>`/`<hibauzenet>` in the XML body, as a `[ERR] ...` plain-text
 * body, and in the `szlahu_error_code` / `szlahu_error` response headers. The
 * body wins for the message because the header is truncated to a single
 * sentence, but the header supplies the code when the body has none — which is
 * how the plain-text format is meant to be read.
 *
 * @returns the parsed error, or `undefined` if the response is not an error.
 */
export const parseError = (response, headers) => {
    const body = fromXml(response) ?? fromPlainText(response);
    const header = headers && fromHeaders(response, headers);
    if (!body)
        return header;
    if (body.code || !header?.code)
        return body;
    return new SzamlazzError(header.code, body.message, response);
};
