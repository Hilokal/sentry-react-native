import { makePromiseBuffer } from '@sentry/utils';
import { NATIVE } from '../wrapper';
/** Native Transport class implementation */
export class NativeTransport {
    constructor() {
        /** A simple buffer holding all requests. */
        this._buffer = makePromiseBuffer(30);
    }
    /**
     * Sends the envelope to the Store endpoint in Sentry.
     *
     * @param envelope Envelope that should be sent to Sentry.
     */
    send(envelope) {
        return this._buffer.add(() => NATIVE.sendEnvelope(envelope));
    }
    /**
     * Wait for all envelopes to be sent or the timeout to expire, whichever comes first.
     *
     * @param timeout Maximum time in ms the transport should wait for envelopes to be flushed. Omitting this parameter will
     *   cause the transport to wait until all events are sent before resolving the promise.
     * @returns A promise that will resolve with `true` if all events are sent before the timeout, or `false` if there are
     * still events in the queue when the timeout is reached.
     */
    flush(timeout) {
        return this._buffer.drain(timeout);
    }
}
/**
 * Creates a Native Transport.
 */
export function makeReactNativeTransport() { return new NativeTransport(); }
//# sourceMappingURL=native.js.map