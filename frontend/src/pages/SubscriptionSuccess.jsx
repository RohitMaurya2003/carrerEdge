import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // After a short delay, navigate to progress page
    const t = setTimeout(() => navigate("/progress"), 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="bg-slate-800/60 p-8 rounded-lg text-center max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Thank you for subscribing 🎉</h1>
        <p className="text-slate-300 mb-4">Your subscription is active. Redirecting to the Progress Tracker...</p>
        <div className="text-sm text-slate-400">If you are not redirected automatically, <button className="link" onClick={() => navigate('/progress')}>click here</button>.</div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
