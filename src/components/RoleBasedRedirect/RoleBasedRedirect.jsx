// src/components/RoleBasedRedirect/RoleBasedRedirect.jsx
import { Navigate } from 'react-router-dom';

function RoleBasedRedirect({ schoolPath, officePath }) {
  const savedUser = sessionStorage.getItem("currentUser");
  const user = savedUser ? JSON.parse(savedUser) : null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const targetPath = user.role === "school" ? schoolPath : officePath;
  return <Navigate to={targetPath} replace />;
}

export default RoleBasedRedirect;