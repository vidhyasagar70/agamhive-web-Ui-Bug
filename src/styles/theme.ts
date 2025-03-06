export const lightTheme = {
  // Primary colors
  primary: {
    main: '#FFFFFF',     // Pure white - main brand color
    light: '#FFFFFF',    // White - hover states
    dark: '#F8FAFC',     // Very light gray - active states
    contrast: '#1E293B'  // Dark gray - text on primary
  },

  // Secondary colors
  secondary: {
    main: '#FF9F5A',     // Mild orange - secondary actions
    light: '#FFB07D',    // Light orange - hover states
    dark: '#F87F3B',     // Dark orange - active states
    contrast: '#FFFFFF'  // White - text on secondary
  },

  // Background colors
  background: {
    default: '#F9FAFB',  // Very light gray - main background
    paper: '#FFFFFF',    // White - cards, dialogs
    alternate: '#F3F4F6' // Light gray - alternate sections
  },

  // Text colors
  text: {
    primary: '#374151',   // Sophisticated gray - primary text
    secondary: '#6B7280', // Medium gray - secondary text
    disabled: '#9CA3AF'   // Light gray - disabled text
  },

  // Status colors
  status: {
    success: '#059669',   // Green
    warning: '#F59E0B',   // Amber
    error: '#DC2626',     // Red
    info: '#3B82F6'       // Blue
  },

  // Border colors
  border: {
    light: '#E5E7EB',    // Light gray
    main: '#D1D5DB',     // Medium gray
    dark: '#9CA3AF'      // Dark gray
  },

  // Shadow definitions
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.08)'
  },

  // Component-specific styles
  components: {
    // Navigation
    navbar: {
      background: '#FFFFFF',
      border: '#E5E7EB',
      height: '64px'
    },
    
    // Sidebar
    sidebar: {
      background: '#FFFFFF',
      width: '250px',
      activeItem: '#FF9F5A15', // Very light orange for active state
      hoverItem: '#F3F4F6'
    },

    // Cards
    card: {
      background: '#FFFFFF',
      border: '#E5E7EB',
      headerBg: '#F9FAFB',
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)'
    },

    // Forms
    input: {
      background: '#FFFFFF',
      border: '#D1D5DB',
      focusBorder: '#FF9F5A',
      placeholder: '#9CA3AF',
      height: '40px'
    },

    // Buttons
    button: {
      height: '40px',
      borderRadius: '6px',
      padding: '0 16px',
      // Primary Button (White with orange border)
      primary: {
        background: '#FFFFFF',
        hoverBg: '#F9FAFB',
        color: '#FF9F5A',
        border: '#FF9F5A'
      },
      // Secondary Button (Orange)
      secondary: {
        background: '#FF9F5A',
        hoverBg: '#F87F3B',
        color: '#FFFFFF'
      },
      // Outline Button
      outline: {
        border: '#D1D5DB',
        color: '#374151',
        hoverBg: '#F3F4F6'
      }
    },

    // Table
    table: {
      headerBg: '#F9FAFB',
      borderColor: '#E5E7EB',
      hoverBg: '#F3F4F6',
      stripedBg: '#F9FAFB'
    },

    // Modal
    modal: {
      overlay: 'rgba(0, 0, 0, 0.3)',
      background: '#FFFFFF',
      shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    }
  },

  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    sizes: {
      h1: '2rem',
      h2: '1.5rem',
      h3: '1.25rem',
      body: '1rem',
      small: '0.875rem'
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },

  
  layout: {
    maxWidth: '1280px',
    containerPadding: '1rem',
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    }
  }
};

// You can also define a dark theme if needed
export const darkTheme = {
  // ... dark theme colors
}; 