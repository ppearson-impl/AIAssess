# Custom Measures Architecture

## Overview
The application now supports organization-specific customization of assessment questions and scoring guidance. Administrators can edit the scoring guidance for all 25 assessment questions and save custom configurations per organization.

## Database Schema

### `custom_measures` Table
Stores organization-specific assessment configurations.

```sql
id UUID PRIMARY KEY
org_name TEXT UNIQUE NOT NULL        -- Organization identifier
dims_config JSONB NOT NULL            -- Full DIMS configuration with scoring
created_at TIMESTAMP
updated_at TIMESTAMP
created_by TEXT                       -- Email of user who created/edited
```

**Indices:**
- `idx_custom_measures_org_name` (UNIQUE) - Fast lookups by organization
- `idx_custom_measures_created_at` - Track most recent configurations

## API Endpoints

### 1. **POST** `/api/measures/save`
Save or update custom scoring guidance for an organization.

**Request Body:**
```json
{
  "org_name": "Acme Corp",
  "dims_config": [
    {
      "id": 1,
      "code": "TF",
      "name": "Technical Foundations",
      "color": "#FF6B6B",
      "qs": [
        {
          "id": "TF1",
          "title": "System of Record Consolidation",
          "qual": "Is Workday your authoritative system of record...?",
          "scoring": {
            "1": "Multiple systems of record...",
            "2": "Partial consolidation...",
            "3": "...",
            "4": "...",
            "5": "..."
          }
        }
        // ... more questions
      ]
    }
    // ... 4 dimensions total
  ],
  "created_by": "admin@acmecorp.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "org_name": "acme corp",
    "dims_config": {...},
    "created_by": "admin@acmecorp.com",
    "updated_at": "2026-04-10T12:00:00Z"
  }
}
```

### 2. **GET** `/api/measures/by-org?org_name=Acme%20Corp`
Retrieve custom scoring guidance for an organization.

**Response:**
```json
{
  "data": {
    "id": "uuid-here",
    "org_name": "acme corp",
    "dims_config": [...],
    "created_by": "admin@acmecorp.com",
    "updated_at": "2026-04-10T12:00:00Z"
  }
}
```

If no custom measures exist, returns `{ "data": null }` and frontend uses defaults.

## Frontend Implementation

### Component: `Assessment.tsx`

**State Added:**
```typescript
const [editingDims, setEditingDims] = useState<any>(JSON.parse(JSON.stringify(DIMS)));
const [isEditMode, setIsEditMode] = useState(false);
```

**Hook: Load Custom Measures**
```typescript
useEffect(() => {
  if (orgName.trim()) {
    loadCustomMeasures();
  }
}, [orgName]);

const loadCustomMeasures = async () => {
  // Fetches from /api/measures/by-org and updates editingDims
};
```

**Save Function: `saveCustomMeasures()`**
- Validates organization name
- POSTs to `/api/measures/save`
- Updates Supabase `custom_measures` table
- Shows success/error alerts

### Measures Screen Features

**Read-Only Mode (Default):**
- Display-only table of all 25 questions and scoring levels
- [✎ Edit Scoring] button to toggle edit mode

**Edit Mode (✎ Edit Scoring clicked):**
- Title becomes editable input
- Qual becomes editable input
- Each score level (1-5) becomes editable input
- Inline updates to `editingDims` state
- [💾 Save All Changes] button persists to database
- [← Back to Home] to cancel without saving

## Workflow: Editing Organization Measures

1. **User enters organization name** on landing screen
2. **Component loads custom measures** from Supabase for that org (if any)
3. **User navigates to Measures section** (via sidebar or measurements button)
4. **Click [✎ Edit Scoring]** to enable edit mode
5. **Edit fields appear** for all questions and scoring guidance
6. **Type to update** - changes reflected in real-time  to `editingDims`
7. **Click [💾 Save All Changes]** to persist to Supabase
8. **All assessments** taken by users from this org will see the custom ordering next time it loads

## Data Flow Diagram

```
Landing Screen
    ↓
User enters org name (useState: orgName)
    ↓
useEffect triggers loadCustomMeasures()
    ↓
GET /api/measures/by-org?org_name=Acme%20Corp
    ↓
Supabase: SELECT * FROM custom_measures WHERE org_name = 'acme corp'
    ↓
If found: setEditingDims(custom_config)
If not found: editingDims remains as default DIMS
    ↓
User clicks [✎ Edit Scoring] → isEditMode = true
    ↓
Render editable inputs bound to editingDims state
    ↓
User clicks [💾 Save] → saveCustomMeasures()
    ↓
POST /api/measures/save with org_name + editingDims
    ↓
Supabase: UPSERT into custom_measures (onConflict: org_name)
    ↓
✓ Success confirmation + isEditMode = false
```

## Key Features

✅ **Organization Isolation** - Different orgs have independent scoring configs
✅ **Real-Time Loading** - Custom measures auto-load when org name entered
✅ **Inline Editing** - No modal dialogs; edit directly in table rows
✅ **Upsert Logic** - First save creates record, subsequent saves update
✅ **Audit Trail** - `created_by` and `updated_at` tracked
✅ **Fallback to Defaults** - If no custom config, uses DIMS defaults
✅ **Null Safety** - API gracefully handles missing records

## Testing Checklist

- [ ] Enter org name, navigate to Measures → loads default DIMS
- [ ] Click [✎ Edit Scoring] → inputs appear
- [ ] Edit question title → see real-time state update
- [ ] Edit scoring level 1-5 text → see change reflected
- [ ] Click [💾 Save] → success alert and exit edit mode
- [ ] Reload page, re-enter same org → custom measures load from DB
- [ ] Try different org name → shows defaults (no custom config)
- [ ] Verify Supabase: check custom_measures table has new row
- [ ] Check indices: verify org_name query is fast

## Future Enhancements

- Add versioning to track measure history
- Implement rollback to previous versions
- Add approval workflow for measure changes
- Bulk import measures from CSV
- Clone measures from one organization to another
- Add measure templates for industry verticals
