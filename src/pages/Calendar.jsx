import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Clock, User, Bell, Edit, Trash2 } from 'lucide-react'
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
    })
    return { plans: dayEvents, announcements: dayAnnouncements }
  }

  const handleDayClick = (day) => {
    if (!day) return
    const dateStr = currentDate.date(day).format('YYYY-MM-DD')
    const { plans, announcements } = getEventsForDay(day)
    
    if (plans.length > 0 || announcements.length > 0) {
      setSelectedDate(dateStr)
      setSelectedItem({ plans, announcements })
      setShowDetailModal(true)
    } else if (canCreatePlan) {
      setSelectedDate(dateStr)
      setShowEventModal(true)
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
        }
      }
      return a
    })

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
  }

  // Delete announcement
  const deleteAnnouncement = (announcementId) => {
    const updatedAnnouncements = announcements.filter(a => a.id !== announcementId)
    setAnnouncements(updatedAnnouncements)
    localStorage.setItem('kusgan_announcements', JSON.stringify(updatedAnnouncements))
    
    // Refresh selected item
    if (selectedItem) {
      const updatedAnnouncementsList = selectedItem.announcements.filter(a => a.id !== announcementId)
      setSelectedItem({ ...selectedItem, announcements: updatedAnnouncementsList })
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500 hover:bg-red-600'
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'low': return 'bg-green-500 hover:bg-green-600'
      default: return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getAnnouncementPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500'
      case 'medium': return 'border-l-4 border-yellow-500'
      case 'low': return 'border-l-4 border-green-500'
      default: return 'border-l-4 border-gray-500'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'environmental': return '🌱'
      case 'relief operation': return '🚑'
      case 'fire response': return '🔥'
      case 'notes': return '📝'
      default: return '📌'
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
          <p className="text-sm text-gray-500">Click on a day to view or create events</p>
        </div>
        {canCreatePlan && (
          <button
            onClick={() => {
              setSelectedDate(dayjs().format('YYYY-MM-DD'))
              setShowEventModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <Plus size={18} />
            Add Event
          </button>
        )}
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black p-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            {currentDate.format('MMMM YYYY')}
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={prevMonth} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextMonth} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div 
              key={day} 
              className="text-center text-sm font-semibold text-gray-600 py-3"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const { plans, announcements } = getEventsForDay(day)
            const hasEvents = plans.length > 0 || announcements.length > 0
            
            return (
              <div
                key={index}
                className={`min-h-[120px] border-b border-r border-gray-100 transition-all ${
                  day ? (hasEvents ? 'hover:bg-red-50 cursor-pointer' : (canCreatePlan ? 'hover:bg-gray-50 cursor-pointer' : '')) : 'bg-gray-50'
                }`}
                onClick={() => handleDayClick(day)}
              >
                {day && (
                  <div className="p-2 h-full flex flex-col">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all hover:scale-110 ${
                        dayjs().format('DD') === String(day) && currentDate.month() === dayjs().month()
                          ? 'bg-red-600 text-white shadow-lg'
                          : hasEvents 
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-700 hover:bg-red-100'
                      }`}
                    >
                      {day}
                    </div>
                    <div className="flex-1 mt-1 space-y-1 overflow-hidden">
                      {/* Plans */}
                      {plans.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs text-white px-2 py-1 rounded truncate ${event.type === 'plan' ? 'bg-red-500' : 'bg-gray-800'}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {/* Announcements - show title */}
                      {announcements.slice(0, 2).map(announcement => (
                        <div
                          key={announcement.id}
                          className={`text-xs text-white px-2 py-1 rounded truncate ${getPriorityColor(announcement.priority)}`}
                          title={announcement.title}
                        >
                          📢 {announcement.title}
                        </div>
                      ))}
                      {plans.length + announcements.length > 2 && (
                        <div className="text-xs text-gray-500 px-2">
                          +{plans.length + announcements.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 animate-slide-up">
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">Create Event</h3>
                <p className="text-sm text-gray-400">{selectedDate}</p>
              </div>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

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
            </div>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {showEditModal && editingAnnouncement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 animate-slide-up">
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">Edit Announcement</h3>
                <p className="text-sm text-gray-400">{editingAnnouncement.date}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingAnnouncement(null)
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateAnnouncement} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter announcement content"
                  rows={4}
                  required
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="flex gap-2">
                  {['high', 'medium', 'low'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, priority: p })}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium capitalize transition-all ${
                        editForm.priority === p
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
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
