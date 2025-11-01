# HCMUT Peer Tutoring System - AI Coding Instructions

## Project Overview
React + TypeScript + Vite SPA for a university peer tutoring system with dual-role architecture (students and tutors). Uses shadcn/ui components with Radix UI primitives, TailwindCSS, and client-side state management.

## Architecture & Data Flow

### Role-Based Navigation Pattern
`App.tsx` is the single-page router. Navigation is state-driven (`currentPage` state), not URL-based:
- Students: `dashboard` → `tutors` → `register` → `sessions` → `messages` → `profile`
- Tutors: `dashboard` → `schedule` → `students` → `messages` → `profile`
- Switch roles via `LoginPage` demo mode (no real auth)

### State Management
**No Redux/Context** - Props drilling from `App.tsx`:
- `currentUser` (User type from `src/types/index.ts`) flows down to all pages
- `hasConsent` (boolean) controls student data access features
- Page navigation via `onNavigate` callback prop pattern

### Data Layer
`src/data/mockData.ts` contains all mock data:
- `mockStudentUser`, `mockTutorUser` - Demo users
- `mockSubjects`, `mockTutors`, `mockTutoringSessions` - Static arrays
- **No API calls, no backend** - All data is hardcoded for demo

### Consent Flow (Student-Specific)
First-time students see `ConsentDialog.tsx` → localStorage tracks consent → `hasConsent` prop gates dashboard features.

## Component Architecture

### UI Components (`src/components/ui/`)
Follows **shadcn/ui conventions**:
1. Each component imports `cn` utility from `./utils` (NOT `@/lib/utils`)
2. Uses `class-variance-authority` for variant management
3. Radix primitives imported with **versioned paths**: `'@radix-ui/react-dialog@1.1.6'`
4. Never import from `@/components/ui` - use relative paths

### Feature Components Pattern
- **Student**: `src/components/student/*.tsx` - 5 pages + shared logic
- **Tutor**: `src/components/tutor/*.tsx` - 4 pages + shared logic
- Each page receives props from `App.tsx` (no context/hooks for state)

### Styling Approach
- TailwindCSS utility classes directly in JSX
- Gradient backgrounds common: `bg-gradient-to-br from-blue-50 to-white`
- Card-based layouts: `Card` + `CardHeader` + `CardContent` pattern
- Icons from `lucide-react` (standard imports, no version suffix)

## Critical Import Rules

### ❌ BROKEN (Don't Use)
```tsx
import { toast } from 'sonner@2.0.3';  // TypeScript can't resolve versioned imports
import { Button } from '@/components/ui/button';  // Path alias not configured
```

### ✅ CORRECT
```tsx
import { toast } from 'sonner';  // Use package name directly
import { Button } from '../ui/button';  // Relative paths only
import { cn } from './utils';  // UI components import from sibling utils.ts
```

### Vite Config Quirk
`vite.config.ts` has extensive version-aliased imports for Radix packages but **these only work in Radix imports**. Regular packages like `sonner`, `lucide-react` use standard imports.

## Development Workflow

### Commands (PowerShell)
```powershell
npm run dev     # Vite dev server (default port 5173)
npm run build   # Production build to dist/
```

### Common Errors
1. **Type mismatch in LoginPage**: `onLogin` expects `'student' | 'tutor'` but LoginPage defines 5 roles (`'ads' | 'oaa' | 'osa'` unused). Fix: Align type definitions or remove unused roles.
2. **Module not found**: Check import paths use relative (not `@/` alias) and remove version suffixes for non-Radix packages.

### Testing
**No test framework configured** - Manual browser testing only.

## Type System (`src/types/index.ts`)

Key interfaces:
- `User`: Shared base with role discrimination (`'student' | 'tutor'`)
- `Tutor`: Has `availability` (TimeSlot[]), `subjects` (string[] of codes)
- `TutoringSession`: Links student/tutor/subject with `meetings` array
- `Meeting`: Individual session with attendance tracking

## Patterns to Follow

### Adding a New Feature Page
1. Create in `src/components/student/` or `src/components/tutor/`
2. Accept props from App.tsx: `currentUser`, navigation callbacks
3. Add navigation item to `Navigation.tsx` array (`studentNavItems` or `tutorNavItems`)
4. Add route case in `App.tsx` main content section
5. Import mock data from `src/data/mockData.ts`, never fetch APIs

### Creating UI Components
```tsx
import { cn } from './utils';  // From same ui/ folder
import * as React from 'react';

export interface MyComponentProps extends React.ComponentProps<'div'> {
  // Props here
}

export function MyComponent({ className, ...props }: MyComponentProps) {
  return <div className={cn('base-classes', className)} {...props} />;
}
```

### Toast Notifications
```tsx
import { toast } from 'sonner';  // NOT sonner@2.0.3
import { Toaster } from './components/ui/sonner';

// In App.tsx, <Toaster /> is already rendered
toast.success('Title', { description: 'Details' });
```

## File Organization
```
src/
  App.tsx              # Root router & state
  types/index.ts       # All TypeScript interfaces
  data/mockData.ts     # All mock data arrays
  components/
    student/           # 5 student pages
    tutor/             # 4 tutor pages
    ui/                # 40+ shadcn components
    figma/             # ImageWithFallback utility
    Navigation.tsx     # Top navigation bar
    ConsentDialog.tsx  # Student consent modal
    LoginPage.tsx      # Role selection screen
```

## Known Issues
- `LoginPage` role type mismatch (ads/oaa/osa roles defined but unused)
- No path alias configured despite `@:` references in some examples
- README.md is empty - no official documentation
