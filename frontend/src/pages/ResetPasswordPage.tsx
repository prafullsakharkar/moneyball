import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { TextField, Alert, Typography, Box } from '@mui/material';
import { LoadingButton } from '@shared/components/LoadingButton';
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
        <Alert severity="error">This password reset link is invalid or has expired.</Alert>
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
        <Alert severity="success">Your password has been reset. Redirecting to sign in...</Alert>
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
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="New Password" type="password" placeholder="At least 8 characters" autoComplete="new-password"
        error={!!errors.password} helperText={errors.password?.message} {...register('password')} />
      <TextField label="Confirm Password" type="password" placeholder="Repeat your password" autoComplete="new-password"
        error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} {...register('confirmPassword')} />
      <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={isSubmitting}>
        Reset Password
      </LoadingButton>
    </Box>
  );
}
