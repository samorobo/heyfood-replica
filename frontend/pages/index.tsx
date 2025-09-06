import { useState, useMemo } from 'react';
import { Container, Box, Typography, Grid, Button, Skeleton, Alert, useMediaQuery, useTheme, Drawer } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { styled } from '@mui/material/styles';
import Header from '../components/Header';
import CategoryFilters from '../components/CategoryFilters';
import SearchAndSort from '../components/SearchAndSort';
import RestaurantCard from '../components/RestaurantCard';
import SidebarFilters from '../components/SidebarFilters';
import CarouselSection from '../components/CarouselSection';
import { Restaurant, Tag, RestaurantsResponse, TagsResponse } from '../types';

const MainContainer = styled(Box)({
  backgroundColor: '#f8f9fa',
  minHeight: '100vh'
});

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 24,
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: 16
  }
}));

const MainContent = styled(Box)({
  flex: 1,
  minWidth: 0 // Prevents flex item from overflowing
});

const LoadMoreButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#22c55e',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: 8,
  fontWeight: 500,
  textTransform: 'none',
  [theme.breakpoints.down('md')]: {
    padding: '10px 28px',
    fontSize: '14px'
  },
  [theme.breakpoints.down('sm')]: {
    padding: '8px 24px',
    fontSize: '13px'
  },
  '&:hover': {
    backgroundColor: '#16a34a'
  }
}));

const RestaurantGrid = styled(Grid)(({ theme }) => ({
  '& .MuiGrid-item': {
    display: 'flex'
  }
}));

const MobileSidebarToggle = styled(Button)(({ theme }) => ({
  display: 'none',
  backgroundColor: '#ffffff',
  color: '#1a1a1a',
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  padding: '8px 16px',
  marginBottom: 16,
  textTransform: 'none',
  fontWeight: 500,
  [theme.breakpoints.down('md')]: {
    display: 'flex'
  },
  '&:hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#22c55e'
  }
}));

// Mock carousel data - you can replace this with real data from your API
const carouselItems = [
  {
    id: '1',
    title: 'FREE DELIVERY',
    subtitle: 'Feedwell Supermarket',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop',
    backgroundColor: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    textColor: '#ffffff'
  },
  {
    id: '2',
    title: 'Bodija Market at a cheaper rate',
    subtitle: '10% 5% service fee',
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=200&fit=crop',
    backgroundColor: 'linear-gradient(135deg, #92400e 0%, #a16207 100%)',
    textColor: '#ffffff'
  },
  {
    id: '3',
    title: 'NOW ON HEYFOOD',
    subtitle: 'Westmead Royal Bites',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop',
    backgroundColor: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)',
    textColor: '#ffffff'
  },
  {
    id: '4',
    title: 'Special Offers',
    subtitle: 'Up to 30% off',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop',
    backgroundColor: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    textColor: '#ffffff'
  }
];

