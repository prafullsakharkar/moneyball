import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { TextField, Alert, Typography, Box, Grid } from '@mui/material';
import { LoadingButton } from '@shared/components/LoadingButton';
import { useAuth } from '@providers/AuthProvider';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });
type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await registerUser({ email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Create Account</Typography>
      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField label="First Name" placeholder="John" autoComplete="given-name"
            error={!!errors.firstName} helperText={errors.firstName?.message} {...register('firstName')} />
        </Grid>
        <Grid size={6}>
          <TextField label="Last Name" placeholder="Doe" autoComplete="family-name"
            error={!!errors.lastName} helperText={errors.lastName?.message} {...register('lastName')} />
        </Grid>
      </Grid>
      <TextField label="Email" type="email" placeholder="you@example.com" autoComplete="email"
        error={!!errors.email} helperText={errors.email?.message} {...register('email')} />
      <TextField label="Password" type="password" placeholder="At least 8 characters" autoComplete="new-password"
        error={!!errors.password} helperText={errors.password?.message} {...register('password')} />
      <TextField label="Confirm Password" type="password" placeholder="Repeat your password" autoComplete="new-password"
        error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} {...register('confirmPassword')} />
      <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={isSubmitting}>
        Create Account
      </LoadingButton>
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Already have an account?{' '}
        <Link to="/auth/login" style={{ fontWeight: 500 }}>Sign in</Link>
      </Typography>
    </Box>
  );
}
