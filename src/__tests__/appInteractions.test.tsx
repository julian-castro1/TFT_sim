import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'

// Increase default timeout for async parser
jest.setTimeout(10000)

describe('TFT Display Simulator - basic interactions', () => {
  test('renders main UI sections', () => {
    render(<App />)

    expect(screen.getByText('TFT Display Simulator')).toBeInTheDocument()
    expect(screen.getByText('Arduino Code Editor')).toBeInTheDocument()
    expect(screen.getByText('Display Controls')).toBeInTheDocument()
  })

  test('parse & render button parses sample code without errors', async () => {
    render(<App />)

    const parseButton = screen.getByRole('button', { name: /parse/i })
    fireEvent.click(parseButton)

    // Wait until button text switches back from "Parsing..."
    await waitFor(() => expect(parseButton).toHaveTextContent('Parse & Render'))

    // No error panel rendered
    const errorPanel = screen.queryByText(/errors/i)
    expect(errorPanel).not.toBeInTheDocument()

    // Stats should update
    expect(screen.getByText(/elements:/i)).toBeInTheDocument()
  })

  test('debug mode toggle shows overlay info', () => {
    render(<App />)

    const debugCheckbox = screen.getByLabelText(/debug mode/i)
    fireEvent.click(debugCheckbox)
    // overlay info appears
    expect(screen.getByText(/screen:/i)).toBeInTheDocument()
  })
})