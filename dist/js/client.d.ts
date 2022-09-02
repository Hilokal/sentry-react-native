import { BaseClient } from '@sentry/core';
import { Event, EventHint, SeverityLevel } from '@sentry/types';
import { ReactNativeClientOptions } from './options';
/**
 * The Sentry React Native SDK Client.
 *
 * @see ReactNativeClientOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
export declare class ReactNativeClient extends BaseClient<ReactNativeClientOptions> {
    private readonly _browserClient;
    /**
     * Creates a new React Native SDK instance.
     * @param options Configuration options for this SDK.
     */
    constructor(options: ReactNativeClientOptions);
    /**
     * @inheritDoc
     */
    eventFromException(_exception: unknown, _hint?: EventHint): PromiseLike<Event>;
    /**
     * @inheritDoc
     */
    eventFromMessage(_message: string, _level?: SeverityLevel, _hint?: EventHint): PromiseLike<Event>;
    /**
     * If native client is available it will trigger a native crash.
     * Use this only for testing purposes.
     */
    nativeCrash(): void;
    /**
     * @inheritDoc
     */
    close(): PromiseLike<boolean>;
    /**
   * Starts native client with dsn and options
   */
    private _initNativeSdk;
    /**
     * If the user is in development mode, and the native nagger is enabled then it will show an alert.
     */
    private _showCannotConnectDialog;
}
//# sourceMappingURL=client.d.ts.map