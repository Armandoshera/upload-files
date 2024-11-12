import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from './src/component/FileUpload';
import '@testing-library/jest-dom';


describe('FileUpload Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('file selection works', () => {
      render(<FileUpload />);

      const fileInput = screen.getByLabelText(/Choose File/i);
      const file = new File(['test'], 'test-file.txt', { type: 'text/plain' });
  
      fireEvent.change(fileInput, { target: { files: [file] } });
  
      expect(screen.getByText('Upload')).toBeInTheDocument(); // Button should be present
    });
  //error message showsif there is no file selected
    test('error message shows if no file is selected', async () => {
      render(<FileUpload />);

      const uploadButton = screen.getByRole('button', { name: /Upload/i });
  
      fireEvent.click(uploadButton);
  
      expect(await screen.findByText(/Please upload a file/i)).toBeInTheDocument();
    });
  
  });