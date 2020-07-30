import { store, persistor } from './store';
import React from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Navigator from './navigation/index.js';

// console.disableYellowBox = true;

// eslint-disable-next-line require-jsdoc
export default function App() {
    return (
        <Provider store = { store }>
             <PersistGate
                 loading = { null }
                 persistor = { persistor }>
                 <Navigator />
        {/*             <View*/}
        {/*                 style={{*/}
        {/*                     flex: 1,*/}
        {/*                     backgroundColor: 'white',*/}
        {/*                     justifyContent: 'center',*/}
        {/*                     alignItems: 'center'*/}
        {/*                 }}>*/}
        {/*                 <Text>Hello, Nav2 !</Text>*/}
        {/*             </View>*/}
              </PersistGate>
         </Provider>
    );

}

// const App = () =>
//     (
//         <View
//             style={{
//                 flex: 1,
//                 backgroundColor: 'white',
//                 justifyContent: 'center',
//                 alignItems: 'center'
//             }}>
//             <Text>Hello, world2 !</Text>
//         </View>
//     );
//
// export default App;
