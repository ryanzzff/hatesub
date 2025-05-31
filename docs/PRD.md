# Product Requirements Document (PRD)
## Subscription Management Tool - "HateSub"

**Version:** 1.0  
**Last Updated:** June 1, 2025  
**Status:** Draft

### 1. Project Overview

**Product Name:** HateSub - Subscription Management Tool  
**Target Users:** Individual consumers managing multiple subscriptions  
**Tech Stack:** SvelteKit + TailwindCSS + Cloudflare D1 + User Authentication  
**Design Approach:** Mobile-first responsive design  
**Goal:** Help users identify unnecessary subscriptions and optimize their spending by providing insights based on usage frequency, perceived value, and subscription reasoning.

---

### 2. Core Problem Statement

Many users lose track of their subscriptions and continue paying for services they rarely use or no longer need. Without a clear overview of subscription costs and usage patterns, users struggle to make informed decisions about which subscriptions to keep or cancel.

---

### 3. Key Features

#### 3.1 Core Features (MVP)
- **User Authentication** - Secure login and registration system
- **Subscription Dashboard** - Central view of all active subscriptions (mobile-optimized)
- **Add/Edit Subscriptions** - Manual entry with subscription reasoning
- **Multi-Currency Support** - Support for different currencies with conversion
- **Usage Rating System** - Users rate frequency of use (1-5 scale)
- **Value Rating System** - Users rate perceived value/usefulness (1-5 scale)
- **Subscription Reasoning** - Users explain why they subscribed initially
- **Cost Analytics** - Monthly/yearly spending breakdown with currency conversion
- **Smart Recommendations** - Rule-based suggestions for cancellation (non-AI)
- **Subscription Categories** - Organize by type (Entertainment, Productivity, etc.)

#### 3.2 Enhanced Features (Post-MVP)
- **Usage Reminders** - Notifications to encourage rating updates
- **Spending Goals** - Set monthly subscription budgets
- **Advanced Analytics** - Detailed spending trends and insights
- **Renewal Alerts** - Notifications before subscription renewals
- **Data Export** - Export subscription data for personal records
- **Dark Mode** - UI theme switching
- **Advanced Filtering** - Search and filter subscriptions by various criteria

#### 3.3 Far Future Features
- **AI-driven Recommendations** - Machine learning based suggestions
- **Automatic Subscription Detection** - Bank/credit card integration
- **Negotiation Assistant** - Help contact providers for better deals
- **Family Plan Optimization** - Suggest shared plans for households
- **Subscription Marketplace** - Discover new services based on preferences
- **Sharing Features** - Compare with friends/family (anonymized)

---

### 4. User Stories

#### As a user, I want to:
1. **Create an account and login** so my data is secure and accessible across devices
2. **Add a subscription** with reasoning so I can track its cost, usage, and remember why I subscribed
3. **See all my subscriptions** in one place with total costs in my preferred currency
4. **Rate how often I use each subscription** to track usage patterns over time
5. **Rate how valuable each subscription is** to assess its worth to me
6. **Get recommendations** on which subscriptions I should consider canceling based on my ratings
7. **View spending analytics** to understand my subscription spending patterns across currencies
8. **Edit subscription details** when prices change, usage patterns shift, or reasoning evolves
9. **Categorize subscriptions** to better organize and analyze my spending
10. **Delete subscriptions** when I cancel them
11. **See renewal dates** so I can decide before being charged
12. **Export my data** for personal record keeping
13. **Use the app on mobile** with a responsive, touch-friendly interface
14. **Switch between currencies** to see costs in different denominations

---

### 5. Feature Specifications

#### 5.1 Subscription Data Model
```
Subscription {
  id: string
  user_id: string
  name: string
  description?: string
  cost: number
  currency: string (ISO 4217 currency codes)
  billing_cycle: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  renewal_date: date
  category: string
  subscription_reason: string (why user subscribed)
  usage_rating: 1-5 (how often used)
  value_rating: 1-5 (how valuable/useful)
  date_added: date
  last_updated: date
  status: 'active' | 'cancelled' | 'paused'
  notes?: string
}
```

