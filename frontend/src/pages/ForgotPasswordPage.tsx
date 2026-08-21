import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Typography, Box } from '@mui/material';
import { Input, Button, Banner } from '@shared/components';
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
        <Banner tone="success">We sent a password reset link. Please check your inbox.</Banner>
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
        Enter your email and we'll send you a reset link.
      </Typography>
      {error && <Banner tone="error">{error}</Banner>}
      <Input label="Email" type="email" placeholder="you@example.com" autoComplete="email"
        error={errors.email?.message} helperText={errors.email?.message} {...register('email')} />
      <Button type="submit" variant="primary" size="large" fullWidth loading={isSubmitting}>
        Send Reset Link
      </Button>
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Remember your password?{' '}
        <Link to="/auth/login" style={{ fontWeight: 500 }}>Sign in</Link>
      </Typography>
    </Box>
  );
}
