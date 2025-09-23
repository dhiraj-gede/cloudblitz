import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        {isLoginMode ? (
          <LoginForm
            onSuccess={() => {
              // Handle successful login
              console.log('Login successful');
            }}
            onSwitchToRegister={() => setIsLoginMode(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={() => {
              // Handle successful registration
              console.log('Registration successful');
            }}
            onSwitchToLogin={() => setIsLoginMode(true)}
          />
        )}
      </div>
    </div>
  );
};