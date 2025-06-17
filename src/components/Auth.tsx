
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthProps {
  embedded?: boolean;
}

const Auth: React.FC<AuthProps> = ({ embedded = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let authError = null;
    let successMessage = '';

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      authError = error;
      if (!error) successMessage = 'Welcome back to your affiliate dashboard!';
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/affiliate-portal`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });
      authError = error;
      if (!error) successMessage = 'Account created! Please check your email for verification.';
    }
    
    setLoading(false);

    if (authError) {
      toast.error(authError.message);
    } else {
      toast.success(successMessage);
      if (!embedded) {
        navigate('/affiliate-portal');
      }
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/20 backdrop-blur-sm border-primary/30 shadow-2xl relative z-10">
      <CardHeader className="text-center pb-8">
        <div className="text-4xl mb-4">💰</div>
        <CardTitle className="text-2xl text-primary">
          {isLogin ? 'Access Affiliate Portal' : 'Join Our Affiliate Program'}
        </CardTitle>
        <p className="text-muted-foreground">
          {isLogin ? 'Login to track your earnings and referrals' : 'Start earning commissions today'}
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="First name"
                    className="pl-10 bg-background/50 border-primary/30 focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Last name"
                    className="pl-10 bg-background/50 border-primary/30 focus:border-primary"
                    required
                  />
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                className="pl-10 bg-background/50 border-primary/30 focus:border-primary"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="pl-10 pr-10 bg-background/50 border-primary/30 focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  className="pl-10 bg-background/50 border-primary/30 focus:border-primary"
                  required
                />
              </div>
            </div>
          )}
          
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 group" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isLogin ? '💰 Access Dashboard' : '🚀 Join Program')}
            {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          </Button>
          
          {isLogin && (
            <div className="text-center">
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot your password?
              </button>
            </div>
          )}
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            {isLogin ? "New to our affiliate program?" : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-semibold mt-2"
          >
            {isLogin ? 'Join the Program' : 'Login to Dashboard'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Auth;
