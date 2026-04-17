'use client'

import React from 'react'
// 导入 Material UI 所需组件
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { ThemeProvider } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Link from 'next/link'
import { usePathname } from 'next/navigation' // 用于获取当前路径
import theme from '../theme'

// 定义 tab 列表及其对应路由
const tabs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Company', href: '/company' },
  { label: 'User', href: '/user' },
  { label: '登录', href: '/login' },
  { label: '注册', href: '/signup' },
]

// 布局组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 获取当前路径用于确定 active tab
  const pathname = usePathname()
  // 查找当前在第几个 tab
  const currentTabIndex = tabs.findIndex(tab => pathname.startsWith(tab.href))

  return (
    <html lang="zh">
      <body>
        <ThemeProvider theme={theme}>
          {/* 全局导航栏 */}
          <AppBar position="fixed" sx={{ height: '64px', minHeight: '64px' }}>
            <Toolbar sx={{ minHeight: '64px', height: '64px' }}>
              {/* 左侧标题 */}
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, fontWeight: 800, fontSize: '20px' }}
              >
                Minimal Dashboard
              </Typography>
              {/* 右侧 Tab 导航栏 */}
              <Tabs
                value={currentTabIndex === -1 ? false : currentTabIndex}
                textColor="inherit"
                indicatorColor="secondary"
                sx={{
                  '& .MuiTabs-indicator': { height: 3 },
                  '& .MuiTab-root': {
                    px: 2.5,
                    minHeight: '64px',
                  },
                }}
              >
                {tabs.map((tab, idx) => (
                  // 使用 Next.js Link 作为每个 Tab 的组件
                  <Tab
                    key={tab.href}
                    value={idx}
                    label={tab.label}
                    component={Link}
                    href={tab.href}
                    sx={{
                      minWidth: 92,
                      borderBottom: '2px solid transparent',
                      '&:hover': {
                        color: 'rgba(255,255,255,0.9)',
                        borderBottomColor: 'rgba(255,255,255,0.9)',
                      },
                      '&.Mui-selected': {
                        color: 'rgba(255,255,255,0.95)',
                        borderBottomColor: 'rgba(255,255,255,0.95)',
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Toolbar>
          </AppBar>
          {/* 页面内容区，添加 paddingTop 以避免被导航栏遮挡 */}
          <Box component="main" sx={{ paddingTop: '64px', px: 2 }}>
            {children}
          </Box>
        </ThemeProvider>
      </body>
    </html>
  )
}   