import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainNavigation} from '../../app';

const LandingPage = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<MainNavigation>;
}) => {
  return (
    <View className="bg-white dark:bg-gray-900 h-full">
      <View className="flex h-full">
        <ScrollView className="p-6">
          <View className="py-8 flex items-center">
            <Image
              className="w-20 h-20"
              source={{
                uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pinclipart.com%2Fpicdir%2Fbig%2F499-4998359_leaves-clipart-green-tea-leaf-leaves-green-tea.png&f=1&nofb=1&ipt=d9a5535ebedbf7cf8fffd28c7d38e9f1e91b918f287cdebc19bcb0523b0ffda0&ipo=images',
              }}
            />
          </View>
          <View className="mb-8">
            <Text className="dark:text-white text-3xl font-extrabold mb-8">
              Join the Pomodoro Park Community and Achieve More!
            </Text>
            <View className="flex gap-4">
              <Text className="dark:text-gray-300 text-lg">
                Welcome to Pomodoro Park, the ultimate productivity companion!
                We are excited to have you join us on this journey towards
                greater productivity and achievement.
              </Text>
              <Text className="dark:text-gray-300 text-lg">
                We understand that life can be busy and it can be difficult to
                stay focused on the tasks that matter most. That's why we've
                designed Pomodoro Park to help you stay on track and make the
                most of your time. With our user-friendly interface and powerful
                productivity tools, you'll be able to set and track your goals,
                stay organized, and stay motivated.
              </Text>
              <Text className="dark:text-gray-300 text-lg">
                Whether you're a student, professional, or just looking to be
                more productive in your personal life, Pomodoro Park has
                everything you need to succeed. So what are you waiting for?
                Let's get started on maximizing your productivity and reaching
                your goals. Sign up for an account today and start reaping the
                benefits of Pomodoro Park!
              </Text>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          className="px-6 py-6 mt-3"
          onPress={() => navigation.navigate('SignIn')}>
          <View className="bg-green-500 p-3 rounded-md">
            <Text className="text-center font-semibold text-gray-900">
              Get Started
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingPage;