#### 5.2 Subscription Categories
- **Entertainment** - Netflix, Spotify, Disney+, Gaming services
- **Productivity** - Office 365, Adobe Creative, Notion, Slack
- **Health & Fitness** - Gym memberships, Fitness apps, Meditation apps
- **Education** - Online courses, Language learning, Professional development
- **News & Media** - Newspapers, Magazines, Podcasts
- **Software & Tools** - Development tools, Design software, Utilities
- **Cloud & Storage** - Cloud storage, Backup services, Hosting
- **Financial** - Banking fees, Investment platforms, Financial tools
- **Transportation** - Car subscriptions, Transit passes, Ride sharing
- **Other** - Miscellaneous subscriptions

#### 5.3 Billing Cycle Types
- **One-time** - Single payment (e.g., lifetime licenses)
- **Weekly** - Charged every week
- **Monthly** - Charged every month (most common)
- **Quarterly** - Charged every 3 months
- **Yearly** - Charged annually (often with discounts)

#### 5.4 Rating System
- **Usage Frequency Scale:**
  - 1: Never use (haven't used in months)
  - 2: Rarely use (few times per month)
  - 3: Occasionally use (few times per week)
  - 4: Regularly use (daily/almost daily)
  - 5: Essential (use multiple times daily)

- **Value Rating Scale:**
  - 1: No value (regret having it)
  - 2: Little value (could live without it)
  - 3: Some value (nice to have)
  - 4: Good value (definitely worth it)
  - 5: Excellent value (couldn't live without it)

#### 5.5 Recommendation Algorithm (Rule-Based)
- **High Priority to Cancel:** Low usage (1-2) + Low value (1-2) + High cost
- **Medium Priority:** Low usage (1-2) OR Low value (1-2) + Medium cost
- **Consider Alternatives:** High cost + Medium usage/value (3)
- **Keep:** High usage (4-5) + High value (4-5)

---

### 6. UI/UX Design Mockups

#### 6.1 Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│ HateSub Logo                    Profile | Settings | 🔔 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 Spending Overview                                    │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│ │ Monthly     │ │ Yearly      │ │ Potential   │       │
│ │ $127.43     │ │ $1,529.16   │ │ Savings     │       │
│ │             │ │             │ │ $34.99      │       │
│ └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                         │
│ 🎯 Quick Actions                                        │
│ [+ Add Subscription] [💡 Get Recommendations]          │
│                                                         │
│ 📋 Your Subscriptions (12 active)                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Netflix      $15.99/mo  ⭐⭐⭐⭐⭐  📈⭐⭐⭐⭐⭐    │ │
│ │ Renews: June 15, 2025                    [Edit] [❌] │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ Adobe CC     $52.99/mo  ⭐⭐⭐⭐⭐  📈⭐⭐⭐⭐⭐    │ │
│ │ Renews: June 28, 2025                    [Edit] [❌] │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ ⚠️ Duolingo   $12.99/mo  ⭐⭐⭐⭐⭐  📈⭐⭐⭐⭐⭐  │ │
│ │ Consider canceling - Low usage           [Edit] [❌] │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### 6.2 Add/Edit Subscription Form (Mobile-First)
```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Dashboard        Add New Subscription         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Service Name *                                          │
│ [Netflix                                             ]  │
│                                                         │
│ Cost *                    Currency *                    │
│ [15.99              ] [USD ▼                        ]   │
│                                                         │
│ Billing Cycle *                                         │
│ ○ One-time ○ Weekly ● Monthly ○ Quarterly ○ Yearly     │
│                                                         │
│ Next Renewal Date                                       │
│ [📅 June 15, 2025                                   ]  │
│                                                         │
│ Category *                                              │
│ [Entertainment ▼                                    ]   │
│                                                         │
│ Why did you subscribe to this service? *                │
│ [Family entertainment, kids love the shows          ]  │
│                                                         │
│ How often do you use this service? *                    │
│ ⭐ ⭐ ⭐ ⭐ ⭐  (4/5 - Regularly use)                      │
│                                                         │
│ How valuable is this service to you? *                  │
│ ⭐ ⭐ ⭐ ⭐ ⭐  (5/5 - Excellent value)                    │
│                                                         │
│ Additional Notes (optional)                             │
│ [Family plan shared with spouse                      ]  │
│                                                         │
│                            [Cancel] [Save Subscription] │
└─────────────────────────────────────────────────────────┘
```

#### 6.3 Insights/Recommendations Page
```
┌─────────────────────────────────────────────────────────┐
│ 💡 Smart Recommendations                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🚨 High Priority (Consider Canceling)                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Gym Membership    $45/mo                            │ │
│ │ 📊 Usage: ⭐⭐⭐⭐⭐  Value: ⭐⭐⭐⭐⭐                      │ │
│ │ 💰 Potential Annual Savings: $540                   │ │
│ │ [Mark as Cancelled] [Keep This] [Remind Me Later]  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ⚠️ Medium Priority (Review Needed)                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Adobe Stock      $29.99/mo                          │ │
│ │ 📊 Usage: ⭐⭐⭐⭐⭐  Value: ⭐⭐⭐⭐⭐                      │ │
│ │ 💡 Consider downgrading to basic plan               │ │
│ │ [View Alternatives] [Keep This] [Downgrade]        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ✅ Keep These (High Value)                              │
│ Netflix, Spotify, Adobe Creative Cloud                  │
│                                                         │
│ 📈 Spending Trends                                      │
│ [Monthly spending chart would go here]                  │
└─────────────────────────────────────────────────────────┘
```

---

### 7. Technical Architecture

#### 7.1 Frontend
- **Framework:** SvelteKit
- **Styling:** TailwindCSS with mobile-first approach
- **TypeScript:** For type safety and better development experience
- **Responsive Design:** Mobile-first, progressive enhancement for desktop

#### 7.2 Backend & Database
- **Database:** Cloudflare D1 (SQLite-based)
- **Authentication:** Secure user registration and login system
- **Hosting:** Cloudflare Pages
- **API:** SvelteKit API routes

#### 7.3 Data Storage Structure
```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cost REAL NOT NULL,
  currency TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  renewal_date DATE,
  category TEXT NOT NULL,
  subscription_reason TEXT NOT NULL,
  usage_rating INTEGER CHECK(usage_rating >= 1 AND usage_rating <= 5),
  value_rating INTEGER CHECK(value_rating >= 1 AND value_rating <= 5),
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

---

### 8. Updated Requirements & Decisions

Based on the clarification provided:

✅ **Confirmed Decisions:**
1. **Data Storage:** Cloudflare D1 database
2. **Authentication:** User login/registration required
3. **Design Approach:** Mobile-first with TailwindCSS
4. **Currency Support:** Multi-currency with conversion
5. **Integration Policy:** No 3rd party integrations in core features

✅ **New Features Added:**
- Subscription reasoning field (why user subscribed)
- Enhanced billing cycle types (one-time, weekly, monthly, quarterly, yearly)
- Comprehensive subscription categories
- Mobile-optimized UI components

✅ **Feature Reorganization:**
- Moved AI-driven features to "Far Future"
- Moved bank/credit card integration to "Far Future" 
- Moved negotiation assistant to "Far Future"
- Focus on rule-based recommendations for MVP

---

### 9. Next Steps

1. **Review and Approve PRD** - Confirm all requirements are captured correctly
2. **Set up Development Environment** - Initialize SvelteKit project with TailwindCSS
3. **Database Design** - Implement Cloudflare D1 schema
4. **Authentication System** - Build secure user registration/login
5. **Core CRUD Operations** - Implement subscription management
6. **Mobile-First UI** - Build responsive components
7. **MVP Testing** - User testing and feedback collection

For detailed implementation tasks, see `TODO.md` in the project root.
