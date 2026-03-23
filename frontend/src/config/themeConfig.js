// Centralized Theme Configuration
export const themeConfig = {
  fonts: {
    primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  },
  auth: {
    layoutType: 'split', // 'center' or 'split'
    logo: 'https://www.freelogodesign.org/assets/img/home/icones/business-card-icon.svg',
    splitImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    favicon: 'https://www.freelogodesign.org/assets/img/home/icones/business-card-icon.svg',
  },
  admin: {
    logo: 'https://www.freelogodesign.org/assets/img/home/icones/business-card-icon.svg',
    logoText: 'Admin Dashboard',
    needThemeChange: true,
    needFooter: true,
    toasterPosition: 'top-right',
    sidebar: {
      expandedWidth: 240,
      collapsedWidth: 64,
    },
  },
};

// Centralized Color Theme Configuration
export const colorTheme = {
  light: {
    // Primary Colors
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    
    // Secondary Colors
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    
    // Background Colors
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    
    // Text Colors
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    
    // Sidebar Colors
    sidebar: {
      background: '#ffffff',
      text: '#707070',
      hover: '#f0f0f0',
      selected: '#e3eefa',
      selectedText: '#ffffff',
      icon: '#707070',
    },
    
    // TopBar Colors
    topbar: {
      background: '#ffffff',
      text: '#707070',
      avatarBg: '#1976d2',
      avatarText: '#ffffff',
    },
    
    // Footer Colors
    footer: {
      background: '#ffffff',
      text: '#757575',
      border: '#e0e0e0',
    },
  },
  
  dark: {
    // Primary Colors
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    
    // Secondary Colors
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
    },
    
    // Background Colors
    background: {
      default: '#0a0e27',
      paper: '#111827',
    },
    
    // Text Colors
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
    },
    
    // Sidebar Colors
    sidebar: {
      background: '#111827',
      text: '#ffffff',
      hover: '#1f2937',
      selected: '#90CAF929',
      selectedText: '#ffffff',
      icon: '#94a3b8',
    },
    
    // TopBar Colors
    topbar: {
      background: '#111827',
      text: '#ffffff',
      avatarBg: '#90caf9',
      avatarText: '#000000',
    },
    
    // Footer Colors
    footer: {
      background: '#111827',
      text: '#94a3b8',
      border: '#1f2937',
    },
  },
  
  // Status Colors (same for both modes)
  status: {
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
  },

  // Chip Colors
  chip: {
    light: {
      role: {
        background: 'linear-gradient(135deg, #e3eefa 0%, #f0f4ff 100%)',
        border: '#90caf9',
        color: '#1565c0',
      },
      active: {
        background: 'linear-gradient(135deg, #e8f5e9 0%, #f1fff2 100%)',
        border: '#81c784',
        color: '#2e7d32',
      },
      inactive: {
        background: 'linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)',
        border: '#bdbdbd',
        color: '#757575',
      },
    },
    dark: {
      role: {
        background: 'linear-gradient(135deg, #1a2744 0%, #1e3a5f 100%)',
        border: '#42a5f5',
        color: '#90caf9',
      },
      active: {
        background: 'linear-gradient(135deg, #1b3a2a 0%, #1e4d35 100%)',
        border: '#66bb6a',
        color: '#a5d6a7',
      },
      inactive: {
        background: 'linear-gradient(135deg, #1f2937 0%, #263244 100%)',
        border: '#4b5563',
        color: '#6b7280',
      },
    },
  },
};
