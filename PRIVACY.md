# Privacy Policy — Microsoft Skills Navigator

**Last Updated:** October 24, 2026  
**Effective Date:** October 24, 2026  
**Application:** Microsoft Skills Navigator (`atozazure-mscertification-tool`)  
**Publisher:** atozazure (Daniel Powley)  
**URL:** [https://skills.atozazure.com](https://skills.atozazure.com)  
**Repository:** [https://github.com/danzure/microsoft-skills-navigator](https://github.com/danzure/microsoft-skills-navigator)

---

## 1. Our Privacy Philosophy: Privacy by Design & Zero Tracking

Microsoft Skills Navigator was engineered from the ground up as a **privacy-first, client-side static web application**. 

We believe that tracking your professional certifications, career milestones, and learning roadmaps should remain entirely your private business. We do not require you to create an account, log in, or disclose any personal identifying information (PII).

### Core Architectural Commitments:
- **No User Accounts:** You do not need an account, password, email address, or third-party sign-in to use any feature of this tool.
- **Zero Server-Side User Databases:** We do not operate a backend database to store your learning progress, tracked certifications, or preferences.
- **100% Client-Side Computation:** All state computation, progress tracking, prerequisite unlock checks, timeline reordering, and roadmap filtering happen locally within your web browser.
- **Zero Advertising or Cross-Site Tracking:** We do not display third-party advertisements, sell data, or deploy invasive cross-site tracking pixels, social media widgets, or fingerprinting scripts.

---

## 2. What Information We Do and Do Not Collect

| Category | Collected? | Description / Details |
|---|---|---|
| **Personal Identifying Information (PII)** | **No** | We do not collect names, email addresses, phone numbers, home/work addresses, or government IDs. |
| **Authentication Credentials** | **No** | No passwords, tokens, API keys, or Microsoft Learn login credentials are ever requested or stored. |
| **Financial / Payment Information** | **No** | Microsoft Skills Navigator is completely free. We do not collect credit cards, billing addresses, or payment details. Currency selection (GBP, USD, EUR) is strictly a local cosmetic display preference for estimated exam fees. |
| **Certification & Progress State** | **Client-Side Only** | Certification statuses, completion timestamps, and customized roadmaps are stored solely on your local device via HTML5 `localStorage`. |
| **Analytics & Telemetry** | **No** | We do not embed Google Analytics, Microsoft Clarity, Meta Pixels, or other user tracking scripts. |
| **Web Server Diagnostic Logs** | **Standard Non-PII** | Azure Static Web Apps / Azure Front Door infrastructure logs standard, aggregated HTTP web server requests (e.g., HTTP status code, request duration, browser user agent) strictly for uptime monitoring, DDoS mitigation, and operational routing. |

---

## 3. Client-Side Data Storage (`localStorage`) Registry

To persist your certification progress and custom career timelines between browser sessions, Microsoft Skills Navigator utilizes the standard HTML5 `localStorage` API. 

The data stored in your browser never leaves your device unless you explicitly export a JSON backup file. Below is the complete registry of keys utilized:

| LocalStorage Key | Purpose | Stored Data Format | Retention Period |
|---|---|---|---|
| `ms-cert-tracker-progress` | Tracks status of certifications | JSON Object mapping exam IDs to status (`not_started`, `in_progress`, `completed`, `needs_renewal`) | Until cleared by user |
| `ms-cert-tracker-tracked-paths` | Actively followed certification tracks | JSON Array of track IDs (e.g. `['azure-infrastructure', 'ai-machine-learning']`) | Until cleared by user |
| `ms-cert-tracker-tracked-certs` | Pinned priority certifications | JSON Array of exam IDs (e.g. `['az-104', 'ai-102']`) | Until cleared by user |
| `ms-cert-tracker-dismissed-certs` | Dismissed suggestions in the Action Center | JSON Array of exam IDs | Until cleared by user |
| `ms-cert-tracker-dates` | Completion timestamps used for 1-year renewal alerts | JSON Object mapping exam IDs to ISO-8601 UTC date strings | Until cleared by user |
| `ms-cert-tracker-custom-playlist` | Ordered custom career timeline sequence | JSON Array of ordered exam IDs | Until cleared by user |
| `ms-cert-tracker-applied-skills` | Progress for hands-on scenario assessment labs | JSON Object mapping skill IDs to status (`not_started`, `in_progress`, `completed`) | Until cleared by user |
| `ms-cert-tracker-theme` | Visual theme preference | String: `'light'`, `'dark'`, or `'system'` | Until cleared by user |
| `atozazure_currency` | Exam pricing display currency preference | String: `'GBP'`, `'USD'`, or `'EUR'` | Until cleared by user |

---

## 4. Your Rights & Total Data Sovereignty

Because your data is stored locally in your browser, you retain complete, unconditional control over your information at all times:

### 1. Right to Export (Data Portability)
You can export your complete progress, custom timeline, and settings as an unencrypted, standardized JSON file at any time.
- Open **Data & Preferences** (via the top header database icon or the Command Palette `Ctrl+K` $\rightarrow$ "Data Backup & Restore Preferences").
- Click **Export Backup (JSON)**. A file named `ms-skills-navigator-backup-[date].json` will download immediately to your computer.

### 2. Right to Restore & Migrate
You can import your backup JSON file into any browser or machine to restore your progress without needing an account or network sync.

### 3. Right to Erasure (Instant Deletion)
You can permanently erase all stored data at any time:
- In the application: Open **Data & Preferences** $\rightarrow$ click **Reset All Progress** $\rightarrow$ confirm reset. All 9 keys will be immediately purged.
- In your browser: Use your browser's "Clear Browsing Data" / "Cookies and Site Data" feature for `skills.atozazure.com` or `localhost`.

---

## 5. Cookies & Tracking Technologies

Microsoft Skills Navigator **does not use cookies** for tracking, advertising, or session management. 

Standard browser cache and `localStorage` are used strictly to provide essential application functionality and remember your visual display preferences.

---

## 6. External Links & Third-Party Platforms

Our application includes links to external resources, primarily:
- **Microsoft Learn** (`learn.microsoft.com`): Official exam specifications, study guides, interactive sandbox labs, and renewal portals.
- **Microsoft Tech Community** (`techcommunity.microsoft.com`): Community discussions and official skills hub announcements.
- **GitHub** (`github.com`): The open-source code repository and issue tracker.
- **atozazure** (`atozazure.com`): Daniel Powley's personal technical blog and portfolio.

When you click an external link, you leave Microsoft Skills Navigator. External websites operate under their own privacy policies and terms of service. We encourage you to review their respective privacy notices:
- [Microsoft Privacy Statement](https://privacy.microsoft.com/en-us/privacystatement)
- [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)

---

## 7. Hosting & Cloud Infrastructure

Microsoft Skills Navigator is hosted on **Azure Static Web Apps** and globally distributed via Microsoft Azure CDN/Front Door. 

Azure cloud infrastructure automatically processes incoming network connections and transient server logs containing standard HTTP connection metadata (such as client IP address, user agent, requested URL, and response status). This operational processing is necessary to provide secure transport over HTTPS, prevent denial-of-service (DDoS) attacks, and maintain service availability. 

These diagnostic logs are managed by Microsoft Azure according to Microsoft's enterprise cloud compliance standards and are not combined with any personal user profiles by atozazure.

---

## 8. Regulatory Compliance (GDPR & CCPA/CPRA)

Although Microsoft Skills Navigator does not collect personal data, we adhere to the core principles established by the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act / California Privacy Rights Act (CCPA/CPRA):

- **Data Minimization & Storage Limitation:** We collect and store zero personal identifying information on our servers.
- **Privacy by Default:** All tracking features are opt-in and restricted to your local browser environment.
- **No Sale or Sharing of Personal Information:** We do not sell, rent, monetize, or share your data with advertisers or third parties.

---

## 9. Changes to this Privacy Policy

We may update this Privacy Policy periodically to reflect new features (e.g., new certification tracks or data management utilities) or operational improvements. Any updates will be reflected with a revised **Last Updated** date at the top of this document.

---

## 10. Contact Us & Open Source Governance

If you have questions, feedback, or concerns regarding this Privacy Policy or the security of Microsoft Skills Navigator, please reach out:

- **Author & Maintainer:** Daniel Powley (atozazure)
- **Website:** [https://atozazure.com](https://atozazure.com)
- **GitHub Issues:** [https://github.com/danzure/microsoft-skills-navigator/issues](https://github.com/danzure/microsoft-skills-navigator/issues)
- **Email:** [daniel@atozazure.com](mailto:daniel@atozazure.com)
