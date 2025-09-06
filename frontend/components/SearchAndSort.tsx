import { Box, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
  [theme.breakpoints.down('md')]: {
    marginBottom: 20
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8
  }
}));

const NavigationButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  [theme.breakpoints.down('sm')]: {
    gap: 6
  }
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  width: 40,
  height: 40,
  [theme.breakpoints.down('md')]: {
    width: 36,
    height: 36
  },
  [theme.breakpoints.down('sm')]: {
    width: 32,
    height: 32
  },
  '&:hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#22c55e'
  },
  '&:disabled': {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.5
  }
}));

const SeeAllButton = styled('button')(({ theme }) => ({
  backgroundColor: 'transparent',
  border: 'none',
  color: '#22c55e',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  padding: 0,
  textDecoration: 'underline',
  [theme.breakpoints.down('md')]: {
    fontSize: '13px'
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px'
  },
  '&:hover': {
    textDecoration: 'none'
  }
}));

interface SearchAndSortProps {
  title: string;
  showNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

export default function SearchAndSort({ 
  title, 
  showNavigation = false,
  onPrevious,
  onNext,
  canGoPrevious = true,
  canGoNext = true,
  showSeeAll = false,
  onSeeAll
}: SearchAndSortProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <SectionHeader>
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        fontWeight="700" 
        sx={{ 
          color: '#1a1a1a',
          fontSize: {
            xs: '18px',
            sm: '20px',
            md: '24px'
          }
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        width: isSmall ? '100%' : 'auto',
        justifyContent: isSmall ? 'space-between' : 'flex-end'
      }}>
        {showSeeAll && (
          <SeeAllButton onClick={onSeeAll}>
            See all
          </SeeAllButton>
        )}
        
        {showNavigation && (
          <NavigationButtons>
            <NavButton 
              onClick={onPrevious}
              disabled={!canGoPrevious}
            >
              <ChevronLeft sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
            </NavButton>
            <NavButton 
              onClick={onNext}
              disabled={!canGoNext}
            >
              <ChevronRight sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
            </NavButton>
          </NavigationButtons>
        )}
      </Box>
    </SectionHeader>
  );
}