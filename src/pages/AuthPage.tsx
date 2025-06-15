
import Auth from '@/components/Auth';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-background bg-stars flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      <Auth />
    </div>
  );
};

export default AuthPage;
