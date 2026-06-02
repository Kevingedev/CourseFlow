import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('./api', () => ({
  default: apiMock,
}))

import { applicationsService } from './applicationsService'

describe('applicationsService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('normalizes application statuses and nullable fields when loading applications', async () => {
    apiMock.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          user_id: 11,
          course_id: 21,
          status: 'ACEPTADO',
          has_darde: true,
          previous_education: 'ESO',
          user: { name: 'Marta', email: 'marta@example.com' },
          course: { name: 'Vue Basics' },
        },
        {
          id: 2,
          user_id: 12,
          course_id: 22,
          status: 'rechazado',
          has_darde: undefined,
          previous_education: null,
          user: null,
          course: null,
        },
        {
          id: 3,
          user_id: 13,
          course_id: 23,
          status: 'cancelado',
          user: { name: 'Nora', email: 'nora@example.com' },
          course: { name: 'Pinia' },
        },
        {
          id: 4,
          user_id: 14,
          course_id: 24,
          status: 'something-else',
        },
      ],
    })

    await expect(applicationsService.getApplications()).resolves.toEqual([
      {
        id: 1,
        user_id: 11,
        course_id: 21,
        status: 'accepted',
        has_darde: true,
        previous_education: 'ESO',
        user: { name: 'Marta', email: 'marta@example.com' },
        course: { name: 'Vue Basics' },
      },
      {
        id: 2,
        user_id: 12,
        course_id: 22,
        status: 'rejected',
        has_darde: null,
        previous_education: null,
        user: null,
        course: null,
      },
      {
        id: 3,
        user_id: 13,
        course_id: 23,
        status: 'cancelled',
        has_darde: null,
        previous_education: null,
        user: { name: 'Nora', email: 'nora@example.com' },
        course: { name: 'Pinia' },
      },
      {
        id: 4,
        user_id: 14,
        course_id: 24,
        status: 'pending',
        has_darde: null,
        previous_education: null,
        user: null,
        course: null,
      },
    ])
  })

  it('updates the application status through the API and returns the mapped record', async () => {
    apiMock.patch.mockResolvedValueOnce({
      data: {
        id: 8,
        user_id: 18,
        course_id: 28,
        status: 'aceptado',
        has_darde: false,
        previous_education: 'Bachillerato',
        user: { name: 'Lucia', email: 'lucia@example.com' },
        course: { name: 'Testing Pro' },
      },
    })

    await expect(applicationsService.updateApplicationStatus(8, 'accepted')).resolves.toEqual({
      id: 8,
      user_id: 18,
      course_id: 28,
      status: 'accepted',
      has_darde: false,
      previous_education: 'Bachillerato',
      user: { name: 'Lucia', email: 'lucia@example.com' },
      course: { name: 'Testing Pro' },
    })

    expect(apiMock.patch).toHaveBeenCalledWith('/api/v1/applications/8/status', {
      status: 'accepted',
    })
  })

  it('propagates server details when deleting an application fails', async () => {
    apiMock.delete.mockRejectedValueOnce({
      response: {
        data: {
          detail: 'No se permite eliminar esta solicitud.',
        },
      },
    })

    await expect(applicationsService.deleteApplication(19)).rejects.toThrow(
      'No se permite eliminar esta solicitud.',
    )
  })
})
