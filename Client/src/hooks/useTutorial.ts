import { TutorialContext } from 'contexts/TutorialContext.ts';
import { useContext } from 'react';

export const useTutorial = () => useContext(TutorialContext);
