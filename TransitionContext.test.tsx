import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { TransitionProvider, useTransition } from './TransitionContext';
import React from 'react';

// Component to test the hook
const TestComponent = () => {
  const isTransition = useTransition();
  const navigate = useNavigate();

  return (
    <div>
      <span data-testid="transition-value">{isTransition.toString()}</span>
      <button onClick={() => navigate('/other')}>Navigate</button>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  );
};

describe('TransitionContext', () => {
  it('should handle transition state correctly', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <TransitionProvider>
          <Routes>
            <Route path="/" element={<TestComponent />} />
            <Route path="/other" element={<TestComponent />} />
          </Routes>
        </TransitionProvider>
      </MemoryRouter>
    );

    // Initial state should be false
    expect(screen.getByTestId('transition-value').textContent).toBe('false');

    // Navigate to another page
    const button = screen.getByText('Navigate');
    await user.click(button);

    // State should be true
    expect(screen.getByTestId('transition-value').textContent).toBe('true');

    // Navigate back home
    const homeButton = screen.getByText('Go Home');
    await user.click(homeButton);

    // State should remain true
    expect(screen.getByTestId('transition-value').textContent).toBe('true');
  });
});
