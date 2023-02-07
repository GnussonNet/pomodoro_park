import React, {useCallback, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import UserStack from './UserStack';
import WelcomeStack from './WelcomeStack';

const RootStack = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = useCallback(
    (newUserData: any) => {
      setUser(newUserData);
      if (initializing) {
        setInitializing(false);
      }
    },
    [initializing],
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  if (initializing) {
    return null;
  }

  return user ? <UserStack /> : <WelcomeStack />;
};

export default RootStack;
