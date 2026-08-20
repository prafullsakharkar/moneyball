import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import {
  TextField, Alert, Typography, Box, Checkbox, FormControlLabel,
  InputAdornment, IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@shared/components/LoadingButton';
import { useAuth } from '@providers/AuthProvider';

const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      if (message.includes('Invalid credentials') || message.includes('UNAUTHORIZED')) {
        setError('Invalid email or password. Please try again.');
      } else if (message.includes('NETWORK_ERROR') || message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your connection.');
      } else if (message.includes('TIMEOUT')) {
        setError('The request timed out. Please try again.');
      } else {
        setError(message);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
      aria-label="Sign in form"
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Sign In</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Welcome back to CricketOS
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} role="alert">
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        autoFocus
        error={!!errors.email}
        helperText={errors.email?.message}
        slotProps={{ htmlInput: { 'aria-label': 'Email address' } }}
        {...register('email')}
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter your password"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        slotProps={{
          htmlInput: { 'aria-label': 'Password' },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        {...register('password')}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControlLabel
          control={<Checkbox size="small" {...register('rememberMe')} />}
          label={<Typography variant="body2">Remember me</Typography>}
        />
        <Link to="/auth/forgot-password" style={{ fontSize: '0.875rem' }}>
          Forgot password?
        </Link>
      </Box>

      <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={isSubmitting}>
        Sign In
      </LoadingButton>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Don&apos;t have an account?{' '}
        <Link to="/auth/register" style={{ fontWeight: 500 }}>Create one</Link>
      </Typography>
    </Box>
  );
}
