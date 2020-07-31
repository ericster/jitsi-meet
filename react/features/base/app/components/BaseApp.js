// @flow

import { jitsiLocalStorage } from 'js-utils';
import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { i18next } from '../../i18n';
import {
    MiddlewareRegistry,
    PersistenceRegistry,
    ReducerRegistry,
    StateListenerRegistry
} from '../../redux';
import { SoundCollection } from '../../sounds';
import { appWillMount, appWillUnmount } from '../actions';
import logger from '../logger';

declare var APP: Object;

/**
 * The type of the React {@code Component} state of {@link BaseApp}.
 */
type State = {

    /**
     * The {@code Route} rendered by the {@code BaseApp}.
     */
    route: Object,

    /**
     * The redux store used by the {@code BaseApp}.
     */
    store: Object
};

/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
export default class BaseApp extends Component<*, State> {
    _init: Promise<*>;

    /**
     * Initializes a new {@code BaseApp} instance.
     *
     * @param {Object} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: Object) {
        super(props);

        this.state = {
            route: {},
            store: undefined
        };
    }

    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    componentDidMount() {
        /**
         * Make the mobile {@code BaseApp} wait until the {@code AsyncStorage}
         * implementation of {@code Storage} initializes fully.
         *
         * @private
         * @see {@link #_initStorage}
         * @type {Promise}
         */
        this._init = this._initStorage()
            .catch(err => {
                /* BaseApp should always initialize! */
                logger.error(err);
            })
            .then(() => new Promise(resolve => {
                this.setState({
                    store: this._createStore()
                }, resolve);
            }))
            .then(() => this.state.store.dispatch(appWillMount(this)))
            .catch(err => {
                /* BaseApp should always initialize! */
                logger.error(err);
            });
    }

    /**
     * De-initializes the app.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this.state.store.dispatch(appWillUnmount(this));
    }

    /**
     * Delays this {@code BaseApp}'s startup until the {@code Storage}
     * implementation of {@code localStorage} initializes. While the
     * initialization is instantaneous on Web (with Web Storage API), it is
     * asynchronous on mobile/react-native.
     *
     * @private
     * @returns {Promise}
     */
    _initStorage(): Promise<*> {
        const _initializing = jitsiLocalStorage.getItem('_initializing');

        return _initializing || Promise.resolve();
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { route: { component }, store } = this.state;

        if (store) {
            return (
                <I18nextProvider i18n = { i18next }>
                    <Provider store = { store }>
                        <Fragment>
                            { this._createMainElement(component) }
                            <SoundCollection />
                            { this._createExtraElement() }
                            { this._renderDialogContainer() }
                        </Fragment>
                    </Provider>
                </I18nextProvider>
            );
        }

        return null;
    }

    /**
     * Creates an extra {@link ReactElement}s to be added (unconditionaly)
     * alongside the main element.
     *
     * @returns {ReactElement}
     * @abstract
     * @protected
     */
    _createExtraElement() {
        return null;
    }

    /**
     * Creates a {@link ReactElement} from the specified component, the
     * specified props and the props of this {@code AbstractApp} which are
     * suitable for propagation to the children of this {@code Component}.
     *
     * @param {Component} component - The component from which the
     * {@code ReactElement} is to be created.
     * @param {Object} props - The read-only React {@code Component} props with
     * which the {@code ReactElement} is to be initialized.
     * @returns {ReactElement}
     * @protected
     */
    _createMainElement(component, props) {
        console.log('component created: BaseApp');
        console.log(component);
        return component ? React.createElement(component, props || {}) : null;
    }

    /**
     * Initializes a new redux store instance suitable for use by this
     * {@code AbstractApp}.
     *
     * @private
     * @returns {Store} - A new redux store instance suitable for use by
     * this {@code AbstractApp}.
     */
    _createStore() {
        console.log('_createStore with logger');
        // Create combined reducer from all reducers in ReducerRegistry.
        const reducer = ReducerRegistry.combineReducers();

        // Apply all registered middleware from the MiddlewareRegistry and
        // additional 3rd party middleware:
        // - Thunk - allows us to dispatch async actions easily. For more info
        // @see https://github.com/gaearon/redux-thunk.
        // const middlewareList = [ Thunk, createLogger() ];
        let middlewareList = new Array();
        middlewareList[0] = thunk;

        // middleware = MiddlewareRegistry.applyMiddleware(reduxlogger);
        const level = 'log' | 'console' | 'warn' | 'error' | 'info';
        const diff = false;
        const middleware = MiddlewareRegistry.applyMiddleware(thunk, createLogger({
            level,
            diff
        }));

        // MiddlewareRegistry.register(createLogger);

        // Try to enable Redux DevTools Chrome extension in order to make it
        // available for the purposes of facilitating development.
        // let devToolsExtension;
        //
        // if (typeof window === 'object'
        //         && (devToolsExtension = window.devToolsExtension)) {
        //     middleware = compose(middleware, devToolsExtension());
        // }
        const reduxDevtoolsExtensionOptions = {
            // actionSanitizer,
            actionsBlacklist: [
            // actionsWhitelist: [
                'APP_WILL_MOUNT',
                'APP_WILL_UNMOUNT',
                'REGISTER_SOUND',
                'SETTINGS_UPDATED',
                '_SET_APP_STATE_LISTENER',
                'APP_STATE_CHANGED',
                '_SET_AUDIOMODE_SUBSCRIPTIONS',
                'SET_MAX_RECEIVER_VIDEO_QUALITY',
                'PARTICIPANT_JOINED',
                'PARTICIPANT_UPDATED',
                'SET_LOADABLE_AVATAR_URL',
                'ADD_KNOWN_DOMAINS',
                'ONLINE_STATE_CHANGED_EVENT',
                '_STORE_NETWORK_INFO_CLEANUP',
                '_ADD_AUDIO_ELEMENT',
                '_REMOVE_AUDIO_ELEMENT',
                'REGISTER_SOUND',
                'PLAY_SOUND',
                'STOP_SOUND',
                'UNREGISTER_SOUND',
                'SET_AUDIO_MUTED',
                'SET_AUDIO_ONLY',
                'SET_ROOM',
                'TRACK_ADDED',
                'SET_AUDIO_AVAILABLE',
                'SET_CAMERA_FACING_MODE',
                'SET_VIDEO_AVAILABLE',
                'SET_VIDEO_MUTED',
                'CONFERENCE_JOINED',
                'SELECT_LARGE_VIDEO_PARTICIPANT',
                'UPDATE_KNOWN_LARGE_VIDEO_RESOLUTION',
                'SET_FILMSTRIP_ENABLED',
                'SET_TILE_VIEW',
                'SCREEN_SHARE_PARTICIPANTS_UPDATED',
                'PARTICIPANT_ID_CHANGED',
                'SET_FILMSTRIP_ENABLED',
                'SET_NETWORK_INFO',
                '_STORE_NETWORK_INFO_CLEANUP',
                'STORE_NETWORK_INFO_CLEANUP',
                '_SET_IMMERSIVE_LISTENER',
                'CLEAR_NOTIFICATIONS',
                'HIDE_NOTIFICATION',
                'SET_NOTIFICATIONS_ENABLED',
                'SHOW_NOTIFICATION',
                'CONFIG_WILL_LOAD',
                '_UPDATE_CONFIG',
                'LOAD_CONFIG_ERROR',
                'SET_CONFIG',
                'SET_LOCATION_URL',
                'SET_JWT',
                'SET_LOGGING_CONFIG',
                'LIB_WILL_INIT',
                'SET_LOG_COLLECTOR',
                'LIB_DID_DISPOSE',
                'LIB_DID_INIT',
                'LIB_INIT_ERROR',
                'LIB_WILL_DISPOSE',
                'SET_COLOR_SCHEME',
                '_SET_AUDIOMODE_DEVICES',
                '_SET_AUDIOMODE_SUBSCRIPTIONS',
                'UPDATE_FLAGS',
                'CLIENT_RESIZED',
                'SET_ASPECT_RATIO',
                'SET_REDUCED_UI',
                'SET_PENDING_SUBJECT_CHANGE',
                '_STORE_CURRENT_CONFERENCE',
                '_UPDATE_CONFERENCE_DURATION',
                'DELETE_RECENT_LIST_ENTRY',
                'TRACK_NO_DATA_FROM_SOURCE',
                'TRACK_UPDATED',
                'TRACK_ADDED',
                'TRACK_CREATE_ERROR',
                'TRACK_REMOVED',
                'TRACK_WILL_CREATE',
                'CONNECTION_DISCONNECTED',
                'CONNECTION_ESTABLISHED',
                'CONNECTION_FAILED',
                'CONNECTION_WILL_CONNECT',
                'SET_LOCATION_URL',
                'SET_NO_SRC_DATA_NOTIFICATION_UID',
                'UPDATE_DEVICE_LIST',
                'ADD_PENDING_DEVICE_REQUEST',
                'REMOVE_PENDING_DEVICE_REQUESTS',
                'SET_AUDIO_INPUT_DEVICE',
                'SET_VIDEO_INPUT_DEVICE',
                'HIDE_DIALOG',
                'OPEN_DIALOG',
                'CLEAR_MESSAGES',
                'SET_ACTIVE_MODAL_ID',
                'SET_PRIVATE_MESSAGE_RECIPIENT',
                'TOGGLE_CHAT',
                'CONFERENCE_WILL_JOIN',
                'PIN_PARTICIPANT',
                'SET_DOCUMENT_EDITING_STATUS',
                'SET_DOCUMENT_URL',
                'SET_TOOLBOX_ENABLED',
                'SET_TOOLBOX_TIMEOUT',
                'SET_TOOLBOX_ALWAYS_VISIBLE',
                'SET_TOOLBAR_HOVERED',
                'SET_OVERFLOW_MENU_VISIBLE',
                'FULL_SCREEN_CHANGED',
                'CLEAR_TOOLBOX_TIMEOUT',
                'SET_TOOLBOX_TIMEOUT_MS',
                'SET_TOOLBOX_VISIBLE',
                'TOGGLE_TOOLBOX_VISIBLE',
                'SET_CALENDAR_AUTHORIZATION',
                'SET_CALENDAR_EVENTS',
                'SET_PREFERRED_VIDEO_QUALITY',
                // 'ADD_MESSAGE',
                // 'SEND_MESSAGE',
                'TOGGLE_CHAT',
                ''
                                ],
            // actionsWhitelist: [
            //             // 'APP_WILL_MOUNT',
            //             // 'APP_WILL_UNMOUNT',
            //             'REGISTER_SOUND',
            //             'ADD_MESSAGE',
            //             'SEND_MESSAGE',
            //             'TOGGLE_CHAT'
            //         ],
            maxAge: 6
        };
        const composeEnhancers
            = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
                && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(reduxDevtoolsExtensionOptions))
            || compose;


        const store = createStore(
            reducer,
            PersistenceRegistry.getPersistedState(),
            // composeEnhancers(
                middleware,
            // )
        );

        // StateListenerRegistry
        StateListenerRegistry.subscribe(store);

        // This is temporary workaround to be able to dispatch actions from
        // non-reactified parts of the code (conference.js for example).
        // Don't use in the react code!!!
        // FIXME: remove when the reactification is finished!
        if (typeof APP !== 'undefined') {
            APP.store = store;
        }

        return store;
    }

    /**
     * Navigates to a specific Route.
     *
     * @param {Route} route - The Route to which to navigate.
     * @returns {Promise}
     */
    _navigate(route): Promise<*> {
        if (_.isEqual(route, this.state.route)) {
            return Promise.resolve();
        }

        if (route.href) {
            // This navigation requires loading a new URL in the browser.
            window.location.href = route.href;

            return Promise.resolve();
        }

        // XXX React's setState is asynchronous which means that the value of
        // this.state.route above may not even be correct. If the check is
        // performed before setState completes, the app may not navigate to the
        // expected route. In order to mitigate the problem, _navigate was
        // changed to return a Promise.
        return new Promise(resolve => {
            this.setState({ route }, resolve);
        });
    }

    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer: () => React$Element<*>
}
