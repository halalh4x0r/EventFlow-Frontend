import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user)
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center" role="alert">
          Please login to see your profile.
        </div>
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow-sm" style={{ maxWidth: "500px" }}>
        <div className="card-body text-center">
          <h3 className="card-title fw-bold mb-4">Your Profile</h3>
          
          <p className="mb-2">
            <strong>Username:</strong> {user.username}
          </p>
          <p className="mb-4">
            <strong>Email:</strong> {user.email}
          </p>

          <div className="d-flex justify-content-center">
            <span className="badge bg-primary px-3 py-2">Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}
