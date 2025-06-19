# 🎬 Adonis Fan3Cinema

A web application built with **AdonisJS** to manage and display movie schedules, ticket bookings, and user interactions.

## 🚀 Features

- Display list of available movies
- Filter movies by genre and date
- Ticket booking system
- Admin dashboard (in progress)
- Responsive UI using Tailwind CSS
- Built on AdonisJS (v5)

## 🛠️ Tech Stack

- [AdonisJS](https://adonisjs.com/) (v5)
- TypeScript
- Tailwind CSS
- SQLite / MySQL (configurable)
- Vite for frontend assets

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/IrfanRomadhonWidodo/adonis_fan3cinema.git

# Navigate into the directory
cd adonis_fan3cinema

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate application key
node ace generate:key

# Run migrations
node ace migration:run
