'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  Slider,
  Paper,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useCompanyData, CompanyData } from '@/hooks/useCompanyData';
import { normalizeLevel } from '@/lib/company-utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

// ===============
// 工具函数
// ===============

// 范围滑块辅助，找最大、最小
function getFieldMinMax(data: CompanyData[], field: keyof CompanyData) {
  if (!data.length) return [0, 0];
  const nums = data.map((item) => Number(item[field])).filter((n) => !isNaN(n));
  return [Math.min(...nums), Math.max(...nums)];
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

// ===============
// 主界面
// ===============
const DIMENSIONS = [
  { key: 'level', label: '公司等级' },
  { key: 'country', label: '国家' },
  { key: 'city', label: '城市' },
] as const;

// 多选下拉样式 props
const selectProps = {
  multiple: true,
  input: <OutlinedInput label="筛选" />,
  renderValue: (selected: any) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((value: string) => (
        <Chip key={value} label={value} size="small" />
      ))}
    </Box>
  ),
  size: 'small' as const,
};

export default function CompanyChartPage() {
  const { data, loading, error } = useCompanyData();

  // 提取枚举, 范围
  // 枚举选项统一按 normalizeLevel 后的值生成，保证筛选与显示一致
  const levelOptions = useMemo(() => uniq(data.map(d => normalizeLevel(d.level))), [data]);
  const countryOptions = useMemo(() => uniq(data.map(d => d.country)), [data]);
  const cityOptions = useMemo(() => uniq(data.map(d => d.city)), [data]);
  const [yearMin, yearMax] = useMemo(() => getFieldMinMax(data, 'founded_year'), [data]);
  const [revenueMin, revenueMax] = useMemo(() => getFieldMinMax(data, 'annual_revenue'), [data]);
  const [empMin, empMax] = useMemo(() => getFieldMinMax(data, 'employees'), [data]);

  // ===============
  // 状态 - 筛选器与维度
  // ===============
  const [dimension, setDimension] = useState<'level' | 'country' | 'city'>('level');
  const [levelFilter, setLevelFilter] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [foundedYear, setFoundedYear] = useState<number[]>([yearMin, yearMax]);
  const [annualRevenue, setAnnualRevenue] = useState<number[]>([revenueMin, revenueMax]);
  const [employees, setEmployees] = useState<number[]>([empMin, empMax]);

  // ===============
  // 过滤后数据
  // ===============
  const filteredData = useMemo(() => {
    return data.filter((d) => {
      // level
      if (levelFilter.length > 0) {
        const label = normalizeLevel(d.level);
        if (!levelFilter.includes(label)) return false;
      }
      // country
      if (countryFilter.length > 0 && !countryFilter.includes(d.country)) return false;
      // city
      if (cityFilter.length > 0 && !cityFilter.includes(d.city)) return false;
      // founded_year
      if (d.founded_year < foundedYear[0] || d.founded_year > foundedYear[1]) return false;
      // annual_revenue
      if (d.annual_revenue < annualRevenue[0] || d.annual_revenue > annualRevenue[1]) return false;
      // employees
      if (d.employees < employees[0] || d.employees > employees[1]) return false;
      return true;
    });
  }, [data, levelFilter, countryFilter, cityFilter, foundedYear, annualRevenue, employees]);

  // ===============
  // 维度聚合数据
  // ===============
  const barChart = useMemo(() => {
    // 根据当前维度, 统计公司数量
    let map = new Map<string, number>();
    filteredData.forEach(d => {
      let key = d[dimension];
      if (dimension === 'level') key = normalizeLevel(key);
      if (!map.has(key)) map.set(key, 0);
      map.set(key, map.get(key)! + 1);
    });
    // 排序(降序)
    const entries = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30); // 限制显示数量

    const labels = entries.map(e => e[0]);
    const counts = entries.map(e => e[1]);

    return {
      labels,
      data: counts,
    };
  }, [filteredData, dimension]);

  // ===============
  // 图表配置
  // ===============
  const chartData: ChartData<'bar'> = {
    labels: barChart.labels,
    datasets: [
      {
        label: '公司数量',
        data: barChart.data,
        backgroundColor: 'rgba(22,93,255,0.85)',
        borderRadius: 6,
        maxBarThickness: 40,
      },
    ],
  };
  const chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label(ctx) {
            const val = ctx.parsed.x || ctx.parsed;
            return `公司数量: ${val}`;
          }
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: { font: { size: 15 }, color: '#111' },
        grid: { display: false },
      },
      x: {
        beginAtZero: true,
        ticks: { font: { size: 13 }, color: '#888' },
        grid: { display: true, color: '#eee' }
      }
    }
  };

  // ===============
  // 载入/错误处理
  // ===============
  if (loading) return (
    <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography color="text.secondary">数据载入中...</Typography>
    </Box>
  );
  if (error) return (
    <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

  return (
    <Box sx={{
      p: 4,
      maxWidth: '1400px',
      mx: 'auto',
      bgcolor: '#fafbfc',
      minHeight: '100vh',
    }}>
      {/* 页面标题 */}
      <Typography variant="h4" fontWeight="bold" color="#1d2129" mb={2}>
        公司数据动态条形图
      </Typography>
      <Typography color="#555" fontSize="16px" mb={4}>
        支持多条件筛选和多维度展示，数据源：companies_0330(1).csv
      </Typography>

      {/* 维度切换 */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', borderRadius: 3, gap: 2 }}>
        <Typography color="#888" mr={2}>选择X轴维度：</Typography>
        <Stack direction="row" spacing={1}>
          {DIMENSIONS.map(dim => (
            <Chip
              key={dim.key}
              label={dim.label}
              color={dimension === dim.key ? 'primary' : 'default'}
              variant={dimension === dim.key ? 'filled' : 'outlined'}
              clickable
              onClick={() => setDimension(dim.key)}
              sx={{ fontWeight: 600, fontSize: 15 }}
            />
          ))}
        </Stack>
      </Paper>

      {/* 筛选器 */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: '#fff',
          borderRadius: 3,
          boxShadow: '0 2px 15px rgba(0,0,0,0.045)',
        }}
      >
        <Grid container spacing={2} rowSpacing={3}>
          {/* Level */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel>公司等级</InputLabel>
              <Select
                {...selectProps}
                value={levelFilter}
                label="公司等级"
                onChange={e => setLevelFilter(e.target.value as string[])}
              >
                {levelOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={levelFilter.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Country */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel>国家</InputLabel>
              <Select
                {...selectProps}
                value={countryFilter}
                label="国家"
                onChange={e => setCountryFilter(e.target.value as string[])}
              >
                {countryOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={countryFilter.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* City */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel>城市</InputLabel>
              <Select
                {...selectProps}
                value={cityFilter}
                label="城市"
                onChange={e => setCityFilter(e.target.value as string[])}
              >
                {cityOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={cityFilter.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Founded Year */}
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4.5 }}>
            <Box px={1}>
              <Typography fontSize={14} color="#777" mb={1}>
                注册年份范围：{foundedYear[0]} - {foundedYear[1]}
              </Typography>
              <Slider
                min={yearMin}
                max={yearMax}
                step={1}
                value={foundedYear}
                marks={[
                  { value: yearMin, label: `${yearMin}` },
                  { value: yearMax, label: `${yearMax}` }
                ]}
                valueLabelDisplay="auto"
                size="small"
                onChange={(_, val) => setFoundedYear(val as number[])}
              />
            </Box>
          </Grid>
          {/* Annual Revenue */}
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <Box px={1}>
              <Typography fontSize={14} color="#777" mb={1}>
                年收入区间（元）：{annualRevenue[0]} - {annualRevenue[1]}
              </Typography>
              <Slider
                min={revenueMin}
                max={revenueMax}
                step={Math.max(Math.floor((revenueMax-revenueMin)/200), 1)}
                value={annualRevenue}
                marks={[
                  { value: revenueMin, label: `${revenueMin}` },
                  { value: revenueMax, label: `${revenueMax}` },
                ]}
                valueLabelDisplay="auto"
                size="small"
                onChange={(_, val) => setAnnualRevenue(val as number[])}
              />
            </Box>
          </Grid>
          {/* Employees */}
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <Box px={1}>
              <Typography fontSize={14} color="#777" mb={1}>
                员工区间（人）：{employees[0]} - {employees[1]}
              </Typography>
              <Slider
                min={empMin}
                max={empMax}
                step={Math.max(Math.floor((empMax-empMin)/200), 1)}
                value={employees}
                marks={[
                  { value: empMin, label: `${empMin}` },
                  { value: empMax, label: `${empMax}` },
                ]}
                valueLabelDisplay="auto"
                size="small"
                onChange={(_, val) => setEmployees(val as number[])}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 条形图 */}
      <Paper
        sx={{
          p: { xs: 1, sm: 3 },
          borderRadius: 4,
          background: '#fff',
          boxShadow: '0 2px 14px rgba(0,0,0,0.045)',
          minHeight: 480,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography fontWeight={600} mb={2} fontSize={19} color="#222">
          {DIMENSIONS.find(d => d.key === dimension)?.label} 维度下公司数量分布
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ height: { xs: 340, md: 520 }, width: '100%', position: 'relative', p: 1 }}>
          {barChart.labels.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <Box sx={{ pt: 8, width: '100%', textAlign: 'center' }}>
              <Typography color="#aaa" fontSize={16}>无满足条件的数据</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}