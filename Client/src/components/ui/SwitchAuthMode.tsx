interface SwitchAuthModeProps {
  text: string;
  linkText: string;
  onClick: () => void;
}

export const SwitchAuthMode: React.FC<SwitchAuthModeProps> = ({ text, linkText, onClick }) => {
  return (
    <div className='text-center mt-8 pt-6 border-t border-border/50'>
      <p className='text-sm text-muted-foreground flex items-center justify-center gap-2'>
        <span>{text}</span>
        <button
          type='button'
          onClick={onClick}
          className='
            font-semibold text-primary hover:text-primary/90 
            smooth-transition focus-ring rounded-md
            px-2 py-1 -mx-2 hover:bg-primary/5
            relative group
          '
        >
          {linkText}

          {/* Animated underline effect */}
          <span
            className='
            absolute bottom-0 left-0 w-0 h-0.5 bg-primary 
            group-hover:w-full smooth-transition
          '
          />
        </button>
      </p>

      {/* Decorative dots */}
      <div className='flex items-center justify-center gap-1 mt-4 opacity-40'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='w-1 h-1 bg-muted-foreground rounded-full' />
        ))}
      </div>
    </div>
  );
};
