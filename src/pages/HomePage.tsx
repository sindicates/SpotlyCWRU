import { useState, useEffect } from 'react';
// Adding full file extensions in case the build tool needs them
import  supabase  from '../lib/supabaseClient.ts'; 
import { useSession } from '../hooks/useAuth.tsx'; 
import LoadingPage from './LoadingPage.tsx'; 
import { Navigate } from 'react-router-dom';
import OnboardingFlow from '../components/OnboardingFlow.tsx';
// import Dashboard from '../components/Dashboard.tsx'; 

const HomePage = () => {
  const { session } = useSession();
  const user = session?.user;

  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    const fetchProfile = async () => {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
      } else {
        setProfile(data);
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [user]); 

  if (loadingProfile) {
    return <LoadingPage />;
  }
  
  // If no user, redirect to the sign-up page
  if (!user) {
    // You have a sign-in page, so let's check for that first
    // But your original request was to go to sign-up
    return <Navigate to="/auth/sign-up" replace />;
  }

  // If user, but not onboarded, show the flow
  if (user && !profile?.is_onboarded) {
    return <OnboardingFlow user={user} setProfile={setProfile} />;
  }

  // If user AND onboarded, show the main app

  if(user && profile?.is_onboarded){

    return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to Spotly, {profile?.username || user?.email}!</h1>
      <p>This is your main app page. You are fully onboarded.</p>
    </div>
  );
  
  }
  
};  

export default HomePage;








