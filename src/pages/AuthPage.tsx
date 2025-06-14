
import Auth from '@/components/Auth';

const AuthPage = () => {
    return (
        <div className="min-h-screen bg-background bg-stars flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-cosmic-gradient"></div>
            <Auth className="bg-card/20 backdrop-blur-sm border-primary/30 shadow-2xl relative z-10" />
        </div>
    );
};

export default AuthPage;
