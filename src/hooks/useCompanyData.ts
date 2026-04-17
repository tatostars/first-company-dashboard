'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface CompanyCsvRow {
  company_code: string;
  company_name: string;
  level: string;
  country: string;
  city: string;
  founded_year: string;
  annual_revenue: string;
  employees: string;
}

export interface CompanyData {
  company_code: string;
  company_name: string;
  level: string;
  country: string;
  city: string;
  founded_year: number;
  annual_revenue: number;
  employees: number;
}

interface UseCompanyDataResult {
  data: CompanyData[];
  loading: boolean;
  error: string | null;
}

// CSV 字段在解析后仍是 string，这里统一转 number，非法值回退到 0。
const toNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const useCompanyData = (): UseCompanyDataResult => {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCsv = async () => {
      try {
        // CSV 放在 public 根目录下，通过绝对路径访问。
        const response = await fetch('/companies_0330(1).csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.status}`);
        }

        const csvText = await response.text();
        const result = Papa.parse<CompanyCsvRow>(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        if (result.errors.length > 0) {
          throw new Error(result.errors[0].message);
        }

        // 统一字段映射和类型转换，供各页面直接使用。
        const parsedData: CompanyData[] = result.data.map((row) => ({
          company_code: row.company_code,
          company_name: row.company_name,
          level: row.level,
          country: row.country,
          city: row.city,
          founded_year: toNumber(row.founded_year),
          annual_revenue: toNumber(row.annual_revenue),
          employees: toNumber(row.employees),
        }));

        if (isMounted) {
          setData(parsedData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : 'Failed to load company data';
          setError(message);
          setData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCsv();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
};
