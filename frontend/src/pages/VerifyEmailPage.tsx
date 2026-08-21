import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Typography, Box, CircularProgress } from '@mui/material';
import { Button, Banner } from '@shared/components';
import { useAuth } from '@providers/AuthProvider';
import { useAuthStore } from '@stores/authStore';
import { identityService } from '@api/index';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);
  const { verifyEmail } = useAuth();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (token && !verified) {
      setLoading(true);
      verifyEmail(token)
        .then(() => setVerified(true))
        .catch((err) => setError(err instanceof Error ? err.message : 'Verification failed.'))
        .finally(() => setLoading(false));
    }
  }, [token, verifyEmail, verified]);

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try { await identityService.resendVerification(user?.email ?? ''); setResent(true); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to resend email.'); }
    finally { setLoading(false); }
  };

  if (token && loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ color: 'text.secondary', mt: 2 }}>Verifying your email...</Typography>
      </Box>
    );
  }

  if (verified) {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Email Verified</Typography>
        <Banner tone="success">Your email has been verified successfully!</Banner>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3, textAlign: 'center' }}>
          <Link to="/" style={{ fontWeight: 500 }}>Go to Dashboard</Link>
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Verify Your Email</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        We sent a verification link to <strong>{user?.email ?? 'your email'}</strong>.
      </Typography>
      {error && <Banner tone="error" sx={{ mb: 2 }}>{error}</Banner>}
      {resent && <Banner tone="success" sx={{ mb: 2 }}>Verification email sent! Check your inbox.</Banner>}
      {!resent && (
        <Button onClick={handleResend} variant="secondary" size="large" fullWidth loading={loading}>
          Resend Verification Email
        </Button>
      )}
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3, textAlign: 'center' }}>
        <Link to="/auth/login" style={{ fontWeight: 500 }}>Back to Sign In</Link>
      </Typography>
    </Box>
  );
}
