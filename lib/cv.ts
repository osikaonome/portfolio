// CV content for /about, from the content brief. Metrics are quoted exactly as approved.
export const cv = {
  summary:
    "Senior frontend engineer with 5+ years building scalable web applications and leading teams. Specialises in React and Next.js architecture, TypeScript and responsive, accessible UI. Track record in performance optimisation, full-stack feature delivery and mentoring junior developers. Also works as a creative designer across social, campaign and retail signage design.",
  experience: [
    {
      role: "Senior Frontend Engineer",
      org: "JL13 Concepts",
      period: "Sep 2023 – Present",
      location: "Remote (Canada)",
      points: [
        "Frontend infrastructure for 4 SaaS products and internal tools: landing pages, dashboards and community platforms.",
        "Private communities, automated workflows and demo booking with React, Shadcn UI and custom hooks.",
        "Internal CRM dashboard with ApexCharts and Azure SSO: 50+ internal users, 99.2% uptime.",
        "Cloudflare CDN and lazy loading: 40% reduction in time-to-interactive.",
        "JWT/OAuth authentication patterns shared across products.",
      ],
    },
    {
      role: "Frontend Engineer & Design Lead",
      org: "ConnectAfrobeats",
      period: "Aug 2024 – Sep 2025",
      location: "Remote",
      points: [
        "Led development of a social network platform (chat, feed, content creation) in Next.js and TypeScript.",
        "Zustand + TanStack Query architecture: 30% reduction in initial load time; Core Web Vitals score 62 → 85 (mobile).",
        "Google Sign-in, JWT and Paystack integration.",
        "UI redesign with Tailwind and Shadcn UI to WCAG 2.1 AA, for a platform with 1K+ active users.",
        "Cross-functional delivery.",
      ],
    },
    {
      role: "Head of IT",
      org: "Thummim Nigeria & Kenya",
      period: "Jan 2022 – Sep 2025",
      location: "Full-time",
      points: [
        "IT operations and frontend for regional offices, on platforms serving 15K+ users.",
        "Custom WordPress plugins (PHP, REST API): 60% reduction in content management time.",
        "Cloudflare CDN and JWT; infrastructure, scaling and support process improvements: support response time 8hrs → <2hrs, 99% uptime.",
        "Mentored junior developers and set coding standards.",
      ],
    },
  ],
  skills: {
    Frontend: ["React", "Next.js (SSR/SSG)", "TypeScript", "JavaScript (ES6+)", "HTML", "CSS", "SASS"],
    UI: ["Tailwind CSS", "Shadcn UI", "Material UI", "Responsive design", "WCAG accessibility"],
    "State & data": ["Zustand", "TanStack Query", "REST APIs"],
    "Backend & auth": ["Node.js", "MySQL", "JWT", "OAuth", "Google Sign-in", "Azure SSO"],
    Platform: ["Cloudflare CDN", "Core Web Vitals", "SEO", "Schema markup", "Paystack"],
    "CMS & mobile": ["WordPress (themes, plugins)", "Flutter"],
    Design: ["Social media and campaign creative", "Event creative", "Digital and physical signage", "Short-form video (reels)"],
  },
  education: [
    { title: "Higher Diploma in Cybersecurity", org: "City College Dublin", period: "Sep 2025 – Present" },
    {
      title: "Advanced Diploma in Software Engineering (Distinction, Scholar Award)",
      org: "Aptech Computer Education, Lagos",
      period: "2016 – 2018",
    },
  ],
} as const;
