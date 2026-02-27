import { useState, useEffect } from 'react'
import { ArrowLeft, Mail, Calendar, Shield, Bell, CalendarDays, Save, User, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'

function MemberDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, getAllMembers, users, setUsers, updateMemberPermission } = useAuth()
  
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [tempPermissions, setTempPermissions] = useState({
    canCreateAnnouncement: false,
    canCreatePlan: false,
    canViewAllAnnouncements: false
  })

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const allMembers = getAllMembers()
    const foundMember = allMembers.find(m => m.id === parseInt(id))
    if (foundMember) {
      setMember(foundMember)
      setTempPermissions({
        canCreateAnnouncement: foundMember.canCreateAnnouncement || false,
        canCreatePlan: foundMember.canCreatePlan || false,
        canViewAllAnnouncements: foundMember.canViewAllAnnouncements || false
      })
    }
    setLoading(false)
  }, [id, getAllMembers])

  const handlePermissionChange = (permission) => {
    setTempPermissions({
      ...tempPermissions,
      [permission]: !tempPermissions[permission]
    })
    setHasChanges(true)
  }

  const handleSavePermissions = () => {
    updateMemberPermission(parseInt(id), 'canCreateAnnouncement', tempPermissions.canCreateAnnouncement)
    updateMemberPermission(parseInt(id), 'canCreatePlan', tempPermissions.canCreatePlan)
    updateMemberPermission(parseInt(id), 'canViewAllAnnouncements', tempPermissions.canViewAllAnnouncements)
    setHasChanges(false)
    // Refresh member data
    const allMembers = getAllMembers()
    const foundMember = allMembers.find(m => m.id === parseInt(id))
    if (foundMember) {
      setMember(foundMember)
    }
  }

  const getRoleBadge = (role) => {
    return role === 'admin' 
      ? 'bg-red-100 text-red-700 border-red-200'
      : 'bg-blue-100 text-blue-700 border-blue-200'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="animate-fade-in">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <User size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Member not found</p>
          <button
            onClick={() => navigate('/members')}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Members
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/members')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Back to Members
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Info Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-3xl">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{member.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadge(member.role)}`}>
                    {member.role === 'admin' ? 'Administrator' : 'Member'}
                  </span>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={18} className="text-gray-400" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={18} className="text-gray-400" />
                    <span>Joined {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Member ID */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Member ID: </span>
                  <span className="text-sm font-medium text-gray-700">{member.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Card - Only visible to admin */}
          {isAdmin && member.role !== 'admin' && (
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Permissions</h3>
              </div>
              
              <div className="space-y-4">
                {/* Can Create Announcements */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">Create Announcements</p>
                      <p className="text-sm text-gray-500">Allow this member to create announcements</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePermissionChange('canCreateAnnouncement')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      tempPermissions.canCreateAnnouncement ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      tempPermissions.canCreateAnnouncement ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Can Create Plans */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">Create Plans</p>
                      <p className="text-sm text-gray-500">Allow this member to create calendar plans</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePermissionChange('canCreatePlan')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      tempPermissions.canCreatePlan ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      tempPermissions.canCreatePlan ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Can View All Announcements */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">View All Announcements</p>
                      <p className="text-sm text-gray-500">Allow viewing private announcements (limited can see vs anyone can see)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePermissionChange('canViewAllAnnouncements')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      tempPermissions.canViewAllAnnouncements ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      tempPermissions.canViewAllAnnouncements ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Save Button */}
                {hasChanges && (
                  <button
                    onClick={handleSavePermissions}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Current Permissions Display (for non-admin or viewing own profile) */}
          {!isAdmin || member.role === 'admin' ? (
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Your Permissions</h3>
              </div>
              
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${member.canCreateAnnouncement ? 'bg-green-50' : 'bg-gray-50'}`}>
                  {member.canCreateAnnouncement ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <X size={18} className="text-gray-400" />
                  )}
                  <span className={member.canCreateAnnouncement ? 'text-green-700' : 'text-gray-500'}>
                    Can Create Announcements
                  </span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${member.canCreatePlan ? 'bg-green-50' : 'bg-gray-50'}`}>
                  {member.canCreatePlan ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <X size={18} className="text-gray-400" />
                  )}
                  <span className={member.canCreatePlan ? 'text-green-700' : 'text-gray-500'}>
                    Can Create Plans
                  </span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${member.canViewAllAnnouncements ? 'bg-green-50' : 'bg-gray-50'}`}>
                  {member.canViewAllAnnouncements ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <X size={18} className="text-gray-400" />
                  )}
                  <span className={member.canViewAllAnnouncements ? 'text-green-700' : 'text-gray-500'}>
                    Can View All Announcements
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Sidebar Stats */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Info</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="font-medium text-gray-800">
                  {member.role === 'admin' ? 'Administrator' : 'Member'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="font-medium text-green-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p className="font-medium text-gray-800">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberDetail
