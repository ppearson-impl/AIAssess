# Backend Setup Guide — Supabase

This application now stores all assessment responses in a Supabase PostgreSQL database.

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up / Log in
3. Create a new project:
   - Project name: `workday-ai-assessment` (or your choice)
   - Database password: Save this securely
   - Region: Choose closest to your users
4. Wait for project to initialize (~5 minutes)

## Step 2: Set Up Database Schema

1. Go to the **SQL Editor** in your Supabase project
2. Click **New Query**
3. Copy the entire contents of `SUPABASE_SETUP.sql`
4. Paste into the SQL editor
5. Click **Run** to create the `assessments` table with indices and policies

## Step 3: Get API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (labeled as "API URL" or at top of page)
   - **Anon Public Key** (under "Project API keys" → "anon" / "public")
3. Do NOT share these keys, but the anon key is safe for client-side usage

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in the project root (copy from `.env.local.example`)
2. Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Save the file (do NOT commit to git)

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Test the Backend

1. Run the development server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:3000
3. Complete an assessment (Quick or Detailed)
4. Data should now be saved to your Supabase database

## Step 7: Verify Data in Supabase

1. Go to your Supabase project
2. Click **Table Editor** in the left sidebar
3. Select the `assessments` table
4. You should see rows with your assessment responses

## API Endpoints Available

- **POST** `/api/assessments/save` — Save a new assessment response
- **GET** `/api/assessments/by-email?email=user@example.com` — List all assessments by email address
- **GET** `/api/assessments/list` — List all saved assessments (filterable by org name)
- **GET** `/api/assessments/[id]` — Retrieve a specific assessment by ID
- **PUT** `/api/assessments/[id]` — Update an existing assessment

## Example Usage

### Save a new assessment:
```javascript
const response = await fetch('/api/assessments/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orgName: 'Acme Corp',
    path: 'quick',
    quickAnswers: { 'q-modules': 'hcm-fins', ... },
  })
});
const { data } = await response.json();
console.log('Saved assessment ID:', data.id);
```

### List saved assessments:
```javascript
const response = await fetch('/api/assessments/list?orgName=Acme');
const { data } = await response.json();
console.log('Found assessments:', data);
```

### List assessments by email:
```javascript
const response = await fetch('/api/assessments/by-email?email=user@company.com');
const { data } = await response.json();
console.log('User past assessments:', data);
```

### Retrieve a specific assessment:
```javascript
const response = await fetch('/api/assessments/some-uuid-here');
const { data } = await response.json();
console.log('Assessment:', data);
```

## Troubleshooting

### "Supabase configuration missing" warning
- Ensure `.env.local` exists in the project root
- Verify environment variable names are correct
- Restart the dev server after adding `.env.local`

### "Failed to save assessment" error
- Check that your Supabase credentials are correct
- Verify the `assessments` table exists (check Table Editor in Supabase)
- Check browser console for detailed error messages

### Database not found
- Ensure you ran the SQL setup script in Supabase
- Verify you're in the correct Supabase project
- Check that Row Level Security policies were created

## Next Steps

- Integrate save functionality into the Assessment component
- Create a "History" screen to load and resume past assessments
- Add export functionality (PDF, CSV)
- Add team/organization management
- Implement user authentication
