# Wave 1 · Launch: website components and functional requirements

**Archetype A: Brochure · Archetype B: Lead generation**

This is a practical reference of genuine, commonly used website sections, components, content blocks and behaviours found on real business websites. It merges the Wave 1 component reference (`Wave_1_Launch_A_B_Website_Components_Reference.docx`, 12 Nov 2026) with Looq's research on industry patterns, Ghana-specific requirements and live Ghanaian websites.

Updated 13 November 2026. Scope is Wave 1 only, archetypes A and B; other archetypes are left out on purpose.

---

## Contents

1. [Scope and how to use this reference](#1-scope-and-how-to-use-this-reference)
2. [Archetype A: brochure website](#2-archetype-a-brochure-website)
3. [Archetype B: lead-generation website](#3-archetype-b-lead-generation-website)
4. [Shared foundations for A and B](#4-shared-foundations-for-a-and-b)
5. [Ghana market requirements](#5-ghana-market-requirements)
6. [Component library inventory](#6-component-library-inventory)
7. [What is not automatically required](#7-what-is-not-automatically-required)
8. [Launch checklist](#8-launch-checklist)
9. [Real website references](#9-real-website-references)
10. [Key design decisions for Wave 1](#10-key-design-decisions-for-wave-1)
11. [Reference templates in Looq](#11-reference-templates-in-looq)

---

## 1. Scope and how to use this reference

This document turns the Looq archetype map into a component inventory. It covers what a real business website needs to communicate, what visitors expect to find, and what the site must actually do. The inventory is industry-neutral, and industry variations are called out only where they change a component.

| Archetype | Primary job | Typical visitor action | Typical site shape |
|---|---|---|---|
| **A · Brochure** | Explain the business, build credibility and make contact details easy to find | Understand the business, view services or work, then call, email, visit or message | Small multi-page site or a short one-page site |
| **B · Lead generation** | Turn relevant visitors into enquiries the business can respond to | Request a quote, ask a question, book a consultation or submit a project brief | Multi-page service site, or a focused landing page with enquiry capture |

### Priority labels

| Label | Meaning |
|---|---|
| **CORE** | Expected on almost every credible site of this archetype. Leaving it out creates a real usability or business-information gap. |
| **COMMON** | Frequently used and valuable for many businesses; the exact content depends on the business. |
| **CONDITIONAL** | Include only when the business model, audience, location or service requires it. |
| **ADVANCED** | Useful for more mature lead handling or specific conversion needs; not a default. |

> These are components and behaviours, not a demand that every site has every page. A small firm can combine About, Services and Contact on one page; a specialist business may need separate service pages. Build the smallest complete site that answers visitors' real questions.

---

## 2. Archetype A: brochure website

A brochure website is the business's information profile online. It should quickly answer: who are you, what do you offer, who do you serve, why should I trust you, and how do I reach you?

### 2.1 Typical page structure

| Page / section | Priority | What it should contain |
|---|---|---|
| Home | CORE | A clear proposition, short introduction, main services or products, audience or service area, a trust cue, the next step and a contact route |
| About | COMMON | Company story, mission or approach, founder or team, experience, qualifications, values and relevant credentials |
| Services / What we do | CORE | A service list with plain-language descriptions, who each is for, scope, and links to details or enquiry |
| Individual service page | CONDITIONAL | One page per important service where customers need a separate explanation, search visibility or proof |
| Work / Projects / Portfolio | CONDITIONAL | Selected work with images, context, role or scope, and outcomes, where visual proof matters |
| Contact | CORE | Phone, WhatsApp, email, address or service area, Ghana Post GPS address, opening hours, map or directions where useful |
| FAQ | COMMON | Answers to recurring questions about scope, process, location, timing, eligibility or fees |
| Privacy notice | CORE when personal data is collected | What personal information is collected, why, how it is used and shared, and how to contact the business about it |
| News / Insights / Blog | CONDITIONAL | Only if the business will keep it current; a stale blog hurts trust |
| Careers | CONDITIONAL | Vacancies or a way to apply, when the business is hiring |
| 404 page | CORE | A friendly message, links to Home, Services and Contact, and the phone number |

### 2.2 Components commonly used on A websites

| Component | What it does / typical content | Priority |
|---|---|---|
| Brand header | Logo or wordmark, business name and consistent visual identity | CORE |
| Primary navigation | Home, About, Services, Work, Contact. Keep labels familiar and keep links visible on desktop rather than hidden behind a menu icon | CORE |
| Mobile navigation menu | Compact menu for small screens that opens and closes accessibly (Escape key, focus handling) | CORE |
| Skip-to-content link | First focusable element, for keyboard users | CORE |
| Hero / opening section | A specific headline saying what the business does, for whom and where; a supporting sentence; a real photo; an optional CTA | CORE |
| Service cards / service list | Service name, short description, optional icon or photo, link to detail or enquiry | CORE |
| About / company intro block | Short overview with a link to the full About section | COMMON |
| Team / people profiles | Real names, roles and photos where people are part of what customers are buying | CONDITIONAL |
| Credentials and affiliations | Licences, registrations, memberships, certifications or awards that can be verified (see §5) | CONDITIONAL |
| Project / work gallery | Images or case summaries with captions and context, which work better than image-only grids | CONDITIONAL |
| Testimonials / reviews | Genuine customer feedback with permission and attribution; never invent ratings | COMMON |
| Contact information block | Clickable phone (`tel:`), WhatsApp, email, address, service area and opening hours | CORE |
| Opening hours | Weekly hours plus public-holiday exceptions, matching the Google Business Profile | CONDITIONAL (CORE for places customers visit) |
| Map and directions | Embedded map loaded lazily, or a directions link, for a physical location; leave it out for online-only businesses | CONDITIONAL |
| Social profile links | Links to active, official profiles only | COMMON |
| Footer | Repeats key navigation, name, address and phone, hours, social links, legal links and business identity | CORE |
| Breadcrumbs | Shows where the visitor is on deeper multi-page sites | CONDITIONAL |
| Back-to-top control | Shortcut on long pages that must not cover content | CONDITIONAL |

### 2.3 Homepage section order: a sensible baseline

1. **Header:** logo, navigation and a clear Contact link or button.
2. **Hero:** what the business does, who it serves, and where.
3. **Services or products overview:** the main offers, not every detail.
4. **Why choose us / approach:** specific differentiators backed by facts.
5. **Proof:** selected work, credentials, team or customer reviews. Choose the kind of proof that matters most in the industry.
6. **Short About:** who is behind the business, with a link to learn more.
7. **FAQ or practical information**, if visitors keep asking the same questions.
8. **Contact section / CTA:** phone, WhatsApp, email, address or a simple enquiry route.
9. **Footer:** secondary navigation, contact details and legal links.

### 2.4 Industry variations within A

| Industry | Useful additions / content variations |
|---|---|
| Home & local services | Service-area list, operating hours, 24-hour emergency availability only if genuine, service categories, before/after and recent-job photos, call and WhatsApp links |
| Professional services | Practice areas or services, practitioner profiles, qualifications, professional memberships, office details, appointment route, confidentiality note |
| Construction & design | Project portfolio with type filters, process, capabilities and materials, site photos, locations served, quote route, contractor classification or licence where held |
| Real estate agents | Agent and team profiles, areas covered, services (sales, letting, valuation, property management), office details, licence details, links to current listings if they are kept up to date |
| Education & training | Programmes or courses, who they are for, entry requirements, delivery format, term dates and intakes, staff or trainers, admissions contact, fees where the school publishes them |
| Nonprofits & faith | Mission, programmes, leadership, service or meeting times and location, evidence of impact, events, donation route (MoMo and bank details), registration number |
| Creative & portfolio | Selected work, disciplines, client and sector examples, process, creator bio, project enquiry link |
| Restaurants (menu-led) | An HTML menu (not PDF) with prices in GH₵, dietary and allergen notes, location, hours, phone and WhatsApp, optional delivery-app and reservation links |

---

## 3. Archetype B: lead-generation website

A lead-generation site includes everything A has, plus a designed path from visitor interest to a usable enquiry. It must:
- tell visitors what to do next
- collect enough information to respond intelligently
- confirm the request was received
- deliver the enquiry to the right person

### 3.1 The lead-generation path

| Stage | Component / behaviour | What good looks like |
|---|---|---|
| 1. Attract | A relevant landing, service or campaign page | The page matches the visitor's need, service and location, with no misleading promise |
| 2. Explain | Offer, service detail, value proposition | The visitor understands what is offered, who it is for and what happens next |
| 3. Build confidence | Reviews, credentials, case studies, process, guarantees | Proof is genuine, relevant and placed near the decision point |
| 4. Prompt action | Primary CTA such as "Request a quote", "Book a free consultation" or "Get an estimate" | The button names the actual next step and leads straight to it |
| 5. Capture | Enquiry, quote, consultation or project-brief form | It asks only for what is needed to qualify and respond |
| 6. Validate and submit | Labels, validation, accessible errors, submit state | People understand the fields, can fix mistakes, and know whether it worked |
| 7. Confirm | Success message or thank-you page | Confirms receipt, sets a realistic response time (e.g. "within one working day") and explains the next step |
| 8. Route and follow up | Email or CRM notification, an auto-reply, assignment | The enquiry reaches a monitored inbox, WhatsApp or system and isn't lost. Replying within minutes rather than hours greatly raises contact rates. |

### 3.2 Core lead-generation components

| Component | Typical implementation | Priority |
|---|---|---|
| Primary CTA | A prominent action such as "Request a quote", "Book a free consultation", "Get an estimate" or "Send an enquiry" | CORE |
| Repeated contextual CTA | The same main action after relevant sections and in the footer, with no competing primary actions | COMMON |
| Contact / enquiry form | Name, a way to reply (phone/WhatsApp or email), enquiry type and message; fields chosen for the actual service | CORE |
| Quote request form | Adds service type, location, scope, size or quantity, timeframe or budget, only when these affect the price | CONDITIONAL |
| Consultation request form | May ask the area of advice, preferred contact method and availability; must not imply a confirmed appointment | CONDITIONAL |
| Project brief form | For agencies and design/build firms: goal, service, rough scope, timeline and attachments if needed | CONDITIONAL |
| Hidden tracking fields | `service`, `area` and `source_page`, so enquiries can be counted against the industry's metric (see §3.5) | COMMON |
| Field labels and help text | Visible labels (not placeholder-only), required/optional markers, examples and short instructions | CORE |
| Field validation and error messages | Inline or summary errors that say what is wrong and how to fix it, plus validation on the server | CORE |
| Submit / loading state | Prevents double submission and shows that the request is being sent | CORE |
| Success / thank-you state | Clear confirmation, next steps and a realistic response time; a unique thank-you URL helps conversion tracking | CORE |
| Privacy / consent notice | Explains how enquiry details are used; optional marketing consent is a separate, unticked box | CORE when personal data is collected |
| Click-to-call link | `tel:` link, especially valuable on mobile and for urgent or local services | COMMON (CORE for local services) |
| WhatsApp contact link | A `wa.me` link with a prefilled message, for businesses that actively monitor WhatsApp | COMMON (close to CORE in Ghana) |
| Sticky mobile action bar | Call · WhatsApp · enquiry shortcuts on phones that don't cover content and hide near the form | COMMON |
| Email link | `mailto:`; never the only contact method if a form is promised | COMMON |
| Auto-reply and owner notification | Instant email or SMS confirmation to the visitor plus an alert to the business | COMMON |
| Live chat / chatbot | Only if staffed or reliably managed; automation must be disclosed, with a human fallback | CONDITIONAL |
| Appointment scheduler | Calendar of available slots (e.g. Calendly, Cal.com), only when the business can keep its availability current | CONDITIONAL |
| Lead routing | Sends enquiries by service, region or type to the right person | COMMON as volume grows |
| CRM / lead record | Stores source, page, campaign, timestamp, status and contact details in an approved system | ADVANCED |
| Spam protection | Honeypot, time check and rate limiting first; an invisible challenge (Turnstile, reCAPTCHA v3) as a fallback; avoid image CAPTCHAs | CORE |
| Analytics / conversion events | Measures form starts, successful submissions, phone, WhatsApp and CTA clicks, configured with privacy in mind | COMMON |
| Lead magnet | A free guide or checklist in exchange for an email address, with clear consent | CONDITIONAL |

### 3.3 Typical lead forms and their fields

| Form type | Starter fields | Add only when useful |
|---|---|---|
| General enquiry | Name; phone/WhatsApp or email; message | Subject or enquiry type; preferred reply method |
| Local service quote | Name; phone; location or area; service needed; short description | Property type; size or quantity; photos; urgency; preferred visit time |
| Professional consultation | Name; phone/email; area of advice or service; brief description | Preferred time; client type (local, diaspora, foreign investor); confidentiality warning |
| Construction / design project | Name; contact details; project type; location; summary | Approximate size; drawings or files; expected start; budget range |
| School admission enquiry | Parent name; phone; child's name and entry class/year; term | Current school; visit/open-day request; how they heard |
| Real estate valuation / listing | Name; phone; property location; property type; sell/let/manage | Bedrooms; land size and title status; timeline |
| Nonprofit volunteer / partner | Name; phone/email; area of interest | Availability; skills; organisation |
| Creative project brief | Name; email/phone; project type; date or deadline | Location; budget range; references or links |
| Restaurant event / catering | Name; phone; event date; number of guests; event type | Venue; dietary needs; budget per head |

> Keep first-contact forms short. Use a multi-step form only when the enquiry genuinely needs several groups of information, and show the steps. Never collect sensitive information just because a field is available.

### 3.4 Trust and decision-support components for B

| Component | Why it matters / examples | Priority |
|---|---|---|
| Testimonials / verified reviews | Evidence from real customers, attributed accurately and with permission; a link to the Google review source where possible | COMMON |
| Case studies / project outcomes | Problem, work done and outcome with numbers; useful for higher-value purchases | CONDITIONAL |
| Client / partner logos | Only logos the business may display, for real relationships | CONDITIONAL |
| Credentials / licences | Relevant registration, licence, insurance or certification (see §5) | CONDITIONAL |
| Process / what happens next | The steps after an enquiry: review, call, site visit, proposal, consultation | COMMON |
| Pricing guidance | Starting prices in GH₵, typical ranges, what affects the price, or how quotes are prepared. Rarely published in Ghana, so a real differentiator. | CONDITIONAL |
| Service area / eligibility | Areas served, customer types, project types or limits | COMMON for local services |
| Guarantee / response promise | Only a guarantee or response time the business can consistently keep | CONDITIONAL |
| FAQ / objection handling | Real pre-sale concerns: price, timing, coverage, process, documents, payment (MoMo, bank), cancellation | COMMON |
| Comparison / package table | Clarifies options where customers choose between service levels or packages | CONDITIONAL |

### 3.5 Industry variations within B

| Industry | What to measure | Key B additions |
|---|---|---|
| Home & local services | Quote requests by area | Sticky call/WhatsApp, quote form with area and photo upload, area pages, emergency line if genuine |
| Professional services | Enquiries by practice area | One page or section per practice area with its own CTA; consultation form with a matter-type field; confidentiality note |
| Construction & design | Portfolio → quote requests | CTA on every project ("Planning something similar?"); project questionnaire with budget, timeline and file upload |
| Real estate agents | Valuation and area enquiries | "What's my property worth?" form; area guides with CTAs; sold showcase |
| Education & training | Admission enquiries by term | Admissions enquiry and visit/open-day booking; prospectus download; fees and term dates |
| Nonprofits & faith | Donations, event RSVPs | Persistent Give/Donate button (MoMo, bank, card link-outs); event RSVP; volunteer form |
| Creative & portfolio | Enquiries by project type | Enquiry form with required project type and date; "check my date"; CTA at the end of every gallery |
| Restaurants (menu) | Menu views, order clicks | Order button (delivery apps, WhatsApp); reservation link; private-event/catering form; tracked outbound clicks |

---

## 4. Shared foundations for A and B

| Area | Requirement | Implementation notes |
|---|---|---|
| Responsive design | Layouts work on mobile, tablet and desktop | Test real content, navigation, forms and tap targets (44px or more) from 360px wide; no horizontal scroll. Most Ghanaian visitors are on phones. |
| Accessibility | Semantic headings (one H1), keyboard access, visible focus, alt text, enough contrast, accessible forms | WCAG 2.2 AA is the target. Labels must be associated with their controls. Respect `prefers-reduced-motion`. |
| Performance | Optimised images (WebP, lazy-loaded), self-hosted fonts loaded sensibly, few third-party scripts, stable layout | Aim for Core Web Vitals "good" (LCP 2.5s or less). Mobile data is costly, so page weight matters. |
| Security | HTTPS, secure form handling, server-side validation, protected admin access | Don't expose secrets or send personal data to unapproved services. |
| SEO basics | Unique titles and meta descriptions, useful headings, descriptive URLs, crawlable links, alt text, sitemap | `LocalBusiness` (or subtype) structured data with name, address, phone, hours and geo; Google Business Profile linked. Avoid thin location pages. |
| Business identity | Consistent name, logo, contact details and location | One source of business information feeds the header, footer, contact page, structured data and Google Business Profile. |
| Privacy | A privacy notice when collecting personal data; cookie controls only when tracking requires them | See §5 for Ghana's Data Protection Act. EU/UK visitors trigger cookie-consent rules if tracking is used. |
| Error handling | Custom 404, form error states, a fallback contact route | A broken route should never leave a visitor stuck. |
| Content quality | Real business details, current services, authentic photos, working links | No placeholder testimonials, invented logos, fake ratings or unsupported claims. |
| Social sharing | Open Graph title, description and image | Links shared on WhatsApp and social media show a proper preview. |

---

## 5. Ghana market requirements

Looq templates are for real Ghanaian businesses, so these apply on top of the foundations.

### 5.1 Contact and payment habits

| Requirement | Notes | Priority |
|---|---|---|
| WhatsApp as a main contact route | Use a `wa.me/233…` link with a prefilled message. On forms, "Phone or WhatsApp" is often required and email optional. | COMMON, close to CORE |
| Phone numbers | Show them as local text (024 555 0187) and link them in international format (`tel:+233245550187`). Landlines (030…) where relevant. | CORE |
| Ghana Post GPS digital address | Add to the address (e.g. GA-123-4567) along with a landmark ("opposite the …"), because street addresses alone are often unclear | COMMON |
| Prices in GH₵ | Format as "GH₵ 1,200". State whether VAT and official fees are included. | CONDITIONAL (when prices are shown) |
| Mobile money | Name MoMo (and bank transfer) as payment options in the FAQ, donation and payment details | COMMON |
| Response promise | "We reply within one working day" works well, provided the business keeps it | COMMON |
| Diaspora visitors | Many enquiries come from Ghanaians abroad: accept international phone numbers, state time zones and remote-friendly processes | CONDITIONAL |

### 5.2 Privacy

| Requirement | Notes |
|---|---|
| Data Protection Act, 2012 (Act 843) | Privacy notices should explain what is collected, why, how long it's kept and how people can access, correct or delete their data. Data controllers are expected to register with the Data Protection Commission. Check the business's registration status. |
| Cookies | If no tracking cookies are used, say so. If analytics or ads are used and EU/UK visitors are expected, add a consent banner with an equally easy "Reject". |

### 5.3 Credentials and regulators by industry

Show these only when the business actually holds them, and link to the official register where one exists. Check current rules before launch, because requirements change.

| Industry | Credentials and regulators commonly shown |
|---|---|
| All registered businesses | Registration with the Office of the Registrar of Companies (ORC); company or business-name number; GRA TIN where appropriate |
| Professional services (accounting) | Institute of Chartered Accountants, Ghana (ICAG) membership and firm licence |
| Professional services (law) | Ghana Bar Association / General Legal Council standing. Lawyer advertising is restricted by the profession's conduct rules, so keep claims factual and avoid "best lawyer" language. |
| Foreign-owned businesses / market entry | Ghana Investment Promotion Centre (GIPC) registration |
| Construction | Ministry of Works and Housing contractor classification, professional body membership (e.g. Ghana Institution of Engineers, Ghana Institute of Architects) |
| Real estate | Licensing under the Real Estate Agency Act, 2020 (Act 1047) and the Real Estate Agency Council; land title status in listings |
| Education | Ghana Education Service registration and National Schools Inspectorate Authority (NaSIA) inspection/licensing for private schools |
| Nonprofits | Registration as a company limited by guarantee with the ORC and with the Department of Social Welfare; registration number in the footer |
| Restaurants | Food and Drugs Authority (FDA) and Ghana Tourism Authority licences, where held; allergen information on the menu |

### 5.4 What local sites usually lack (and Looq templates should provide)

Research on Ghanaian business sites found that most are firm pages written as "we", with stock photos and a generic "Contact us" form. They usually lack:
- **published prices** in GH₵
- **a real person** shown with a photo
- **results with numbers**
- **named testimonials**
- **an explicitly free first call**
- **an FAQ**
- **a clear niche**

Surprisingly, many also lack WhatsApp. Providing these is a real differentiator for Looq.

---

## 6. Component library inventory

Build these as configurable components rather than one hard-coded page per industry. Content, labels and data change per client; each component's purpose and behaviour stay the same.

| Reusable component | Variants / configuration |
|---|---|
| **SiteHeader** | Logo; horizontal nav; dropdown nav; mobile drawer; optional CTA; transparent-over-hero to solid on scroll; optional utility bar (phone, hours) |
| **SiteFooter** | Contact block; navigation columns; social links; legal links; registration number; optional newsletter only where used |
| **HeroSection** | Text-left/image-right; centred; full-bleed image; inset rounded image; compact page hero; with or without CTA; optional headline slider (manual or slow auto-advance with pause, never the only place key content lives) |
| **CTAButton / CTAGroup** | Primary and secondary; internal anchor; phone; WhatsApp; email; external booking link; optional arrow-circle companion |
| **SectionHeading** | Eyebrow or pill label, heading, short description, optional action link |
| **ServiceGrid / ServiceCard** | Icon or photo; title; summary; detail link or form preselect; optional starting price |
| **FeatureList / ProcessSteps** | Icon + short benefit; numbered steps; two-column capability list |
| **AboutSection** | Text and image; company story; mission and values; founder letter or team emphasis |
| **TeamGrid / PersonCard** | Portrait or initials; name; role; credentials; contact or profile link |
| **LogoStrip** | Client, partner, membership or certification marks; optional monochrome |
| **CredentialBadges** | Regulator or membership badges with links to official registers (see §5.3) |
| **TestimonialCard / ReviewList** | Quote; attribution; source and date; rating only if verified; link to Google reviews |
| **CaseStudyCard / ResultStat** | Client type and location; headline metric (counter optional); short story |
| **ProjectGrid / Gallery** | Responsive grid; optional filters and lightbox; captions and accessible descriptions |
| **PricingCard / PackageTable** | Package name, duration, inclusions, "from" price in GH₵, CTA that preselects the form |
| **FAQAccordion** | Native `details`/`summary`; keyboard operable; optional categories |
| **ContactDetails** | Phone, WhatsApp, email, address with GPS address and landmark, hours, service areas |
| **MapEmbed / DirectionsLink** | Lazy map with a fallback directions link; only for physical locations |
| **EnquiryForm** | Configurable fields; labels; required/optional; validation; honeypot; consent; tracking fields; success and error states |
| **QuoteRequestForm** | Service-specific questions; conditional fields; optional file upload; progress indicator only if multi-step |
| **LeadMagnetForm** | Single email field, value statement, consent note, confirmation |
| **FormSuccessState** | Receipt confirmation; response time; reference number if generated; next steps; urgent contact route |
| **FloatingContactActions** | WhatsApp bubble or sticky mobile bar (Call · WhatsApp · Enquire); mobile-aware; must not cover content; hides near the form |
| **PrivacyDialog / LegalPage** | Act 843-aligned privacy notice; terms where needed |
| **Breadcrumbs** | Hierarchical links for deeper pages |
| **CookieNotice / Preferences** | Only when tracking actually requires it |
| **SEO / Metadata config** | Per-page title, description, canonical, Open Graph image, `LocalBusiness`/`ProfessionalService` structured data |
| **BusinessInfo (data)** | One source for name, phones, WhatsApp, email, address, GPS, hours and socials, feeding every component above |

---

## 7. What is not automatically required

- **A blog:** only when the business has relevant content and will maintain it.
- **Live chat:** don't add a chat bubble if nobody will answer it.
- **A chatbot:** only for a clearly defined task, with a human fallback.
- **A booking calendar:** only when real availability can be kept current.
- **A map:** for places customers visit, not for remote or online-only businesses.
- **A newsletter pop-up:** optional and often intrusive; only with a clear value exchange and valid consent.
- **Animations, counters and carousels:** decorative. Auto-rotating carousels are widely ignored and need a pause control.
- **Login, dashboards, online payments or memberships:** these belong to other archetypes (C–G).
- **Long multi-step forms:** avoid unless qualification genuinely can't be done with a short form.
- **Accessibility overlay widgets:** don't fix accessibility, and sites using them still face complaints.
- **Visible image or puzzle CAPTCHAs:** use invisible protection instead.
- **Generic stock photos of people:** use real photos of the business wherever possible.
- **PDF-only menus or price lists:** use HTML so they work on phones and in search.

---

## 8. Launch checklist

| Check | A · Brochure | B · Lead gen |
|---|---|---|
| Visitors can identify the business and its offer quickly | ☐ | ☐ |
| Main services or products and the intended audience are clear | ☐ | ☐ |
| Navigation and footer work on mobile and desktop (360px and up) | ☐ | ☐ |
| Contact details are accurate and clickable on mobile (phone, WhatsApp, email) | ☐ | ☐ |
| Address includes a Ghana Post GPS address and a landmark | ☐ | ☐ |
| About, credentials and proof are genuine and current | ☐ | ☐ |
| Privacy notice is available when personal data is collected (Act 843) | ☐ | ☐ |
| Prices, if shown, are in GH₵ and say what's included | If shown | If shown |
| Primary CTA is clear and leads to the expected action | Optional | ☐ |
| Enquiry or quote form asks only for relevant information | Optional | ☐ |
| Labels, instructions and validation are accessible | If form exists | ☐ |
| Successful submission shows a confirmation with a response time | If form exists | ☐ |
| Enquiry reaches a monitored inbox, WhatsApp or system | If form exists | ☐ |
| Auto-reply and owner notification are working | — | ☐ |
| Spam protection and server-side validation are active | If form exists | ☐ |
| Phone, WhatsApp and email routes work and are monitored | ☐ | ☐ |
| Structured data and Google Business Profile details match the site | ☐ | ☐ |
| Analytics measure meaningful actions without unnecessary tracking | Recommended | Recommended |
| Images optimised, fonts self-hosted, no heavy third-party scripts | ☐ | ☐ |
| Keyboard-only navigation, visible focus and reduced motion checked | ☐ | ☐ |
| Custom 404 page works | ☐ | ☐ |

---

## 9. Real website references

These are live sites found during research. They show patterns that are actually in use; they are not a claim that every design choice on them is best practice.

### 9.1 Ghanaian business sites

| Site | Pattern shown |
|---|---|
| [Handymen Accra](https://www.handymenaccra.com/) · [contact](https://www.handymenaccra.com/contact/) | Local home services: service categories, quote CTA, call/email/chat, response promise; quote form with name, phone, optional email, category, location and brief |
| [Plumbers Ghana · contact](https://plumbersghana.com/contact/) | Service quote form with enquiry type, city, details, an alternative call/email route and a privacy notice |
| [Spring Legal Consultancy](https://www.springlegal.com.gh/) | Professional-services brochure: proposition, practice areas, About, contact and consultation CTA |
| [Fitch Attorneys · contact](https://www.fitchattorneys.com/contact/) | Firm contact page with address, several contact routes, departmental emails, hours and map |
| [MacCarthy & Associates · contact](https://maccarthyandassociates.com/contact/) | Consultation enquiry, contact details, hours, map and a pre-contact FAQ |
| [Bernard Bempong & Associates · contact](https://www.bba.com.gh/contact?subject=careers) | Enquiry form with organisation and service selection, plus a careful confidentiality and engagement notice |
| [iSel](https://www.weareisel.com/) | Creative agency: client proof, project brief invitation, contact details and service navigation |
| [LuminCore Consult](https://lumincoreconsult.com/) | Consulting firm: hero with service tabs, photo service cards, a flagship package, FAQ, free consultation via Cal.com scheduler and WhatsApp |
| [Gotham Consult](https://gothamconsult.com/) | One of the few Ghanaian consultancies publishing cedi prices ("from GHS 2,400/month"); free call with a day/time picker; WhatsApp |
| [Naflin Consult](https://naflinconsult.com/sme-effieciency-for-ghana/) | SME operations services with an anonymised result; also shows common gaps (no prices, no free call, no WhatsApp) |
| [IDS Consulting](https://idsconsultingservices.com/) | Accounting-led advisory with a free 30-minute discovery call |

### 9.2 Comparable sites outside Ghana

| Site | Pattern shown |
|---|---|
| [Purpose In Action](https://www.purpose-in-action.co.uk/) (UK) | Solo advisor: priced assessment → retainer ladder, cash results with numbers, FAQ |
| [Nemico Consulting](https://nemicoconsulting.com/) (South Africa) | Problem hook, three priced packages in rand, five-phase process, numeric result, 11-question FAQ, free call via embedded Calendly |
| [Tracy Diamonds](https://tracydiamonds.com/work-with-me/) (Nigeria) | Systems and structure for owner-led SMEs; named testimonials with numbers; WhatsApp |

### 9.3 Standards and guidance

- [W3C WAI · Forms tutorial](https://www.w3.org/WAI/tutorials/forms/), [Labelling controls](https://www.w3.org/WAI/tutorials/forms/labels/), [Validation](https://www.w3.org/WAI/tutorials/forms/validation/)
- [W3C · WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [WebAIM Million 2025](https://webaim.org/projects/million/2025)
- [Google · LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business) · [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) · [Mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing) · [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [NN/g · Hamburger menus](https://www.nngroup.com/articles/hamburger-menus/) · [Contact pages](https://www.nngroup.com/articles/contact-us-pages/) · [Auto-forwarding carousels](https://www.nngroup.com/articles/auto-forwarding/) · [Placeholder labels](https://www.nngroup.com/articles/form-design-placeholders/)
- [Baymard · Inline validation](https://baymard.com/blog/inline-form-validation)
- [HubSpot · Lead generation forms](https://blog.hubspot.com/marketing/lead-generation-forms)
- [HBR · The short life of online sales leads](https://hbr.org/2011/03/the-short-life-of-online-sales-leads)
- [ORC Ghana · 2026 fees and charges](https://orc.gov.gh/forms/FINAL-FEES-AND-CHARGES-2026.pdf) · [Annual returns 2026](https://orc.gov.gh/annual-returns-2026/)

---

## 10. Key design decisions for Wave 1

- **Separate archetypes, shared parts:** treat A and B as separate archetypes, but let B reuse nearly every A component.
- **Lead generation is a path, not a form:** a form on every page isn't enough. The offer, CTA, form, confirmation and follow-up must work together.
- **Configurable forms:** fields change by industry and enquiry type, and every B form carries tracking fields for its industry's metric.
- **Visible contact details:** for Ghana-facing businesses, clickable phone and WhatsApp are standard, provided someone monitors them.
- **Authentic proof:** real people, completed projects, verifiable qualifications and genuine feedback. Never invent ratings, logos or claims.
- **Mobile first:** navigation, tap-to-call, WhatsApp and form completion must all work comfortably on a phone.
- **Foundations, not add-ons:** privacy (Act 843), accessibility, security, performance and SEO.
- **Fill Ghana's gaps:** published GH₵ prices, a real person, results with numbers and a free first call are rare on Ghanaian sites, so provide them where the business can honour them.

---

## 11. Reference templates in Looq

These templates already use most of the B components above and can serve as starting points:

| Template | Archetype | Notable components |
|---|---|---|
| [single-page/boateng-advisory](../Looq/templates/single-page/boateng-advisory/index.html) | B, one page | Founder-led consulting firm: "sound familiar" checklist, four priced services with form preselect, process steps, anonymised results, team list, FAQ, WhatsApp-first consultation form, privacy dialog, sticky mobile action bar |
| [single-page/kwan-consulting](../Looq/templates/single-page/kwan-consulting/index.html) | B, one page | Corporate consulting firm: inset hero with headline tabs, photo service cards that preselect the form, priced launch package, testimonial, lead-magnet form, FAQ, consultation form with client-type field, WhatsApp button, privacy dialog |
