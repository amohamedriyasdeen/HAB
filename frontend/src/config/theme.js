import { createTheme } from "@mui/material/styles";
import { colorTheme, themeConfig } from './themeConfig';

const { expandedWidth, collapsedWidth } = themeConfig.admin.sidebar;

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },

  typography: {
    fontFamily: themeConfig.fonts.primary,
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },

  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: colorTheme.light.primary,
        secondary: colorTheme.light.secondary,
        background: colorTheme.light.background,
        text: colorTheme.light.text,
      },
    },

    dark: {
      palette: {
        mode: "dark",
        primary: colorTheme.dark.primary,
        secondary: colorTheme.dark.secondary,
        background: colorTheme.dark.background,
        text: colorTheme.dark.text,
      },
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '[data-toolpad-color-scheme="light"] &': {
            backgroundColor: colorTheme.light.background.default,
            color: colorTheme.light.text.primary,
          },
          '[data-toolpad-color-scheme="dark"] &': {
            backgroundColor: colorTheme.dark.background.default,
            color: colorTheme.dark.text.primary,
          },
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          // Override Toolpad's hardcoded mini (collapsed) drawer width
          '&[style*="width: 84px"]': {
            width: `${collapsedWidth}px !important`,
          },
          '[data-toolpad-color-scheme="light"] &': {
            backgroundColor: colorTheme.light.sidebar.background,
            color: colorTheme.light.sidebar.text,
            borderRight: "1px solid #e0e0e0",
          },
          '[data-toolpad-color-scheme="dark"] &': {
            backgroundColor: colorTheme.dark.sidebar.background,
            color: colorTheme.dark.sidebar.text,
            borderRight: "1px solid #1f2937",
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          '[data-toolpad-color-scheme="light"] &': {
            backgroundColor: colorTheme.light.topbar.background,
            color: colorTheme.light.topbar.text,
            borderBottom: "1px solid #e0e0e0",
          },
          '[data-toolpad-color-scheme="dark"] &': {
            backgroundColor: colorTheme.dark.topbar.background,
            color: colorTheme.dark.topbar.text,
            borderBottom: "1px solid #1f2937",
          },
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          '[data-toolpad-color-scheme="light"] &': {
            backgroundColor: colorTheme.light.topbar.background,
            color: colorTheme.light.topbar.text,
          },
          '[data-toolpad-color-scheme="dark"] &': {
            backgroundColor: colorTheme.dark.topbar.background,
            color: colorTheme.dark.topbar.text,
          },
        },
      },
    },

    MuiTooltip: {
      defaultProps: {
        placement: 'left',
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          outline: 'none',
          marginTop: '4px',
          marginBottom: '4px',
          '&:focus': {
            outline: 'none',
          },
          '[data-toolpad-color-scheme="light"] &': {
            color: colorTheme.light.sidebar.text,
            "&:hover": {
              backgroundColor: colorTheme.light.sidebar.hover,
            },
            "&.Mui-selected": {
              backgroundColor: colorTheme.light.sidebar.selected,
              color: colorTheme.light.sidebar.selectedText,
              '& .MuiListItemIcon-root': {
                color: colorTheme.light.sidebar.selectedText,
              },
            },
          },
          '[data-toolpad-color-scheme="dark"] &': {
            color: colorTheme.dark.sidebar.text,
            "&:hover": {
              backgroundColor: colorTheme.dark.sidebar.hover,
            },
            "&.Mui-selected": {
              backgroundColor: colorTheme.dark.sidebar.selected,
              color: colorTheme.dark.sidebar.selectedText,
              '& .MuiListItemIcon-root': {
                color: colorTheme.dark.sidebar.selectedText,
              },
            },
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          '[data-toolpad-color-scheme="light"] &': {
            color: colorTheme.light.sidebar.icon,
          },
          '[data-toolpad-color-scheme="dark"] &': {
            color: colorTheme.dark.sidebar.icon,
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          outline: 'none',
          '&:focus': {
            outline: 'none',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          outline: 'none',
          '&:focus': {
            outline: 'none',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.75rem',
          letterSpacing: '0.02em',
          backdropFilter: 'blur(4px)',
          '&.chip-role': {
            '[data-toolpad-color-scheme="light"] &': {
              background: colorTheme.chip.light.role.background,
              border: `1px solid ${colorTheme.chip.light.role.border}`,
              color: colorTheme.chip.light.role.color,
            },
            '[data-toolpad-color-scheme="dark"] &': {
              background: colorTheme.chip.dark.role.background,
              border: `1px solid ${colorTheme.chip.dark.role.border}`,
              color: colorTheme.chip.dark.role.color,
            },
          },
          '&.chip-active': {
            '[data-toolpad-color-scheme="light"] &': {
              background: colorTheme.chip.light.active.background,
              border: `1px solid ${colorTheme.chip.light.active.border}`,
              color: colorTheme.chip.light.active.color,
            },
            '[data-toolpad-color-scheme="dark"] &': {
              background: colorTheme.chip.dark.active.background,
              border: `1px solid ${colorTheme.chip.dark.active.border}`,
              color: colorTheme.chip.dark.active.color,
            },
          },
          '&.chip-inactive': {
            '[data-toolpad-color-scheme="light"] &': {
              background: colorTheme.chip.light.inactive.background,
              border: `1px solid ${colorTheme.chip.light.inactive.border}`,
              color: colorTheme.chip.light.inactive.color,
            },
            '[data-toolpad-color-scheme="dark"] &': {
              background: colorTheme.chip.dark.inactive.background,
              border: `1px solid ${colorTheme.chip.dark.inactive.border}`,
              color: colorTheme.chip.dark.inactive.color,
            },
          },
        },
      },
    },
  },
});
