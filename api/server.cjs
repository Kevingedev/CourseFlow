/* eslint-disable @typescript-eslint/no-require-imports */
const jsonServer = require('json-server')
const path = require('path')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults({
  logger: true,
  readOnly: false,
  noCors: false,
})

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] || 'Content-Type, Authorization',
  )
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

const db = () => router.db
const nextId = (collectionName) => {
  const items = db().get(collectionName).value() || []
  const maxId = items.reduce((acc, item) => {
    const asNumber = typeof item.id === 'number' ? item.id : Number(item.id)
    return Number.isFinite(asNumber) ? Math.max(acc, asNumber) : acc
  }, 0)
  return maxId + 1
}

const toNumber = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

const getUserById = (userId) =>
  (db().get('users').value() || []).find((user) => Number(user.id) === Number(userId)) || null

const getCourseById = (courseId) =>
  (db().get('courses').value() || []).find((course) => Number(course.id) === Number(courseId)) || null

const waitingEntriesForCourse = (courseId) =>
  (db().get('waiting_list').value() || [])
    .filter((entry) => Number(entry.course_id) === Number(courseId))
    .sort((left, right) => {
      const leftPosition = Number(left.position) || 0
      const rightPosition = Number(right.position) || 0
      if (leftPosition !== rightPosition) return leftPosition - rightPosition
      return Number(left.id) - Number(right.id)
    })

const reindexWaitingList = (courseId) => {
  const entries = waitingEntriesForCourse(courseId)
  entries.forEach((entry, index) => {
    db().get('waiting_list').find({ id: entry.id }).assign({ position: index + 1 }).write()
  })
}

const serializeWaitingEntry = (entry, position) => {
  const user = getUserById(entry.user_id)
  const course = getCourseById(entry.course_id)

  return {
    ...entry,
    position: typeof position === 'number' ? position : entry.position,
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      : null,
    course: course
      ? {
          id: course.id,
          name: course.name,
        }
      : null,
  }
}

const findApplicationByUserAndCourse = (userId, courseId) =>
  (db().get('applications').value() || []).find(
    (application) =>
      Number(application.user_id) === Number(userId) &&
      Number(application.course_id) === Number(courseId),
  ) || null

server.get('/api/v1/courses/', (req, res) => {
  res.json(db().get('courses').value() || [])
})

server.get('/api/v1/courses/:courseId', (req, res) => {
  const courseId = toNumber(req.params.courseId)
  if (courseId === null) return res.status(400).json({ detail: 'Invalid course id.' })
  const course = db().get('courses').find({ id: courseId }).value()
  if (!course) return res.status(404).json({ detail: 'Course not found.' })
  res.json(course)
})

server.get('/api/v1/courses/:courseId/applications', (req, res) => {
  const courseId = toNumber(req.params.courseId)
  if (courseId === null) return res.status(400).json({ detail: 'Invalid course id.' })
  const applications = (db().get('applications').value() || []).filter(
    (app) => Number(app.course_id) === courseId,
  )
  res.json(applications)
})

server.get('/api/v1/applications/', (req, res) => {
  res.json(db().get('applications').value() || [])
})

server.patch('/api/v1/applications/:applicationId/status', (req, res) => {
  const applicationId = toNumber(req.params.applicationId)
  if (applicationId === null) return res.status(400).json({ detail: 'Invalid application id.' })
  const status = typeof req.body?.status === 'string' ? req.body.status : null
  if (!status) return res.status(400).json({ detail: 'Missing status.' })

  const existing = db().get('applications').find({ id: applicationId }).value()
  if (!existing) return res.status(404).json({ detail: 'Application not found.' })

  db().get('applications').find({ id: applicationId }).assign({ status }).write()
  const updated = db().get('applications').find({ id: applicationId }).value()
  res.json(updated)
})

server.delete('/api/v1/applications/:applicationId', (req, res) => {
  const applicationId = toNumber(req.params.applicationId)
  if (applicationId === null) return res.status(400).json({ detail: 'Invalid application id.' })
  db().get('applications').remove({ id: applicationId }).write()
  res.sendStatus(204)
})

server.get('/api/v1/waiting-list/:courseId', (req, res) => {
  const courseId = toNumber(req.params.courseId)
  if (courseId === null) return res.status(400).json({ detail: 'Invalid course id.' })

  const entries = waitingEntriesForCourse(courseId).map((entry, index) =>
    serializeWaitingEntry(entry, entry.position || index + 1),
  )

  res.json(entries)
})

