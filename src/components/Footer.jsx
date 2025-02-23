/**
 * Footer component for the Holidaze application.
 *
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 *
 * @returns {JSX.Element} The rendered footer section.
 */
function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
    <div className="container text-center">
      <h5 className="fw-bold">Holidaze</h5>
    </div>
    <div className="text-center mt-3">
      <p className="mb-0">&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
    </div>
  </footer>
  );
}
export default Footer;