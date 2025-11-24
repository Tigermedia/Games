# Changelog - טופס הגדרת סוכן AI

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-11-17

### Added - Section 5 Major Enhancements

#### New "אודות העסק" Section
- Added new section at the beginning of Section 5
- Toggle between text input and URL input modes
- Two prominent toggle buttons: "כתוב תוכן" and "הוסף קישור"
- Visual toggle with blue highlight on active mode
- Users can provide business information either as text OR as a link
- Fields:
  - `aboutBusiness` - Free text about the business
  - `aboutBusinessUrl` - URL to business information page

#### Dynamic Reference URL Fields (5.5)
- Converted "קישורים למקורות עזר" from single textarea to dynamic URL array
- Start with 1 URL input field (minimum required)
- "הוסף קישור נוסף" button with Plus icon
- Delete button (Trash icon) next to each URL field
- Delete button disabled when only 1 field remains
- Maximum 10 URL fields can be added
- Each field has proper URL validation
- LinkIcon displayed next to each URL input
- Proper error messages for invalid URLs

#### Layout Improvements
- Moved "חשוב לדעת" (Important to Know) box to the TOP of Section 5
- Box now appears before any input fields
- Improved information hierarchy and user guidance

### Changed

#### Type Definitions (src/types/form.ts)
- Updated `section5Schema`:
  - Added `aboutBusiness: z.string().optional()`
  - Added `aboutBusinessUrl: z.string().url().optional().or(z.literal(''))`
  - Changed `references` from optional string to `z.array(z.string().url().or(z.literal(''))).optional()`
  - URL validation allows empty strings or valid URLs

#### Component Updates (src/components/Section5.tsx)
- Complete rewrite of Section5 component
- Added new imports:
  - `useState` from React for toggle state
  - `useEffect` from React for array initialization
  - `UseFormSetValue` from react-hook-form
  - `Link as LinkIcon` from lucide-react
- Added state management:
  - `aboutInputMode` state for text/URL toggle
  - `references` watch for dynamic URL array
- Added initialization:
  - `useEffect` to initialize empty references array
  - Prevents blank page issue
- Added new functions:
  - `addReference()`: Adds new empty URL to array (max 10)
  - `removeReference(index)`: Removes URL at index (min 1)
- New UI components:
  - Toggle buttons for "אודות העסק" mode selection
  - Conditional rendering based on toggle state
  - Dynamic URL fields with add/remove controls
  - LinkIcon visual indicator for URL fields

#### App Component (src/App.tsx)
- Updated Section5 render in `renderSection()` function:
  - Added `watch={watch}` prop to Section5 component
  - Added `setValue={setValue}` prop to Section5 component
  - Now passes: `register`, `errors`, `watch`, and `setValue`
- Removed unused `React` import (TypeScript optimization)

#### Export Utilities (src/utils/export.ts)
- Updated `generateEmailBody()` function for Section 5:
  - Added aboutBusiness display
  - Added aboutBusinessUrl display
  - Changed references from single field to array iteration
  - References now displayed as numbered list
  - Added separateDocumentation checkbox indicator
- Updated Section 3 export:
  - Changed from fixed responsibility fields to array mapping
  - Dynamic numbering based on actual responsibilities
  - Updated personality traits to use preset labels or custom text
- Added new helper function:
  - `getPersonalityLabel(preset)`: Returns Hebrew labels for personality presets

### Fixed

#### Critical Bug Fixes
- **Section 3 Blank Page Issue**:
  - Root cause: Uninitialized responsibilities array
  - Fixed by adding `useEffect` hook to initialize with `['']`
  - Ensures array always has at least one element
  - Prevents rendering errors and blank pages

- **Section 5 Missing Props**:
  - Added `watch` and `setValue` props in App.tsx
  - Enables dynamic array functionality
  - Fixes TypeScript interface requirements

### Technical Details

#### Form Validation Updates
- Section 5 references validation:
  - Array of URLs with proper validation
  - Each URL can be empty string OR valid URL
  - Uses Zod's `.or(z.literal(''))` for optional URL pattern
