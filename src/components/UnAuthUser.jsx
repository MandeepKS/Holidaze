import { Link } from 'react-router-dom'
export default function UnAuthUser() {
  return (
      <div>
      <p> <i className="bi bi-exclamation-triangle fs-4"></i> You dont have access to this page.</p>
      <Link to="/">Home</Link>
   </div>
  );
}