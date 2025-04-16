import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Analysis from '../Analysis';
import '@testing-library/jest-dom/vitest';
import { vi, describe, test, expect } from 'vitest';

// Mock the ChartComponent
vi.mock('../components/AnalysisChart', () => {
  return {
    default: () => <div data-testid="mock-chart">Mock Chart Component</div>
  };
});

// Mock the NavBar and Menu components
vi.mock('../components/NavBar', () => {
  return {
    default: () => <div data-testid="mock-navbar">Mock NavBar</div>
  };
});

vi.mock('../components/Menu', () => {
  return {
    default: () => <div data-testid="mock-menu">Mock Menu</div>
  };
});

describe('Analysis Component', () => {
  const renderAnalysis = () => {
    return render(
      <BrowserRouter>
        <Analysis />
      </BrowserRouter>
    );
  };


  test('renders with correct layout classes', async () => {
    renderAnalysis();
    
    await waitFor(() => {
      // Check for main container classes
      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('flex', 'flex-col', 'lg:flex-row', 'bg-primaryBg');
      
      // Check for chart container classes
      const chartContainer = mainElement.querySelector('div:last-child');
      expect(chartContainer).toHaveClass('ml-2', 'sm:ml-6', 'lg:ml-28', 'flex-1');
    });
  });

  test('maintains responsive layout structure', async () => {
    renderAnalysis();
    
    await waitFor(() => {
      // Verify the main structure
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement.children.length).toBe(2); // Menu and chart container
    });
  });
}); 