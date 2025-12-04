import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DragAndDrop } from '../DragAndDrop';

describe('DragAndDrop', () => {
  it('renders children', () => {
    render(
      <DragAndDrop onDrop={vi.fn()}>
        <div>Drop zone content</div>
      </DragAndDrop>
    );

    expect(screen.getByText('Drop zone content')).toBeInTheDocument();
  });

  it('handles file drop', () => {
    const onDrop = vi.fn();
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    render(
      <DragAndDrop onDrop={onDrop}>
        <div>Drop zone</div>
      </DragAndDrop>
    );

    const dropZone = screen.getByText('Drop zone');

    fireEvent.dragOver(dropZone, {
      dataTransfer: {
        files: [file],
        types: ['Files'],
      },
    });

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(onDrop).toHaveBeenCalledWith([file]);
  });

  it('handles multiple files', () => {
    const onDrop = vi.fn();
    const files = [
      new File(['content1'], 'test1.txt'),
      new File(['content2'], 'test2.txt'),
    ];

    render(
      <DragAndDrop onDrop={onDrop} multiple={true}>
        <div>Drop zone</div>
      </DragAndDrop>
    );

    const dropZone = screen.getByText('Drop zone');

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files,
      },
    });

    expect(onDrop).toHaveBeenCalledWith(files);
  });

  it('filters files by accept', () => {
    const onDrop = vi.fn();
    const validFile = new File(['content'], 'test.cs', { type: 'text/x-csharp' });
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });

    render(
      <DragAndDrop onDrop={onDrop} accept=".cs">
        <div>Drop zone</div>
      </DragAndDrop>
    );

    const dropZone = screen.getByText('Drop zone');

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [validFile, invalidFile],
      },
    });

    expect(onDrop).toHaveBeenCalledWith([validFile]);
  });

  it('shows drag overlay when dragging', () => {
    render(
      <DragAndDrop onDrop={vi.fn()}>
        <div>Drop zone</div>
      </DragAndDrop>
    );

    const dropZone = screen.getByText('Drop zone');

    fireEvent.dragEnter(dropZone, {
      dataTransfer: {
        types: ['Files'],
      },
    });

    expect(screen.getByText(/drop files here/i)).toBeInTheDocument();
  });

  it('hides drag overlay on drag leave', () => {
    render(
      <DragAndDrop onDrop={vi.fn()}>
        <div>Drop zone</div>
      </DragAndDrop>
    );

    const dropZone = screen.getByText('Drop zone');

    fireEvent.dragEnter(dropZone, {
      dataTransfer: {
        types: ['Files'],
      },
    });

    expect(screen.getByText(/drop files here/i)).toBeInTheDocument();

    fireEvent.dragLeave(dropZone);

    expect(screen.queryByText(/drop files here/i)).not.toBeInTheDocument();
  });

  it('prevents default on drag over', () => {
    render(
      <DragAndDrop onDrop={vi.fn()}>
        <div>Drop zone</div>
      </DragAndDrop>
    );

    const dropZone = screen.getByText('Drop zone');
    const event = new Event('dragover', { bubbles: true, cancelable: true });

    Object.defineProperty(event, 'dataTransfer', {
      value: {
        types: ['Files'],
        effectAllowed: 'all',
      },
    });

    const preventDefault = vi.spyOn(event, 'preventDefault');

    dropZone.dispatchEvent(event);

    expect(preventDefault).toHaveBeenCalled();
  });

  it('calls onDragOver callback', () => {
    const onDragOver = vi.fn();

    render(
      <DragAndDrop onDrop={vi.fn()} onDragOver={onDragOver}>
        <div>Drop zone</div>
      </DragAndDrop>
    );

    const dropZone = screen.getByText('Drop zone');

    fireEvent.dragOver(dropZone, {
      dataTransfer: {
        types: ['Files'],
      },
    });

    expect(onDragOver).toHaveBeenCalled();
  });

  it('disabled state prevents drops', () => {
    const onDrop = vi.fn();

    render(
      <DragAndDrop onDrop={onDrop} disabled={true}>
        <div>Drop zone</div>
      </DragAndDrop>
    );

    const dropZone = screen.getByText('Drop zone');
    const file = new File(['content'], 'test.txt');

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(onDrop).not.toHaveBeenCalled();
  });
});
