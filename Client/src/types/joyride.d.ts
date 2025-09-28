/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-joyride' {
  import * as React from 'react';
  import { Component } from 'react';

  export interface Step {
    target: string;
    content: React.ReactNode;
    [key: string]: any;
  }

  interface JoyrideProps {
    steps: Step[];
    continuous?: boolean;
    [key: string]: any;
  }

  export default class Joyride extends Component<JoyrideProps> {}
}
