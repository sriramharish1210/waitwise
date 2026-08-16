# ⏳ WaitWise

### Make Every Minute Count.

WaitWise is an AI-powered temporal planning application that transforms unpredictable waiting time into productive, structured time.

Instead of letting a 10, 20, or 45-minute waiting period disappear, WaitWise analyzes your available time, tasks, priorities, and context to create an optimized micro-schedule — then dynamically replans it when your available time changes.

> **Waiting time is inevitable. Wasted time isn't.**

---

# ✦ What is WaitWise?

Waiting is one of those everyday problems that seems too small to solve.

You are waiting at a hospital.
You're at a college office.
Your train is delayed.
You're waiting for someone.
A meeting hasn't started yet.

You suddenly have 25 minutes.

What should you actually do?

You have several tasks, different priorities, and uncertain amounts of time. Manually deciding what fits — and continuously recalculating when the waiting period changes — is surprisingly difficult.

**WaitWise handles that decision for you.**

You provide:

* Where or why you're waiting
* How much time you currently have
* What you want to accomplish

WaitWise's AI planning agent determines:

* Which tasks should be completed
* How much time each task should receive
* Which tasks should be excluded
* How much safety buffer should remain
* Why the schedule was constructed that way

And when your available time changes, WaitWise **replans the schedule instead of forcing you to start over.**

---

# ⚡ Core Concept

WaitWise treats your waiting period as a **dynamic time budget**.

```text
WAITING TIME
     │
     ▼
┌───────────────────────┐
│ Context + Time + Tasks│
└───────────┬───────────┘
            │
            ▼
      AI PLANNING AGENT
            │
            ▼
┌──────────────────────────┐
│ Optimized Temporal Plan  │
├──────────────────────────┤
│ Task A      15 min       │
│ Task B       8 min       │
│ Task C       5 min       │
│ Safety       4 min       │
└──────────────────────────┘
            │
            ▼
      TIME CHANGES?
            │
            ▼
       DYNAMIC REPLAN
```

The important part isn't simply generating a schedule.

It's **adapting the schedule when reality changes.**

---

# ✨ Features

## 🧠 AI-Powered Task Duration Estimation

Not sure how long a task will take?

WaitWise can estimate a realistic duration based on:

* Task description
* Waiting context
* Task complexity

For example:

> `Read a 12-page research paper`

can be evaluated within the context of:

> `Waiting at a college administration office`

The estimated duration can then be manually adjusted.

---

## ⏱️ Intelligent Time Allocation

WaitWise analyzes the available time and determines the best combination of tasks.

The planner considers:

* Task duration
* Priority
* Available time
* Task fit
* Safety buffer
* Waiting context

Instead of simply filling every available minute, WaitWise intentionally leaves room for uncertainty.

---

## 🔄 Dynamic Replanning

Waiting time rarely stays constant.

You may initially have:

> **35 minutes**

and suddenly realize:

> **Only 12 minutes left.**

WaitWise doesn't make you rebuild your schedule.

It recalculates the plan based on the new constraint and determines:

* What stays
* What moves
* What gets removed
* How the buffer changes
* Why the new plan is better

This is one of the core ideas behind WaitWise.

---

## 📊 Temporal Visualization

The generated plan is represented as a proportional timeline.

Instead of reading a list of times, you can visually understand how your available time is being allocated.

```text
0m          10m          20m          30m          35m
```

│────────────│────────────│────────────│────────────│

│   TASK A   │   TASK B   │ TASK C │   BUFFER     │

│────────────│────────────│─────────│··············│

The timeline makes time allocation immediately understandable.

---

## 🛡️ Safety Buffer

WaitWise doesn't assume that every waiting period will behave perfectly.

Unexpected delays happen.

The planner therefore reserves a dynamic safety buffer depending on the available time and schedule.

This prevents the plan from becoming unrealistically packed.

---

## 🎯 Priority-Aware Planning

Tasks can be assigned different priority levels:

