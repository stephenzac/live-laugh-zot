interface LoginPageContainerProps {
  children?: React.ReactNode;
}

export const MainContainer: React.FC<LoginPageContainerProps> = ({
  children,
}) => (
  <div className='min-h-screen flex flex-col'>
    <main className='bg-orange-200 w-screen h-max flex-grow flex flex-col items-center pt-16'>
      {children}
    </main>
  </div>
);
