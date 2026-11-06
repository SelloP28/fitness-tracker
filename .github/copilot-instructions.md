# Fuel & Form: project rules

Personal fitness PWA (nutrition, water, body weight, training, photos). React 19 + TypeScript + Tailwind 4 + React Router 7 + Vite 8, Appwrite Cloud backend.
Commands: npm run dev | npm run lint | npm run build | npm test

## Working style
- Make small, focused changes. Do not touch files unrelated to the task. Do not commit.
- Before finishing, run npm run lint and npm run build and fix errors. Then summarise the files changed.
- If something is ambiguous, ask instead of guessing.

## Code structure
- Only src/lib/api/* may call the Appwrite SDK. Components and pages use hooks/context, never the SDK directly.
- Fully typed. No "any" unless unavoidable.
- Reuse existing components and design tokens in src/styles/tokens.css. No new colours or styles. Flat design, 12px card radius, two font weights only, sentence case, minimum text 12px, touch targets at least 44px.

## Appwrite rules (SDK v29, TablesDB: tables and rows, NOT collections/documents)
- Use object parameters, for example:
  tablesDB.createRow({ databaseId, tableId, rowId: ID.unique(), data, permissions })
  tablesDB.listRows({ databaseId, tableId, queries })
  account.createEmailPasswordSession({ email, password })
  account.deleteSession({ sessionId: "current" })
  storage.createFile({ bucketId, fileId: ID.unique(), file, permissions })
- Tables only grant "create" to all users. Every created row (and file) MUST include owner permissions: Permission.read/update/delete(Role.user(userId)), and rows MUST have user_id = the signed-in user's id.
- Every list query MUST include Query.equal("user_id", userId) and an explicit Query.limit(100).
- Tables (ID = name): targets(user_id, effective_from, calories_kcal, protein_g, water_ml); foods(user_id, name, serving_label, kcal, protein_g, carbs_g, fat_g, is_preset); meal_logs(user_id, eaten_at, meal_type, status[pending|confirmed], source[app|telegram], photo_file_id, note); meal_items(user_id, meal_id, food_id, name, servings, kcal, protein_g, carbs_g, fat_g); water_logs(user_id, logged_at, amount_ml); body_weights(user_id, logged_on, weight_kg).
- One storage bucket holds all photos. Prefix file names with "meal_" or "body_". Resize photos client-side before upload.

## Units and time
- The UI works in litres for water; the database stores millilitres. Convert in src/lib/api only.
- "Today" is the browser's local calendar day. Store timestamps as ISO strings.
- Energy is stored in kcal in the database (columns calories_kcal and kcal). The UI can show kcal or kJ (1 kcal = 4.184 kJ) based on the user's energy-unit preference. Convert only at the UI/api boundary using src/lib/energy.ts. Never store kJ.

## Security
- Never put an API key or secret in this app. Config comes from VITE_ environment variables (public identifiers only). .env files are git-ignored.
- Never log tokens or session details.
- AI/Gemini calls will run server-side in an Appwrite Function later, never in the browser.