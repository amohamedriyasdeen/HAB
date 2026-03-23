import { Box, Typography } from "@mui/material";
import { colorTheme } from '../../../config/themeConfig';

function Footer() {
    return (
        <Box
            sx={{
                width: "100%",
                textAlign: "center",
                py: 2,
                '[data-toolpad-color-scheme="light"] &': {
                    borderTop: `1px solid ${colorTheme.light.footer.border}`,
                    backgroundColor: colorTheme.light.footer.background,
                },
                '[data-toolpad-color-scheme="dark"] &': {
                    borderTop: `1px solid ${colorTheme.dark.footer.border}`,
                    backgroundColor: colorTheme.dark.footer.background,
                },
            }}
        >
            <Typography 
                variant="body2" 
                sx={{ 
                    '[data-toolpad-color-scheme="light"] &': {
                        color: colorTheme.light.footer.text,
                    },
                    '[data-toolpad-color-scheme="dark"] &': {
                        color: colorTheme.dark.footer.text,
                    },
                }}
            >
                2026 Your Company. All rights reserved.
            </Typography>
        </Box>
    )
}
export default Footer;
