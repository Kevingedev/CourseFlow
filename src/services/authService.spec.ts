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

import { authService } from './authService'

describe('authService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('registers a user with normalized payload values and maps the returned profile', async () => {
    apiMock.post.mockResolvedValueOnce({
      data: {
        id: 15,
        name: 'Ana López',
        email: 'ana@example.com',
        role: 'superadmin',
        dni_nie: 'X1234567T',
        birth_date: '1998-03-15',
        createdAt: '2026-06-01T10:00:00Z',
      },
    })

    await expect(
      authService.register({
        name: 'Ana López',
        email: 'ana@example.com',
        password: 'secret123',
      }),
    ).resolves.toEqual({
      id: '15',
      name: 'Ana López',
      fullName: 'Ana López',
      email: 'ana@example.com',
      role: 'suadmin',
      dniNie: 'X1234567T',
      birthDate: '1998-03-15',
      createdAt: '2026-06-01T10:00:00Z',
    })

    expect(apiMock.post).toHaveBeenCalledWith('/api/v1/auth/register', {
      name: 'Ana López',
      email: 'ana@example.com',
      password: 'secret123',
      dni_nie: null,
      birth_date: null,
      role: 'user',
    })
  })

  it('logs in by calling the session endpoint and then fetching the current user', async () => {
    apiMock.post.mockResolvedValueOnce({ data: {} })
    apiMock.get.mockResolvedValueOnce({
      data: {
        id: 9,
        name: 'Carlos Ruiz',
        email: 'carlos@example.com',
        role: 'admin',
      },
    })

    await expect(authService.login('carlos@example.com', 'top-secret')).resolves.toEqual({
      user: {
        id: '9',
        name: 'Carlos Ruiz',
        fullName: 'Carlos Ruiz',
        email: 'carlos@example.com',
        role: 'admin',
        dniNie: null,
        birthDate: null,
        createdAt: undefined,
      },
      token: 'cookie_session_active',
    })

    expect(apiMock.post).toHaveBeenCalledWith('/api/v1/auth/login', {
      email: 'carlos@example.com',
      password: 'top-secret',
    })
    expect(apiMock.get).toHaveBeenCalledWith('/api/v1/users/me')
  })

  it('ignores unauthorized logout responses', async () => {
    apiMock.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: {
          detail: 'Session expired',
        },
      },
    })

    await expect(authService.logout()).resolves.toBeUndefined()
    expect(apiMock.post).toHaveBeenCalledWith('/api/v1/auth/logout')
  })
})
