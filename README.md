# 实习项目 - 企业数据可视化平台

## 项目介绍
本项目是基于 Next.js + Material UI 开发的**企业数据管理与可视化平台**，使用真实公司 CSV 数据，实现数据仪表盘、动态筛选、多维度图表展示等功能，符合企业后台数据系统的开发规范。

## 完成功能
? 数据仪表盘（公司数量、总收入、国家数、员工总数）  
? 动态环形图（按公司等级 level 统计占比）  
? 累计折线图（按成立年份统计公司增长趋势）  
? 动态条形图（支持维度切换：level / country / city）  
? 多条件筛选器（等级、国家、城市、年份、收入、员工数范围）  
? CSV 数据源读取与解析  
? 数字自动格式化（K / M 单位）  
? 响应式界面，风格参考数据平台设计

## 技术栈
- 框架：Next.js 14 (App Router)
- UI 库：Material UI
- 图表库：Chart.js、react-chartjs-2
- 数据解析：papaparse
- 语言：TypeScript
- 数据来源：companies_0330(1).csv

## 项目结构
- src/app/dashboard 数据仪表盘
- src/app/company-chart 动态条形图与筛选页面
- public/ 存放 CSV 数据源

## 运行方法
1. 安装依赖
```bash
npm install
2、启动项目
npm run dev