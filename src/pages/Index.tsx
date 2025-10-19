import { Button } from '@/components/ui/button';
import { Anchor, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-ocean p-4">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm mb-6">
          <Anchor className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">ReelDeal</h1>
        <p className="text-xl text-white/90 mb-8">Premium Fishing Equipment Store</p>
        <p className="text-white/70 mb-8 max-w-lg mx-auto">
          Your trusted source for professional-grade fishing gear. From rods to lures, we've got everything you need for the perfect catch.
        </p>
        <Button 
          onClick={() => navigate('/admin/login')} 
          size="lg"
          className="gap-2 bg-white text-primary hover:bg-white/90"
        >
          <Lock className="w-5 h-5" />
          Admin Access
        </Button>
      </div>
    </div>
  );
};

export default Index;
