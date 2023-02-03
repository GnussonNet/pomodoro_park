import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainNavigation } from '../../app';

const SignIn = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<MainNavigation>;
}) => {
  return (
    <View className='bg-white dark:bg-gray-900 h-full p-6'>
      <ScrollView>

        <View className='py-8 flex items-center'>
          <Image className='w-20 h-20' source={{ uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pinclipart.com%2Fpicdir%2Fbig%2F499-4998359_leaves-clipart-green-tea-leaf-leaves-green-tea.png&f=1&nofb=1&ipt=d9a5535ebedbf7cf8fffd28c7d38e9f1e91b918f287cdebc19bcb0523b0ffda0&ipo=images" }} />
        </View>
        <View className='mb-8'>
          <Text className='dark:text-white text-3xl font-extrabold mb-5'>
            Sign in to account
          </Text>
          <Text className='dark:text-gray-400'>Welcome to Pomodoro Park! Let's get started on maximizing your productivity.</Text>
        </View>
        <View className='flex gap-8'>
          <View>
            <View className='mb-4'>
              <Text className='dark:text-white mb-2'>Email</Text>
              <TextInput className='bg-gray-800 p-3 rounded-md text-white' keyboardType='email-address' placeholder='Email address' />
            </View>
            <View>
              <Text className='dark:text-white mb-2'>Password</Text>
              <TextInput className='bg-gray-800 p-3 rounded-md text-white' secureTextEntry placeholder='Password' />
            </View>
            <TouchableOpacity>
              <View className='flex items-end pt-2'>
                <Text className='text-white'>Forgot password?</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <View className='bg-green-500 p-3 rounded-md'>
              <Text className='text-center font-semibold text-gray-900'>Continue</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className='mt-12'>
          <Text className='text-center text-white'>New member? <Text className='font-bold'>Create free account</Text></Text>
        </TouchableOpacity>
      </ScrollView>
      <Text className='text-center text-gray-300 mt-6'>By using Pomodoro Park, you agree to the <TouchableOpacity><Text className='underline text-gray-300 flex'>terms and conditions</Text></TouchableOpacity> and concent to our use of cookies in accordance with the terms of our privacy policy.</Text>
    </View>
  )
}

export default SignIn