server.post('/api/v1/waiting-list/', (req, res) => {
  const userId = toNumber(req.query.user_id)
  const courseId = toNumber(req.query.course_id)
  if (userId === null || courseId === null) {
    return res.status(400).json({ detail: 'Missing user_id or course_id.' })
  }

  const already = (db().get('waiting_list').value() || []).some(
    (entry) => Number(entry.user_id) === userId && Number(entry.course_id) === courseId,
  )
  if (already) return res.status(409).json({ detail: 'Already in waiting list.' })

  const maxPos =
    waitingEntriesForCourse(courseId).reduce((acc, entry) => {
      const entryPosition = Number(entry.position) || 0
      return Math.max(acc, entryPosition)
    }, 0) + 1

  const record = {
    id: nextId('waiting_list'),
    user_id: userId,
    course_id: courseId,
    position: maxPos,
    created_at: new Date().toISOString(),
  }

  db().get('waiting_list').push(record).write()
  res.status(201).json(serializeWaitingEntry(record, record.position))
})

server.patch('/api/v1/waiting-list/:entryId/pending', (req, res) => {
  const entryId = toNumber(req.params.entryId)
  if (entryId === null) return res.status(400).json({ detail: 'Invalid waiting list id.' })

  const entry = db().get('waiting_list').find({ id: entryId }).value()
  if (!entry) return res.status(404).json({ detail: 'Waiting list entry not found.' })

  const application = findApplicationByUserAndCourse(entry.user_id, entry.course_id)
  if (!application) {
    return res.status(404).json({ detail: 'Application not found.' })
  }

  db().get('applications').find({ id: application.id }).assign({ status: 'pending' }).write()
  db().get('waiting_list').remove({ id: entryId }).write()
  reindexWaitingList(entry.course_id)

  const updatedApplication = db().get('applications').find({ id: application.id }).value()
  res.json({
    waiting_list_removed: true,
    application: updatedApplication,
  })
})

server.delete('/api/v1/waiting-list/:entryId', (req, res) => {
  const entryId = toNumber(req.params.entryId)
  if (entryId === null) return res.status(400).json({ detail: 'Invalid waiting list id.' })

  const entry = db().get('waiting_list').find({ id: entryId }).value()
  if (!entry) return res.status(404).json({ detail: 'Waiting list entry not found.' })

  db().get('waiting_list').remove({ id: entryId }).write()
  reindexWaitingList(entry.course_id)
  res.sendStatus(204)
})

server.get('/api/admin/users', (req, res) => {
  const users = (db().get('users').value() || []).filter((u) => u.role === 'admin' || u.role === 'suadmin')
  res.json(users)
})

server.post('/api/admin/users', (req, res) => {
  const payload = req.body || {}
  if (!payload.email || !payload.name) return res.status(400).json({ detail: 'Missing name or email.' })
  const record = {
    ...payload,
    id: String(nextId('users')),
    role: payload.role || 'admin',
    createdAt: new Date().toISOString(),
  }
  db().get('users').push(record).write()
  res.status(201).json(record)
})

server.patch('/api/admin/users/:userId', (req, res) => {
  const userId = String(req.params.userId)
  const existing = db().get('users').find({ id: userId }).value()
  if (!existing) return res.status(404).json({ detail: 'User not found.' })
  db().get('users').find({ id: userId }).assign(req.body || {}).write()
  res.json(db().get('users').find({ id: userId }).value())
})

server.delete('/api/admin/users/:userId', (req, res) => {
  const userId = String(req.params.userId)
  db().get('users').remove({ id: userId }).write()
  res.sendStatus(204)
})

server.post('/api/v1/auth/login', (req, res) => {
  res.json({ ok: true })
})

server.post('/api/v1/auth/logout', (req, res) => {
  res.json({ ok: true })
})

server.post('/api/v1/auth/register', (req, res) => {
  const payload = req.body || {}
  if (!payload.email || !payload.password || !payload.name) {
    return res.status(400).json({ detail: 'Missing name, email or password.' })
  }

  const exists = (db().get('users').value() || []).some((u) => u.email === payload.email)
  if (exists) return res.status(409).json({ detail: 'Email already registered.' })

  const record = {
    ...payload,
    id: String(nextId('users')),
    role: payload.role || 'user',
    createdAt: new Date().toISOString(),
  }
  db().get('users').push(record).write()
  res.status(201).json(record)
})

server.get('/api/v1/users/me', (req, res) => {
  const user = (db().get('users').value() || [])[0]
  if (!user) return res.status(404).json({ detail: 'No users in db.' })
  res.json(user)
})

server.patch('/api/v1/users/me', (req, res) => {
  const users = db().get('users').value() || []
  const first = users[0]
  if (!first) return res.status(404).json({ detail: 'No users in db.' })
  db().get('users').find({ id: first.id }).assign(req.body || {}).write()
  res.json(db().get('users').find({ id: first.id }).value())
})

server.use(router)

const port = Number(process.env.PORT) || 8002
server.listen(port, () => {
   
  console.log(`JSON Server API running on http://localhost:${port}`)
})
