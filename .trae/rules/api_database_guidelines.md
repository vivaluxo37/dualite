# API & Database Guidelines for Dualite Platform

## Supabase Database Schema Reference

### Core Tables Structure

#### Users Table
```sql
users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)
```

#### Brokers Table
```sql
brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  min_deposit DECIMAL(10,2),
  max_leverage TEXT,
  spread_from DECIMAL(4,2),
  regulated_by TEXT[],
  trading_platforms TEXT[],
  account_types JSONB,
  features JSONB,
  pros TEXT[],
  cons TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)
```

#### Reviews Table
```sql
reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  trading_experience experience_level,
  account_type TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)
```

## Database Query Patterns

### Basic CRUD Operations

#### Fetching Brokers
```typescript
// Get all brokers with pagination
export async function getBrokers({
  page = 1,
  limit = 20,
  sortBy = 'rating',
  order = 'desc',
  search,
  regulatedBy,
}: GetBrokersParams) {
  let query = supabase
    .from('brokers')
    .select(`
      id,
      name,
      description,
      logo_url,
      rating,
      review_count,
      min_deposit,
      max_leverage,
      spread_from,
      regulated_by,
      trading_platforms,
      is_featured
    `);

  // Apply search filter
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  // Apply regulation filter
  if (regulatedBy?.length) {
    query = query.overlaps('regulated_by', regulatedBy);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: order === 'asc' });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch brokers: ${error.message}`);
  }

  return {
    data: data || [],
    count: count || 0,
    hasMore: (count || 0) > page * limit,
  };
}
```

#### Fetching Broker Details
```typescript
// Get broker with reviews and related data
export async function getBrokerDetails(brokerId: string) {
  const { data, error } = await supabase
    .from('brokers')
    .select(`
      *,
      reviews (
        id,
        rating,
        comment,
        trading_experience,
        account_type,
        is_verified,
        created_at,
        users (
          name,
          avatar_url
        )
      )
    `)
    .eq('id', brokerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Broker not found');
    }
    throw new Error(`Failed to fetch broker details: ${error.message}`);
  }

  return data;
}
```

### Review Management

#### Creating Reviews
```typescript
export async function createReview(reviewData: CreateReviewData) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }

  // Check if user already reviewed this broker
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', user.id)
    .eq('broker_id', reviewData.brokerId)
    .single();

  if (existingReview) {
    throw new Error('You have already reviewed this broker');
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      broker_id: reviewData.brokerId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      trading_experience: reviewData.tradingExperience,
      account_type: reviewData.accountType,
    })
    .select(`
      *,
      users (
        name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    throw new Error(`Failed to create review: ${error.message}`);
  }

  return data;
}
```

### User Management

#### User Profile Operations
```typescript
// Update user profile
export async function updateUserProfile(updates: Partial<UserProfile>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      name: updates.name,
      avatar_url: updates.avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data;
}

// Get user shortlist
export async function getUserShortlist() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }

  const { data, error } = await supabase
    .from('user_shortlists')
    .select(`
      broker_id,
      created_at,
      brokers (
        id,
        name,
        logo_url,
        rating,
        min_deposit,
        regulated_by
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch shortlist: ${error.message}`);
  }

  return data;
}
```

## Row Level Security (RLS) Policies

### Understanding RLS Implementation

#### Users Table Policies
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

#### Reviews Table Policies
```sql
-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);
```

### Working with RLS in Code

```typescript
// RLS automatically filters data based on policies
// No additional filtering needed in most cases
export async function getUserReviews() {
  // This will automatically only return reviews for the authenticated user
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      brokers (
        name,
        logo_url
      )
    `);

  if (error) {
    throw new Error(`Failed to fetch user reviews: ${error.message}`);
  }

  return data;
}
```

## Real-time Subscriptions

### Setting up Real-time Updates

```typescript
// Subscribe to broker rating updates
export function useBrokerRatingUpdates(brokerId: string) {
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const subscription = supabase
      .channel(`broker-${brokerId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'brokers',
          filter: `id=eq.${brokerId}`,
        },
        (payload) => {
          if (payload.new.rating !== payload.old.rating) {
            setRating(payload.new.rating);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [brokerId]);

  return rating;
}

// Subscribe to new reviews
export function useNewReviews(brokerId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel(`reviews-${brokerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews',
          filter: `broker_id=eq.${brokerId}`,
        },
        () => {
          // Invalidate and refetch reviews
          queryClient.invalidateQueries({
            queryKey: ['broker-reviews', brokerId],
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [brokerId, queryClient]);
}
```

## Error Handling Patterns

### Database Error Types

```typescript
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export function handleSupabaseError(error: any): never {
  if (error.code === 'PGRST116') {
    throw new DatabaseError('Record not found', error.code);
  }
  
  if (error.code === '23505') {
    throw new DatabaseError('Duplicate entry', error.code);
  }
  
  if (error.code === '23503') {
    throw new DatabaseError('Referenced record does not exist', error.code);
  }
  
  throw new DatabaseError(
    error.message || 'Database operation failed',
    error.code,
    error.details
  );
}
```

### Retry Logic

```typescript
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(2, attempt - 1))
      );
    }
  }

  throw lastError!;
}

// Usage
export async function getBrokersWithRetry(params: GetBrokersParams) {
  return withRetry(() => getBrokers(params));
}
```

## Performance Optimization

### Query Optimization

```typescript
// Use select to limit returned columns
const { data } = await supabase
  .from('brokers')
  .select('id, name, rating, logo_url') // Only needed columns
  .limit(20);

// Use indexes for filtering
const { data } = await supabase
  .from('brokers')
  .select('*')
  .eq('is_featured', true) // Uses index on is_featured
  .order('rating', { ascending: false }); // Uses index on rating

// Avoid N+1 queries with joins
const { data } = await supabase
  .from('reviews')
  .select(`
    *,
    users!inner(name, avatar_url),
    brokers!inner(name, logo_url)
  `)
  .limit(50);
```

### Caching Strategies

```typescript
// React Query configuration for different data types
export const queryConfig = {
  brokers: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  },
  reviews: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
  },
  userProfile: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,    // 30 minutes
  },
};

// Use appropriate cache configuration
export function useBrokers(params: GetBrokersParams) {
  return useQuery({
    queryKey: ['brokers', params],
    queryFn: () => getBrokers(params),
    ...queryConfig.brokers,
  });
}
```

## Security Best Practices

### Input Validation

```typescript
import { z } from 'zod';

// Define validation schemas
export const createReviewSchema = z.object({
  brokerId: z.string().uuid('Invalid broker ID'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000),
  tradingExperience: z.enum(['beginner', 'intermediate', 'advanced']),
  accountType: z.string().optional(),
});

// Validate before database operations
export async function createReviewSafe(rawData: unknown) {
  const validatedData = createReviewSchema.parse(rawData);
  return createReview(validatedData);
}
```

### Rate Limiting

```typescript
// Simple rate limiting for API calls
const rateLimiter = new Map<string, number[]>();

export function checkRateLimit(userId: string, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    throw new Error('Rate limit exceeded');
  }
  
  validRequests.push(now);
  rateLimiter.set(userId, validRequests);
}
```

These guidelines ensure secure, performant, and maintainable database interactions throughout the Dualite platform.