'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Link as MuiLink
} from '@mui/material';

// 邮箱格式校验正则
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  // 组件状态定义
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  // 表单验证逻辑
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // 非空验证
    if (!email) newErrors.email = '邮箱不能为空';
    if (!password) newErrors.password = '密码不能为空';
    if (!confirmPassword) newErrors.confirmPassword = '请再次输入密码';

    // 邮箱格式验证
    if (email && !emailRegex.test(email)) {
      newErrors.email = '邮箱格式不正确';
    }

    // 密码长度验证
    if (password && password.length < 6) {
      newErrors.password = '密码至少需要6位';
    }

    // 两次密码一致性验证
    if (
      password &&
      confirmPassword &&
      password !== confirmPassword
    ) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    setErrors(newErrors);

    // 如果没有错误，返回 true
    return Object.keys(newErrors).length === 0;
  };

  // 提交处理函数
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false); // 每次提交前先重置成功状态

    if (validate()) {
      // 注册成功逻辑（这里仅做本地演示，实际情况需与后端交互）
      setSuccess(true);
      // 清空输入框
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f9f9f9',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 5,
          bgcolor: '#ffffff',
          borderRadius: 3,
          boxShadow: '0 6px 24px rgba(17, 24, 39, 0.08)',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          注册
        </Typography>
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess(false)}
          >
            注册成功！
          </Alert>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="邮箱"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="密码"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            fullWidth
            margin="normal"
            label="确认密码"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            注册
          </Button>
        </form>

        {/* 登录引导 */}
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: 'text.secondary' }}
        >
          已有账号？{' '}
          <MuiLink
            component={NextLink}
            href="/login"
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            去登录
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
