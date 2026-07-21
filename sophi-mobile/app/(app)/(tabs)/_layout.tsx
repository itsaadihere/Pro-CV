import { Tabs } from 'expo-router';
import { LayoutDashboard, PlusCircle, Bot, Target, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f2b48',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create CV',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Coach',
          tabBarIcon: ({ color, size }) => <Bot color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="ats-checker"
        options={{
          title: 'ATS Scanner',
          tabBarIcon: ({ color, size }) => <Target color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 22} />,
        }}
      />
    </Tabs>
  );
}
