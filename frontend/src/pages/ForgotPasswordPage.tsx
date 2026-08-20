import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { TextField, Alert, Typography, Box } from '@mui/material';
import { LoadingButton } from '@shared/components/LoadingButton';
import { useAuth } from '@providers/AuthProvider';

const schema = z.object({ email: z.email('Please enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { forgotPassword } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try { await forgotPassword(data.email); setSent(true); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to send reset email.'); }
  };

  if (sent) {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Check Your Email</Typography>
        <Alert severity="success">We sent a password reset link. Please check your inbox.</Alert>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3, textAlign: 'center' }}>
          <Link to="/auth/login" style={{ fontWeight: 500 }}>Back to Sign In</Link>
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Reset Password</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Enter your email and we&apos;ll send you a reset link.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Email" type="email" placeholder="you@example.com" autoComplete="email"
        error={!!errors.email} helperText={errors.email?.message} {...register('email')} />
      <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={isSubmitting}>
        Send Reset Link
      </LoadingButton>
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Remember your password?{' '}
        <Link to="/auth/login" style={{ fontWeight: 500 }}>Sign in</Link>
      </Typography>
    </Box>
  );
}