* **High**
* **Medium**
* **Low**

When time becomes limited, higher-value tasks are favored.

The AI can also explain why lower-priority tasks were excluded.

---

## 💡 AI Planning Insights

WaitWise doesn't simply output:

> "Do these tasks."

It also explains the reasoning behind the schedule.

Examples:

* Why a task was prioritized
* Why another task was excluded
* Why a particular buffer was selected
* How efficiently the available time was used

This makes the plan understandable rather than a black box.

---

## ↩️ Replanning & Undo

When the available time changes, WaitWise generates a new plan while preserving the previous state.

Users can compare the new allocation and undo the change when necessary.

---

## 💾 Session Persistence

The current session can be preserved locally so that refreshing the application doesn't unnecessarily destroy the user's planning context.

A new session can be started whenever the user wants a clean slate.

---

# 🧩 How It Works

### 01 — Describe the Waiting Situation

Tell WaitWise what you're waiting for.

```text
College administration office
```

---

### 02 — Set Available Time

Define how much time you currently have.

```text
35 minutes
```

---

### 03 — Add Tasks

Add the things you could potentially accomplish.

```text
Finish assignment       20 min   HIGH
```

Review presentation     15 min   MEDIUM

Reply to emails          5 min   LOW

---

### 04 — Let the Agent Plan

WaitWise evaluates the tasks against the available time and creates a temporal schedule.

---

### 05 — Follow the Timeline

The resulting plan is presented visually so you can immediately see how your time should be spent.

---

### 06 — Adapt When Reality Changes

If your waiting time changes:

```text
35 min → 12 min
```

WaitWise dynamically recalculates the schedule.

You don't have to start again.

---

# 🧠 The AI Agent

WaitWise uses a single planning agent powered by **Google Gemini**.

The agent performs three primary operations:

### Duration Estimation

```text
Context + Task
```

```
  ↓
```

AI Reasoning

```
  ↓
```

Estimated Duration

### Timeline Optimization

```text
Context
```

*

Available Time

*

Tasks

↓

AI Planning Agent

↓

Optimized Timeline

### Dynamic Replanning

```text
Previous Plan
```

```
  +
```

New Time Constraint

```
  +
```

Original Tasks

```
  ↓
```

AI Replanning

```
  ↓
```

Updated Timeline

The AI output is additionally validated before being presented to the user.

---

# 🏗️ Architecture

```text
┌───────────────────────────────┐
```

│          WaitWise UI          │

│       Next.js + React         │

└───────────────┬───────────────┘

```
            │

            ▼
```

┌───────────────────────────────┐

│        API Route Layer        │

│                               │

│  /api/estimate                │

│  /api/optimize                │

│  /api/replan                  │

└───────────────┬───────────────┘

```
            │

            ▼
```

┌───────────────────────────────┐

│       WaitWise Agent          │

│                               │

│  Duration Estimation          │

│  Timeline Optimization       │

│  Dynamic Replanning           │

└───────────────┬───────────────┘

```
            │

            ▼
```

┌───────────────────────────────┐

│        Gemini 2.5 Flash       │

│        AI Planning Layer      │

└───────────────┬───────────────┘

```
            │

            ▼
```

┌───────────────────────────────┐

│   Structured JSON Response    │

│                               │

│  Zod Validation               │

│  Deterministic Validation     │

└───────────────────────────────┘

````

---

# 🛠️ Tech Stack

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**

### AI

- **Google Gemini 2.5 Flash**
- Structured JSON generation
- AI planning and replanning

### Validation

- **Zod**
- Deterministic plan validation
- Runtime response validation

### State & Storage

- React state
- Browser `localStorage`

### Deployment

- **Vercel**

---

# 📁 Project Structure

