import React from 'react';
import { AppIntro3D } from '../components/AppIntro3D';

interface OnboardingScreenProps {
  onComplete: () => void;
  isDark?: boolean;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  isDark = true,
}) => {
  return <AppIntro3D onComplete={onComplete} isDark={isDark} />;
};
