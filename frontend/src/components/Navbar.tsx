import "./Navbar.css";

// TODO: replace with your real npub / nostr profile URL (e.g. https://njump.me/npub1...)
const NOSTR_URL = "#";

export default function Navbar() {
  return (
    <nav className="navbar">
      <a className="nav-brand" href="/">
        Raymond Romero
      </a>
      <div className="nav-links">
        <a href="#about">About Me</a>
        <a href="mailto:raymond50romero@gmail.com">Contact</a>
        <a href={NOSTR_URL} target="_blank" rel="noreferrer">
          Nostr
        </a>
      </div>
    </nav>
  );
}
