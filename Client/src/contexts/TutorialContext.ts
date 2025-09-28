import { createContext } from 'react';

interface TutorialContextType {
  startTutorial: () => void;
}
export const TutorialContext = createContext<TutorialContextType>({ startTutorial: () => {} });
