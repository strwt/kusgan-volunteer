import { useMemo, useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, Clock, User, Bell, Plus } from 'lucide-react'
import dayjs from 'dayjs'
import { useAuth } from '../context/AuthContext'

// Local storage helper for events
const getStoredEvents = () => {
  const stored = localStorage.getItem('kusgan_events')
  return stored ? JSON.parse(stored) : []
}

// Local storage helper for announcements
const getStoredAnnouncements = () => {
  const stored = localStorage.getItem('kusgan_announcements')
  return stored ? JSON.parse(stored) : []
}

function Calendar() {
  const { user } = useAuth()
<<<<<<< HEAD
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [events, setEvents] = useState(getStoredEvents)
  const [announcements, setAnnouncements] = useState(getStoredAnnouncements)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'plan',
    startTime: '',
    endTime: '',
    priority: 'medium',
    category: 'environmental',
    visibility: 'public',
  })
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    priority: 'medium',
    category: 'environmental',
    visibility: 'public',
  })

  useEffect(() => {
    localStorage.setItem('kusgan_events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    setAnnouncements(getStoredAnnouncements())
  }, [events])

  const canCreatePlan = user?.canCreatePlan || user?.role === 'admin'
  const canCreateAnnouncement = user?.canCreateAnnouncement || user?.role === 'admin'
  const canViewAllAnnouncements = user?.canViewAllAnnouncements || user?.role === 'admin'
  const isAdmin = user?.role === 'admin'

  const daysInMonth = currentDate.daysInMonth()
  const firstDayOfMonth = currentDate.startOf('month').day()

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'))
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'))

  const getEventsForDay = (day) => {
    if (!day) return { plans: [], announcements: [] }
    const dateStr = currentDate.date(day).format('YYYY-MM-DD')
    const dayEvents = events.filter(e => e.date === dateStr)
    const dayAnnouncements = announcements.filter(a => {
      return a.date === dateStr && (a.visibility === 'public' || a.authorId === user?.id || user?.role === 'admin' || canViewAllAnnouncements)
=======
  const [events] = useState(getStoredEvents)
  const [announcements] = useState(getStoredAnnouncements)
  const [selectedMonthKey, setSelectedMonthKey] = useState(null)
  const [expandedItemId, setExpandedItemId] = useState(null)

  const visibleAnnouncements = useMemo(() => {
    return announcements.filter(a => {
      return a.visibility === 'public' || a.authorId === user?.id || user?.role === 'admin'
>>>>>>> 87a1face433de87f5546fee631b01a9c62081437
    })
  }, [announcements, user])

  const monthGroups = useMemo(() => {
    const allItems = [
      ...events.map(event => ({
        id: `plan-${event.id}`,
        type: 'plan',
<<<<<<< HEAD
        startTime: '',
        endTime: '',
        priority: 'medium',
        category: 'environmental',
        visibility: 'public',
      })
    }
  }

  const handleSubmitEvent = (e) => {
    e.preventDefault()
    if (!eventForm.title || !selectedDate) return

    const newEvent = {
      id: Date.now(),
      ...eventForm,
      date: selectedDate,
      createdBy: user.name,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
    }

    setEvents([...events, newEvent])
    setShowEventModal(false)
    setEventForm({
      title: '',
      description: '',
      type: 'plan',
      startTime: '',
      endTime: '',
      priority: 'medium',
      category: 'environmental',
      visibility: 'public',
    })
  }

  const deleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId))
  }

  // Check if user can edit an announcement
  const canEditAnnouncement = (announcement) => {
    // Admin can edit any announcement
    if (isAdmin) return true
    // User can edit their own announcement if they have permission
    if (announcement.authorId === user?.id && canCreateAnnouncement) return true
    return false
  }

  // Handle edit button click
  const handleEditClick = (announcement) => {
    setEditingAnnouncement(announcement)
    setEditForm({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority || 'medium',
      category: announcement.category || 'environmental',
      visibility: announcement.visibility || 'public',
    })
    setShowEditModal(true)
    setShowDetailModal(false)
  }

  // Handle update announcement
  const handleUpdateAnnouncement = (e) => {
    e.preventDefault()
    if (!editForm.title || !editForm.content || !editingAnnouncement) return

    const updatedAnnouncements = announcements.map(a => {
      if (a.id === editingAnnouncement.id) {
        return {
          ...a,
          title: editForm.title,
          content: editForm.content,
          priority: editForm.priority,
          category: editForm.category,
          visibility: editForm.visibility,
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm'),
=======
        title: event.title,
        description: event.description,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        createdBy: event.createdBy,
      })),
      ...visibleAnnouncements.map(announcement => ({
        id: `announcement-${announcement.id}`,
        type: 'announcement',
        title: announcement.title,
        content: announcement.content,
        date: announcement.date,
        priority: announcement.priority,
        category: announcement.category,
        author: announcement.author,
      })),
    ].filter(item => dayjs(item.date).isValid())

    const grouped = allItems.reduce((acc, item) => {
      const monthKey = dayjs(item.date).format('YYYY-MM')
      if (!acc[monthKey]) {
        acc[monthKey] = {
          monthKey,
          monthLabel: dayjs(item.date).format('MMMM YYYY'),
          items: [],
>>>>>>> 87a1face433de87f5546fee631b01a9c62081437
        }
      }
      acc[monthKey].items.push(item)
      return acc
    }, {})

<<<<<<< HEAD
    setAnnouncements(updatedAnnouncements)
    localStorage.setItem('kusgan_announcements', JSON.stringify(updatedAnnouncements))
    setShowEditModal(false)
    setEditingAnnouncement(null)
    setEditForm({
      title: '',
      content: '',
      priority: 'medium',
      category: 'environmental',
      visibility: 'public',
    })
    
    // Refresh selected item with updated data
    if (selectedItem) {
      const { announcements: updatedAnnouncementsList } = getEventsForDay(currentDate.date(parseInt(selectedDate.split('-')[2])))
      setSelectedItem({ ...selectedItem, announcements: updatedAnnouncementsList })
    }
=======
    return Object.values(grouped)
      .map(group => ({
        ...group,
        items: [...group.items].sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()),
      }))
      .sort((a, b) => dayjs(b.monthKey).valueOf() - dayjs(a.monthKey).valueOf())
  }, [events, visibleAnnouncements])

  const selectedMonth = monthGroups.find(group => group.monthKey === selectedMonthKey)

  const toggleExpand = (itemId) => {
    setExpandedItemId(prev => (prev === itemId ? null : itemId))
>>>>>>> 87a1face433de87f5546fee631b01a9c62081437
  }

  const getItemTimeLabel = (item) => {
    if (item.type === 'plan') {
      if (item.startTime || item.endTime) {
        return `${item.startTime || '--:--'} - ${item.endTime || '--:--'}`
      }
      return 'No time set'
    }
    return 'No time set'
  }

  const getItemCategoryLabel = (item) => {
    if (item.type === 'announcement') {
      return item.category || 'announcement'
    }
    return 'plan'
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
          <p className="text-sm text-gray-500">
            {selectedMonth ? `Events in ${selectedMonth.monthLabel}` : 'Select a month that has events'}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {!selectedMonth && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthGroups.map(group => (
            <button
              key={group.monthKey}
              onClick={() => {
                setSelectedMonthKey(group.monthKey)
                setExpandedItemId(null)
              }}
              className="text-left bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg hover:border-red-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{group.monthLabel}</p>
                    <p className="text-xs text-gray-500">Click to view events</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {group.items.length}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {group.items.slice(0, 3).map(item => (
                  <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-2">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {dayjs(item.date).format('MMM D, YYYY')} | {getItemTimeLabel(item)}
                    </p>
                    <p className="text-xs text-red-600 mt-1 capitalize">{getItemCategoryLabel(item)}</p>
                  </div>
                ))}
                {group.items.length > 3 && (
                  <p className="text-xs text-gray-500">+{group.items.length - 3} more</p>
                )}
              </div>
            </button>
          ))}

          {monthGroups.length === 0 && (
            <div className="col-span-full bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
              No months with events yet.
            </div>
<<<<<<< HEAD

            <form onSubmit={handleSubmitEvent} className="p-6 space-y-4">
              {/* Event Type Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEventForm({ ...eventForm, type: 'plan' })}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    eventForm.type === 'plan'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Plan
                </button>
                <button
                  type="button"
                  onClick={() => setEventForm({ ...eventForm, type: 'announcement' })}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    eventForm.type === 'announcement'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Announcement
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter event title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>

              {/* Time - Only show for plans */}
              {eventForm.type === 'plan' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={eventForm.startTime}
                      onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={eventForm.endTime}
                      onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Priority - Only show for announcements */}
              {eventForm.type === 'announcement' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <div className="flex gap-2">
                    {['high', 'medium', 'low'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEventForm({ ...eventForm, priority: p })}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium capitalize transition-all ${
                          eventForm.priority === p
                            ? p === 'high' ? 'bg-red-600 text-white'
                              : p === 'medium' ? 'bg-yellow-500 text-white'
                              : 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category - Only show for announcements */}
              {eventForm.type === 'announcement' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="flex gap-2 flex-wrap">
                    {['environmental', 'relief operation', 'fire response', 'notes'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEventForm({ ...eventForm, category: c })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                          eventForm.category === c
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {getCategoryIcon(c)} {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Visibility - Only show for announcements, and only for admin */}
              {eventForm.type === 'announcement' && isAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEventForm({ ...eventForm, visibility: 'public' })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        eventForm.visibility === 'public'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🌍 Anyone can see
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventForm({ ...eventForm, visibility: 'private' })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        eventForm.visibility === 'private'
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🔒 Only me
                    </button>
                  </div>
                </div>
              )}

              {/* Note for members when creating announcement */}
              {eventForm.type === 'announcement' && !isAdmin && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    ℹ️ Your announcement will be submitted for admin approval. The admin will set the visibility.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Create {eventForm.type === 'plan' ? 'Plan' : 'Announcement'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal - Shows events/announcements when clicking on a day */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-t-2xl flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-lg font-semibold text-white">Events & Announcements</h3>
                <p className="text-sm text-gray-400">{selectedDate}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Plans */}
              {selectedItem.plans.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase">Plans</h4>
                  {selectedItem.plans.map(plan => (
                    <div
                      key={plan.id}
                      className="bg-gray-50 rounded-lg p-4 mb-2 border-l-4 border-red-500"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-gray-800">{plan.title}</h5>
                          {plan.description && (
                            <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                          )}
                          {(plan.startTime || plan.endTime) && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <Clock size={14} />
                              <span>{plan.startTime || '--:--'} - {plan.endTime || '--:--'}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <User size={14} />
                            <span>{plan.createdBy}</span>
                          </div>
                        </div>
                        {(user?.role === 'admin' || user?.name === plan.createdBy) && (
                          <button
                            onClick={() => {
                              deleteEvent(plan.id)
                              const newPlans = selectedItem.plans.filter(p => p.id !== plan.id)
                              setSelectedItem({ ...selectedItem, plans: newPlans })
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Announcements */}
              {selectedItem.announcements.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase">Announcements</h4>
                  {selectedItem.announcements.map(announcement => (
                    <div
                      key={announcement.id}
                      className={`bg-gray-50 rounded-lg p-4 mb-2 ${getAnnouncementPriorityColor(announcement.priority)}`}
                    >
                      <div className="flex items-start gap-3">
                        <Bell size={18} className="text-gray-400 mt-1" />
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800">{announcement.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                              announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {announcement.priority}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              announcement.category === 'environmental' ? 'bg-green-100 text-green-700' :
                              announcement.category === 'relief operation' ? 'bg-blue-100 text-blue-700' :
                              announcement.category === 'fire response' ? 'bg-orange-100 text-orange-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {getCategoryIcon(announcement.category)} {announcement.category}
                            </span>
                            {announcement.visibility === 'private' && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                🔒 Private
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <User size={14} />
                            <span>{announcement.author}</span>
                          </div>
                          
                          {/* Edit and Delete buttons for announcements */}
                          {canEditAnnouncement(announcement) && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                              <button
                                onClick={() => handleEditClick(announcement)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => deleteAnnouncement(announcement.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedItem.plans.length === 0 && selectedItem.announcements.length === 0 && (
                <p className="text-gray-500 text-center py-4">No events for this day</p>
              )}
=======
          )}
        </div>
      )}

      {selectedMonth && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-black p-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{selectedMonth.monthLabel}</h3>
              <p className="text-sm text-gray-400">{selectedMonth.items.length} event(s)</p>
>>>>>>> 87a1face433de87f5546fee631b01a9c62081437
            </div>
            <button
              onClick={() => {
                setSelectedMonthKey(null)
                setExpandedItemId(null)
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          </div>

          <div className="p-5 space-y-3">
            {selectedMonth.items.map(item => {
              const isExpanded = expandedItemId === item.id

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all ${
                    item.type === 'announcement' ? 'border-yellow-200 bg-yellow-50/40' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {item.type === 'announcement' ? (
                            <Bell size={16} className="text-yellow-600" />
                          ) : (
                            <CalendarIcon size={16} className="text-red-600" />
                          )}
                          <span className="text-xs uppercase tracking-wide text-gray-500">
                            {item.type}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{dayjs(item.date).format('MMMM D, YYYY')}</p>
                      </div>
                      <span className="text-xs text-gray-500">{isExpanded ? 'Hide' : 'Expand'}</span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-200 pt-3 text-sm text-gray-700 space-y-3">
                      {item.type === 'plan' && (
                        <>
                          <p>{item.description || 'No description provided.'}</p>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={14} />
                            <span>{item.startTime || '--:--'} - {item.endTime || '--:--'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <User size={14} />
                            <span>{item.createdBy || 'Unknown creator'}</span>
                          </div>
                        </>
                      )}

                      {item.type === 'announcement' && (
                        <>
                          <p>{item.content || 'No content provided.'}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.priority && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                {item.priority}
                              </span>
                            )}
                            {item.category && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <User size={14} />
                            <span>{item.author || 'Unknown author'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

<<<<<<< HEAD
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {['environmental', 'relief operation', 'fire response', 'notes'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, category: c })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        editForm.category === c
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {getCategoryIcon(c)} {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility - Only show for admin */}
              {isAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, visibility: 'public' })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        editForm.visibility === 'public'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🌍 Anyone can see
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, visibility: 'private' })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        editForm.visibility === 'private'
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🔒 Only me
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Update Announcement
              </button>
            </form>
=======
            {selectedMonth.items.length === 0 && (
              <p className="text-gray-500 text-center py-4">No events in this Month.</p>
            )}
>>>>>>> 87a1face433de87f5546fee631b01a9c62081437
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
