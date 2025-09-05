# User Rules for Dualite - Forex Broker Review Platform

## Project Overview
Dualite is a comprehensive forex broker review and comparison platform built with React, TypeScript, Tailwind CSS, and Supabase. The platform provides broker analysis, educational content, trading simulators, and user authentication.

## User Guidelines

### 1. Authentication & User Management
- **Always use Supabase authentication** for user management
- Implement proper Row Level Security (RLS) policies for all database operations
- Use the existing `AuthContext` and `useAuth` hook for authentication state
- Protect sensitive routes with `ProtectedRoute` component
- Never expose sensitive user data in client-side code

### 2. Database Operations
- **Use Supabase client** from `src/lib/supabase.ts` for all database operations
- Follow the established database schema in `supabase/migrations/20250111_initial_schema.sql`
- Implement proper error handling for all database queries
- Use React Query (`@tanstack/react-query`) for data fetching and caching
- Always validate data before database operations

### 3. Code Standards
- **TypeScript**: Use strict typing, define interfaces in `src/types/index.ts`
- **React**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes, follow the design system
- **Components**: Use Radix UI components from `src/components/ui/`
- **State Management**: Use React Query for server state, React Context for global client state

### 4. Security Requirements
- **Never commit sensitive data** (API keys, passwords, secrets)
- Use environment variables for configuration (`.env` file)
- Implement proper input validation and sanitization
- Follow OWASP security guidelines for web applications
- Use HTTPS in production environments

### 5. Performance Guidelines
- **Optimize images**: Use appropriate formats and sizes
- **Code splitting**: Implement lazy loading for routes and components
- **Database queries**: Use indexes and optimize query performance
- **Caching**: Leverage React Query caching strategies
- **Bundle size**: Monitor and optimize JavaScript bundle size

### 6. Content Guidelines
- **Broker Information**: Ensure accuracy of broker data and ratings
- **Educational Content**: Provide valuable, accurate financial education
- **Regulatory Compliance**: Include proper disclaimers and risk warnings
- **SEO**: Implement proper meta tags, structured data, and semantic HTML

### 7. Testing Requirements
- Write unit tests for utility functions and hooks
- Implement integration tests for critical user flows
- Test authentication and authorization flows thoroughly
- Validate database operations and RLS policies
- Test responsive design across different devices

### 8. Deployment & Environment
- **Development**: Use `npm run dev` for local development
- **Environment Variables**: Configure Supabase URL and keys properly
- **Build Process**: Ensure clean builds with `npm run build`
- **Version Control**: Use meaningful commit messages and branch names

### 9. Data Migration & Updates
- **Brand Migration**: Replace all "DailyForex" references with "Broker Analysis"
- **Contact Information**: Use the new address and contact details:
  - Address: 30 N Gould St Ste R, Sheridan, WY 82801, US
  - EIN: 384298140
  - Phone: (801)-893-2577

### 10. Feature Development Workflow
- **Planning**: Create detailed implementation plans using Byterover MCP tools
- **Context Gathering**: Use module tools to understand existing codebase
- **Implementation**: Follow established patterns and conventions
- **Testing**: Validate functionality and user experience
- **Documentation**: Update relevant documentation and comments

### 11. Error Handling
- Implement comprehensive error boundaries
- Provide user-friendly error messages
- Log errors appropriately for debugging
- Handle network failures gracefully
- Implement retry mechanisms for critical operations

### 12. Accessibility
- Follow WCAG 2.1 AA guidelines
- Implement proper ARIA labels and roles
- Ensure keyboard navigation support
- Test with screen readers
- Maintain proper color contrast ratios

### 13. API Integration
- Use Supabase APIs for all backend operations
- Implement proper rate limiting and error handling
- Cache API responses appropriately
- Handle API versioning and deprecation

### 14. Monitoring & Analytics
- Implement user analytics for feature usage
- Monitor application performance metrics
- Track error rates and user feedback
- Set up alerts for critical issues

## Prohibited Actions
- **Never hardcode sensitive information** in source code
- **Don't bypass authentication** or authorization checks
- **Avoid direct DOM manipulation** - use React patterns
- **Don't ignore TypeScript errors** - fix them properly
- **Never commit broken code** to main branch
- **Don't use deprecated APIs** or libraries

## Emergency Procedures
- **Security Issues**: Immediately report and patch security vulnerabilities
- **Data Breaches**: Follow incident response procedures
- **Service Outages**: Implement fallback mechanisms and user notifications
- **Critical Bugs**: Prioritize fixes and deploy hotfixes when necessary

## Resources
- **Documentation**: Refer to Supabase docs for database operations
- **Design System**: Follow Radix UI and Tailwind CSS documentation
- **TypeScript**: Use official TypeScript handbook for best practices
- **React**: Follow React official documentation and patterns

---

**Remember**: This platform handles financial information and user data. Always prioritize security, accuracy, and user experience in all development decisions.