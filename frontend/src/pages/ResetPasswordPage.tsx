import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Typography, Box } from '@mui/material';
import { Input, Button, Banner } from '@shared/components';
import { useAuth } from '@providers/AuthProvider';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!token) {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Invalid Link</Typography>
        <Banner tone="error">This password reset link is invalid or has expired.</Banner>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3, textAlign: 'center' }}>
          <Link to="/auth/forgot-password" style={{ fontWeight: 500 }}>Request a new reset link</Link>
        </Typography>
      </Box>
    );
  }

  if (success) {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Password Reset</Typography>
        <Banner tone="success">Your password has been reset. Redirecting to sign in...</Banner>
      </Box>
    );
  }

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await resetPassword(token, data.password);
      setSuccess(true);
      setTimeout(() => navigate('/auth/login', { replace: true }), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to reset password.'); }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Set New Password</Typography>
      {error && <Banner tone="error">{error}</Banner>}
      <Input label="New Password" type="password" placeholder="At least 8 characters" autoComplete="new-password"
        error={errors.password?.message} helperText={errors.password?.message} {...register('password')} />
      <Input label="Confirm Password" type="password" placeholder="Repeat your password" autoComplete="new-password"
        error={errors.confirmPassword?.message} helperText={errors.confirmPassword?.message} {...register('confirmPassword')} />
      <Button type="submit" variant="primary" size="large" fullWidth loading={isSubmitting}>
        Reset Password
      </Button>
    </Box>
  );
}
