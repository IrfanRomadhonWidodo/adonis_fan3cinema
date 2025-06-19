<p align="center">
  <a href="https://adonisjs.com" target="_blank">
    <img src="https://raw.githubusercontent.com/adonisjs/adonisjs.com/main/public/images/logo.svg" width="200" alt="AdonisJS Logo">
  </a>
</p>


<p align="center">
  <a href="https://github.com/adonisjs/core/actions/workflows/test.yml">
    <img src="https://github.com/adonisjs/core/actions/workflows/test.yml/badge.svg" alt="Build Status">
  </a>
  <a href="https://www.npmjs.com/package/@adonisjs/core">
    <img src="https://img.shields.io/npm/dt/@adonisjs/core.svg" alt="Total Downloads">
  </a>
  <a href="https://www.npmjs.com/package/@adonisjs/core">
    <img src="https://img.shields.io/npm/v/@adonisjs/core.svg" alt="Latest Stable Version">
  </a>
  <a href="https://github.com/adonisjs/core/blob/main/LICENSE.md">
    <img src="https://img.shields.io/npm/l/@adonisjs/core.svg" alt="License">
  </a>
</p>

## About Adonis Fan3Cinema

**Adonis Fan3Cinema** is a web-based movie and ticket management system built with [AdonisJS v6](https://adonisjs.com), a fully-featured Node.js MVC framework designed for modern full-stack applications.

This project demonstrates the power of AdonisJS in building structured, scalable, and developer-friendly applications for cinema management, including movie listings, schedule filtering, and ticket booking functionality.

## Features

- 🎞️ Movie listing with genre & date filters  
- 🎟️ Ticket booking system with real-time validation  
- 🎛️ Organized MVC structure using AdonisJS  
- 🎨 Clean UI powered by Tailwind CSS  
- 🧪 TypeScript support out of the box  
- 🔐 Environment variable management & session control

## Getting Started

```bash
# Clone the repository
git clone https://github.com/IrfanRomadhonWidodo/adonis_fan3cinema.git

# Navigate into the project directory
cd adonis_fan3cinema

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env

# Generate application key
node ace generate:key

# Run migrations (if applicable)
node ace migration:run

# Start the development server
node ace serve --watch
