// import 'react-native-gesture-handler';
import { useTheme, BaseSetting } from '@config';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ChooseLocation from '@screens/ChooseLocation';
import Filter from '@screens/Filter';
import Loading from '@screens/Loading';
import PreviewImage from '@screens/PreviewImage';
import SearchHistory from '@screens/SearchHistory';
import SelectDarkOption from '@screens/SelectDarkOption';
import i18n from 'i18next';
import React, { useEffect } from 'react';
import { initReactI18next } from 'react-i18next';
import { Text, View, StatusBar } from 'react-native';
import { DarkModeProvider, useDarkMode } from 'react-native-dark-mode';
import SplashScreen from 'react-native-splash-screen';
import { useSelector } from 'react-redux';

/* Main Stack Navigator */
import Main from './main';
import Hello from '../../app-jitsi/components/hello';


/* Modal Screen only affect iOS */
import SelectFontOption from '@screens/SelectFontOption';

const RootStack = createStackNavigator();

export default function Navigator() {
    const storeLanguage = useSelector(state => state.application.language);
    const { theme, colors } = useTheme();
    const isDarkMode = useDarkMode();

    const forFade = ({ current, closing }) => {
        return {
            cardStyle: {
                opacity: current.progress
            }
        };
    };

    useEffect(() => {
        i18n.use(initReactI18next).init({
            resources: BaseSetting.resourcesLanguage,
            lng: storeLanguage ?? BaseSetting.defaultLanguage,
            fallbackLng: BaseSetting.defaultLanguage
        });
        SplashScreen.hide();
        StatusBar.setBackgroundColor(colors.primary, true);
        StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    }, []);

    return (

        // <View
        //     style={{
        //         flex: 1,
        //         backgroundColor: 'white',
        //         justifyContent: 'center',
        //         alignItems: 'center'
        //     }}>
        //     <Text>Hello, Navigator !</Text>
        // </View>
        <DarkModeProvider>
            <NavigationContainer theme = { theme }>
                <RootStack.Navigator
                    mode = 'modal'
                    headerMode = 'none'
                    initialRouteName = 'Loading'>
                    <RootStack.Screen
                        name = 'Loading'
                        component = { Loading }
                        options = {{ gestureEnabled: false }} />
                    <RootStack.Screen
                        name = 'Main'
                        component = { Main } />
                    <RootStack.Screen
                        name = 'Filter'
                        component = { Filter } />
                    <RootStack.Screen
                        name = 'ChooseLocation'
                        component = { ChooseLocation } />
                    <RootStack.Screen
                        name = 'SearchHistory'
                        component = { SearchHistory } />
                    <RootStack.Screen
                        name = 'PreviewImage'
                        component = { PreviewImage } />
                    <RootStack.Screen
                        name = 'SelectDarkOption'
                        component = { SelectDarkOption }
                        gestureEnabled = { false }
                        options = {{
                            cardStyleInterpolator: forFade,
                            cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
                        }} />
                    <RootStack.Screen
                        name = 'SelectFontOption'
                        component = { SelectFontOption }
                        gestureEnabled = { false }
                        options = {{
                            cardStyleInterpolator: forFade,
                            cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
                        }} />
                </RootStack.Navigator>
            </NavigationContainer>
        </DarkModeProvider>
    );
}
