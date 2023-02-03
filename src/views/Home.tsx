import { View} from 'react-native'
import React from 'react'
import CountdownTimer from "../components/CountdownTimer";

const Home = () => {
  return (
    <View className='bg-white dark:bg-gray-900 px-8 py-4 h-full'>
      <View className='mt-auto'>
        <CountdownTimer />
      </View>
    </View>
  )
}

export default Home