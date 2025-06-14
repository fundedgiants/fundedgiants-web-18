
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auth form submitted:', { isLogin, formData });
  };

  return (
    <div className="min-h-screen bg-background bg-stars flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      
      <Card className="w-full max-w-md bg-card/20 backdrop-blur-sm border-primary/30 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-8">
          <div className="text-4xl mb-4">⚡</div>
          <CardTitle className="text-2xl text-primary">
            {isLogin ? 'Enter the Divine Realm' : 'Join the Cosmic Giants'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isLogin ? 'Welcome back, divine trader' : 'Begin your ascension to trading godhood'}
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
                  />
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 group">
              {isLogin ? '⚡ Enter Divine Realm' : '🚀 Begin Ascension'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {isLogin && (
              <div className="text-center">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot your divine password?
                </button>
              </div>
            )}
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "New to the cosmic realm?" : "Already a divine trader?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-semibold mt-2"
            >
              {isLogin ? 'Join the Giants' : 'Enter the Realm'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