- aboutBusinessUrl validation:
  - Optional field that accepts valid URLs or empty string
  - Proper error messaging in Hebrew

#### State Management
- Uses `setValue` from react-hook-form for programmatic updates
- Local `useState` for UI toggle state (aboutInputMode)
- `watch` for reactive updates based on form values
- Dynamic array manipulation with add/remove operations
- Proper initialization with `useEffect` hooks

#### UI/UX Improvements
- **Toggle buttons** (אודות העסק):
  - Full-width flex layout
  - Primary blue color on active state
  - Smooth transitions
  - Clear visual feedback
- **URL fields**:
  - LinkIcon for visual clarity
  - Flex layout with delete button
  - Add button with icon and text
  - Disabled delete when only 1 field
  - Red border on validation error
- **Layout order**:
  1. Important box (moved to top)
  2. אודות העסק (new)
  3. 5.1 סקירת מוצרים (required)
  4. 5.2 מפרט (optional)
  5. 5.3 מחירים (optional)
  6. 5.4 הזמנות (optional)
  7. 5.5 קישורים (dynamic URLs)
  8. Separate documentation checkbox

#### Data Migration Considerations
- Old Section 5 data structure remains compatible
- New fields are optional, won't break existing saved data
- References field migration:
  - Old: Single string (optional)
  - New: Array of strings (optional)
  - App handles both gracefully

### Developer Experience
- All TypeScript errors resolved
- Clean compilation with `tsc --noEmit`
- Proper type safety maintained
- Export functions updated for new structure
- No breaking changes to other components

---

## [1.1.0] - 2025-11-17

### Added - Section 3 Major Enhancements

#### 3.1 תפקיד (Role) - Pre-made Options
- Added 8 pre-made role buttons for quick selection:
  - נציג שירות לקוחות (Customer Service Representative)
  - יועץ מכירות (Sales Consultant)
  - מתאם פגישות (Appointment Coordinator)
  - מומחה טכני (Technical Expert)
  - מנהל קשרי לקוחות (Customer Relations Manager)
  - נציג תמיכה (Support Representative)
  - יועץ פיננסי (Financial Advisor)
  - מנהל חשבון (Account Manager)
- Role buttons have active state (blue highlight when selected)
- Custom text input still available below buttons
- Clicking button auto-fills the role field

#### 3.2 אחריות עיקרית (Key Responsibilities) - Dynamic Fields
- Changed from 5 fixed responsibility fields to dynamic array system
- Now starts with 1 responsibility field (minimum required)
- Added "הוסף אחריות נוספת" (Add Another Responsibility) button with Plus icon
- Added delete button (Trash icon) next to each responsibility
- Delete button disabled when only 1 responsibility remains
- Maximum 10 responsibilities can be added
- Each field has placeholder with examples
- Improved validation for array-based responsibilities

#### 3.4 תכונות אישיות (Personality Traits) - Pre-made Profiles
- Added 6 personality preset options as large selectable cards:
  1. **עוזר וסבלני** (Helpful & Patient)
     - Traits: "סבלני, מקשיב בקפידה, מסביר בבהירות, מעודד, מכבד את זמן הלקוח, נחוש למצוא פתרונות"
  2. **מקצועי ויעיל** (Professional & Efficient)
     - Traits: "ממוקד, יעיל, עניני, מדויק, מקצועי, מסודר בעבודה, מספק מידע רלוונטי בלבד"
  3. **חברותי וחם** (Friendly & Warm)
     - Traits: "חברי, חם, נגיש, אופטימי, יוצר קשר אישי, משתמש בהומור במידה, מעורר אמון"
  4. **מומחה ובטוח** (Expert & Confident)
     - Traits: "בטוח בעצמו, מקצועי ברמה גבוהה, בעל ידע רחב, מסוגל להתמודד עם אתגרים, מעביר ביטחון"
  5. **אמפתי ואכפתי** (Empathetic & Caring)
     - Traits: "אמפתי, אכפתי, מבין צרכים רגשיים, תומך, מרגיע, מראה הבנה אמיתית, מתחשב ברגשות"
  6. **מותאם אישית** (Custom)
     - Opens textarea for manual trait entry (min 10 characters)
