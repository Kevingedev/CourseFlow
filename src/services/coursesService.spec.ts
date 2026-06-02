import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('./api', () => ({
  default: apiMock,
}))

import { coursesService } from './coursesService'

describe('coursesService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns the courses list from the API', async () => {
    const courses = [
      {
        id: 1,
        name: 'Frontend',
        description: 'Vue and React',
        start_date: '2026-01-10',
        end_date: '2026-04-10',
        capacity: 20,
        is_active: true,
      },
    ]

    apiMock.get.mockResolvedValueOnce({ data: courses })

    await expect(coursesService.getCourses()).resolves.toEqual(courses)
    expect(apiMock.get).toHaveBeenCalledWith('/api/v1/courses/')
  })

  it('creates a course using the provided payload', async () => {
    const payload = {
      name: 'Backend',
      description: 'Node.js and APIs',
      start_date: '2026-02-01',
      end_date: '2026-05-01',
      capacity: 18,
      is_active: true,
    }
    const createdCourse = { id: 7, ...payload }

    apiMock.post.mockResolvedValueOnce({ data: createdCourse })

    await expect(coursesService.createCourse(payload)).resolves.toEqual(createdCourse)
    expect(apiMock.post).toHaveBeenCalledWith('/api/v1/courses/', payload)
  })

  it('wraps delete errors with the fallback message when the API provides no detail', async () => {
    apiMock.delete.mockRejectedValueOnce({})

    await expect(coursesService.deleteCourse(99)).rejects.toThrow(
      'No se pudo desactivar el curso.',
    )
  })
})
