# AI Health Companion - Design Guidelines

## Design Approach
**Selected Approach**: Reference-Based (Healthcare/Medical)
Taking inspiration from modern healthcare platforms like Headspace Health, Babylon Health, and Teladoc, focusing on trust, accessibility, and clean medical interface design.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: 210 85% 25% (deep medical blue)
- Dark Mode: 210 60% 15% (darker medical blue)

**Accent Colors:**
- Success/Health: 145 65% 45% (medical green)
- Warning/Alert: 25 85% 55% (warm orange)
- Emergency: 355 75% 50% (medical red)

**Background Treatment:**
- Subtle gradient overlays from primary to lighter tints
- Clean white/dark backgrounds with minimal texture
- Soft shadows for depth without distraction

### B. Typography
- **Primary**: Inter (clean, medical-grade readability)
- **Accent**: Poppins (friendly headers for comfort)
- Sizes: Large headers for confidence, medium body for clarity

### C. Layout System
**Tailwind Spacing**: Consistent use of 4, 6, 8, 12, 16 units
- p-4, p-6 for components
- m-8, m-12 for section spacing
- h-16, h-20 for interactive elements

### D. Component Library
**Core Elements:**
- Rounded buttons (medical-friendly, non-threatening)
- Card-based information display with soft shadows
- Clear navigation with health-focused iconography
- Form inputs with high contrast for accessibility
- Emergency CTA buttons with distinct red styling

**Navigation:**
- Tab-based navigation for easy thumb access
- Clear icons with text labels
- Emergency SOS always accessible

**Data Displays:**
- Dashboard cards with health metrics
- Progress indicators for health tracking
- Clear status indicators (green/yellow/red)

### E. Page-Specific Treatments

**Home Page:**
- Clean hero section with health-focused imagery
- Quick access cards to main features
- Calming gradient background
- Maximum 4 sections: Hero, Features, Trust indicators, CTA

**SkinCheck & Medical Pages:**
- Camera interface with clear guidelines
- Step-by-step progress indicators
- Reassuring color scheme
- Clear result displays

**Emergency (SOS) Page:**
- High contrast red emergency theme
- Large, easy-to-tap buttons
- Minimal interface for stress situations
- Clear emergency contact display

## Images
**Hero Image**: Large, calming healthcare professional or diverse people using health technology
**Feature Cards**: Icon-based illustrations for each health service
**Trust Indicators**: Medical certifications, security badges
**Emergency Page**: No decorative images - focus on functionality

## Key Principles
1. **Trust**: Medical-grade color scheme and typography
2. **Accessibility**: High contrast, large touch targets
3. **Clarity**: Minimal interface during health emergencies
4. **Comfort**: Rounded elements, calming colors
5. **Efficiency**: Quick access to critical health features