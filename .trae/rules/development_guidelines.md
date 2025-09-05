# Development Guidelines for Dualite Platform

## Code Quality Standards

### TypeScript Guidelines
- **Strict Mode**: Always use TypeScript strict mode
- **Type Definitions**: Define all interfaces in `src/types/index.ts`
- **No `any` Types**: Avoid using `any` - use proper typing or `unknown`
- **Null Safety**: Handle null/undefined cases explicitly
- **Generic Types**: Use generics for reusable components and functions

```typescript
// Good
interface BrokerData {
  id: string;
  name: string;
  rating: number | null;
  regulatedBy: string[];
}

// Bad
interface BrokerData {
  id: any;
  name: any;
  rating: any;
  regulatedBy: any;
}
```

### React Component Patterns

#### Functional Components
```typescript
// Preferred pattern
interface ComponentProps {
  title: string;
  onAction: () => void;
  isLoading?: boolean;
}

export function Component({ title, onAction, isLoading = false }: ComponentProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <button onClick={onAction} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Action'}
      </button>
    </div>
  );
}
```

#### Custom Hooks
```typescript
// Pattern for data fetching hooks
export function useBrokers() {
  return useQuery({
    queryKey: ['brokers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Supabase Integration Patterns

#### Database Queries
```typescript
// Good - with proper error handling
export async function getBrokerById(id: string) {
  const { data, error } = await supabase
    .from('brokers')
    .select(`
      *,
      reviews (
        id,
        rating,
        comment,
        created_at,
        users (name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching broker:', error);
    throw new Error('Failed to fetch broker data');
  }

  return data;
}
```

#### Authentication Patterns
```typescript
// Use existing auth context
function ProtectedComponent() {
  const { user, loading } = useAuthContext();

  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginPrompt />;

  return <AuthenticatedContent />;
}
```

### Styling Guidelines

#### Tailwind CSS Best Practices
```typescript
// Good - semantic class grouping
<div className="
  flex items-center justify-between
  p-4 mb-6
  bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  rounded-lg shadow-sm
  hover:shadow-md transition-shadow
">

// Bad - random order
<div className="p-4 flex bg-white rounded-lg items-center border mb-6 shadow-sm">
```

#### Component Variants
```typescript
// Use class-variance-authority for component variants
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Error Handling Patterns

#### React Error Boundaries
```typescript
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

#### API Error Handling
```typescript
// Consistent error handling for API calls
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to create review');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create review');
    },
  });
}
```

### Performance Optimization

#### Code Splitting
```typescript
// Lazy load pages
const BrokerProfilePage = lazy(() => import('../pages/BrokerProfilePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

// Use Suspense for loading states
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/broker/:id" element={<BrokerProfilePage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
</Suspense>
```

#### Memoization
```typescript
// Memoize expensive calculations
const BrokerCard = memo(({ broker }: { broker: Broker }) => {
  const formattedRating = useMemo(() => {
    return broker.rating ? broker.rating.toFixed(1) : 'N/A';
  }, [broker.rating]);

  return (
    <div className="broker-card">
      <h3>{broker.name}</h3>
      <span>Rating: {formattedRating}</span>
    </div>
  );
});
```

### Testing Patterns

#### Component Testing
```typescript
// Test component behavior
import { render, screen, fireEvent } from '@testing-library/react';
import { BrokerCard } from './BrokerCard';

describe('BrokerCard', () => {
  const mockBroker = {
    id: '1',
    name: 'Test Broker',
    rating: 4.5,
    regulatedBy: ['FCA', 'CySEC'],
  };

  it('displays broker information correctly', () => {
    render(<BrokerCard broker={mockBroker} />);
    
    expect(screen.getByText('Test Broker')).toBeInTheDocument();
    expect(screen.getByText('Rating: 4.5')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClickMock = jest.fn();
    render(<BrokerCard broker={mockBroker} onClick={onClickMock} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClickMock).toHaveBeenCalledWith(mockBroker.id);
  });
});
```

### Security Best Practices

#### Input Validation
```typescript
// Use Zod for runtime validation
import { z } from 'zod';

const reviewSchema = z.object({
  brokerId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

export function validateReviewData(data: unknown) {
  return reviewSchema.parse(data);
}
```

#### Environment Variables
```typescript
// Validate environment variables
const env = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing required environment variables');
}
```

### Accessibility Guidelines

#### ARIA Labels and Roles
```typescript
// Proper accessibility implementation
<button
  aria-label={`View details for ${broker.name}`}
  aria-describedby={`broker-${broker.id}-description`}
  onClick={() => navigateToBroker(broker.id)}
>
  <span id={`broker-${broker.id}-description`}>
    {broker.name} - Rating: {broker.rating}/5
  </span>
</button>
```

#### Keyboard Navigation
```typescript
// Handle keyboard events
function SearchInput() {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      performSearch();
    } else if (event.key === 'Escape') {
      clearSearch();
    }
  };

  return (
    <input
      type="search"
      onKeyDown={handleKeyDown}
      aria-label="Search brokers"
      placeholder="Search brokers..."
    />
  );
}
```

### File Organization

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── auth/         # Authentication components
│   ├── landing/      # Homepage components
│   ├── layout/       # Layout components
│   └── shared/       # Shared utility components
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries and configurations
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── contexts/         # React contexts
```

### Git Workflow

#### Commit Messages
```
feat: add broker comparison feature
fix: resolve authentication redirect issue
refactor: optimize broker data fetching
docs: update API documentation
test: add unit tests for review component
style: improve responsive design for mobile
```

#### Branch Naming
```
feature/broker-comparison
fix/auth-redirect-bug
refactor/data-fetching
docs/api-updates
test/review-component
```

These guidelines ensure consistent, maintainable, and high-quality code across the Dualite platform.