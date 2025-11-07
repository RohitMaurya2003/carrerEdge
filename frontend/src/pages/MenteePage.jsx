import { useEffect } from "react";
import { useMenteeStore } from "../store/useMenteeStore";

const MenteePage = () => {
  const { mentors, fetchMentors, requestMentorship, cancelRequest, isFetching } = useMenteeStore();

  useEffect(() => {
    fetchMentors();
  }, []);

  console.log({ mentors });

  return (
    <div className="mx-auto bg-base-100 p-6 rounded-lg shadow-lg min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
  <h2 className="text-2xl font-semibold text-primary mb-4">Choose Your Mentor</h2>

  {isFetching ? (
    <p className="text-center text-gray-500">Loading...</p>
  ) : mentors.length === 0 ? (
    <p className="text-center text-gray-500">No mentors available</p>
  ) : (
    <ul className="space-y-4 ">
      {mentors.map((mentor) => (
        <li
          key={mentor._id}
          className="flex items-center justify-between bg-base-200 p-4 rounded-lg shadow-md"
        >
          <div>
            <p className="font-medium text-lg">{mentor.fullName}</p>
            <p className="text-sm text-gray-400">{mentor.email}</p>
          </div>
          <div>
            {mentor.status === "accepted" ? (
              <button className="btn btn-neutral btn-sm" disabled>
                Followed
              </button>
            ) : mentor.status === "pending" ? (
              <button
                onClick={() => cancelRequest(mentor._id)}
                className="btn btn-warning btn-sm"
              >
                Pending
              </button>
            ) : (
              <button
                onClick={() => requestMentorship(mentor._id)}
                className="btn btn-primary btn-sm"
              >
                Follow
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default MenteePage;