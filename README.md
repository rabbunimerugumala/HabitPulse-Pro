# HabitPulse Pro

> A modern, premium habit tracker for building consistent daily routines with streaks and analytics.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## Project Description

**HabitPulse Pro** is a comprehensive web application designed to help users track their daily habits, maintain streaks, and visualize their progress over time. In a world of scattered to-do lists and disconnected goals, HabitPulse Pro provides a unified, beautiful dashboard for all your daily and weekly routines.

We built this project to combine the performance of **React** + **Vite** with the robust backend capabilities of **Supabase**. It differs from other trackers by focusing heavily on **User Experience (UX)**—featuring a polished "Moon" inspired dark theme, glassmorphism effects, and smooth animations that make the act of tracking habits feel rewarding and premium.

**Key Highlights:**
*   **Performance:** Lightning-fast loads with Vite.
*   **Security:** Robust authentication via Supabase.
*   **Design:** Mobile-first, responsive interface with a curated dark palette.

## Table of Contents

*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Installation & Setup](#installation--setup)
*   [Usage](#usage)
*   [Contributing](#contributing)
*   [Credits](#credits)
*   [License](#license)

## Features

### Core Capabilities
*   **Authentication**: Secure Email & Password login/signup with Supabase Auth.
*   **Onboarding Flow**: Personalized setup to capture user name and focus areas.
*   **Today's Focus**: A smart dashboard showing only what needs to be active today.
*   **Flexible Scheduling**:
    *   **Daily Habits**: Repeat every day.
    *   **Weekly Habits**: Specific days (e.g., "Gym on Mon, Wed, Fri").
*   **Progress Tracking**:
    *   **Streaks**: Visual counters for consecutive completions.
    *   **Stats**: Weekly completion rates and total active habits.

### Visuals & Analytics
*   **Calendar View**: detailed monthly history of completions.
*   **Analytics Dashboard**: 30-day activity charts and category distribution.
*   **Rich Customization**: vector icons (Health, Productivity, etc.) and color coding.
*   **Modern UI**: Glass-morphism cards, gradients, and a "Moon" dark theme.

## Tech Stack

*   **Frontend**: React (v18+), TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS, clsx, tailwind-merge
*   **Animations**: Framer Motion
*   **Icons**: React Icons (FontAwesome, etc.)
*   **Charts**: Recharts
*   **Backend & DB**: Supabase (PostgreSQL)

## Installation & Setup

Follow these steps to get the project running on your local machine.

### Prerequisites
*   Node.js (v18 or higher)
*   npm (or pnpm/yarn)
*   A Supabase account

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/habit-pulse-pro.git
    cd habit-pulse-pro
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Supabase Configuration**
    *   Create a new project on [Supabase](https://supabase.com).
    *   Go to **Authentication** settings and enable "Email Provider".
    *   Run the migration scripts (found in `migrations/`) in the Supabase SQL Editor to create the necessary tables:
        *   `profiles`
        *   `habits`
        *   `habit_completions`

4.  **Environment Variables**
    Create a `.env.local` file in the root directory and add your keys:
    ```env
    VITE_SUPABASE_URL=your_project_url_here
    VITE_SUPABASE_ANON_KEY=your_anon_key_here
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app should now be running at `http://localhost:5173`.

## Usage

1.  **Sign Up**: Create an account to start storing your data securely.
2.  **Onboarding**: You'll be asked for your name and focus areas (e.g., Health, Learning).
3.  **Create a Habit**:
    *   Click the **"+"** button on the dashboard.
    *   Choose a name, category, icon, and color.
    *   Select Frequency: "Every Day" or "Specific Days".
4.  **Track Progress**:
    *   Tap a habit card to mark it as **Done** (Green).
    *   Watch your **Streak** counter increase!
5.  **Analyze**:
    *   Visit the **Calendar** to see your monthly heatmap.
    *   Check **Stats** for completion trends.

## Credits

This project makes use of several open-source libraries and resources:

*   **[React Icons](https://react-icons.github.io/react-icons/)**: For the diverse icon set.
*   **[Recharts](https://recharts.org/)**: For the beautiful analytics charts.
*   **[Supabase](https://supabase.com/)**: For the incredible backend-as-a-service platform.
*   **[Tailwind CSS](https://tailwindcss.com/)**: For rapid UI development.

## Contributing

Contributions are welcome! If you'd like to improve HabitPulse Pro:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please ensure your code follows the existing style (TypeScript, functional components).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
