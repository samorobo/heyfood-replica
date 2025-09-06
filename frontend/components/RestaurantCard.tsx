import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Star as StarIcon, DeliveryDining } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Restaurant } from '../types';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s',
  cursor: 'pointer',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: 8,
  },
}));

const StatusBadge = styled(Box)<{ status: string }>(({ theme, status }) => ({
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor:
    status === 'Not taking orders' ? '#dc2626' : 'rgba(0, 0, 0, 0.7)',
  color: '#ffffff',
  padding: '4px 8px',
  borderRadius: 12,
  fontSize: '12px',
  fontWeight: 500,
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '10px',
    padding: '2px 6px',
  },
}));

const PromoBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: '#22c55e',
  color: '#ffffff',
  padding: '4px 8px',
  borderRadius: 12,
  fontSize: '12px',
  fontWeight: 500,
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '10px',
    padding: '2px 6px',
  },
}));

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginTop: 4,
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    gap: 2,
  },
}));

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export default function RestaurantCard({
  restaurant,
  onClick,
}: RestaurantCardProps) {
  const handleClick = () => {
    console.log('Navigate to restaurant:', restaurant.name);
    if (onClick) onClick();
  };

  return (
    <StyledCard
      onClick={handleClick}
      data-testid={`card-restaurant-${restaurant.id}`}
    >
      {/* Image + Badges */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={restaurant.imageUrl}
          alt={restaurant.name}
          sx={{
            objectFit: 'cover',
            height: { xs: 160, sm: 180, md: 200 },
          }}
        />
        <StatusBadge status={restaurant.status} data-testid={`status-${restaurant.id}`}>
          {restaurant.status}
        </StatusBadge>
        {restaurant.promoText && (
          <PromoBadge data-testid={`promo-${restaurant.id}`}>
            {restaurant.promoText}
          </PromoBadge>
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ fontSize: { xs: '15px', sm: '16px', md: '18px' }, mb: 0.5 }}
          data-testid={`text-restaurant-name-${restaurant.id}`}
        >
          {restaurant.name}
        </Typography>

        <TagsContainer>
          {restaurant.tags.map((tag, index) => (
            <Typography
              key={tag.id}
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px' } }}
              data-testid={`text-tag-${restaurant.id}-${index}`}
            >
              {tag.name}
              {index < restaurant.tags.length - 1 ? ', ' : ''}
            </Typography>
          ))}
        </TagsContainer>

        {/* Rating */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
          }}
        >
          <StarIcon sx={{ color: '#ffc107', fontSize: { xs: 14, sm: 16 } }} />
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ fontSize: { xs: '12px', sm: '13px' } }}
            data-testid={`text-rating-${restaurant.id}`}
          >
            {typeof restaurant.rating === 'number'
              ? restaurant.rating.toFixed(1)
              : restaurant.rating}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 1, fontSize: { xs: '11px', sm: '12px' } }}
            data-testid={`text-ratings-count-${restaurant.id}`}
          >
            {restaurant.ratingsCount}
          </Typography>
        </Box>

        {/* Delivery Info */}
        {restaurant.deliveryInfo && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 0.5,
            }}
          >
            <DeliveryDining
              sx={{ color: '#f59e0b', fontSize: { xs: 14, sm: 16 } }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: '11px', sm: '12px' } }}
              data-testid={`text-delivery-info-${restaurant.id}`}
            >
              {restaurant.deliveryInfo}
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
}
