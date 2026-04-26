import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClipboardProvider } from '../context/ClipboardContext';
import { Constants } from '../logic/constants';
import { ColorConverterTab } from './ColorConverterTab';

function renderTab(addToast = vi.fn()) {
  return render(
    <ClipboardProvider>
      <ColorConverterTab addToast={addToast} />
    </ClipboardProvider>
  );
}

test('Copy HSB button is disabled initially', () => {
  renderTab();
  expect(screen.getByRole('button', { name: 'Copy HSB' })).toBeDisabled();
});

test('valid hex enables Copy HSB button and shows result', async () => {
  renderTab();
  await userEvent.type(screen.getByLabelText('CSS Hex Code'), '#ff0000');

  expect(screen.getByRole('button', { name: 'Copy HSB' })).not.toBeDisabled();
  expect(screen.getByText(/Hue: 0,/)).toBeInTheDocument();
});

test('invalid hex shows error message', async () => {
  renderTab();
  await userEvent.type(screen.getByLabelText('CSS Hex Code'), '#xyz');

  expect(screen.getByText('Enter a valid 6-digit hex code')).toBeInTheDocument();
});

test('clicking Copy HSB calls addToast with success', async () => {
  const addToast = vi.fn();
  renderTab(addToast);

  await userEvent.type(screen.getByLabelText('CSS Hex Code'), '#ff0000');
  await userEvent.click(screen.getByRole('button', { name: 'Copy HSB' }));

  expect(addToast).toHaveBeenCalledWith(Constants.hsbCopied, 'success');
});
