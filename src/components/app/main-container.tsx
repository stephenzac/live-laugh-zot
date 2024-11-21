interface LoginPageContainerProps {
  children?: React.ReactNode;
}

export const MainContainer: React.FC<LoginPageContainerProps> = ({
  children,
}) => (
  <main className='bg-orange-200 w-screen h-screen flex flex-col items-center pt-16 pb-24'>
    {children}
  </main>
);
