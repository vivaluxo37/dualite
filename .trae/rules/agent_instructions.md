# Agent Instructions for Dualite Platform

## Mandatory Rule Compliance

**ALL AGENTS MUST FOLLOW THESE INSTRUCTIONS ON EVERY INTERACTION**

This document establishes the mandatory workflow and rule compliance requirements for all AI agents working on the Dualite forex broker review platform.

## Rule File Hierarchy

Agents MUST consult and follow ALL rule files in this order of priority:

1. **`project_rules.md`** - Core project requirements and Byterover workflows
2. **`user_rules.md`** - User interaction and development guidelines
3. **`development_guidelines.md`** - Technical standards and code quality
4. **`api_database_guidelines.md`** - Database and API interaction patterns
5. **`agent_instructions.md`** - This file (workflow enforcement)

## Mandatory Workflow Sequence

### STEP 1: Rule Familiarization (REQUIRED)
Before ANY task execution, agents MUST:

```markdown
1. Read and understand ALL rule files in the `.trae/rules/` directory
2. Identify project-specific requirements from `project_rules.md`
3. Review user guidelines from `user_rules.md`
4. Understand technical standards from `development_guidelines.md`
5. Study database patterns from `api_database_guidelines.md`
```

### STEP 2: Byterover Onboarding Workflow (MANDATORY)
Every agent session MUST start with:

```markdown
1. Call `byterover-check-handbook-existence` to verify handbook status
2. If no handbook exists: Call `byterover-create-handbook`
3. If handbook exists: Call `byterover-check-handbook-sync` for gap analysis
4. Call `byterover-update-handbook` to synchronize with current codebase
5. Call `byterover-list-modules` to understand existing modules
6. Update or create modules using `byterover-store-module` and `byterover-update-module`
```

### STEP 3: Planning Workflow (MANDATORY)
For ANY development task, agents MUST:

```markdown
1. Call `byterover-retrieve-knowledge` to gather relevant context
2. Use `byterover-retrieve-active-plans` if continuing existing work
3. Call `byterover-assess-context-completeness` to ensure sufficient information
4. Create detailed implementation plan with specific todo items
5. Present plan to user for approval
6. **IMMEDIATELY** call `byterover-save-implementation-plan` after user approval
7. Execute implementation following the saved plan
8. Call `byterover-update-plan-progress` for each completed task
9. Mark entire plan complete when all tasks finished
10. Call `byterover-store-knowledge` to save implementation insights
```

## Critical Project Requirements

### Brand Migration (MANDATORY)
**ALL AGENTS MUST:**
- Change ANY reference from "DailyForex" to "Broker Analysis"
- Use correct contact information:
  - Address: 30 N Gould St Ste R, Sheridan, WY 82801, US
  - EIN: 384298140
  - Phone: (801)-893-2577

### Technology Stack Compliance
**ALL CODE MUST USE:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Supabase for backend (PostgreSQL, Auth, Storage)
- Radix UI + Shadcn/ui for components
- React Query for state management
- React Router DOM for routing

### Database Schema Compliance
**ALL DATABASE OPERATIONS MUST:**
- Follow the schema in `supabase/migrations/20250111_initial_schema.sql`
- Respect Row Level Security (RLS) policies
- Use existing indexes for performance
- Leverage existing triggers and functions

### Code Quality Standards
**ALL CODE MUST:**
- Follow TypeScript strict mode
- Use proper error handling with try/catch blocks
- Implement loading states and user feedback
- Follow accessibility guidelines (WCAG 2.1 AA)
- Use semantic HTML and proper ARIA labels
- Optimize for Core Web Vitals

### Security Requirements
**ALL IMPLEMENTATIONS MUST:**
- Use Supabase RLS policies for data access
- Validate all user inputs with Zod schemas
- Implement proper authentication checks
- Never expose sensitive data or API keys
- Use environment variables for configuration

## MCP Server Utilization

### Required MCP Server Usage
Agents MUST utilize ALL available MCP servers:

1. **Byterover MCP** - For knowledge management and planning
2. **Supabase MCP** - For database operations and documentation
3. **Any additional MCP servers** - As appropriate for the task

### MCP Integration Patterns
```markdown
- Always call `byterover-retrieve-knowledge` before starting implementation
- Use Supabase MCP for database schema validation
- Store all implementation insights with `byterover-store-knowledge`
- Update modules frequently with `byterover-update-module`
```

## Error Prevention Checklist

Before completing ANY task, agents MUST verify:

### ✅ Code Quality
- [ ] TypeScript compilation without errors
- [ ] All imports and dependencies resolved
- [ ] Proper error handling implemented
- [ ] Loading states and user feedback included
- [ ] Accessibility requirements met

### ✅ Database Compliance
- [ ] Schema matches `initial_schema.sql`
- [ ] RLS policies respected
- [ ] Proper indexes used for queries
- [ ] Data validation implemented

### ✅ UI/UX Standards
- [ ] Responsive design implemented
- [ ] Shadcn/ui components used correctly
- [ ] Tailwind CSS classes applied properly
- [ ] Loading and error states handled

### ✅ Security & Performance
- [ ] Input validation with Zod schemas
- [ ] Authentication checks in place
- [ ] Environment variables used for secrets
- [ ] Core Web Vitals optimized

### ✅ Brand Compliance
- [ ] No "DailyForex" references remain
- [ ] Correct "Broker Analysis" branding used
- [ ] Proper contact information included

## Workflow Enforcement

### Mandatory Tool Calls
Every agent session MUST include these tool calls:

1. **Session Start:**
   - `byterover-check-handbook-existence`
   - `byterover-list-modules`
   - `byterover-retrieve-knowledge`

2. **During Implementation:**
   - `byterover-assess-context-completeness`
   - `byterover-think-about-collected-information`
   - `byterover-update-plan-progress`

3. **Session End:**
   - `byterover-store-knowledge`
   - `byterover-update-module` (if applicable)

### Quality Assurance
Before marking any task complete, agents MUST:

1. Run comprehensive validation using available MCP servers
2. Verify all rule compliance from the checklist above
3. Test functionality in development environment
4. Ensure proper documentation and knowledge storage

## Failure Recovery

If ANY step in the mandatory workflow fails:

1. **Document the failure** with specific error details
2. **Attempt alternative approaches** using available tools
3. **Escalate to user** if technical blockers prevent progress
4. **Never skip workflow steps** - find workarounds instead

## Continuous Improvement

Agents MUST:
- Store lessons learned using `byterover-store-knowledge`
- Update module insights with `byterover-update-module`
- Contribute to handbook updates when gaps are identified
- Report workflow improvements to enhance future agent performance

---

**REMEMBER: These instructions are MANDATORY for ALL agents. Failure to follow this workflow may result in incomplete implementations, security vulnerabilities, or project inconsistencies.**

**Every agent interaction MUST begin with rule familiarization and Byterover onboarding, followed by proper planning workflow execution.**