```text
waitwise/
````

│

├── app/

│   ├── api/

│   │   ├── estimate/

│   │   │   └── route.ts

│   │   ├── optimize/

│   │   │   └── route.ts

│   │   └── replan/

│   │       └── route.ts

│   │

│   ├── globals.css

│   ├── layout.tsx

│   └── page.tsx

│

├── components/

│   ├── dashboard/

│   │   ├── AgentInsight.tsx

│   │   ├── Dashboard.tsx

│   │   ├── ReplanNotice.tsx

│   │   ├── TaskInput.tsx

│   │   ├── TaskItem.tsx

│   │   ├── TaskList.tsx

│   │   ├── Timeline.tsx

│   │   ├── TimelineTask.tsx

│   │   ├── WaitingContext.tsx

│   │   └── WaitingTimeControl.tsx

│   │

│   └── landing/

│       └── Hero.tsx

│

├── lib/

│   ├── ai/

│   │   ├── agent.ts

│   │   ├── gemini.ts

│   │   ├── prompts.ts

│   │   └── schemas.ts

│   │

│   └── optimizer/

│       └── planner.ts

│

├── types/

│   ├── plan.ts

│   ├── session.ts

│   └── task.ts

│

├── assets/

│   └── images/

│

├── .env.example

├── .gitignore

├── package.json

└── README.md

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js 18+
* npm
* A Google Gemini API key

---

## 1. Clone the Repository

```bash
git clone https://github.com/sriramharish1210/waitwise.git
```

```bash
cd waitwise
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

> Never commit `.env.local` to version control.

---

## 4. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔐 Environment Variables

| VariableDescription |                                                        |
| ------------------- | ------------------------------------------------------ |
| `GEMINI_API_KEY`    | Google Gemini API key used by the server-side AI agent |

The API key is accessed server-side and should never be exposed through client-side code.

---

# 🧪 Testing

Run the TypeScript compiler:

```bash
npx tsc --noEmit
```

Run the production build:

```bash
npm run build
```

Run the development server:

```bash
npm run dev
```

---

# 📌 Example

Imagine you're waiting at a college office for **35 minutes**.

You have:

```text
Finish assignment        20 min   HIGH
```

Review presentation      15 min   MEDIUM

Reply to emails           5 min   LOW

WaitWise might determine that completing all three is unrealistic once a safety buffer is considered.

It could produce:

```text
┌──────────────────────────────────────────┐
```

│          35 MINUTE WAITING WINDOW        │

├──────────────────────────────────────────┤

│ Assignment │ Presentation │ Buffer       │

│   20 min   │    10 min    │   5 min      │

└──────────────────────────────────────────┘

Now imagine the waiting time suddenly drops to **12 minutes**.

Instead of manually rebuilding the schedule:

```text
35 min
```

↓

12 min

↓

AI REPLAN

↓

Highest-value task selected

* safety buffer preserved

That's the core experience WaitWise is designed around.

---

# 🎯 Design Philosophy

WaitWise follows a simple principle:

> **Don't optimize for filling time. Optimize for using time well.**

The system intentionally balances:

* Productivity
* Priority
* Realistic task duration
* Uncertainty
* Context
* Available time

The goal isn't to create the busiest schedule.

The goal is to create the **most useful schedule that can realistically be completed.**

---

# 🔮 Future Direction

Potential future capabilities include:

* Calendar integration
* Location-aware waiting detection
* Automatic waiting-time detection
* Recurring task intelligence
* Personal productivity patterns
* Smarter historical duration estimates
* Voice-based task input
* Notifications when a waiting period changes
* Multi-session history
* Personalized planning strategies
* Cross-device synchronization
* Context-aware task recommendations

The long-term vision is to make WaitWise a **real-time temporal planning assistant**, rather than simply a task scheduler.

---

# 🤝 Contributing

Contributions, ideas, and improvements are welcome.

If you find a bug or have an idea for improving WaitWise:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Open a Pull Request

---

# 📄 License

This project is currently available for personal and educational use.

---

<div align="center">

### ⏳ Stop waiting. Start using the time.

**Built with Next.js, TypeScript, and Gemini.**

</div>
