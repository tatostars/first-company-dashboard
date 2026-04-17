'use client';

import {
  Box, Grid, Paper, Typography, Card, CardContent
} from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  TooltipItem
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useCompanyData } from '@/hooks/useCompanyData';
import { formatCompactNumber, toLevelStats } from '@/lib/company-utils';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  PointElement, LineElement
);

// ======================
// 数据处理函数
// ======================
type DashboardCompany = {
  level: string;
  country: string;
  employees: number;
  foundedYear: number;
  annualRevenue: number;
};

function getTotalCompanies(companies: DashboardCompany[]) { return companies.length; }
function getTotalRevenue(companies: DashboardCompany[]) { return companies.reduce((a, b) => a + b.annualRevenue, 0); }
function getUniqueCountries(companies: DashboardCompany[]) { return [...new Set(companies.map(c => c.country))].length; }
function getTotalEmployees(companies: DashboardCompany[]) { return companies.reduce((a, b) => a + b.employees, 0); }

function getCumulativeByYear(companies: DashboardCompany[]) {
  const sorted = [...companies].sort((a, b) => a.foundedYear - b.foundedYear);
  const map: Record<number, number> = {};
  let count = 0;
  sorted.forEach(c => {
    count++;
    map[c.foundedYear] = count;
  });
  return {
    years: Object.keys(map).map(Number),
    counts: Object.values(map)
  };
}

// ======================
// 主页面（最终美化版）
// ======================
export default function DashboardPage() {
  const { data } = useCompanyData();
  const companies = data.map((item) => ({
    ...item,
    name: item.company_name,
    foundedYear: item.founded_year,
    annualRevenue: item.annual_revenue,
  }));

  const totalCompanies = getTotalCompanies(companies);
  const totalRevenue = getTotalRevenue(companies);
  const countryCount = getUniqueCountries(companies);
  const totalEmployees = getTotalEmployees(companies);
  // 从原始 level 编码统一转换后得到 A/B/C 占比数据
  const levelStats = toLevelStats(companies.map((company) => company.level));
  const cumulative = getCumulativeByYear(companies);

  const doughnutData = {
    labels: ['Level A', 'Level B', 'Level C'],
    datasets: [{
      data: [levelStats.A, levelStats.B, levelStats.C],
      backgroundColor: ['#165DFF', '#36CFC9', '#F7BA1E'],
      hoverOffset: 6
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { padding: 20, font: { size: 12 } } },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'doughnut'>) => {
            const total = levelStats.A + levelStats.B + levelStats.C;
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0.0';
            return `${ctx.label}: ${ctx.parsed} 家 (${pct}%)`;
          }
        }
      }
    }
  };

  const lineData = {
    labels: cumulative.years,
    datasets: [{
      label: '累计公司数量',
      data: cumulative.counts,
      borderColor: '#165DFF',
      backgroundColor: 'rgba(22,93,255,0.15)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top' as const } },
    scales: {
      y: { beginAtZero: true, border: { display: false } },
      x: { grid: { display: false } }
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1600px', mx: 'auto' }}>

      <Typography variant="h4" fontWeight="700" mb={4} color="#1d2129">
        Company Data Dashboard
      </Typography>

      {/* 数据卡片 */}
      <Grid container spacing={4} mb={5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ py: 3, px: 2 }}>
              <Typography color="#64748b" fontSize="15px" mb={1}>公司总数</Typography>
              <Typography variant="h3" fontWeight="700" color="#1d2129">{totalCompanies}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ py: 3, px: 2 }}>
              <Typography color="#64748b" fontSize="15px" mb={1}>总收入</Typography>
              <Typography variant="h3" fontWeight="700" color="#1d2129">{formatCompactNumber(totalRevenue)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ py: 3, px: 2 }}>
              <Typography color="#64748b" fontSize="15px" mb={1}>覆盖国家</Typography>
              <Typography variant="h3" fontWeight="700" color="#1d2129">{countryCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ py: 3, px: 2 }}>
              <Typography color="#64748b" fontSize="15px" mb={1}>员工总数</Typography>
              <Typography variant="h3" fontWeight="700" color="#1d2129">{formatCompactNumber(totalEmployees)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 图表区域 */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <Typography variant="h6" fontWeight="600" mb={3}>公司等级占比</Typography>
            <Box sx={{ height: '380px' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <Typography variant="h6" fontWeight="600" mb={3}>历年累计入驻公司数量</Typography>
            <Box sx={{ height: '380px' }}>
              <Line data={lineData} options={lineOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
}