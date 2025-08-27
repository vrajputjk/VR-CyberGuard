# VRCyber Guard - Mobile Setup Guide

## Mobile Development with Capacitor

VRCyber Guard is now enhanced with Capacitor for native mobile deployment on iOS and Android.

### Quick Setup for Mobile Development

1. **Export to GitHub**: Click the "Export to GitHub" button in Lovable to transfer your project
2. **Clone and Setup**: 
   ```bash
   git clone [your-repo-url]
   cd vr-cybergaurd
   npm install
   ```

3. **Initialize Capacitor** (already configured):
   ```bash
   npx cap init
   ```

4. **Add Platforms**:
   ```bash
   # For Android
   npx cap add android
   
   # For iOS (requires macOS with Xcode)
   npx cap add ios
   ```

5. **Build and Sync**:
   ```bash
   npm run build
   npx cap sync
   ```

6. **Run on Device/Emulator**:
   ```bash
   # Android (requires Android Studio)
   npx cap run android
   
   # iOS (requires macOS with Xcode)
   npx cap run ios
   ```

### Mobile-Optimized Features

#### Touch-Friendly Navigation
- Responsive sidebar that auto-closes on mobile after tool selection
- Touch-optimized buttons and interactive elements
- Swipe-friendly interface elements

#### Mobile Performance Enhancements
- Optimized tool loading with progress indicators
- Reduced memory footprint for mobile devices
- Enhanced touch responsiveness

#### Mobile-Specific Tools Accuracy

1. **Network Scanner**: Enhanced for mobile networks with realistic mobile service detection
2. **DNS Lookup**: Optimized for mobile carrier DNS resolution
3. **IP Lookup**: Mobile IP range detection and carrier identification
4. **Phishing Detector**: Mobile-specific phishing pattern detection
5. **Email Security**: Mobile email client compatibility checks

### Mobile Security Considerations

- All tools work offline where possible
- Secure storage for scan results
- No sensitive data stored in localStorage
- Mobile-optimized cryptographic operations

### Troubleshooting Mobile Issues

1. **Android Build Issues**: Ensure Android Studio is properly installed
2. **iOS Build Issues**: Requires macOS with Xcode 12+
3. **Performance**: Tools are optimized for mobile processors
4. **Network**: Works with mobile data and WiFi

### Development Workflow

1. Make changes in Lovable editor
2. Export to GitHub when ready for mobile testing
3. Pull changes: `git pull origin main`
4. Sync to mobile: `npx cap sync`
5. Test on device: `npx cap run android/ios`

For detailed mobile development guidance, visit: https://lovable.dev/blogs/mobile-development