- Preset cards show full trait description
- Selected card highlights in primary blue color
- Custom textarea only appears when "מותאם אישית" is selected
- Auto-fills personality traits when preset is selected

### Changed

#### Type Definitions (src/types/form.ts)
- Updated `section3Schema`:
  - Changed `responsibilities` from object with 5 fixed fields to `z.array()`
  - Minimum 1 responsibility required, each must be non-empty string
  - Removed fixed fields: `responsibility1` through `responsibility5`
  - Added `personalityTraitsPreset` (optional string)
  - Added `personalityTraitsCustom` (optional string)
  - Added custom validation using `.refine()`:
    - If preset is 'custom', requires custom text with min 10 characters
    - Otherwise, requires a preset to be selected

#### Component Updates (src/components/Section3.tsx)
- Complete rewrite of Section3 component
- Added new imports:
  - `useState` from React for local state management
  - `UseFormSetValue` from react-hook-form
  - `Plus, Trash2` icons from lucide-react
- Added new props:
  - `setValue: UseFormSetValue<FormData>` for programmatic form updates
- Added constants:
  - `roleOptions`: Array of 8 pre-made role strings
  - `personalityPresets`: Array of 6 preset objects with value, label, and traits
- Added state management:
  - `roleInput` state for controlled role input
  - `selectedPersonality` watch for personality preset selection
  - `responsibilities` watch for dynamic responsibility array
- Added new functions:
  - `addResponsibility()`: Adds new empty responsibility to array
  - `removeResponsibility(index)`: Removes responsibility at index
  - `handleRoleSelect(role)`: Sets role value and updates input
  - `handlePersonalitySelect(preset)`: Sets personality preset and traits
- Improved UI/UX:
  - Role section now has grid of clickable buttons
  - Responsibilities have individual add/remove controls
  - Personality traits displayed as large descriptive cards
  - Conditional rendering for custom personality textarea
  - Hidden input field for personality preset value

#### App Component (src/App.tsx)
- Updated Section3 render in `renderSection()` function:
  - Added `setValue={setValue}` prop to Section3 component
  - Now passes: `register`, `errors`, `watch`, and `setValue`

### Technical Details

#### Form Validation Updates
- Responsibilities validation changed from object-based to array-based
- Each responsibility validated individually (min 1 char)
- Array must contain at least 1 responsibility
- Personality validation uses custom refine logic:
  ```typescript
  .refine(
    (data) => data.personalityTraitsPreset === 'custom'
      ? (data.personalityTraitsCustom && data.personalityTraitsCustom.length >= 10)
      : !!data.personalityTraitsPreset,
    {
      message: 'יש לבחור תכונות אישיות או להזין תכונות מותאמות אישית',
      path: ['personalityTraitsCustom'],
    }
  )
  ```

#### State Management
- Uses `setValue` from react-hook-form for programmatic updates
- Local `useState` for controlled inputs (roleInput)
- `watch` for reactive updates based on form values
- Dynamic array manipulation with add/remove operations

#### UI/UX Improvements
- **Role buttons**:
  - 2-4 column grid (responsive)
  - Blue highlight on selection
  - Hover effects on all buttons
- **Responsibility fields**:
  - Flex layout with delete button
  - Add button with icon and text
  - Disabled delete when only 1 field
  - Red highlight on error
- **Personality cards**:
  - 1-2 column grid (responsive)
  - Large clickable cards
  - Full trait description visible
  - Blue highlight on active
  - Conditional textarea rendering

### Developer Experience
- Hot Module Replacement (HMR) works perfectly
- TypeScript types updated and fully typed
- No breaking changes to other components
- Backward compatible with existing saved data

### Performance
- No performance impact
- Efficient array operations
- Minimal re-renders with proper React optimization

---

## [1.0.0] - 2025-11-17

### Added - Initial Release

