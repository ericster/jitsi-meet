import React from 'react';
import { Text, View } from 'react-native';

const Hello = () =>
    (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Text>Hellooooo, world!</Text>
        </View>
    );

export default Hello;
