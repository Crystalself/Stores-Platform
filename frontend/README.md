# Professional E-Commerce Platform

A comprehensive Next.js e-commerce platform with Material-UI (MUI), AI integration, and AR capabilities.

## Project Structure

```
src/
├── app/             # Next.js pages and layouts using App Router
├── components/      # UI components (reusable React components)
├── config/          # General configuration files (theme settings, constants, environment variables)
├── contexts/        # React Context providers and hooks (e.g., AuthContext, ThemeContext)
├── hooks/           # Custom React hooks for logic reuse
├── lib/             # Application utilities and helpers (e.g., API clients, authentication utilities)
├── messages/        # Localization translation JSON files for each language
├── middleware.js    # Middleware functions, e.g., for internationalization routing
├── models/          # Data models or types (e.g., Prisma schemas, TypeScript types)
├── services/        # API service calls and business logic (e.g., fetch products, user auth)
├── store/           # State management (e.g., Redux slices, Zustand stores)
├── styles/          # Global style files (Tailwind config, MUI theme overrides, CSS)
└── i18n.js          # Internationalization configuration
```

## Features

- 🌍 **Internationalization**: Multi-language support (English/Arabic)
- 🎨 **Material-UI**: Professional design system with custom theme
- 🌙 **Dark/Light Mode**: Complete theme switching with persistence
- 🤖 **AI Integration**: Product recommendations, search, and chatbots
- 🥽 **AR Support**: Virtual try-on and product visualization
- 📱 **Responsive Design**: Mobile-first approach
- ⚡ **Performance**: Optimized for speed and SEO

## Theme System

### Color Palette
- **Primary**: Professional blue gradient for brand identity
- **Secondary**: Complementary colors for accents
- **Success**: Green tones for positive actions
- **Warning**: Amber for alerts and notifications
- **Error**: Red for errors and destructive actions
- **Info**: Blue for informational content
- **Neutral**: Grays for text and backgrounds

### Typography
- **Heading Fonts**: Modern sans-serif for titles
- **Body Fonts**: Readable fonts for content
- **Code Fonts**: Monospace for technical content
- **Arabic Support**: RTL typography with proper font weights

### Components
- **Buttons**: Multiple variants (contained, outlined, text, icon)
- **Cards**: Product cards with hover effects
- **Navigation**: Responsive navigation with mobile menu
- **Forms**: Styled form components with validation
- **Modals**: Overlay components for dialogs
- **Tables**: Data display with sorting and pagination
- **Charts**: Data visualization components
- **AR Components**: 3D product viewers and virtual try-on

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Theme Customization

The theme system is located in `src/config/theme.js` and includes:
- Color palette definitions
- Typography scale
- Component style overrides
- Dark/light mode variants
- Responsive breakpoints
- Animation configurations

## AI & AR Integration

- **Product Recommendations**: ML-powered suggestions
- **Visual Search**: Image-based product search
- **Virtual Try-On**: AR product visualization
- **Chatbot Support**: AI-powered customer service
- **Voice Search**: Speech-to-text product search

## Contributing

1. Follow the established folder structure
2. Use the theme system for consistent styling
3. Implement responsive design patterns
4. Add proper TypeScript types
5. Include accessibility features 