import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import { RecentLostItems } from '../components/dashboard/DashboardSections'
import type { Item } from '../services/itemService'

function makeItem(id: number, title: string): Item {
  return {
    id,
    owner: 1,
    owner_email: 'student@example.com',
    item_type: 'lost',
    title,
    description: `${title} description`,
    image: null,
    image_url: null,
    category: 'Bags',
    location: 'Campus Center',
    map_x: null,
    map_y: null,
    status: 'open',
    date: '2026-05-31',
    is_anonymous: false,
    created_at: '2026-05-31T10:00:00Z',
    updated_at: '2026-05-31T10:00:00Z',
  }
}

test('RecentLostItems shows three cards by default and expands on see more', async () => {
  const user = userEvent.setup()
  const items = [makeItem(1, 'Item 1'), makeItem(2, 'Item 2'), makeItem(3, 'Item 3'), makeItem(4, 'Item 4'), makeItem(5, 'Item 5')]

  render(
    <MemoryRouter>
      <RecentLostItems
        title="Recent lost items"
        eyebrow="Recent lost items"
        items={items}
        emptyTitle="No recent lost items yet"
        emptyDescription="No items"
        tone="lost"
      />
    </MemoryRouter>,
  )

  expect(screen.getByText('Item 1')).toBeInTheDocument()
  expect(screen.getByText('Item 2')).toBeInTheDocument()
  expect(screen.getByText('Item 3')).toBeInTheDocument()
  expect(screen.queryByText('Item 4')).not.toBeInTheDocument()
  expect(screen.queryByText('Item 5')).not.toBeInTheDocument()

  await act(async () => {
    await user.click(screen.getByRole('button', { name: /see more/i }))
  })

  expect(screen.getByText('Item 4')).toBeInTheDocument()
  expect(screen.getByText('Item 5')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument()
})