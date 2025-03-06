import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

const DashboardContainer = styled.div`
  padding:10px;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  h3 {
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  p {
    color: #111827;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  h3 {
    color: #374151;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;

const DashboardContent: React.FC = () => {
  // Sample data for charts
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Items Added',
        data: [65, 59, 80, 81, 56, 55],
        fill: true,
        backgroundColor: 'rgba(255, 122, 0, 0.1)',
        borderColor: '#ff7a00',
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ['Electronics', 'Mechanical', 'Electrical', 'Others'],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: [
          '#ff7a00',
          '#00bcd4',
          '#4caf50',
          '#f44336',
        ],
      },
    ],
  };

  const itemStatusData = {
    labels: ['Active', 'Inactive', 'Pending'],
    datasets: [
      {
        label: 'Item Status',
        data: [300, 50, 100],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(244, 67, 54, 0.8)',
          'rgba(255, 152, 0, 0.8)',
        ],
      },
    ],
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <PageTitle>Dashboard Overview</PageTitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <h3>Total Items</h3>
          <p>450</p>
        </StatCard>
        <StatCard>
          <h3>Active Items</h3>
          <p>300</p>
        </StatCard>
        <StatCard>
          <h3>Categories</h3>
          <p>24</p>
        </StatCard>
        <StatCard>
          <h3>Models</h3>
          <p>56</p>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <h3>Monthly Items Added</h3>
          <Line
            data={monthlyData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </ChartCard>

        <ChartCard>
          <h3>Items by Category</h3>
          <Doughnut
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right' as const,
                },
              },
            }}
          />
        </ChartCard>

        <ChartCard>
          <h3>Item Status Distribution</h3>
          <Bar
            data={itemStatusData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </ChartCard>
      </ChartsGrid>
    </DashboardContainer>
  );
};

export default DashboardContent; 