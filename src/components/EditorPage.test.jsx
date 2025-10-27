/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-node-access */
// src/components/EditorPage.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEventLib from '@testing-library/user-event';
import EditorPage from './EditorPage';

describe('EditorPage', () => {
  test('renders main sections and toolbar buttons', () => {
    render(<EditorPage />);
    expect(screen.getByText(/ATS Compatibility Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional Summary/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload New/i })).toBeInTheDocument();
  });

  test('bold/italic/underline trigger execCommand', async () => {
    const user = userEventLib.setup();
    render(<EditorPage />);
    const editor = screen.getByRole('textbox', { name: /resume content/i });
    editor.focus();

    const getBtn = (cmd) =>
      // eslint-disable-next-line testing-library/no-node-access
      document.querySelector(`.icon-button[data-cmd="${cmd}"]`);

    await user.click(getBtn('bold'));
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, null);

    await user.click(getBtn('italic'));
    expect(document.execCommand).toHaveBeenCalledWith('italic', false, null);

    await user.click(getBtn('underline'));
    expect(document.execCommand).toHaveBeenCalledWith('underline', false, null);
  });

  test('list and alignment commands execute', () => {
    render(<EditorPage />);
    const cmds = [
      'insertUnorderedList',
      'insertOrderedList',
      'justifyLeft',
      'justifyCenter',
      'justifyRight',
    ];
    for (const cmd of cmds) {
      const btn = document.querySelector(`.icon-button[data-cmd="${cmd}"]`);
      btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      expect(document.execCommand).toHaveBeenCalledWith(cmd, false, null);
    }
  });

  test('format select applies formatBlock', () => {
    render(<EditorPage />);
    const select = document.getElementById('formatSelect');
    select.value = 'h2';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.execCommand).toHaveBeenCalledWith('formatBlock', false, 'h2');
  });

  test('toolbar mousedown keeps editor focused', () => {
    render(<EditorPage />);
    const editor = document.querySelector('.resume-content');
    editor.focus();
    const bold = document.querySelector('.icon-button[data-cmd="bold"]');
    bold.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(editor);
  });

  test('editor mousedown schedules focus using timers', () => {
    jest.useFakeTimers();
    render(<EditorPage />);
    const editor = document.querySelector('.resume-content');
    editor.blur();
    editor.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    jest.runOnlyPendingTimers();
    expect(document.activeElement).toBe(editor);
  });

  test('Upload New triggers hidden input click', async () => {
    const user = userEventLib.setup();
    render(<EditorPage />);
    const input = document.getElementById('pdfUpload');
    const spy = jest.spyOn(input, 'click');
    await user.click(screen.getByRole('button', { name: /Upload New/i }));
    expect(spy).toHaveBeenCalled();
  });

  test('PDF upload renders canvases for each page', async () => {
    const user = userEventLib.setup();
    render(<EditorPage />);
    const file = new File([new Uint8Array([37, 80, 68, 70])], 'test.pdf', { type: 'application/pdf' });
    const input = document.getElementById('pdfUpload');
    await user.upload(input, file);

    await waitFor(() => {
      const canvases = document.querySelectorAll('.pdf-page-canvas');
      expect(canvases.length).toBe(2);
    });
  });

  test('invalid upload shows alert', async () => {
    const user = userEventLib.setup();
    window.alert = jest.fn();
    render(<EditorPage />);
    const txt = new File(['hello'], 'not.pdf', { type: 'text/plain' });
    const input = document.getElementById('pdfUpload');
    await user.upload(input, txt);
    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/valid PDF/i));
  });

  test('Download snapshots DOM and saves PDF', async () => {
    const user = userEventLib.setup();
    render(<EditorPage />);
    await user.click(screen.getByRole('button', { name: /Download/i }));

    await waitFor(() => {
      const inst = global.__jspdfInstances[0];
      expect(inst.addImage).toHaveBeenCalledTimes(1);
      expect(inst.save).toHaveBeenCalledWith('resume.pdf');
    });
  });

  test('execCommand returning false does not crash', () => {
    document.execCommand.mockReturnValueOnce(false);
    render(<EditorPage />);
    const bold = document.querySelector('.icon-button[data-cmd="bold"]');
    bold.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, null);
  });
});