#### Project Setup
- Initialized React 18 + TypeScript + Vite project
- Configured Tailwind CSS with RTL support
- Set up ESLint and TypeScript strict mode
- Added development and build scripts

#### Core Dependencies
- `react` and `react-dom` (v18.3.1)
- `react-hook-form` (v7.53.2) - Form state management
- `zod` (v3.23.8) - Schema validation
- `@hookform/resolvers` (v3.9.1) - Form validation integration
- `lucide-react` (v0.469.0) - Icon library
- `jspdf` (v2.5.2) - PDF generation
- `html2canvas` (v1.4.1) - Screenshot utility

#### Form Sections (7 Total)

##### Section 1: שם הסוכן (Agent Name)
- Single text input field
- Required validation
- Placeholder with examples
- Info box with tips

##### Section 2: תיאור הסוכן (Agent Description)
- Large textarea (2-3 sentences)
- Character counter (500 max)
- Min 20 characters validation
- Color-coded counter (green/orange/red)
- Info box with good description guidelines

##### Section 3: פרסונה ותפקיד (Persona & Role)
- **3.1**: Role text input (required)
- **3.2**: 5 numbered responsibility fields (all required)
- **3.3**: Response style with:
  - Communication tone (4 radio options)
  - Language (4 radio options + conditional "other" input)
  - Emoji usage (3 radio options)
  - Response length (3 radio options with descriptions)
- **3.4**: Personality traits textarea (min 10 chars)

##### Section 4: מיומנויות (Skills)
- **4.1**: Core capabilities (8 checkboxes + conditional "other" input)
- **4.2**: Workflow scenarios (4 required textareas + 1 optional):
  - Greeting scenario
  - Help request scenario
  - Cannot help scenario
  - Frustrated user scenario
  - Additional scenarios (optional)

##### Section 5: מוצרים ושירותים (Products & Services)
- **5.1**: Products overview (required textarea)
- **5.2**: Specifications (optional textarea)
- **5.3**: Pricing information (optional textarea)
- **5.4**: Booking options (optional textarea)
- **5.5**: References (optional textarea)
- Checkbox for separate documentation

##### Section 6: אילוצים ומגבלות (Constraints & Limitations)
- **6.1**: Should discuss (green-tinted textarea, required)
- **6.2**: Should NOT discuss (red-tinted textarea, required)
- **6.3**: Confidential info (yellow-tinted textarea, optional)
- **6.4**: Behavioral restrictions (5 checkboxes + conditional "other")
- **6.5**: Escalation rules (required textarea)

##### Section 7: פרטי קשר (Contact Information)
- Full name (required)
- Email (required, email validation)
- Phone (required, min 9 digits)
- Company name (required)
- Privacy notice box

#### UI Components

##### ProgressIndicator Component
- Progress bar with percentage
- Section dots with numbers/checkmarks
- Click to jump to any section
- Visual indication of current section
- Responsive - hides on mobile, shows on desktop

##### Navigation Component
- Previous button (with ChevronRight icon)
- Next button (with ChevronLeft icon)
- Submit button for last section (with Send icon)
- Current section counter
- Disabled states for first/last sections

##### Success Screen
- Large checkmark icon in green circle
- Success message in Hebrew
- Three action buttons:
  - Download JSON
  - Send via Email
  - Copy to Clipboard
- Return to form button
- Gradient background

#### Features

##### Form Management
- React Hook Form integration
- Zod schema validation
- Real-time error messages in Hebrew
- Field-level validation (onBlur)
- Required field indicators (*)
- Character counters where applicable

##### Auto-Save System
- Automatic save to localStorage every 30 seconds
- Manual save button in header
- Last saved timestamp display
- Data persistence across browser sessions
- Load saved data on mount

##### Data Export
- **JSON Export**: Download complete form data as JSON file
- **Email Export**: Open email client with pre-filled content
- **Clipboard Export**: Copy formatted text to clipboard
- All exports include Hebrew labels
- Helper functions for label translation

##### Navigation System
- 7-section form with smooth transitions
- Progress tracking (0-100%)
- Jump to any section from progress indicator
- Previous/Next buttons
- Section validation before moving forward
- Scroll to top on section change

##### Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: 320px-768px
  - Tablet: 768px-1280px
  - Desktop: 1280px+
- Mobile sidebar menu (hamburger)
- Collapsible navigation on mobile
- Grid layouts adapt to screen size (1-4 columns)

##### RTL Support
- Full right-to-left layout
- Hebrew text rendering
- Proper RTL input fields
- RTL-aware flexbox and grid
- System fonts with Hebrew support

##### Styling
- Tailwind CSS utility classes
- Custom color palette (blues and grays)
- Smooth transitions and animations
- Hover effects on interactive elements
- Focus states for accessibility
- Print-friendly CSS (.no-print class)

#### Utility Functions

##### Storage Utils (src/utils/storage.ts)
- `saveToLocalStorage(data)`: Save form data
- `loadFromLocalStorage()`: Load saved data
- `clearLocalStorage()`: Clear all saved data
- `getLastSaveTimestamp()`: Get last save time

##### Export Utils (src/utils/export.ts)
- `exportToJSON(data, filename)`: Download as JSON
- `generateEmailBody(data)`: Create email content
- `copyToClipboard(text)`: Copy to clipboard
- `openEmailClient(data)`: Open mailto link
- Label translation helper functions:
  - `getToneLabel()`
  - `getEmojiLabel()`
  - `getLengthLabel()`
  - `getCapabilityLabel()`
  - `getRestrictionLabel()`

#### Type System (src/types/form.ts)
- Complete TypeScript definitions
- 7 section schemas with Zod
- Individual section types exported
- Combined FormData type
- Inferred types from Zod schemas

#### Header & Footer

##### Sticky Header
- Form title
- Mobile menu button (hamburger)
- Save button with timestamp
- Clear button with confirmation
- Sticky positioning

##### Footer
- Copyright notice
- Hidden in print mode

#### Additional Features
- Clear form with confirmation dialog
- Success message after submission
- Error handling with Hebrew messages
- Loading states
- Smooth scrolling
- Keyboard navigation support
- ARIA labels for accessibility

#### Documentation
- README.md - Complete project documentation
- QUICK_START.md - Quick start guide in Hebrew
- FEATURES.md - Detailed feature list (40+ features)
- DEPLOYMENT.md - Deployment guide for 6 platforms

#### Development Setup
- Vite dev server configuration
- Hot Module Replacement (HMR)
- TypeScript strict mode
- ESLint configuration
- PostCSS with Tailwind
- Autoprefixer

#### Build Configuration
- Production build optimization
- Code splitting
- Tree shaking
- Minification
- CSS purging
- Source maps

---

## Version Notes

### [1.1.0] - Focus: Enhanced User Experience
Major improvements to Section 3 with pre-made options and dynamic fields, significantly improving data entry speed and user experience.

### [1.0.0] - Focus: Complete Feature Set
Initial release with all 7 sections, full validation, auto-save, export functionality, and responsive design.

---

## Upcoming Features (Planned)

### [1.2.0] - Planned
- [ ] PDF export with proper RTL styling
- [ ] Dark mode support
- [ ] Multi-language support (English, Arabic)
- [ ] Drag & drop file upload
- [ ] Preview mode before submission
- [ ] Template library for common agent types

### [1.3.0] - Planned
- [ ] Cloud save integration
- [ ] Collaboration features
- [ ] Version history
- [ ] Export to other formats (Word, CSV)
- [ ] Analytics integration
- [ ] A/B testing for form variations

---

## Technical Debt & Improvements

### Known Issues
- None currently

### Future Optimizations
- Consider React.memo for section components
- Add loading skeleton for better perceived performance
- Implement service worker for offline support
- Add unit tests with Vitest
- Add E2E tests with Playwright

---

## Contributors
- Initial development: AI Assistant (Claude)
- Project requirements: User

## License
MIT License - Free for personal and commercial use

---

**For detailed feature information, see [FEATURES.md](FEATURES.md)**
**For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)**
**For quick start, see [QUICK_START.md](QUICK_START.md)**
