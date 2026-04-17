'use client'

import React, { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  OutlinedInput,
  InputAdornment,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Stack
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import SearchIcon from '@mui/icons-material/Search'
import { useCompanyData } from '@/hooks/useCompanyData'
import { normalizeLevel } from '@/lib/company-utils'

// 公司数据类型
type Company = {
  name: string
  level: string
  country: string
  city: string
  foundedYear: number
  annualRevenue: number
  employees: number
}

// level筛选项（与 normalizeLevel 后的展示值保持一致）
const LEVEL_OPTIONS = ['A', 'B', 'C']

// 计算盈利效率 ＝ annualRevenue / employees
function getProfitability(company: Company) {
  return company.employees > 0
    ? company.annualRevenue / company.employees
    : 0
}

// 盈利效率区间与颜色（纯色）
function getProfitabilityColor(value: number) {
  if (value > 800000) {
    // 高：绿色
    return '#70e7b5'
  } else if (value > 400000) {
    // 中：蓝色
    return '#87bfff'
  } else if (value > 150000) {
    // 较低：橙色
    return '#ffd95a'
  } else {
    // 很低：红色
    return '#ffb5ae'
  }
}

// 卡片样式
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 24px 0 rgba(25,57,99,0.10)',
  background: '#fff',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(7),
  padding: theme.spacing(0, 0, 1, 0)
}))

// 表头单元格样式
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  background: '#f4f6f8',
  fontWeight: 600,
  fontSize: 16,
  borderBottom: 'none'
}))

// 盈利效率Cell样式
const ProfitabilityCell = styled(TableCell)<{ $bgColor: string }>(({ $bgColor }) => ({
  backgroundColor: $bgColor,
  color: '#222',
  fontWeight: 600,
  borderRadius: 8,
  minWidth: 120
}))

const ExpandIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'transform 0.2s',
  '&.expanded': {
    transform: 'rotate(180deg)'
  }
}))

