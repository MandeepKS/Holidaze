import { Link } from 'react-router-dom'
/**
 * UnAuthUser component for displaying an access denied message to unauthorized users.
 *
 * @component
 * @example
 * return (
 *   <UnAuthUser />
 * )
 *
 * @returns {JSX.Element} The rendered unauthorized user message.
 */
export default function UnAuthUser() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
    <div className="text-center border rounded p-4 shadow-sm bg-light">
      <i className="bi bi-exclamation-triangle text-warning fs-1"></i>
      <h2 className="mt-3">Access Denied</h2>
      <p className="text-muted">You don’t have access to this page.</p>
      <Link to="/" className="cta-btn mt-2">
        <i className="bi bi-house-door"></i> Go to Home
      </Link>
    </div>
  </div>
  );
}