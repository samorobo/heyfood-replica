import { Box, Typography, List, ListItemButton, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Sort as SortIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SidebarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 0,
  minHeight: 'fit-content',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  [theme.breakpoints.down('md')]: {
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
  }
}));

const FixedSidebarWrapper = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 20, // Offset from top when scrolling
  height: 'fit-content',
  maxHeight: 'calc(100vh - 40px)', // Prevent overflow on small screens
  overflowY: 'auto',
  width: 280,
  flexShrink: 0,
  [theme.breakpoints.up('lg')]: {
    width: 300
  },
  [theme.breakpoints.down('md')]: {
    position: 'relative',
    top: 'auto',
    maxHeight: 'none',
    width: '100%',
    marginBottom: 16
  },
  // Custom scrollbar styling for better UX
  '&::-webkit-scrollbar': {
    width: 4
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#e0e0e0',
    borderRadius: 2
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#bdbdbd'
  }
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  [theme.breakpoints.down('md')]: {
    padding: '16px 20px',
    gap: 8
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px 16px',
    gap: 6
  }
}));

const FilterList = styled(List)({
  padding: 0,
});

const FilterListItem = styled(ListItemButton)(({ theme }) => ({
  padding: '14px 24px',
  transition: 'all 0.2s',
  borderRadius: 10,
  margin: '4px 8px',
  [theme.breakpoints.down('md')]: {
    padding: '12px 20px',
    margin: '3px 6px',
    borderRadius: 8
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 16px',
    margin: '2px 4px',
    borderRadius: 6
  },
  '&:hover': {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  '&.active': {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: '#22c55e',
    },
  },
}));

const StoreCount = styled(Typography)(({ theme }) => ({
  color: '#666',
  fontSize: '15px',
  marginTop: 6,
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
    marginTop: 4
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
    marginTop: 3
  }
}));

interface SidebarFiltersProps {
  totalCount: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const sortOptions = [
  'Most Popular',
  'Nearest',
  'Highest rated',
  'Newest',
  'Most Rated',
];

export default function SidebarFilters({
  totalCount,
  sortBy,
  onSortChange,
}: SidebarFiltersProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <FixedSidebarWrapper>
      {/* All Stores Section */}
      <SidebarContainer sx={{ mb: 3 }}>
        <Box sx={{ 
          p: { xs: 2, sm: 2.5, md: 3 }
        }}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="600"
            sx={{ 
              mb: 1,
              fontSize: {
                xs: '16px',
                sm: '18px', 
                md: '20px'
              }
            }}
            data-testid="text-all-stores"
          >
            All Stores
          </Typography>
          <StoreCount data-testid="text-store-count">
            ({totalCount} Stores)
          </StoreCount>
        </Box>
      </SidebarContainer>

      {/* Sort Section */}
      <SidebarContainer>
        <SidebarHeader>
          <SortIcon sx={{ 
            color: '#666', 
            fontSize: { 
              xs: 18, 
              sm: 20, 
              md: 22 
            } 
          }} />
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            fontWeight="600"
            sx={{
              fontSize: {
                xs: '16px',
                sm: '18px',
                md: '20px'
              }
            }}
          >
            Sort
          </Typography>
        </SidebarHeader>
        <FilterList>
          {sortOptions.map((option) => (
            <FilterListItem
              key={option}
              className={sortBy === option ? 'active' : ''}
              onClick={() => onSortChange(option)}
              data-testid={`option-sort-${option
                .toLowerCase()
                .replace(/\s+/g, '-')}`}
            >
              <ListItemText
                primary={option}
                primaryTypographyProps={{
                  fontSize: {
                    xs: '13px',
                    sm: '14px',
                    md: '15px'
                  },
                  fontWeight: sortBy === option ? 600 : 400,
                }}
              />
            </FilterListItem>
          ))}
        </FilterList>
      </SidebarContainer>
    </FixedSidebarWrapper>
  );
}