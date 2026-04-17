'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Button,
  OutlinedInput,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Stack
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { styled } from '@mui/material/styles'

/** minimals 风格主色 */
const PRIMARY = '#165DFF'

// 假数据
const USER_DATA = [
  {
    id: 1,
    name: 'Alice Lin',
    email: 'alice@example.com',
    role: 'Admin',
    status: '启用'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    status: '禁用'
  },
  {
    id: 3,
    name: 'Charlie Wang',
    email: 'charlie@example.com',
    role: 'Editor',
    status: '启用'
  },
  {
    id: 4,
    name: 'Daisy Chen',
    email: 'daisy@example.com',
    role: 'User',
    status: '启用'
  },
  {
    id: 5,
    name: 'Ethan Lee',
    email: 'ethan@example.com',
    role: 'Editor',
    status: '禁用'
  }
]

// 角色选项
const ROLE_OPTIONS = ['Admin', 'User', 'Editor']

// 状态颜色映射（as const 保证值为字面量类型，满足 Chip color 的联合类型）
const STATUS_COLOR = {
  启用: 'success',
  禁用: 'default'
} as const

// 自定义样式组件（卡片：圆角 + 轻阴影，接近 minimals）
const StyledCard = styled(Card)(() => ({
  borderRadius: 12,
  background: '#fff',
  border: '1px solid rgba(145, 158, 171, 0.12)',
  boxShadow:
    '0 12px 24px -4px rgba(145, 158, 171, 0.12), 0 0 2px 0 rgba(145, 158, 171, 0.16)'
}))

const StyledTableHeadCell = styled(TableCell)(() => ({
  background: '#F9FAFB',
  fontWeight: 600,
  fontSize: '0.8125rem',
  color: '#637381',
  borderBottom: '1px solid #F0F3F7',
  py: 1.75
}))

export default function UserPage() {
  // 用户数据状态
  const [users, setUsers] = useState(USER_DATA)
  // 选中的用户 id 数组
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  // 搜索关键字
  const [search, setSearch] = useState('')
  // 多选过滤角色
  const [roles, setRoles] = useState<string[]>([])

  // 处理表格全选
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(filteredUsers.map(u => u.id))
    } else {
      setSelectedIds([])
    }
  }

  // 处理单选
  const handleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // 处理批量删除
  const handleBulkDelete = () => {
    setUsers(prev => prev.filter(u => !selectedIds.includes(u.id)))
    setSelectedIds([])
  }

  // 处理单个删除
  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    setSelectedIds(prev => prev.filter(x => x !== id))
  }

  // 处理角色过滤
  const handleRoleFilter = (event: any) => {
    setRoles(event.target.value)
  }

  // 处理搜索
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  // 筛选后的用户数据
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
    && (roles.length === 0 || roles.includes(user.role))
  )

  // 是否全选
  const isAllSelected =
    filteredUsers.length > 0 &&
    selectedIds.length === filteredUsers.length

  // 是否部分选中
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < filteredUsers.length

  const inputOutlineSx = {
    borderRadius: 2,
    bgcolor: '#fff',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(145, 158, 171, 0.24)'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: `${PRIMARY}66`
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: `${PRIMARY} !important`
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, md: 4 },
        bgcolor: '#F4F6F8',
        minHeight: '100%'
      }}
    >
      <StyledCard sx={{ overflow: 'hidden' }}>
        {/* 顶部：标题 + 搜索与筛选（同一行）+ 按钮 — 水平布局 */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2.5,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            rowGap: 2,
            borderBottom: '1px solid',
            borderColor: 'rgba(145, 158, 171, 0.16)',
            bgcolor: '#fff'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.375rem' },
              color: '#212B36',
              letterSpacing: '-0.01em',
              flexShrink: 0
            }}
          >
            用户管理
          </Typography>

          {/* 搜索 + 角色筛选：同一行，随中间区域伸缩 */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            sx={{
              flex: 1,
              minWidth: 260,
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}
          >
            <OutlinedInput
              size="small"
              placeholder="搜索姓名…"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#919EAB', fontSize: 22 }} />
                </InputAdornment>
              }
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: '100%', sm: 240 }, maxWidth: 320, ...inputOutlineSx }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                multiple
                displayEmpty
                value={roles}
                onChange={handleRoleFilter}
                renderValue={selected =>
                  selected.length === 0 ? (
                    <span style={{ color: '#919EAB' }}>按角色筛选</span>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {(selected as string[]).map(role => (
                        <Chip
                          key={role}
                          size="small"
                          label={role}
                          sx={{ height: 24, fontWeight: 500 }}
                        />
                      ))}
                    </Box>
                  )
                }
                sx={inputOutlineSx}
              >
                {ROLE_OPTIONS.map(role => (
                  <MenuItem key={role} value={role}>
                    <Checkbox
                      size="small"
                      checked={roles.indexOf(role) > -1}
                      sx={{
                        color: PRIMARY,
                        '&.Mui-checked': { color: PRIMARY }
                      }}
                    />
                    <span>{role}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ flexShrink: 0 }}>
            {selectedIds.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                sx={{
                  borderRadius: 2,
                  minWidth: 88,
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2
                }}
              >
                删除({selectedIds.length})
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                minWidth: 112,
                px: 2.5,
                boxShadow: 'none',
                bgcolor: PRIMARY,
                '&:hover': { bgcolor: '#124fcc', boxShadow: 'none' }
              }}
              onClick={() => window.alert('添加用户功能未实现，仅展示UI')}
            >
              添加用户
            </Button>
          </Stack>
        </Box>

        {/* 表格区域 */}
        <CardContent sx={{ px: 0, pt: 0, pb: 2 }}>
          <Table
            sx={{
              minWidth: 800,
              background: '#fff',
              '& .MuiTableCell-root': {
                borderColor: 'rgba(145, 158, 171, 0.16)',
                py: 1.5,
                fontSize: '0.875rem'
              }
            }}
          >
            <TableHead>
              <TableRow>
                <StyledTableHeadCell align="center" padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={isSomeSelected}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </StyledTableHeadCell>
                <StyledTableHeadCell>姓名</StyledTableHeadCell>
                <StyledTableHeadCell>邮箱</StyledTableHeadCell>
                <StyledTableHeadCell>角色</StyledTableHeadCell>
                <StyledTableHeadCell>状态</StyledTableHeadCell>
                <StyledTableHeadCell align="center">操作</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#b1bac9' }}>
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    selected={selectedIds.includes(user.id)}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      transition: 'background 0.2s'
                    }}
                  >
                    <TableCell align="center" padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => handleSelect(user.id)}
                      />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={
                          user.role === 'Admin'
                            ? 'primary'
                            : user.role === 'Editor'
                              ? 'info'
                              : 'default'
                        }
                        sx={{
                          fontWeight: 600,
                          borderRadius: 1.5,
                          ...(user.role === 'Admin' && {
                            bgcolor: `${PRIMARY}14`,
                            color: PRIMARY,
                            border: 'none'
                          })
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={user.status}
                        color={STATUS_COLOR[user.status as keyof typeof STATUS_COLOR]}
                        variant={user.status === '启用' ? 'filled' : 'outlined'}
                        sx={{
                          fontWeight: 500,
                          borderRadius: 2,
                          color: user.status === '禁用' ? '#868fa6' : undefined,
                          background: user.status === '禁用' ? '#f3f6f9' : undefined
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        sx={{ mr: 0.5, color: PRIMARY }}
                        // 这里只做展示
                        onClick={() => window.alert('编辑功能未实现，仅展示UI')}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </StyledCard>
    </Box>
  )
}