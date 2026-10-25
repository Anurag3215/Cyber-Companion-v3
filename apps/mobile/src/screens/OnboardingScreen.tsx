import React, { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { AppIntro3D } from '../components/AppIntro3D';

interface OnboardingScreenProps {
  onComplete: () => void;
  onSignIn?: () => void;
  isDark?: boolean;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onSignIn,
  isDark = true,
}) => {
  const [showTour, setShowTour] = useState(false);

  if (showTour) {
    return <AppIntro3D onComplete={onComplete} isDark={isDark} />;
  }

  return (
    <WelcomeScreen
      onGetStarted={onComplete}
      onSignIn={() => {
        if (onSignIn) {
          onSignIn();
        } else {
          onComplete();
        }
      }}
      isDark={isDark}
    />
  );
};
