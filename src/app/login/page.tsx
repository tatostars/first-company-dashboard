'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Link as MuiLink,
  TextField,
  Typography,
  Alert,
  Paper
} from '@mui/material';

// 邮箱正则表达式用于基本格式校验
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 模拟正确账号
const CORRECT_EMAIL = 'test@example.com';
const CORRECT_PASSWORD = '123456';

export default function LoginPage() {
  // 表单状态
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 错误状态
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setFormError('');
    setEmailError('');
    setPasswordError('');

    // 检查邮箱是否为空
    if (!email) {
      setEmailError('请输入邮箱');
      valid = false;
    } else if (!emailRegex.test(email)) {
      // 检查邮箱格式
      setEmailError('邮箱格式不正确');
      valid = false;
    }

    // 检查密码是否为空
    if (!password) {
      setPasswordError('请输入密码');
      valid = false;
    }

    // 如果输入有误，阻止进一步处理
    if (!valid) return;

    // 模拟后端账号验证
    if (email !== CORRECT_EMAIL) {
      setFormError('该邮箱不存在');
    } else if (password !== CORRECT_PASSWORD) {
      setFormError('密码错误');
    } else {
      // 登录成功，这里你可以跳转或展示登录成功信息
      alert('登录成功！');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f9fafb'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 5,
          bgcolor: '#ffffff',
          borderRadius: 3,
          boxShadow: '0 6px 24px rgba(17, 24, 39, 0.08)'
        }}
      >
        {/* 标题 */}
        <Typography variant="h5" color="primary" fontWeight={700} mb={2} textAlign="center">
          登录到您的账号
        </Typography>
        {/* 错误提示 */}
        {formError && (
          <Alert severity="error" sx={{mb: 2}}>{formError}</Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* 邮箱输入框 */}
          <TextField
            label="邮箱"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            autoComplete="email"
            InputLabelProps={{shrink: true}}
            sx={{bgcolor: 'white'}}
          />
          {/* 密码输入框 */}
          <TextField
            label="密码"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            autoComplete="current-password"
            InputLabelProps={{shrink: true}}
            sx={{bgcolor: 'white'}}
          />
          {/* 登录按钮 */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              borderRadius: 2,
              boxShadow: 'none',
              fontWeight: 600,
              textTransform: 'none',
              letterSpacing: 1,
              py: 1.5
            }}
          >
            登录
          </Button>
          {/* 注册引导 */}
          <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
            还没账号？{' '}
            <MuiLink
              component={NextLink}
              href="/signup"
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              去注册
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
        