// Material UI + Next.js 主题配置，风格参考 minimals.cc 与现代仪表盘
import { createTheme, ThemeOptions } from '@mui/material/styles';

// 主题主色与次色配置
const PRIMARY_MAIN = '#165DFF'; // 柔和蓝，仪表盘风格主色
const SECONDARY_MAIN = '#7B61FF'; // 次色：浅紫色
const NAVBAR_BG = PRIMARY_MAIN;
const NAVBAR_TEXT = '#fff';

// 主题对象
const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_MAIN,
      contrastText: '#fff', // 主按钮/导航栏文字白色
    },
    secondary: {
      main: SECONDARY_MAIN,
      contrastText: '#fff',
    },
  },
  shape: {
    borderRadius: 8, // 全局圆角8px
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  },
  components: {
    // 导航栏 AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: NAVBAR_BG, // 背景主色
          color: NAVBAR_TEXT, // 文字白色
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          // 保持导航栏文字白色
          color: NAVBAR_TEXT,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: PRIMARY_MAIN,
          boxShadow: '0px 2px 8px rgba(22,93,255,0.08)', // 轻微阴影
          '&:hover': {
            backgroundColor: '#124fcc', // 主色加深
            boxShadow: '0px 4px 16px rgba(22,93,255,0.15)',
          }
        },
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-focused': {
            boxShadow: '0 0 0 2px rgba(22,93,255,0.08)', // 聚焦时轻微阴影
          },
        },
        input: {
          borderRadius: 8,
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#E0E3E7',
        },
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY_MAIN, // 聚焦边框主色
            boxShadow: '0 0 0 2px rgba(22,93,255,0.08)',
          },
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        }
      }
    },
    // 导航/按钮 hover 效果
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&:hover': {
            transition: 'background-color 0.2s',
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: PRIMARY_MAIN,
          textDecoration: 'none',
          '&:hover': {
            color: SECONDARY_MAIN,
            textDecoration: 'underline',
          }
        }
      }
    }
  }
} as ThemeOptions);

// 导出主题给 ThemeProvider 使用
export default theme;
