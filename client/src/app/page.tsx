'use client';
import { useRef, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useThemeContext } from '../theme/providers';
import { useRouter } from 'next/navigation';
import httpClient from '@/utils/httpClient';
import { toast, Toaster } from 'sonner';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();

  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleLogin() {
    if (loginRef.current?.value && passwordRef.current?.value) {
      httpClient.post("/auth/token", {
        login: loginRef.current.value,
        senha: passwordRef.current.value
      })
        .then(response => {
          if (response.status === 200) {
            toast.success('Login realizado com sucesso!');
            setTimeout(() => router.push("admin/produtos"), 1500);
          } else {
            toast.error('Credenciais inválidas');
          }
        })
        .catch(error => {
          console.error("Erro no login:", error);
          toast.error('Erro ao fazer login. Tente novamente.');
        });
    } else {
      toast.warning('Preencha o login e a senha!');
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.background.default,
        position: 'relative',
      }}
    >

      <Toaster
        position="bottom-right"
        richColors
        expand={true}
        toastOptions={{
          style: {
            width: '400px',
            fontSize: '1.1rem',
            margin: '10px',
          },
        }}
      />

      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          bgcolor: theme.palette.background.paper,
          width: 40,
          height: 40,
          '&:hover': {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </IconButton>

      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 24px rgba(0, 0, 0, 0.3)'
              : '0 4px 24px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography
              variant="h1"
              align="center"
              gutterBottom
              color="text.primary"
            >
              Bem-vindo
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Entre com suas credenciais para acessar o sistema
            </Typography>

            <TextField
              fullWidth
              label="Login"
              type="text"
              inputRef={loginRef}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              inputRef={passwordRef}
              required
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
            >
              Entrar
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}