'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu,
  X,
  LayoutDashboard,
  Sun,
  Moon,
  Package,
  Boxes,
  Layers,
  ChevronDown,
  ChevronRight,
  Users,
  LogOut,
  ShoppingCart,
  Factory,
  ClipboardList,
  FileText,
  BarChart,
} from 'lucide-react';
import { useThemeContext } from '../../theme/providers';
import { useRouter, usePathname } from 'next/navigation';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { Toaster } from 'sonner';
import { setCookie, deleteCookie } from 'cookies-next';

const DRAWER_WIDTH = 280;

const MENU_ITEMS = [
  {
    title: 'Gestão de Pessoas',
    icon: Users,
    children: [
      { title: 'Clientes', path: '/admin/clientes' },
      { title: 'Funcionários', path: '/admin/funcionarios' },
      { title: 'Fornecedores', path: '/admin/fornecedores' },
    ],
  },
  { title: 'Matéria Prima', icon: Boxes, path: '/admin/materiaPrima' },
  { title: 'Produtos', icon: Package, path: '/admin/produtos' },
  { title: 'Modelo', icon: Layers, path: '/admin/modelos' },
  { title: 'Compras', icon: ShoppingCart, path: '/admin/compras' },
  { title: 'Pedidos', icon: ClipboardList, path: '/admin/pedidos' },
  { title: 'Produção', icon: Factory, path: '/admin/producao' },
  {
    title: 'Relatórios',
    icon: BarChart,
    children: [
      { title: 'Relatório de Compras', path: '/admin/relatorios/compras' },
      { title: 'Relatório de Produção', path: '/admin/relatorios/producao' },
      { title: 'Relatório de Pedidos', path: '/admin/relatorios/pedidos' },
      { title: 'Relatório de Produtos', path: '/admin/relatorios/produtos' },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [peopleMenuOpen, setPeopleMenuOpen] = useState(false);
  const [reportsMenuOpen, setReportsMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isDarkMode, toggleTheme } = useThemeContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isInPeopleMenu = MENU_ITEMS.find(item =>
      item.title === 'Gestão de Pessoas' &&
      item.children?.some(child => child.path === pathname)
    );

    const isInReportsMenu = MENU_ITEMS.find(item =>
      item.title === 'Relatórios' &&
      item.children?.some(child => child.path === pathname)
    );

    if (isInPeopleMenu) {
      setPeopleMenuOpen(true);
    }

    if (isInReportsMenu) {
      setReportsMenuOpen(true);
    }
  }, [pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Erro ao invalidar token no servidor:', error);
    } finally {
      deleteCookie('token', {
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.137.131.134.182' : undefined,
        //secure: process.env.NODE_ENV === 'production',
        secure: false,
      });
      localStorage.clear();
      sessionStorage.clear();
      router.push('/');
    }
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        bgcolor: theme.palette.background.paper,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.4em',
          display: 'none'
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <LayoutDashboard size={32} color={theme.palette.primary.main} />
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
          WILLINOX
        </Typography>
      </Box>
      <List sx={{ px: 2 }}>
        {MENU_ITEMS.map((item) => {
          if (item.children) {
            const isChildActive = item.children.some((child) => pathname === child.path);
            const isGestaoMenu = item.title === 'Gestão de Pessoas';
            const isReportsMenu = item.title === 'Relatórios';

            const isMenuOpen = isGestaoMenu ? peopleMenuOpen : isReportsMenu ? reportsMenuOpen : false;

            const toggleMenu = () => {
              if (isGestaoMenu) {
                setPeopleMenuOpen(!peopleMenuOpen);
              } else if (isReportsMenu) {
                setReportsMenuOpen(!reportsMenuOpen);
              }
            };

            return (
              <Box key={item.title}>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={toggleMenu}
                    sx={{
                      borderRadius: 1,
                      bgcolor: isChildActive
                        ? theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)'
                        : 'transparent',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.05)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <item.icon size={20} color={isChildActive ? theme.palette.primary.main : undefined} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: '0.9375rem',
                        fontWeight: isChildActive ? 600 : 500,
                        color: isChildActive ? theme.palette.primary.main : undefined,
                      }}
                    />
                    {isMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isMenuOpen}>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.title}
                        onClick={() => handleNavigation(child.path)}
                        sx={{
                          pl: 4,
                          py: 0.5,
                          borderRadius: 1,
                          mb: 0.5,
                          bgcolor: pathname === child.path
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.08)'
                              : 'rgba(0, 0, 0, 0.05)'
                            : 'transparent',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.05)',
                          },
                        }}
                      >
                        <ListItemText
                          primary={child.title}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: pathname === child.path ? 600 : 400,
                            color: pathname === child.path ? theme.palette.primary.main : undefined,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItem key={item.title} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  bgcolor: pathname === item.path
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)'
                    : 'transparent',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <ListItemIcon>
                  <item.icon size={20} color={pathname === item.path ? theme.palette.primary.main : undefined} />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.9375rem',
                    fontWeight: pathname === item.path ? 600 : 500,
                    color: pathname === item.path ? theme.palette.primary.main : undefined,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Toaster
        position="top-right"
        richColors
        expand={true}
        toastOptions={{
          duration: 6000,
          style: {
            width: '420px',
            fontSize: '1rem',
            margin: '10px',
          },
        }}
      />

      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            {mobileOpen ? <X /> : <Menu />}
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton sx={{ mr: 2 }} onClick={toggleTheme}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
          <IconButton onClick={handleLogout}>
            <LogOut size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            minHeight: '100vh',
            bgcolor: theme.palette.background.default,
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </LocalizationProvider>
    </Box>
  );
}