export default function CompanyPage() {
  const { data } = useCompanyData()
  // 完整公司数据：
  // 1) 字段名从 CSV 结构映射到页面结构
  // 2) level 统一转成 A/B/C，避免出现 1/2/3 时筛选失效
  const companies = useMemo<Company[]>(
    () =>
    data.map(item => ({
      name: item.company_name,
      level: normalizeLevel(item.level),
      country: item.country,
      city: item.city,
      foundedYear: item.founded_year,
      annualRevenue: item.annual_revenue,
      employees: item.employees
    })),
    [data]
  )
  // 展开的行下标集合
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  // 搜索文本
  const [search, setSearch] = useState('')
  // level多选过滤
  const [levels, setLevels] = useState<string[]>([])

  // 处理展开/折叠
  const handleToggleExpand = (idx: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  // 处理搜索输入
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  // 处理level多选过滤
  const handleLevelFilter = (e: any) => {
    setLevels(e.target.value)
  }

  // 数据过滤逻辑
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // 按公司名搜索（忽略大小写）
      const matchesSearch = company.name.toLowerCase().includes(search.trim().toLowerCase())
      // level 多选过滤
      const matchesLevel = levels.length === 0 || levels.includes(company.level)
      return matchesSearch && matchesLevel
    })
  }, [companies, search, levels])

  return (
    <Box
      sx={{
        maxWidth: 1080,
        mx: 'auto',
        mt: 2,
        mb: 4
      }}
    >
      <StyledCard>
        <CardContent
          sx={{
            borderBottom: '1px solid #f0f1f2',
            pb: 2,
            pt: 2,
            px: { xs: 2, md: 4 },
            background: '#f9fafb',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12
          }}
        >
          {/* 顶部工具栏（搜索 & 过滤） */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            {/* 搜索框 */}
            <OutlinedInput
              size="small"
              placeholder="搜索公司名…"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              }
              value={search}
              onChange={handleSearch}
              sx={{
                minWidth: 230,
                background: '#fff',
                borderRadius: 3
              }}
            />

            {/* level多选过滤 */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                multiple
                displayEmpty
                value={levels}
                onChange={handleLevelFilter}
                renderValue={selected =>
                  selected.length === 0 ? (
                    <span style={{ color: '#9ea7b3', fontWeight: 500 }}>按Level筛选</span>
                  ) : (
                    <Box sx={{ display: 'flex', gap: .5, flexWrap: 'wrap' }}>
                      {(selected as string[]).map(lv => (
                        <Chip
                          key={lv}
                          label={lv}
                          color={
                            lv === 'A'
                              ? 'primary'
                              : lv === 'B'
                              ? 'info'
                              : 'default'
                          }
                          size="small"
                        />
                      ))}
                    </Box>
                  )
                }
                sx={{ borderRadius: 3, background: '#fff' }}
              >
                {LEVEL_OPTIONS.map(lv => (
                  <MenuItem key={lv} value={lv}>
                    <Chip
                      size="small"
                      label={lv}
                      sx={{ minWidth: 32 }}
                      color={
                        lv === 'A'
                          ? 'primary'
                          : lv === 'B'
                          ? 'info'
                          : 'default'
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
        {/* 表格展示公司数据 */}
        <Box sx={{ px: { xs: 1, md: 3 }, pt: 2, pb: 3 }}>
          <TableContainer>
            <Table sx={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell width={55} align="center"></StyledTableHeadCell>
                  <StyledTableHeadCell>公司名称</StyledTableHeadCell>
                  <StyledTableHeadCell>Level</StyledTableHeadCell>
                  <StyledTableHeadCell>国家</StyledTableHeadCell>
                  <StyledTableHeadCell>盈利效率</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5, color: '#a0aec0' }}>
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company, idx) => {
                    // 当前表格（过滤后）的索引
                    const displayIdx = idx

                    const profitability = getProfitability(company)
                    const profitabilityStr = profitability.toLocaleString(undefined, {
                      maximumFractionDigits: 0
                    }) + ' 元/人'

                    // 盈利效率纯色背景（按区间映射）
                    const bgColor = getProfitabilityColor(profitability)

                    return (
                      <React.Fragment key={company.name + displayIdx}>
                        {/* 外层行 */}
                        <TableRow
                          hover
                          sx={{
                            '& td': {
                              fontSize: 15,
                              borderBottom: expanded.has(displayIdx)
                                ? 'none'
                                : '1.5px solid #f1f3f8'
                            },
                            '&:last-child td': { borderBottom: 0 },
                            transition: 'background 0.2s'
                          }}
                        >
                          <TableCell align="center" sx={{ width: 55 }}>
                            <ExpandIconButton
                              onClick={() => handleToggleExpand(displayIdx)}
                              className={expanded.has(displayIdx) ? 'expanded' : ''}
                              size="small"
                              aria-label="展开折叠"
                            >
                              {expanded.has(displayIdx) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ExpandIconButton>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {company.name}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={company.level}
                              size="small"
                              color={
                                company.level === 'A'
                                  ? 'primary'
                                  : company.level === 'B'
                                    ? 'info'
                                    : 'default'
                              }
                              sx={{
                                fontWeight: 700,
                                letterSpacing: '.5px',
                                fontSize: 14,
                                px: 1.4,
                                py: 0.2,
                                borderRadius: 2
                              }}
                            />
                          </TableCell>
                          <TableCell>{company.country}</TableCell>
                          <ProfitabilityCell $bgColor={bgColor}>
                            {profitabilityStr}
                          </ProfitabilityCell>
                        </TableRow>
                        {/* 折叠行 */}
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            sx={{
                              py: 0,
                              background: expanded.has(displayIdx) ? alpha('#e3eeff', 0.18) : 'inherit',
                              borderBottom: '1.5px solid #f1f3f8'
                            }}
                          >
                            <Collapse in={expanded.has(displayIdx)} timeout="auto" unmountOnExit>
                              <Box
                                sx={{
                                  px: { xs: 1, sm: 2, md: 4 },
                                  py: 1.2,
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  alignItems: 'center',
                                  gap: 2,
                                  color: '#3a3d51',
                                  fontSize: 15,
                                  background: '#fcfdff',
                                  borderRadius: 2,
                                  mt: .5,
                                  mb: .5,
                                  boxShadow: '0px 2px 5px 0 #f2f4fa'
                                }}
                              >
                                {/* 城市 */}
                                <Box>
                                  <Typography variant="body2" component="span" sx={{ color: '#95a4b8' }}>
                                    城市：
                                  </Typography>
                                  {company.city}
                                </Box>
                                {/* 成立年份 */}
                                <Box>
                                  <Typography variant="body2" component="span" sx={{ color: '#95a4b8' }}>
                                    成立年份：
                                  </Typography>
                                  {company.foundedYear}
                                </Box>
                                {/* 年盈利额 */}
                                <Box>
                                  <Typography variant="body2" component="span" sx={{ color: '#95a4b8' }}>
                                    年盈利额：
                                  </Typography>
                                  <span style={{ fontWeight: 500 }}>
                                    {company.annualRevenue.toLocaleString()} 元
                                  </span>
                                </Box>
                                {/* 员工数量 */}
                                <Box>
                                  <Typography variant="body2" component="span" sx={{ color: '#95a4b8' }}>
                                    员工数：
                                  </Typography>
                                  {company.employees.toLocaleString()} 人
                                </Box>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </StyledCard>
    </Box>
  )
}
