import { __awaiter } from "tslib";
import { BrowserClient, defaultStackParser, makeFetchTransport } from '@sentry/browser';
import { BaseClient } from '@sentry/core';
// @ts-ignore LogBox introduced in RN 0.63
import { Alert, LogBox, YellowBox } from 'react-native';
import { NativeTransport } from './transports/native';
import { NATIVE } from './wrapper';
/**
 * The Sentry React Native SDK Client.
 *
 * @see ReactNativeClientOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
export class ReactNativeClient extends BaseClient {
    /**
     * Creates a new React Native SDK instance.
     * @param options Configuration options for this SDK.
     */
    constructor(options) {
        if (!options.transport) {
            options.transport = (options, nativeFetch) => {
                if (NATIVE.isNativeTransportAvailable()) {
                    return new NativeTransport();
                }
                return makeFetchTransport(options, nativeFetch);
            };
        }
        super(options);
        // This is a workaround for now using fetch on RN, this is a known issue in react-native and only generates a warning
        // YellowBox deprecated and replaced with with LogBox in RN 0.63
        if (LogBox) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            LogBox.ignoreLogs(['Require cycle:']);
        }
        else {
            // eslint-disable-next-line deprecation/deprecation
            YellowBox.ignoreWarnings(['Require cycle:']);
        }
        this._browserClient = new BrowserClient({
            dsn: options.dsn,
            transport: options.transport,
            stackParser: options.stackParser || defaultStackParser,
            integrations: [],
        });
        void this._initNativeSdk();
    }
    /**
     * @inheritDoc
     */
    eventFromException(_exception, _hint) {
        return this._browserClient.eventFromException(_exception, _hint);
    }
    /**
     * @inheritDoc
     */
    eventFromMessage(_message, _level, _hint) {
        return this._browserClient.eventFromMessage(_message, _level, _hint);
    }
    /**
     * If native client is available it will trigger a native crash.
     * Use this only for testing purposes.
     */
    nativeCrash() {
        NATIVE.nativeCrash();
    }
    /**
     * @inheritDoc
     */
    close() {
        // As super.close() flushes queued events, we wait for that to finish before closing the native SDK.
        return super.close().then((result) => {
            return NATIVE.closeNativeSdk().then(() => result);
        });
    }
    /**
   * Starts native client with dsn and options
   */
    _initNativeSdk() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let didCallNativeInit = false;
            try {
                didCallNativeInit = yield NATIVE.initNativeSdk(this._options);
            }
            catch (_) {
                this._showCannotConnectDialog();
                (_b = (_a = this._options).onReady) === null || _b === void 0 ? void 0 : _b.call(_a, { didCallNativeInit: false });
                return;
            }
            (_d = (_c = this._options).onReady) === null || _d === void 0 ? void 0 : _d.call(_c, { didCallNativeInit });
        });
    }
    /**
     * If the user is in development mode, and the native nagger is enabled then it will show an alert.
     */
    _showCannotConnectDialog() {
        if (__DEV__ && this._options.enableNativeNagger) {
            Alert.alert('Sentry', 'Warning, could not connect to Sentry native SDK.\nIf you do not want to use the native component please pass `enableNative: false` in the options.\nVisit: https://docs.sentry.io/platforms/react-native/#linking for more details.');
        }
    }
}
//# sourceMappingURL=client.js.map