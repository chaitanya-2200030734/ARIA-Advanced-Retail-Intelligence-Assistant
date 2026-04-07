import 'react-native-gesture-handler'
import { useEffect, useState } from 'react'
import { LogBox } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons } from '@expo/vector-icons'
import * as SplashScreen from 'expo-splash-screen'

// Suppress known warnings
LogBox.ignoreLogs([
  'Expo AV has been deprecated',
  'Cannot read property \'Base64\'',
  'Non-serializable values were found in the navigation state',
])

import { AuthProvider } from './src/context/AuthContext'
import { useAuth } from './src/hooks/useAuth'

// Auth screens
import LandingScreen from './src/screens/auth/LandingScreen'
import LoginScreen from './src/screens/auth/LoginScreen'
import SignupScreen from './src/screens/auth/SignupScreen'
import ShopOwnerSignupScreen from './src/screens/auth/ShopOwnerSignupScreen'

// Admin screens
import DashboardScreen from './src/screens/admin/DashboardScreen'
import InventoryScreen from './src/screens/admin/InventoryScreen'
import SalesScreen from './src/screens/admin/SalesScreen'
import CustomersScreen from './src/screens/admin/CustomersScreen'
import InsightsScreen from './src/screens/admin/InsightsScreen'

// User screens
import UserDashboardScreen from './src/screens/user/UserDashboardScreen'
import ProductsScreen from './src/screens/user/ProductsScreen'
import CartScreen from './src/screens/user/CartScreen'

// Common screens
import ChatScreen from './src/screens/common/ChatScreen'
import ProfileScreen from './src/screens/common/ProfileScreen'

SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// ─── Auth navigator ───────────────────────────────────────────────────────────
function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ShopOwnerSignup" component={ShopOwnerSignupScreen} />
    </Stack.Navigator>
  )
}

// ─── Admin tabs ───────────────────────────────────────────────────────────────
function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: '#F5F2ED' },
        headerTitleStyle: { color: '#1C1814', fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: 'dashboard',
            Inventory: 'inventory-2',
            Sales: 'trending-up',
            Customers: 'people',
            Insights: 'insights',
            'ARIA Chat': 'chat',
          }
          return <MaterialIcons name={icons[route.name] || 'circle'} size={size} color={color} />
        },
        tabBarActiveTintColor: '#C97B2E',
        tabBarInactiveTintColor: '#8A8278',
        tabBarStyle: { backgroundColor: '#F5F2ED', borderTopColor: '#D8D2C8' },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="ARIA Chat" component={ChatScreen} />
    </Tab.Navigator>
  )
}

// ─── User tabs ────────────────────────────────────────────────────────────────
function UserNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: '#F5F2ED' },
        headerTitleStyle: { color: '#1C1814', fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Shop: 'shopping-bag',
            Cart: 'shopping-cart',
            'ARIA Chat': 'chat',
            Profile: 'person',
          }
          return <MaterialIcons name={icons[route.name] || 'circle'} size={size} color={color} />
        },
        tabBarActiveTintColor: '#C97B2E',
        tabBarInactiveTintColor: '#8A8278',
        tabBarStyle: { backgroundColor: '#F5F2ED', borderTopColor: '#D8D2C8' },
      })}
    >
      <Tab.Screen name="Home" component={UserDashboardScreen} />
      <Tab.Screen name="Shop" component={ProductsScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="ARIA Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

// ─── Root navigator ───────────────────────────────────────────────────────────
function RootNavigator() {
  const { user, role, loading } = useAuth()

  if (loading) return null

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : role === 'admin' ? (
        <AdminNavigator />
      ) : (
        <UserNavigator />
      )}
    </NavigationContainer>
  )
}

// ─── App entry ────────────────────────────────────────────────────────────────
export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
      } finally {
        setReady(true)
        await SplashScreen.hideAsync()
      }
    }
    prepare()
  }, [])

  if (!ready) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
