/// <reference types="nativewind/types" />

export type WelcomeNavigation = {
  LandingPage: undefined;
  SignIn: undefined;
  CreateAccount: undefined;
};

export type UserData = {
  [date: string]: {
    pomodoros: number;
  };
  startedAt: string;
};
