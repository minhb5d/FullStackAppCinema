import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen'; // Import SplashScreen
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import MovieDetailScreen from './screens/MovieDetailScreen';
import AccountScreen from './screens/Account/AccountScreen';
import AccountInfoScreen from './screens/Account/AccountInfoScreen';
import ChangePasswordScreen from './screens/Account/ChangePasswordScreen';
import SelectSeatScreen from './screens/SelectSeatScreen';
import PurchasedTicketScreen from "./screens/PurchasedTicketScreen";
import TicketDetailScreen from './screens/TicketDetailScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import AccountMemberScreen from './screens/Account/AccountMemberScreen';
import AccountPointScreen from './screens/Account/AccountPointScreen';
import AccountGiftScreen from './screens/Account/AccountGiftScreen';
import { UserProvider } from './context/UserContext';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    'Roboto': require('./assets/fonts/Roboto/static/Roboto-Regular.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto/static/Roboto-Bold.ttf'),
    'Roboto-Italic': require('./assets/fonts/Roboto/static/Roboto-Italic.ttf'),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Giữ màn hình Splash hiển thị cho đến khi app sẵn sàng
        await SplashScreen.preventAutoHideAsync();
        // Tải các tài nguyên cần thiết (nếu có)
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && appIsReady) {
      // Ẩn màn hình Splash khi app đã sẵn sàng
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, appIsReady]);

  if (!fontsLoaded || !appIsReady) {
    return null; // Hiển thị màn hình Splash cho đến khi app sẵn sàng
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{}}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AccountInfo" component={AccountInfoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SelectSeat" component={SelectSeatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PurchasedTicket" component={PurchasedTicketScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AccountMember" component={AccountMemberScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AccountPoint" component={AccountPointScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AccountGift" component={AccountGiftScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
