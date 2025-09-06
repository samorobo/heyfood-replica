import { Box, Chip, Avatar, Skeleton, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';
import { Tag } from '../types';

const FilterChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: 20,
  padding: '8px 12px',
  fontSize: '14px',
  fontWeight: 400,
  cursor: 'pointer',
  transition: 'all 0.2s',
  minWidth: 'fit-content',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('md')]: {
    padding: '6px 10px',
    fontSize: '13px',
    borderRadius: 16
  },
  [theme.breakpoints.down('sm')]: {
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: 14
  },
  '&:hover': {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.05)'
  },
  '&.active': {
    backgroundColor: '#22c55e',
    color: '#ffffff',
    borderColor: '#22c55e',
    '&:hover': {
      backgroundColor: '#16a34a'
    }
  }
}));

const ScrollContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  width: '100%'
});

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 12,
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  paddingY: 8,
  flex: 1,
  marginX: 8,
  [theme.breakpoints.down('md')]: {
    gap: 10,
    paddingY: 6,
    marginX: 6
  },
  [theme.breakpoints.down('sm')]: {
    gap: 8,
    paddingY: 4,
    marginX: 4
  }
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  width: 32,
  height: 32,
  minWidth: 32,
  [theme.breakpoints.down('md')]: {
    width: 28,
    height: 28,
    minWidth: 28
  },
  [theme.breakpoints.down('sm')]: {
    width: 24,
    height: 24,
    minWidth: 24
  },
  '&:hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#22c55e'
  }
}));

interface CategoryFiltersProps {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagId: string) => void;
  isLoading?: boolean;
}

export default function CategoryFilters({ tags, selectedTags, onTagSelect, isLoading }: CategoryFiltersProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = isSmall ? -150 : isMobile ? -200 : -250;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = isSmall ? 150 : isMobile ? 200 : 250;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ py: { xs: 1, sm: 1.5, md: 2 } }}>
        <ScrollContainer>
          <ScrollButton disabled>
            <ChevronLeft sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
          </ScrollButton>
          <TagsContainer>
            {[...Array(8)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={isSmall ? 80 : isMobile ? 90 : 100}
                height={isSmall ? 28 : isMobile ? 30 : 32}
                sx={{ borderRadius: '16px', flexShrink: 0 }}
              />
            ))}
          </TagsContainer>
          <ScrollButton disabled>
            <ChevronRight sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
          </ScrollButton>
        </ScrollContainer>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 1, sm: 1.5, md: 2 } }}>
      <ScrollContainer>
        <ScrollButton onClick={scrollLeft}>
          <ChevronLeft sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
        </ScrollButton>
        <TagsContainer ref={scrollContainerRef}>
          {tags.map((tag) => (
            <FilterChip
              key={tag.id}
              className={selectedTags.includes(tag.id) ? 'active' : ''}
              avatar={
                <Avatar
                  src={tag.iconUrl}
                  alt={tag.name}
                  sx={{ 
                    width: { xs: 12, sm: 14, md: 16 }, 
                    height: { xs: 12, sm: 14, md: 16 } 
                  }}
                />
              }
              label={tag.name}
              onClick={() => onTagSelect(tag.id)}
              data-testid={`chip-category-${tag.name.toLowerCase().replace(/\s+/g, '-')}`}
            />
          ))}
        </TagsContainer>
        <ScrollButton onClick={scrollRight}>
          <ChevronRight sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
        </ScrollButton>
      </ScrollContainer>
    </Box>
  );
}