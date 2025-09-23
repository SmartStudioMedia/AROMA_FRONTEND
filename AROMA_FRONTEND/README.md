# AROMA Restaurant Frontend

A modern, mobile-first digital menu system for AROMA Restaurant. Built with React, Vite, and Tailwind CSS.

## Features

- 🍔 **Dynamic Menu**: Fetches menu items from backend API
- 🌍 **Multi-language Support**: 10 languages with flag emojis
- 📱 **Mobile-First Design**: Optimized for mobile devices
- 🛒 **Smart Cart**: Quantity controls and order management
- 🖼️ **Image Modal**: Click to enlarge item images
- 🎨 **Modern UI**: Clean, professional design with smooth animations
- ⚡ **Fast Loading**: Optimized for performance

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aroma-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your backend URL:
   ```
   VITE_API_BASE=https://your-backend-url.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE` | Backend API URL | Required |
| `NODE_ENV` | Environment | `production` |

## Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push**

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to your hosting service**

## Project Structure

```
src/
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
├── index.css            # Global styles
└── translations.js       # Multi-language support
```

## Features in Detail

### Multi-Language Support
- 10 languages supported
- Flag emojis for each language
- All text content translated
- Language selection persists

### Mobile Optimization
- Touch-friendly interface
- Responsive design
- Fast loading
- Offline-ready (with service worker)

### Cart Management
- Add/remove items
- Quantity controls
- Real-time total calculation
- Order submission

### Image Handling
- Click to enlarge images
- Modal with backdrop blur
- Optimized loading

## Customization

### Adding New Languages
1. Update `translations.js` with new language
2. Add language to `languages` array
3. Include flag emoji

### Styling
- Uses Tailwind CSS
- Custom colors in `tailwind.config.js`
- Responsive breakpoints
- Dark mode ready

### API Integration
- Fetches menu from backend
- Handles errors gracefully
- Cache-busting for fresh data
- CORS support

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured
   - Check API URL is correct

2. **Menu Not Loading**
   - Check network tab for API errors
   - Verify backend is running
   - Check environment variables

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version
   - Update dependencies

### Performance Tips

1. **Image Optimization**
   - Use WebP format when possible
   - Optimize image sizes
   - Lazy load images

2. **Bundle Size**
   - Tree shaking enabled
   - Code splitting
   - Minimal dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@aroma-restaurant.com or create an issue on GitHub.

---

**AROMA Restaurant** - Digital Menu System 🍔✨