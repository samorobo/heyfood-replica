import { Box, Card, CardMedia, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: 32,
  [theme.breakpoints.down('md')]: {
    marginBottom: 24
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: 16
  }
}));

const CarouselWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  position: 'relative'
});

const CarouselScroll = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 16,
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  paddingY: 8,
  flex: 1,
  [theme.breakpoints.down('md')]: {
    gap: 12,
    paddingY: 6
  },
  [theme.breakpoints.down('sm')]: {
    gap: 8,
    paddingY: 4
  }
}));

const PromoCard = styled(Card)(({ theme }) => ({
  minWidth: 320,
  maxWidth: 320,
  borderRadius: 12,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  [theme.breakpoints.down('md')]: {
    minWidth: 280,
    maxWidth: 280,
    borderRadius: 10
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 240,
    maxWidth: 240,
    borderRadius: 8
  },
  '&:hover': {
    transform: 'scale(1.02)'
  }
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  width: 40,
  height: 40,
  zIndex: 2,
  [theme.breakpoints.down('md')]: {
    width: 36,
    height: 36
  },
  [theme.breakpoints.down('sm')]: {
    width: 32,
    height: 32,
    display: 'none' // Hide on small screens to save space
  },
  '&:hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#22c55e'
  },
  '&.left': {
    left: -20,
    [theme.breakpoints.down('md')]: {
      left: -18
    }
  },
  '&.right': {
    right: -20,
    [theme.breakpoints.down('md')]: {
      right: -18
    }
  }
}));

interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  backgroundColor?: string;
  textColor?: string;
}

interface CarouselSectionProps {
  items: CarouselItem[];
  onItemClick?: (item: CarouselItem) => void;
}

export default function CarouselSection({ items, onItemClick }: CarouselSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = isSmall ? -250 : isMobile ? -300 : -340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = isSmall ? 250 : isMobile ? 300 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <CarouselContainer>
      <CarouselWrapper>
        <ScrollButton className="left" onClick={scrollLeft}>
          <ChevronLeft sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
        </ScrollButton>
        
        <CarouselScroll ref={scrollContainerRef}>
          {items.map((item) => (
            <PromoCard 
              key={item.id}
              onClick={() => onItemClick?.(item)}
            >
              <Box sx={{ position: 'relative', height: { xs: 100, sm: 120, md: 140 } }}>
                <CardMedia
                  component="img"
                  height="100%"
                  image={item.imageUrl}
                  alt={item.title}
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: item.backgroundColor || 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: { xs: 1.5, sm: 2, md: 2 }
                  }}
                >
                  <Typography
                    variant={isSmall ? "subtitle1" : "h6"}
                    fontWeight="700"
                    sx={{
                      color: item.textColor || '#ffffff',
                      mb: item.subtitle ? 0.5 : 0,
                      fontSize: {
                        xs: '14px',
                        sm: '16px',
                        md: '18px'
                      }
                    }}
                  >
                    {item.title}
                  </Typography>
                  {item.subtitle && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: item.textColor || '#ffffff',
                        opacity: 0.9,
                        fontSize: {
                          xs: '11px',
                          sm: '12px',
                          md: '14px'
                        }
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>
            </PromoCard>
          ))}
        </CarouselScroll>
        
        <ScrollButton className="right" onClick={scrollRight}>
          <ChevronRight sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
        </ScrollButton>
      </CarouselWrapper>
    </CarouselContainer>
  );
}