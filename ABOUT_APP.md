# About HabitPulse Pro

## Product Overview
**HabitPulse Pro** is a modern, premium daily habit tracker designed to help users build and maintain consistent routines. It combines a sleek, glassmorphism-inspired UI with powerful tracking features to keep users motivated.

**Who it's for:**
Individuals seeking to improve themselves through consistent habit building, from beginners starting their first routine to advanced users optimising their productivity stack.

**Core User Flows:**
*   **Authentication:** Secure sign-up/login via Email or Google (powered by Supabase).
*   **Onboarding:** A personalized setup experience collecting display name, age group, focus areas (e.g., Health, Productivity), and experience level.
*   **Habit Management:** Users can create custom habits with specific frequencies (daily, weekly), colors, icons, and reminder times.
*   **Daily Tracking:** A simple dashboard to mark habits as completed and view daily progress.
*   **Insights:** Users can view their consistency through streaks, completion trends, and category distribution charts.
*   **Design:** A "Moon" palette dark mode with glassmorphism effects, ensuring a premium feel on both desktop and mobile.

---

## Tech Stack & Versions

### Frontend
| Component | Technology | Version |
| :--- | :--- | :--- |
| **Framework** | React | 19.x |
| **Router** | React Router DOM | ^7.11.0 |
| **Build Tool** | Vite | ^7.2.4 |
| **Language** | TypeScript | ~5.9.3 |

### UI & Styling
| Component | Technology | Version |
| :--- | :--- | :--- |
| **Styling System** | Tailwind CSS | ^3.4.17 |
| **Utilities** | clsx, tailwind-merge | Latest |
| **Icons** | React Icons (FontAwesome/Lucide) | ^5.5.0 |
| **Animations** | Framer Motion | ^12.23.26 |
| **Charts** | Recharts | ^3.6.0 |
| **Toast Notifications** | React Hot Toast | ^2.6.0 |
| **Date Handling** | date-fns | ^4.1.0 |

### Backend & Services
| Component | Technology | Details |
| :--- | :--- | :--- |
| **BaaS Platform** | **Supabase** | Auth & Postgres DB |
| **Client SDK** | @supabase/supabase-js | ^2.89.0 |

---

## Architecture & Data Model

The application follows a modular, service-based architecture:

*   **`src/pages`**: Main application views (e.g., `Home`, `Habits`, `Analytics`).
*   **`src/components`**: Reusable UI blocks and charts.
*   **`src/services`**: API abstraction layer that handles direct communication with Supabase.
*   **`src/context`**: Global state management using React Context API (`AuthContext`, `HabitContext`).
*   **`src/config`**: Configuration files (Supabase client setup).

### Authentication & State
*   **Authentication**: Handled via `AuthContext`, which persists the current user session from Supabase Auth. Supports Email/Password and Google OAuth.
*   **Data Access**: `HabitProvider` manages application state by fetching data via `habitService.ts` and exposing it to components. It handles the merging of "Habit" definitions with their "Completion" records.

### key Database Collections (Supabase Tables)
Although essentially a SQL-based Postgres database, the app interacts with these main tables:

1.  **`profiles`**: Stores user metadata such as display name, age group, focus areas, and onboarding status.
2.  **`habits`**: Core habit definitions containing:
    *   `frequency_type` / `frequency_days`: Scheduling rules.
    *   `reminder_time`: Time for notifications.
    *   `current_streak` & `total_completions`: Aggregated stats.
    *   Visual properties like `color` and `icon`.
3.  **`completions`**: A transaction log of daily completions, linking `user_id`, `habit_id`, and `date`.

---

## Features Implemented

### ✅ Core Features
*   **Authentication System**: Login, Signup, and Protected Routes.
*   **Onboarding Flow**: Multi-step wizard to personalize user profile.
*   **Dashboard**: Daily view of active habits with specific "Mark Complete" toggle.
*   **Habit CRUD**: Full creation and editing capabilities (Name, Category, Color, Frequency, Reminders).
*   **Analytics Dashboard**:
    *   **Visual Charts**: 30-day Completion Trend and Focus Area Distribution.
    *   **Quick Stats**: Total completions, best streak, completion rate.
*   **Calendar View**: Visual history of habit activity.

### 🚧 Limitations & Stubs
*   **AI Insights**: The "Generate AI Insights" feature in Analytics is currently a **mocked implementation** (simulated delay with static text) and does not yet connect to a live LLM API.
*   **Realtime Updates**: The app currently fetches data on mount/update rather than using Supabase Realtime subscriptions.
*   **Reminders**: While "Reminder Time" is saved in the database, push notifications or browser alerts may not be fully wired up to a notification service.

---

## How to Use the App (for end users)

1.  **Sign Up**: Create an account using your email or Google account.
2.  **Personalize**: Complete the brief onboarding to set your focus areas (e.g., Health, Productivity).
3.  **Create Habits**: Go to the Habits tab and add new routines you want to track, setting how often you want to do them.
4.  **Track Daily**: On the Home screen, click the checkmark on any habit you've completed today.
5.  **Build Streaks**: Consistency increases your streak counter—try not to miss a day!
6.  **Review Progress**: Visit the Analytics tab to see charts of your performance over the last 30 days.
7.  **Explore Insights**: Click "Generate AI Insights" to get (simulated) feedback on your habits.
