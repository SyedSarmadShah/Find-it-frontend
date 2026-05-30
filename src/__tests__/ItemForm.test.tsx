import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import ItemForm from '../pages/items/ItemForm'

test('ItemForm calls onSubmit with FormData', async () => {
  const handleSubmit = vi.fn(async (fd: FormData) => {
    // This assertion will run inside the fake handler when called
    expect(fd.get('title')).toBe('My item')
  })

  render(<ItemForm onSubmit={handleSubmit} />)

  await userEvent.type(screen.getByPlaceholderText('Title'), 'My item')
  await userEvent.type(screen.getByPlaceholderText('Description'), 'Some description')

  const button = screen.getByRole('button', { name: /save item/i })
  await userEvent.click(button)

  expect(handleSubmit).toHaveBeenCalled()
})
