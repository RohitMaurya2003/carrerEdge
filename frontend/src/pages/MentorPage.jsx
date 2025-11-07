import { useEffect } from "react";
import { useMentorStore } from "../store/useMentorStore";

const MentorPage = () => {
  const { pendingRequests, fetchPendingRequests, acceptRequest, rejectRequest, isFetching } = useMentorStore();

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className=" mx-auto bg-base-100 p-6 rounded-lg shadow-lg min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
  <h2 className="text-2xl font-semibold text-primary mb-4">Pending Requests</h2>

  {isFetching ? (
    <p className="text-center text-gray-500">Loading...</p>
  ) : pendingRequests.length === 0 ? (
    <p className="text-center text-gray-500">No pending requests</p>
  ) : (
    <ul className="space-y-4">
      {pendingRequests.map((request) => (
        <li
          key={request._id}
          className="flex items-center justify-between bg-base-200 p-4 rounded-lg shadow-md"
        >
          <div>
            <p className="font-medium text-lg">{request.mentee.fullName}</p>
            <p className="text-sm text-gray-400">{request.mentee.email}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => acceptRequest(request.mentee._id)}
              className="btn btn-success btn-sm"
            >
              Accept
            </button>
            <button
              onClick={() => rejectRequest(request.mentee._id)}
              className="btn btn-error btn-sm"
            >
              Reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default MentorPage;