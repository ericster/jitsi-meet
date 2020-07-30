import { Icon } from '@components';
import { BaseColor, useTheme, useFont } from '@config';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AboutUs from '@screens/AboutUs';
import Category from '@screens/Category';
import ChangeLanguage from '@screens/ChangeLanguage';
import ChangePassword from '@screens/ChangePassword';
import Feedback from '@screens/Feedback';
import Home from '@screens/Home';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

/* Bottom Screen */
import Notification from '@screens/Notification';
import Wishlist from '@screens/Wishlist';
import Messenger from '@screens/Messenger';
import Profile from '@screens/Profile';

/* Stack Screen */
import ThemeSetting from '@screens/ThemeSetting';
import Setting from '@screens/Setting';
import Place from '@screens/Place';
import SignUp from '@screens/SignUp';
import SignIn from '@screens/SignIn';
import Review from '@screens/Review';
import Messages from '@screens/Messages';
import Walkthrough from '@screens/Walkthrough';
import ResetPassword from '@screens/ResetPassword';
import ProfileEdit from '@screens/ProfileEdit';
import PlaceDetail from '@screens/PlaceDetail';
import ContactUs from '@screens/ContactUs';

const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function Main() {
    return (
        <MainStack.Navigator
            headerMode = 'none'
            initialRouteName = 'BottomTabNavigator'>
            <MainStack.Screen
                name = 'BottomTabNavigator'
                component = { BottomTabNavigator } />
            <MainStack.Screen
                name = 'ThemeSetting'
                component = { ThemeSetting } />
            <MainStack.Screen
                name = 'Setting'
                component = { Setting } />
            <MainStack.Screen
                name = 'Category'
                component = { Category } />
            <MainStack.Screen
                name = 'Place'
                component = { Place } />
            <MainStack.Screen
                name = 'Walkthrough'
                component = { Walkthrough } />
            <MainStack.Screen
                name = 'SignUp'
                component = { SignUp } />
            <MainStack.Screen
                name = 'SignIn'
                component = { SignIn } />
            <MainStack.Screen
                name = 'Messenger'
                component = { Messenger } />
            <MainStack.Screen
                name = 'Review'
                component = { Review } />
            <MainStack.Screen
                name = 'Feedback'
                component = { Feedback } />
            <MainStack.Screen
                name = 'Messages'
                component = { Messages } />
            <MainStack.Screen
                name = 'Notification'
                component = { Notification } />
            <MainStack.Screen
                name = 'ResetPassword'
                component = { ResetPassword } />
            <MainStack.Screen
                name = 'ChangePassword'
                component = { ChangePassword } />
            <MainStack.Screen
                name = 'ProfileEdit'
                component = { ProfileEdit } />
            <MainStack.Screen
                name = 'ChangeLanguage'
                component = { ChangeLanguage } />
            <MainStack.Screen
                name = 'PlaceDetail'
                component = { PlaceDetail } />
            <MainStack.Screen
                name = 'ContactUs'
                component = { ContactUs } />
            <MainStack.Screen
                name = 'AboutUs'
                component = { AboutUs } />
        </MainStack.Navigator>
    );
}

function BottomTabNavigator() {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const font = useFont();
    const auth = useSelector(state => state.auth);
    const login = auth.login.success;

    return (
        <BottomTab.Navigator
            initialRouteName = 'Home'
            headerMode = 'none'
            tabBarOptions = {{
                showIcon: true,
                showLabel: true,
                activeTintColor: colors.primary,
                inactiveTintColor: BaseColor.grayColor,
                style: { borderTopWidth: 1 },
                labelStyle: {
                    fontSize: 12,
                    fontFamily: font
                }
            }}>
            <BottomTab.Screen
                name = 'Home'
                component = { Home }
                options = {{
                    title: t('home'),
                    tabBarIcon: ({ color }) => (<Icon
                        color = { color }
                        name = 'home'
                        size = { 20 }
                        solid = { true } />)
                }} />

            <BottomTab.Screen
                name = 'Wishlist'
                component = { Wishlist }
                options = {{
                    title: t('wishlist'),
                    tabBarIcon: ({ color }) => (<Icon
                        color = { color }
                        name = 'bookmark'
                        size = { 20 }
                        solid = { true } />)
                }} />
            <BottomTab.Screen
                name = 'Messenger'
                component = { Messenger }
                options = {{
                    title: t('messenger'),
                    tabBarIcon: ({ color }) => (<Icon
                        color = { color }
                        name = 'envelope'
                        size = { 20 }
                        solid = { true } />)
                }} />
            <BottomTab.Screen
                name = 'Notification'
                component = { Notification }
                options = {{
                    title: t('notification'),
                    tabBarIcon: ({ color }) => (<Icon
                        color = { color }
                        name = 'bell'
                        size = { 20 }
                        solid = { true } />)
                }} />
            <BottomTab.Screen
                name = 'Profile'
                component = { login ? Profile : Walkthrough }
                options = {{
                    title: t('account'),
                    tabBarIcon: ({ color }) => (<Icon
                        solid = { true }
                        color = { color }
                        name = 'user-circle'
                        size = { 20 } />)
                }} />
        </BottomTab.Navigator>
    );
}
