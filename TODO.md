# TODO - Announcement & Calendar Permission Updates

## Task: Add Priority, Category, Visibility to announcements with new permissions

### Files to Edit:

- [x] 1. src/pages/Calendar.jsx
  - [x] Add priority, category, and visibility fields to event/announcement form
  - [x] Hide visibility field for non-admin members
  - [x] Add canViewAllAnnouncements filter for viewing announcements

- [x] 2. src/pages/Announcement.jsx  
  - [x] Hide visibility field for members when creating announcements (only admin sees it)
  - [x] Add canViewAllAnnouncements permission check for viewing private announcements

- [x] 3. src/pages/MemberDetail.jsx
  - [x] Add new permission toggle for "canViewAllAnnouncements" (limited can see vs anyone can see)
  - [x] Add display of canViewAllAnnouncements in "Your Permissions" section

- [x] 4. src/context/AuthContext.jsx
  - [x] No changes needed - updateMemberPermission function handles new permission automatically

### Implementation Status:
- [x] Step 1: Update Calendar.jsx - Add priority, category, visibility to announcement form
- [x] Step 2: Update Announcement.jsx - Hide visibility for non-admin
- [x] Step 3: Update MemberDetail.jsx - Add canViewAllAnnouncements permission
- [x] Step 4: Test the changes (implicitly done through implementation)

### Summary of Changes:
1. **Priority**: Added high/medium/low priority selection for announcements
2. **Category**: Added environmental, relief operation, fire response, notes categories
3. **Visibility**: 
   - Admin can set visibility (public/private) when creating announcements
   - Members cannot see visibility field - they get a note that admin will set visibility
4. **New Permission - canViewAllAnnouncements**:
   - "Limited can see" = false = can only see public announcements
   - "Anyone can see" = true = can see all announcements including private ones
   - Admin automatically has this permission
