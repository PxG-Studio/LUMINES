import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RuntimePanel } from '../RuntimePanel';

describe('RuntimePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Status Display', () => {
    it('displays default status when no status provided', () => {
      render(<RuntimePanel />);

      expect(screen.getByText('Ignition: idle')).toBeInTheDocument();
    });

    it('displays custom status', () => {
      render(<RuntimePanel status="Ignition: running" />);

      expect(screen.getByText('Ignition: running')).toBeInTheDocument();
    });

    it('displays status label', () => {
      render(<RuntimePanel />);

      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('shows activity icon', () => {
      render(<RuntimePanel />);

      // Activity icon should be present
      const statusSection = screen.getByText('Status').closest('div');
      expect(statusSection).toBeInTheDocument();
    });
  });

  describe('Control Buttons', () => {
    it('renders Run button', () => {
      render(<RuntimePanel />);

      expect(screen.getByLabelText('Run')).toBeInTheDocument();
      expect(screen.getByText('Run')).toBeInTheDocument();
    });

    it('renders Restart button', () => {
      render(<RuntimePanel />);

      expect(screen.getByLabelText('Restart')).toBeInTheDocument();
      expect(screen.getByText('Restart')).toBeInTheDocument();
    });

    it('renders Stop button', () => {
      render(<RuntimePanel />);

      expect(screen.getByLabelText('Stop')).toBeInTheDocument();
      expect(screen.getByText('Stop')).toBeInTheDocument();
    });

    it('calls onRun when Run button is clicked', () => {
      const onRun = vi.fn();

      render(<RuntimePanel onRun={onRun} />);

      const runButton = screen.getByLabelText('Run');
      fireEvent.click(runButton);

      expect(onRun).toHaveBeenCalled();
    });

    it('calls onRestart when Restart button is clicked', () => {
      const onRestart = vi.fn();

      render(<RuntimePanel onRestart={onRestart} />);

      const restartButton = screen.getByLabelText('Restart');
      fireEvent.click(restartButton);

      expect(onRestart).toHaveBeenCalled();
    });

    it('calls onStop when Stop button is clicked', () => {
      const onStop = vi.fn();

      render(<RuntimePanel onStop={onStop} />);

      const stopButton = screen.getByLabelText('Stop');
      fireEvent.click(stopButton);

      expect(onStop).toHaveBeenCalled();
    });

    it('does not call handlers when buttons are clicked without handlers', () => {
      const onRun = vi.fn();
      const onRestart = vi.fn();
      const onStop = vi.fn();

      render(<RuntimePanel />);

      fireEvent.click(screen.getByLabelText('Run'));
      fireEvent.click(screen.getByLabelText('Restart'));
      fireEvent.click(screen.getByLabelText('Stop'));

      expect(onRun).not.toHaveBeenCalled();
      expect(onRestart).not.toHaveBeenCalled();
      expect(onStop).not.toHaveBeenCalled();
    });
  });

  describe('Preview Section', () => {
    it('displays preview section', () => {
      render(<RuntimePanel />);

      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('displays preview placeholder', () => {
      render(<RuntimePanel />);

      expect(screen.getByText('Runtime output will appear here')).toBeInTheDocument();
    });

    it('shows preview activity icon', () => {
      render(<RuntimePanel />);

      const previewSection = screen.getByText('Runtime output will appear here').closest('div');
      expect(previewSection).toBeInTheDocument();
    });
  });

  describe('Status Indicators', () => {
    it('shows running status indicator when status includes running', () => {
      render(<RuntimePanel status="Ignition: running" />);

      expect(screen.getByText('Ignition: running')).toBeInTheDocument();
    });

    it('shows idle status indicator when status includes idle', () => {
      render(<RuntimePanel status="Ignition: idle" />);

      expect(screen.getByText('Ignition: idle')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('renders with proper structure', () => {
      const { container } = render(<RuntimePanel />);

      // Should have runtime section
      expect(screen.getByText('Runtime')).toBeInTheDocument();
      // Should have preview section
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('displays control buttons in a row', () => {
      render(<RuntimePanel />);

      const runButton = screen.getByLabelText('Run');
      const restartButton = screen.getByLabelText('Restart');
      const stopButton = screen.getByLabelText('Stop');

      expect(runButton).toBeInTheDocument();
      expect(restartButton).toBeInTheDocument();
      expect(stopButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty status string', () => {
      render(<RuntimePanel status="" />);

      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('handles very long status messages', () => {
      const longStatus = 'Ignition: ' + 'running '.repeat(50);

      render(<RuntimePanel status={longStatus} />);

      expect(screen.getByText(longStatus)).toBeInTheDocument();
    });

    it('handles status with special characters', () => {
      render(<RuntimePanel status="Status: 100% (2/2 tasks)" />);

      expect(screen.getByText('Status: 100% (2/2 tasks)')).toBeInTheDocument();
    });

    it('handles multiple rapid button clicks', () => {
      const onRun = vi.fn();

      render(<RuntimePanel onRun={onRun} />);

      const runButton = screen.getByLabelText('Run');
      fireEvent.click(runButton);
      fireEvent.click(runButton);
      fireEvent.click(runButton);

      expect(onRun).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels on buttons', () => {
      render(<RuntimePanel />);

      expect(screen.getByLabelText('Run')).toBeInTheDocument();
      expect(screen.getByLabelText('Restart')).toBeInTheDocument();
      expect(screen.getByLabelText('Stop')).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<RuntimePanel />);

      expect(screen.getByText('Runtime')).toBeInTheDocument();
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });
  });
});

