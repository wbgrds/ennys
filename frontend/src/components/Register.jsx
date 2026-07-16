import { useState } from 'react';

const colors = {
  cream: '#D9CCBA',
  dark: '#1a3a2a',
  logoGreen: '#4B5A3C',
  textOlive: '#6D4E2E',
  gold: '#C9A961',
};

export default function Register({ onLogin, onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validierung
    if (password !== passwordConfirm) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registrierung fehlgeschlagen');
        return;
      }

      // Token speichern und User übergeben
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin(data.user);
      onNavigate('account');
    } catch (err) {
      setError('Fehler bei der Registrierung: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem' }}>
      <h2 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        fontFamily: 'Georgia, serif',
        marginBottom: '1.5rem',
        color: colors.dark,
      }}>
        Registrieren
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #fecaca',
          }}>
            {error}
          </div>
        )}

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: colors.dark,
            fontWeight: '600',
          }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${colors.cream}`,
              borderRadius: '0.5rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: colors.dark,
            fontWeight: '600',
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${colors.cream}`,
              borderRadius: '0.5rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: colors.dark,
            fontWeight: '600',
          }}>
            Passwort
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${colors.cream}`,
              borderRadius: '0.5rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: colors.dark,
            fontWeight: '600',
          }}>
            Passwort wiederholen
          </label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            minLength="6"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${colors.cream}`,
              borderRadius: '0.5rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: colors.logoGreen,
            color: colors.cream,
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s',
            fontSize: '1rem',
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.dark)}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.logoGreen)}
        >
          {loading ? 'Registriere...' : 'Registrieren'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: colors.textOlive }}>
        Schon registriert?{' '}
        <button
          onClick={() => onNavigate('login')}
          style={{
            background: 'none',
            border: 'none',
            color: colors.gold,
            cursor: 'pointer',
            textDecoration: 'underline',
            fontWeight: '600',
          }}
        >
          Jetzt anmelden
        </button>
      </p>
    </div>
  );
}
