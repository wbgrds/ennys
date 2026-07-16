export default function Logo() {
  return (
    <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Husky Head */}
      <defs>
        <style>{`
          .husky-dark { fill: #2d5016; }
          .husky-light { fill: #f5f1e8; }
        `}</style>
      </defs>

      {/* Outer ear - left */}
      <path
        d="M 60 80 Q 50 50 70 40 Q 80 35 85 50 Q 75 65 65 75 Z"
        className="husky-dark"
      />

      {/* Outer ear - right */}
      <path
        d="M 140 80 Q 150 50 130 40 Q 120 35 115 50 Q 125 65 135 75 Z"
        className="husky-dark"
      />

      {/* Head main */}
      <ellipse cx="100" cy="110" rx="55" ry="60" className="husky-dark" />

      {/* Face lighter area */}
      <ellipse cx="100" cy="120" rx="40" ry="45" className="husky-light" />

      {/* Snout */}
      <ellipse cx="100" cy="140" rx="28" ry="25" className="husky-light" />

      {/* Nose */}
      <circle cx="100" cy="145" r="6" className="husky-dark" />

      {/* Left eye */}
      <circle cx="85" cy="105" r="5" className="husky-dark" />
      <circle cx="85" cy="105" r="2.5" fill="white" />

      {/* Right eye */}
      <circle cx="115" cy="105" r="5" className="husky-dark" />
      <circle cx="115" cy="105" r="2.5" fill="white" />

      {/* Mouth line */}
      <path d="M 100 145 Q 95 150 90 148" stroke="#2d5016" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 100 145 Q 105 150 110 148" stroke="#2d5016" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Left ear inner - light */}
      <path
        d="M 68 60 Q 65 55 70 45 Q 75 50 72 65 Z"
        className="husky-light"
      />

      {/* Right ear inner - light */}
      <path
        d="M 132 60 Q 135 55 130 45 Q 125 50 128 65 Z"
        className="husky-light"
      />
    </svg>
  );
}
