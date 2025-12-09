# Trip Receipt Manager

A Svelte application for managing receipts during trips, with cloud storage and support for file/image uploads (including email receipts uploaded as files).

## Features

- **Trip Management**: Create and manage trips with start/end dates and descriptions
- **Receipt Management**: Add receipts to trips with date, description, and amount
- **File Upload**: Drag & drop or file picker for uploading receipt images/PDFs
- **Day-based Organization**: View receipts grouped by date within each trip
- **Modern UI**: Built with shadcn-svelte components and Tailwind CSS

## Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Backend**: Supabase (PostgreSQL database, file storage, authentication)
- **UI Components**: shadcn-svelte
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ and pnpm
- A Supabase account and project

## Setup

1. **Install dependencies**:
   ```sh
   pnpm install
   ```
   
   Note: The project uses OpenAI for AI-powered receipt parsing. Make sure to get an API key from https://platform.openai.com/api-keys

2. **Set up Supabase**:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Create a `.env` file in the root directory:
     ```
     VITE_PUBLIC_SUPABASE_URL=your_supabase_project_url
     VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     OPENAI_API_KEY=your_openai_api_key
     ```

3. **Set up the database**:
   - In your Supabase project, go to SQL Editor
   - Run the following SQL to create the tables:

   ```sql
   -- Create trips table
   CREATE TABLE trips (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     start_date DATE NOT NULL,
     end_date DATE,
     description TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
   );

   -- Create receipts table
   CREATE TABLE receipts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
     date DATE NOT NULL,
     description TEXT NOT NULL,
     amount NUMERIC(10, 2),
     currency TEXT DEFAULT 'USD',
     file_path TEXT NOT NULL,
     file_name TEXT NOT NULL,
     mime_type TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
   );

   -- Enable Row Level Security
   ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
   ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

   -- Create policies for trips
   CREATE POLICY "Users can view their own trips"
     ON trips FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can create their own trips"
     ON trips FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own trips"
     ON trips FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own trips"
     ON trips FOR DELETE
     USING (auth.uid() = user_id);

   -- Create policies for receipts
   CREATE POLICY "Users can view their own receipts"
     ON receipts FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can create their own receipts"
     ON receipts FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own receipts"
     ON receipts FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own receipts"
     ON receipts FOR DELETE
     USING (auth.uid() = user_id);
   ```

4. **Set up storage**:
   - In Supabase, go to Storage
   - Create a new bucket named `receipts`
   - Set it to public (or configure policies as needed)
   - Add the following storage policy:

   ```sql
   CREATE POLICY "Users can upload their own receipts"
     ON storage.objects FOR INSERT
     WITH CHECK (
       bucket_id = 'receipts' AND
       auth.uid()::text = (storage.foldername(name))[1]
     );

   CREATE POLICY "Users can view their own receipts"
     ON storage.objects FOR SELECT
     USING (
       bucket_id = 'receipts' AND
       auth.uid()::text = (storage.foldername(name))[1]
     );
   ```

5. **Set up authentication** (required):
   - In Supabase, go to Authentication > Providers
   - Enable Email provider
   - Configure email templates (optional)
   - For local development, you may want to disable email confirmation:
     - Go to Authentication > Settings
     - Disable "Enable email confirmations" for easier testing
     - (Re-enable in production!)

## Development

Start the development server:

```sh
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

### Using the App

1. **First time setup**:
   - Navigate to `/signup` to create an account
   - Enter your email and password
   - If email confirmation is enabled, check your email and confirm
   - Navigate to `/login` to sign in

2. **Creating trips**:
   - Click "New Trip" on the home page
   - Fill in trip details and click "Create Trip"

3. **Adding receipts** (with AI):
   - Click on a trip to view its details
   - Click "Add Receipt"
   - Upload a receipt image (the AI will analyze it)
   - Click "Analyze Receipt with AI"
   - Review and edit the extracted information (date, amount, currency, description)
   - Click "Looks Good - Save Receipt" to save

4. **Viewing receipts**:
   - Receipts are automatically grouped by date
   - Click on a receipt to view the full image

## Building

To create a production version of your app:

```sh
pnpm build
```

You can preview the production build with `pnpm preview`.

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/          # shadcn-svelte components
│   │   ├── TripList.svelte
│   │   ├── TripForm.svelte
│   │   ├── ReceiptList.svelte
│   │   ├── ReceiptForm.svelte
│   │   ├── ReceiptCard.svelte
│   │   └── FileUpload.svelte
│   ├── stores/
│   │   ├── trips.ts     # Trip state management
│   │   └── auth.ts      # Auth state management
│   ├── utils/
│   │   ├── supabase.ts
│   │   ├── database.types.ts
│   │   └── date.ts
│   └── types/
│       └── index.ts
└── routes/
    ├── +layout.svelte                # Auth wrapper and header
    ├── +page.svelte                  # Home (trip list)
    ├── login/
    │   └── +page.svelte              # Login page
    ├── signup/
    │   └── +page.svelte              # Sign up page
    └── trips/
        ├── new/
        │   └── +page.svelte          # New trip form
        └── [id]/
            ├── +page.svelte          # Trip detail
            └── receipts/
                └── new/
                    └── +page.svelte  # Add receipt form
```

## License

MIT
