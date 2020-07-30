// import 'react-native-gesture-handler';

// Apply all necessary polyfills as early as possible to make sure anything imported henceforth
// sees them.
import './features/mobile/polyfills';

// import React, { PureComponent } from 'react';
import { AppRegistry } from 'react-native';

// import { JitsiApp } from './features/app-jitsi/components';
// import { App } from './features/app-main/index.js';
import  App  from './features/app-main/index.js';
// import { _initLogging } from './features/base/logging/functions';
import { IncomingCallApp } from './features/mobile/incoming-call';

declare var __DEV__;

/**
 * The type of the React {@code Component} props of {@link Root}.
 */
// type Props = {
//
//     /**
//      * The URL, if any, with which the app was launched.
//      */
//     url: Object | string
// };

/**
 * React Native doesn't support specifying props to the main/root component (in
 * the JS/JSX source code). So create a wrapper React Component (class) around
 * features/app's App instead.
 *
 * @extends Component
 */
// class JitsiRoot extends PureComponent<Props> {
//     /**
//      * Implements React's {@link Component#render()}.
//      *
//      * @inheritdoc
//      * @returns {ReactElement}
//      */
//     render() {
//         return (
//             <JitsiApp
//                 { ...this.props } />
//         );
//     }
// }

// Initialize logging.
// _initLogging();
console.log('index.native.js');

// HORRIBLE HACK ALERT! React Native logs the initial props with `console.log`. Here we are quickly patching it
// to avoid logging potentially sensitive information.
if (!__DEV__) {
    /* eslint-disable */

    const __orig_console_log = console.log;
    const __orig_appregistry_runapplication = AppRegistry.runApplication;

    AppRegistry.runApplication = (...args) => {
        // $FlowExpectedError
        console.log = () => {};
        __orig_appregistry_runapplication(...args);
        // $FlowExpectedError
        console.log = __orig_console_log;
    };

    /* eslint-enable */
}

// Register the main Component of JitsiMeetView.
AppRegistry.registerComponent('App', () => App);

// Register the jitsi main/root Component of JitsiMeetView.
// AppRegistry.registerComponent('JitsiApp', () => JitsiRoot);

// Register the main/root Component of IncomingCallView.
// AppRegistry.registerComponent('IncomingCallApp', () => IncomingCallApp);
