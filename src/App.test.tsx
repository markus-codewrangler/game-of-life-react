import { render, screen } from '@testing-library/react';
import { App } from './App';
import { createRoot } from 'react-dom/client';

it('renders without crashing', () => {
  const div = document.createElement('div');
  createRoot(div).render(<App />);
});
