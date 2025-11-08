import { Link } from "react-router-dom";

// Saved reviews feature removed — reviews are no longer persisted.
const SavedReviews = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="max-w-xl text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Saved Reviews Removed</h1>
        <p className="mb-4 text-slate-300">To respect privacy and reduce storage, resume reviews are no longer saved on the server. You can still upload a resume to get an on-the-spot review.</p>
        <Link to="/resume-review" className="inline-block bg-cyan-500 text-black px-4 py-2 rounded">Go to Resume Reviewer</Link>
      </div>
    </div>
  );
};

export default SavedReviews;
