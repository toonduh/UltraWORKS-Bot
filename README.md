---
title: UltraWORKS Bot
description: A Discord.js v14 bot with an Express bridge API for Roblox integration
tags:
  - discord.js
  - typescript
  - bot
  - discord
  - express
---

# UltraWORKS Bot

A Discord bot built with [discord.js](https://discord.js.org) v14, exposing slash commands and an Express bridge API used to communicate with Roblox.

## ✨ Features

- Discord.js v14
- TypeScript
- Express bridge API for Roblox Open Cloud integration

## 💁‍♀️ How to use

- Install dependencies `yarn`
- Connect to your Railway project `railway link`
- Build the bot `yarn build`
- Start the bot `railway run node build/index.js`

## 📝 Notes

The service starts both the Discord bot (`src/index.ts`) and an Express bridge API (`src/api.ts`) used to relay commands to Roblox.
