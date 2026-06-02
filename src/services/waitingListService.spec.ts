import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('./api', () => ({
  default: apiMock,
}))

import { waitingListService } from './waitingListService'

describe('waitingListService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads waiting list entries from a wrapped results payload and assigns stable positions', async () => {
    apiMock.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 101,
            user_id: 201,
            course_id: 301,
            created_at: '2026-04-01T10:00:00Z',
            user: { id: 201, name: 'Eva', email: 'eva@example.com' },
            course: { id: 301, name: 'Frontend Avanzado' },
          },
          {
            id: 102,
            user_id: 202,
            course_id: 301,
            position: 5,
            created_at: '2026-04-02T10:00:00Z',
          },
        ],
      },
    })

    await expect(waitingListService.getWaitingListByCourse(301)).resolves.toEqual([
      {
        id: 101,
        user_id: 201,
        course_id: 301,
        position: 1,
        created_at: '2026-04-01T10:00:00Z',
        user: { id: 201, name: 'Eva', email: 'eva@example.com' },
        course: { id: 301, name: 'Frontend Avanzado' },
      },
      {
        id: 102,
        user_id: 202,
        course_id: 301,
        position: 5,
        created_at: '2026-04-02T10:00:00Z',
        user: undefined,
        course: undefined,
      },
    ])

    expect(apiMock.get).toHaveBeenCalledWith('/api/v1/waiting-list/301')
  })
})
