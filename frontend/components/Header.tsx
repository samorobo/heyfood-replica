import { 
  AppBar, Toolbar, Container, Box, Typography, IconButton, Badge, 
  TextField, InputAdornment, Button, Drawer, List, ListItem, ListItemText,
  ListItemIcon, Divider, useMediaQuery, useTheme
} from '@mui/material';
import { 
  Search as SearchIcon, 
  ShoppingCart, 
  LocationOn, 
  Restaurant,
  Menu as MenuIcon,
  Close as CloseIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#1a1a1a',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid #e0e0e0'
}));

const LogoImage = styled('img')({
  width: 32,
  height: 32,
  marginRight: 8
});

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    height: 44,
    fontSize: '14px',
    '& fieldset': { borderColor: '#e0e0e0' },
    '&:hover fieldset': { borderColor: '#22c55e' },
    '&.Mui-focused fieldset': { borderColor: '#22c55e' },
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px'
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiOutlinedInput-root': {
      height: 40,
      fontSize: '13px'
    }
  }
}));

const CartButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#000000',
  color: '#ffffff',
  borderRadius: 25,
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  minWidth: 'auto',
  height: 40,
  '&:hover': { backgroundColor: '#333333' },
  [theme.breakpoints.down('sm')]: {
    padding: '6px 12px',
    fontSize: '12px'
  }
}));

const RestaurantTab = styled(Button)(({ theme }) => ({
  backgroundColor: '#000000',
  color: '#ffffff',
  borderRadius: 25,
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  minWidth: 'auto',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  '&:hover': { backgroundColor: '#333333' },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    padding: '6px 12px'
  }
}));

const GroceryTab = styled(Button)(({ theme }) => ({
  color: '#666666',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  padding: '8px 16px',
  minWidth: 'auto',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    padding: '6px 12px'
  }
}));

const LocationButton = styled(Button)(({ theme }) => ({
  color: '#1a1a1a',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  padding: '4px 8px',
  minWidth: 'auto',
  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px'
  }
}));

const SignInButton = styled(Button)(({ theme }) => ({
  color: '#1a1a1a',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  padding: '8px 16px',
  minWidth: 'auto',
  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    padding: '6px 10px'
  }
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  display: 'none',
  color: '#1a1a1a',
  padding: 8,
  [theme.breakpoints.down('sm')]: {
    display: 'flex'
  }
}));

const MobileDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: '#ffffff',
    padding: '20px 0'
  }
});

const DrawerHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px 16px',
  borderBottom: '1px solid #e0e0e0'
});

const MobileCartButton = styled(Button)({
  backgroundColor: '#000000',
  color: '#ffffff',
  borderRadius: 25,
  padding: '12px 20px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  width: '100%',
  justifyContent: 'flex-start',
  '&:hover': { backgroundColor: '#333333' }
});

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main header */}
      <StyledAppBar position="sticky" elevation={0}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Toolbar
            sx={{
              py: 2,
              minHeight: '72px !important',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: { xs: 1.5, sm: 3 },
              justifyContent: 'space-between'
            }}
          >
            {/* Mobile Top Row: Logo + Menu Button */}
            {isMobile && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                width: '100%',
                mb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LogoImage 
                    src="https://heyfood.africa/icons/new/logo-circle-green.svg" 
                    alt="HeyFood"
                  />
                </Box>
                <MobileMenuButton onClick={handleMobileMenuToggle}>
                  <MenuIcon />
                </MobileMenuButton>
              </Box>
            )}

            {/* Desktop Left: Logo + Location */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LogoImage 
                  src="https://heyfood.africa/icons/new/logo-circle-green.svg" 
                  alt="HeyFood"
                />
                <LocationButton 
                  startIcon={<LocationOn sx={{ fontSize: 16 }} />} 
                  data-testid="button-set-location"
                >
                  Set Location
                </LocationButton>
              </Box>
            )}

            {/* Center: Search (Mobile: Full Width, Desktop: Flex) */}
            <Box sx={{ 
              flex: { xs: 'none', sm: 1 }, 
              width: { xs: '100%', sm: 'auto' } 
            }}>
              <SearchField
                fullWidth
                placeholder="Search restaurants or food"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666666', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                data-testid="input-search-restaurants"
              />
            </Box>

            {/* Desktop Right: Sign In + Cart */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SignInButton data-testid="button-sign-in">SIGN IN</SignInButton>
                <CartButton 
                  startIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
                  data-testid="button-cart"
                >
                  CART • 0
                </CartButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Drawer Menu */}
      <MobileDrawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
      >
        <DrawerHeader>
          <Typography variant="h6" fontWeight="600">
            Menu
          </Typography>
          <IconButton onClick={closeMobileMenu} size="small">
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <List sx={{ px: 2, pt: 2 }}>
          {/* Location */}
          <ListItem 
            button 
            onClick={closeMobileMenu}
            sx={{ 
              borderRadius: 2, 
              mb: 1,
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
            }}
          >
            <ListItemIcon>
              <LocationOn sx={{ color: '#22c55e' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Set Location" 
              secondary="Lagos, Nigeria"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* Sign In */}
          <ListItem 
            button 
            onClick={closeMobileMenu}
            sx={{ 
              borderRadius: 2, 
              mb: 1,
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
            }}
          >
            <ListItemIcon>
              <PersonIcon sx={{ color: '#666' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Sign In" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* Cart */}
          <Box sx={{ px: 2 }}>
            <MobileCartButton
              startIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
              onClick={closeMobileMenu}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>Cart</span>
                <span>0 items • ₦0</span>
              </Box>
            </MobileCartButton>
          </Box>
        </List>
      </MobileDrawer>

      {/* Tabs */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              overflowX: { xs: 'auto', sm: 'visible' },
              py: 2,
              minHeight: 56,
              gap: 2
            }}
          >
            <RestaurantTab 
              startIcon={<Restaurant sx={{ fontSize: 16 }} />}
              data-testid="tab-restaurants"
            >
              Restaurants
            </RestaurantTab>
            <GroceryTab data-testid="tab-grocery">🛒 Grocery</GroceryTab>
          </Box>
        </Container>
      </Box>
    </>
  );
}