import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Joyride from 'react-joyride';
import type { Step } from 'react-joyride';
import type { CallBackProps } from 'react-joyride';
import { useAuth } from '../hooks/useAuth.ts';
import { updateUser } from '../services/api.ts';
import { TutorialContext } from './TutorialContext.ts';

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [run, setRun] = useState(false);

  // Start tutorial automatically for new users
  React.useEffect(() => {
    if (user && user.hasSeenTutorial === false) {
      setRun(true);
    }
    console.log('User in TutorialProvider:', user);
  }, [user]);

  // User dashboard tutorial steps
  const steps: Step[] = [
    {
      target: '.dashboard-tutorial',
      content: 'Welcome to CloudBlitz! Here’s how to manage your enquiries.',
      placement: 'center',
    },
    {
      target: '.navbar-tutorial',
      content: 'Use the navigation bar to access your dashboard, profile, and logout.',
      placement: 'bottom',
    },
    {
      target: '.dashboard-tutorial',
      content: 'This is your dashboard. Here you’ll see all your enquiries.',
      placement: 'center',
    },
    {
      target: '.searchbar-tutorial',
      content: 'Use search and filters to quickly find specific enquiries.',
      placement: 'bottom',
    },
    {
      target: '.enquiry-table-tutorial',
      content: 'Click any enquiry to view its details.',
      placement: 'top',
    },
    {
      target: '.new-enquiry-tutorial',
      content: 'Click here to submit a new enquiry.',
      placement: 'bottom',
    },
    {
      target: '.dashboard-tutorial',
      content: 'You’re all set! You can restart this tutorial anytime from your profile.',
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = async (data: CallBackProps) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      setRun(false);
      if (user && typeof user?.hasSeenTutorial === 'boolean' && !user?.hasSeenTutorial) {
        await updateUser(user.id, { hasSeenTutorial: true });
        if (refreshUser) refreshUser();
      }
    }
  };

  return (
    <TutorialContext.Provider value={{ startTutorial: () => setRun(true) }}>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        styles={{ options: { zIndex: 10000 } }}
      />
      {children}
    </TutorialContext.Provider>
  );
};