export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Most Popular');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // Fetch tags
  const { data: tags = [], isLoading: tagsLoading, error: tagsError } = useQuery<Tag[]>({
    queryKey: ['/tags'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch restaurants with filters
  const { 
    data: restaurants = [], 
    isLoading: restaurantsLoading, 
    error: restaurantsError,
    refetch
  } = useQuery<Restaurant[]>({
    queryKey: ['/restaurants', searchTerm, selectedTags.join(','), sortBy],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleTagSelect = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const handleCarouselItemClick = (item: any) => {
    console.log('Carousel item clicked:', item);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Show error state
  if (restaurantsError || tagsError) {
    return (
      <MainContainer>
        <Header searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 2.5, md: 3 }, px: { xs: 1, sm: 2, md: 3 } }}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
            data-testid="alert-error"
          >
            Failed to load data. Please check your internet connection and try again.
          </Alert>
        </Container>
      </MainContainer>
    );
  }

  const sidebarContent = (
    <SidebarFilters 
      totalCount={restaurants.length}
      sortBy={sortBy}
      onSortChange={handleSortChange}
    />
  );

  return (
    <MainContainer>
      <Header searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 2, sm: 2.5, md: 3 }, 
          px: { xs: 1, sm: 2, md: 3 } 
        }}
      >
        {/* Category Filters - Horizontal Carousel */}
        <CategoryFilters 
          tags={tags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          isLoading={tagsLoading}
        />

        {/* Promotional Carousel */}
        <CarouselSection 
          items={carouselItems}
          onItemClick={handleCarouselItemClick}
        />

        {/* Mobile Sidebar Toggle */}
        {isMobile && (
          <MobileSidebarToggle onClick={toggleMobileSidebar}>
            Filters & Sort ({restaurants.length} restaurants)
          </MobileSidebarToggle>
        )}

        {/* Mobile Sidebar Drawer */}
        <Drawer
          anchor="left"
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: '280px',
              padding: 2
            }
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Main Content with Sidebar */}
        <ContentWrapper>
          {/* Desktop Sidebar */}
          {!isMobile && sidebarContent}

          {/* Main Content Area */}
          <MainContent>
            {/* Section Header */}
            <SearchAndSort 
              title="Spend Less, Order More! 😋"
              showNavigation={true}
              showSeeAll={true}
            />

            {/* Restaurant Grid */}
            {restaurantsLoading ? (
              <RestaurantGrid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                {[...Array(isMobile ? 4 : 8)].map((_, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={isMobile ? 6 : 4} 
                    lg={isTablet ? 4 : 3} 
                    key={index}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Skeleton 
                        variant="rectangular" 
                        height={{ xs: 160, sm: 180, md: 200 }} 
                        sx={{ borderRadius: 2 }} 
                      />
                      <Box sx={{ p: 2 }}>
                        <Skeleton variant="text" height={28} />
                        <Skeleton variant="text" height={20} width="60%" />
                        <Skeleton variant="text" height={20} width="40%" />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </RestaurantGrid>
            ) : restaurants.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" data-testid="text-no-restaurants">
                  No restaurants found matching your criteria.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search or filters.
                </Typography>
              </Box>
            ) : (
              <RestaurantGrid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                {restaurants.map((restaurant: Restaurant) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={isMobile ? 6 : 4} 
                    lg={isTablet ? 4 : 3} 
                    key={restaurant.id}
                  >
                    <RestaurantCard restaurant={restaurant} />
                  </Grid>
                ))}
              </RestaurantGrid>
            )}

            {/* Additional Sections */}
            {restaurants.length > 0 && (
              <>
                <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
                  <SearchAndSort 
                    title="Party Jollof in IB"
                    showNavigation={true}
                    showSeeAll={true}
                  />
                  
                  <RestaurantGrid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                    {restaurants.slice(0, isMobile ? 2 : 3).map((restaurant: Restaurant) => (
                      <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        md={isMobile ? 6 : 4} 
                        lg={isTablet ? 4 : 3} 
                        key={`party-${restaurant.id}`}
                      >
                        <RestaurantCard restaurant={restaurant} />
                      </Grid>
                    ))}
                  </RestaurantGrid>
                </Box>

                <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
                  <SearchAndSort 
                    title="Local Tasty Meals 🔥"
                    showNavigation={true}
                    showSeeAll={true}
                  />
                  
                  <RestaurantGrid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                    {restaurants.slice(3, isMobile ? 5 : 6).map((restaurant: Restaurant) => (
                      <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        md={isMobile ? 6 : 4} 
                        lg={isTablet ? 4 : 3} 
                        key={`local-${restaurant.id}`}
                      >
                        <RestaurantCard restaurant={restaurant} />
                      </Grid>
                    ))}
                  </RestaurantGrid>
                </Box>

                <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
                  <SearchAndSort 
                    title="Free drinks for you! 🥤"
                    showNavigation={true}
                    showSeeAll={true}
                  />
                  
                  <RestaurantGrid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                    {restaurants.slice(6, isMobile ? 8 : 9).map((restaurant: Restaurant) => (
                      <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        md={isMobile ? 6 : 4} 
                        lg={isTablet ? 4 : 3} 
                        key={`drinks-${restaurant.id}`}
                      >
                        <RestaurantCard restaurant={restaurant} />
                      </Grid>
                    ))}
                  </RestaurantGrid>
                </Box>
              </>
            )}

            {/* Load More Button */}
            {restaurants.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: { xs: 4, sm: 5, md: 6 } }}>
                <LoadMoreButton data-testid="button-load-more">
                  Load More Restaurants
                </LoadMoreButton>
              </Box>
            )}
          </MainContent>
        </ContentWrapper>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        backgroundColor: '#ffffff', 
        borderTop: '1px solid #e0e0e0', 
        mt: { xs: 6, sm: 7, md: 8 }, 
        py: { xs: 4, sm: 5, md: 6 } 
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <img 
              src="https://heyfood.africa/icons/new/logo-circle-green.svg " 
              alt="HeyFood" 
              style={{ 
                width: 32, 
                height: 32 
              }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '12px', sm: '14px' }
              }}
            >
              © 2024 HeyFood Africa. Order meals from your favorite restaurants.
            </Typography>
          </Box>
        </Container>
      </Box>
    </MainContainer>
  );
}