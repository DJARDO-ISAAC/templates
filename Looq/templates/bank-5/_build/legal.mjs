// Privacy, terms of use, cookies and complaints pages.
// Everything wrapped in cf(confirm(...)) or data-confirm is highlighted in review mode (?review=1)
// until the bank's legal and compliance team signs it off.
import { esc, val, cf, tel, wa, NAME, btn, link, head, page, titleBand, ic } from './lib.mjs'
import { BANK, confirm } from './bank.mjs'
import { branchOptions } from './parts.mjs'

const UPDATED = confirm('5 November 2026')
const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('')
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`
const tbl = (headRow, rows) => `<div class="table-wrap not-prose my-6"><table class="tbl !min-w-[520px]"><thead><tr>${headRow.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
const mail = `<a href="mailto:${BANK.email}">${BANK.email}</a>`
const phone = `<a href="${tel(BANK.phone)}">${BANK.phone}</a>`

const contactCard = (title = 'Questions about this page?') => `<div class="rounded-[24px] bg-deep p-6 text-white/75 on-dark">
  <p class="font-display text-[1.1rem] font-bold text-white">${title}</p>
  <p class="mt-2 text-[.92rem]">Write to us or call the hotline. We reply within one working day<span data-confirm></span>.</p>
  <ul class="mt-5 grid gap-2.5 text-[.92rem]">
    <li><a class="flex items-start gap-2.5 text-white hover:underline" href="mailto:${BANK.email}"><span class="mt-1 block size-4 flex-none text-glow">${ic.mail}</span><span class="min-w-0 [overflow-wrap:anywhere]">${BANK.email}</span></a></li>
    <li><a class="flex items-center gap-2.5 text-white hover:underline" href="${tel(BANK.phone)}"><span class="block size-4 text-glow">${ic.phone}</span>${BANK.phone}</a></li>
    <li class="flex items-start gap-2.5"><span class="mt-1 block size-4 flex-none text-glow">${ic.pin}</span><span>${BANK.postal}</span></li>
  </ul>
</div>`

// A long-form document: sticky contents with scroll-spy, numbered sections and a summary card
function doc({ file, title, eb, intro, description, summary, sections, extra = '' }) {
  const toc = sections.map((s, i) => `<li><a href="#${s.id}" data-toc-link><span class="toc-n">${String(i + 1).padStart(2, '0')}</span>${s.h}</a></li>`).join('')
  page({ file, title: `${title} | ${NAME}`, description, kind: 'Legal', body: `
${titleBand({ title, eb, trail: [[title]], intro, aside: `<div class="flex flex-wrap gap-2"><span class="chip !cursor-default">${ic.cal}<span>Last updated <span data-confirm>${val(UPDATED)}</span></span></span><span class="chip !cursor-default">${ic.clock}<span>${Math.max(2, Math.round(sections.reduce((n, s) => n + s.body.replace(/<[^>]+>/g, '').split(/\s+/).length, 0) / 220))} min read</span></span><button type="button" class="chip" data-print>${ic.doc}<span>Print</span></button></div>` })}
<section class="sec !pt-10"><div class="wrap grid gap-10 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-16">
  <aside class="no-print lg:sticky lg:top-[124px] lg:self-start">
    <details class="toc-m lg:hidden"><summary>On this page${ic.chev}</summary><ol class="toc mt-2">${toc}</ol></details>
    <nav class="hidden lg:block" aria-label="On this page"><p class="text-[.72rem] font-semibold uppercase tracking-[.14em] text-muted">On this page</p><ol class="toc mt-4" data-toc>${toc}</ol></nav>
    <div class="mt-8 hidden lg:block">${contactCard()}</div>
  </aside>
  <div class="min-w-0 max-w-[76ch]">
    <div class="rounded-[24px] bg-mint p-6 ring-1 ring-mint-2 md:p-8" data-reveal><p class="flex items-center gap-2 font-display text-[1.1rem] font-bold text-ink"><span class="block size-5 text-brand">${ic.info}</span>In short</p><ul class="ticks mt-4 text-[.98rem]">${summary.map((t) => `<li>${ic.check}<span>${t}</span></li>`).join('')}</ul></div>
    <article class="prose legal mt-4 text-[1.02rem]">${sections.map((s, i) => `<section id="${s.id}" class="legal-sec"><h2><span class="legal-n">${String(i + 1).padStart(2, '0')}</span>${s.h}</h2>${s.body}</section>`).join('')}</article>
    ${extra}
    <p class="callout mt-12 text-[.92rem]" data-confirm>${ic.info}<span>Sample text prepared for the website. Have this page reviewed by the bank's legal and compliance team before publishing.</span></p>
    <div class="mt-8 lg:hidden">${contactCard()}</div>
    <p class="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[.95rem]">${[['Privacy notice', 'privacy'], ['Terms of use', 'terms'], ['Cookies', 'cookies'], ['Complaints', 'complaints']].filter(([, h]) => h !== file).map(([t, h]) => link(t, h)).join('')}</p>
  </div>
</div></section>
` })
}

/* ================= PRIVACY ================= */
doc({
  file: 'privacy', title: 'Privacy notice', eb: 'Legal',
  description: `How ${BANK.short} collects, uses, shares and protects your personal information, and your rights under the Data Protection Act, 2012 (Act 843).`,
  intro: `How we collect, use, share and protect your personal information, and the rights you have under Ghana's Data Protection Act, 2012 (Act 843).`,
  summary: [
    'We collect what we need to open and run your accounts, assess loans and meet our legal duties.',
    'We never sell your information, and we never ask for your PIN or password.',
    'We share it only with people who need it to serve you, or where the law requires it.',
    'You can ask to see, correct or stop the use of your information at any time.',
  ],
  sections: [
    { id: 'who-we-are', h: 'Who we are', body: p(
      `${NAME} (“the bank”, “we”, “us”) is a rural and community bank with its head office at ${BANK.address}. We are the data controller for the personal information described in this notice, and we are registered with the Data Protection Commission of Ghana<span data-confirm></span>.`,
      `Our Data Protection Supervisor oversees how we handle personal information. You can reach them at the head office, by email at ${mail}, or by post at ${BANK.postal}.<span data-confirm></span>`) },
    { id: 'scope', h: 'What this notice covers', body: p(
      'This notice applies to personal information about customers and former customers, people who apply for our products, guarantors, shareholders, and anyone who contacts us or uses this website.',
      'Some products, such as U-Connect, mobile money and insurance, have their own terms that explain extra details. Where they differ, the product terms apply to that product.') },
    { id: 'what-we-collect', h: 'What we collect', body: `<h3>Information you give us</h3>${ul([
      '<strong>Identity:</strong> your name, date of birth, Ghana Card number, photographs and signature.',
      '<strong>Contact:</strong> phone numbers, email address, residential and GhanaPost GPS address.',
      '<strong>Financial:</strong> your occupation, employer, income, payslips and bank statements.',
      '<strong>For loans:</strong> details of guarantors and collateral, and the purpose of the loan.',
      '<strong>For insurance:</strong> details of what you want to cover, and beneficiaries.',
    ])}<h3>Information we create when you bank with us</h3>${ul([
      'Account numbers, balances, transactions, loan repayments and correspondence.',
      'If you use U-Connect: your registered phone number, device details and login history.',
      'CCTV images in and around our branches, kept for security.<span data-confirm></span>',
      'Recordings of calls to our hotline, where we tell you the call is recorded.<span data-confirm></span>',
    ])}<h3>Information from other people</h3>${ul([
      'The National Identification Authority, to verify your Ghana Card.',
      'Licensed credit reference bureaus, when you apply for credit.',
      'Your employer, when you apply for a salary loan repaid by deduction from your pay.',
      'MTN Mobile Money and the ARB Apex Bank, when you move money between services.',
    ])}<h3>Information from this website</h3>${p('When you use a form on this website we collect your name, phone number, email address if you give it, your nearest branch and what you ask about. We do not ask for your PIN, password or full account number online. See the <a href="cookies">cookies page</a> for what is stored on your device.')}` },
    { id: 'how-we-use', h: 'How and why we use it', body: `${p('We only use your information where the law allows it. The table shows the main purposes and the legal reason for each.')}${tbl(['Purpose', 'Legal reason'], [
      ['Opening and running your accounts, loans and policies', 'To perform our contract with you'],
      ['Checking your identity and screening for money laundering and fraud', 'Legal duty, including the Anti-Money Laundering Act, 2020 (Act 1044)'],
      ['Assessing whether you can afford a loan', 'To perform our contract, and our legitimate interest in lending responsibly'],
      ['Keeping our branches, systems and your money secure', 'Legal duty and legitimate interest'],
      ['Reporting to the Bank of Ghana and other regulators', 'Legal duty'],
      ['Telling you about changes to your account or our services', 'To perform our contract'],
      ['Telling you about new products and offers', 'Your consent, which you can withdraw at any time'],
      ['Improving our products, service and website', 'Our legitimate interest'],
    ])}` },
    { id: 'sharing', h: 'Who we share it with', body: `${p('We never sell your personal information. We share it only when we need to, and only with:')}${ul([
      'Our staff, who are trained in confidentiality and only see what their role requires.',
      'The ARB Apex Bank, which provides clearing, payment and digital banking services to rural and community banks.<span data-confirm></span>',
      'MTN Mobile Money, when you link your account to your wallet.',
      'Our partner insurer, when you ask about or take out insurance.',
      'Licensed credit reference bureaus, under the Credit Reporting Act, 2007 (Act 726).',
      'Your employer, to arrange deductions for a salary loan you have agreed to.',
      'Regulators and authorities such as the Bank of Ghana, the Financial Intelligence Centre and the Ghana Revenue Authority, and courts or the police when the law requires it.',
      'Our auditors, lawyers and other professional advisers, who must keep it confidential.',
    ])}${p('Anyone who processes information on our behalf must protect it to the same standard we do, and may only use it on our instructions.')}` },
    { id: 'transfers', h: 'Transfers outside Ghana', body: p('We store your information in Ghana<span data-confirm></span>. If a service provider needs to process it in another country, we make sure it is protected to the standard required by the Data Protection Act before we transfer it.') },
    { id: 'retention', h: 'How long we keep it', body: `${p('We keep information only as long as we need it, or as long as the law requires.')}${tbl(['Information', 'How long'], [
      ['Account and transaction records', 'At least 5 years after the account closes, as required by anti-money laundering law'],
      ['Loan files', 'At least 5 years after the loan is fully repaid<span data-confirm></span>'],
      ['Website enquiries that do not lead to an account', '12 months'],
      ['CCTV recordings', '30 days, unless needed for an investigation<span data-confirm></span>'],
      ['Complaint records', '5 years from when the complaint is closed<span data-confirm></span>'],
    ])}` },
    { id: 'security', h: 'How we protect it', body: `${p('We use physical, technical and organisational measures to protect your information, including:')}${ul([
      'Access controls so that staff see only what they need.',
      'Encryption of data sent between your phone and U-Connect.',
      'Secure storage of paper records at the branch and head office.',
      'Regular staff training and checks on how information is handled.',
    ])}${p('<strong>We will never ask for your PIN, password or the codes we send you</strong>, by phone, SMS, WhatsApp or email. If anyone does, it is fraud. See <a href="security">banking safely</a>.')}` },
    { id: 'your-rights', h: 'Your rights', body: `${p('Under the Data Protection Act, 2012 (Act 843), you have the right to:')}${ul([
      '<strong>See</strong> the personal information we hold about you.',
      '<strong>Correct</strong> information that is wrong or incomplete.',
      '<strong>Ask us to delete</strong> information we no longer have a reason to keep.',
      '<strong>Object</strong> to us using your information for direct marketing.',
      '<strong>Withdraw consent</strong> where we rely on it, without affecting what we did before.',
      '<strong>Complain</strong> to the Data Protection Commission.',
    ])}${p(`To use any of these rights, visit any branch with your Ghana Card, email ${mail} or write to the Data Protection Supervisor at ${BANK.postal}. We may ask you to prove who you are before we act. We aim to respond within 21 days<span data-confirm></span>, and there is no charge.`, 'Some information we must keep by law, for example records needed to prevent money laundering, even if you ask us to delete it. If so, we will explain why.')}` },
    { id: 'children', h: 'Children', body: p('We open School Child Accounts for children with a parent or guardian, who gives consent and manages the account on the child\'s behalf until the child is old enough to operate it.<span data-confirm></span> We do not knowingly collect information from children through this website.') },
    { id: 'decisions', h: 'How we make decisions', body: p('Loan and account decisions are made by our staff. We may use scores from credit reference bureaus to help, but a person always reviews the decision, and you can ask us to explain it.<span data-confirm></span>') },
    { id: 'changes', h: 'Changes to this notice', body: p(`We may update this notice when the law or our services change. The date at the top shows when it last changed. If a change significantly affects how we use your information, we will tell you at your branch, by SMS or on this website before it takes effect.`) },
    { id: 'contact', h: 'Contact and complaints', body: p(`If you have a question or are unhappy with how we have handled your information, contact the Data Protection Supervisor at ${mail} or ${phone}, or follow our <a href="complaints">complaints process</a>.`, 'If you are still not satisfied, you can complain to the Data Protection Commission of Ghana at <a href="https://www.dataprotection.org.gh" rel="noopener">dataprotection.org.gh</a>.') },
  ],
})

/* ================= TERMS ================= */
doc({
  file: 'terms', title: 'Terms of use', eb: 'Legal',
  description: `The terms for using the ${BANK.short} website, its calculators and online forms.`,
  intro: 'The terms that apply when you use this website, its calculators and its online forms. Please read them before you use the site.',
  summary: [
    'This website gives general information. It is not an offer of credit or of any product.',
    'Calculators give estimates only. Your actual terms are set out in writing before you sign.',
    'Online forms start a conversation. Accounts are only opened after we check your Ghana Card in person.',
    'These terms are governed by the laws of Ghana.',
  ],
  sections: [
    { id: 'about', h: 'About these terms', body: p(`This website is run by ${NAME}. By using it you agree to these terms. If you do not agree, please do not use the website.`, 'These terms cover the website only. Your accounts, loans, policies and digital banking each have their own agreement, which applies to that product.') },
    { id: 'who-we-are', h: 'Who we are', body: p(`${NAME}, ${BANK.address}, ${BANK.postal}. ${cf(BANK.licence)}`) },
    { id: 'information', h: 'Information on this website', body: p('We work to keep this website accurate and up to date, but the information is for general guidance only. It is not financial, legal or tax advice, and it is not an offer to provide any product.', 'Products, rates, fees and opening hours can change. The <a href="rates">rates and fees page</a> shows the date its figures took effect. The terms of your own account or loan are the ones in your signed agreement.') },
    { id: 'calculators', h: 'Calculators and estimates', body: p('Our loan calculator and susu planner give estimates based on the figures you enter and an example interest rate. They are not a loan offer and do not include every fee. Before you sign anything, we tell you the rate, all fees and the total you will repay, in writing.') },
    { id: 'forms', h: 'Online forms and applications', body: `${p('When you send a form on this website:')}${ul([
      'It is a request for us to contact you. It is not an application, and it does not commit you or us to anything.',
      'We will call you, usually within one working day<span data-confirm></span>, using the details you give.',
      'To open an account or take out a loan, you must visit a branch so that we can check your Ghana Card and documents, as Bank of Ghana rules require.',
      'Please give accurate information, and do not include your PIN, password or full account number.',
    ])}` },
    { id: 'your-use', h: 'Using the website responsibly', body: `${p('You agree not to:')}${ul([
      'Use the website for anything unlawful or fraudulent, or pretend to be someone else.',
      'Try to gain unauthorised access to the website, our systems or other people\'s information.',
      'Introduce viruses or other harmful code, or overload the website with automated requests.',
      'Copy the website\'s content for commercial use without our written permission.',
    ])}` },
    { id: 'security', h: 'Security and fraud', body: p(`We will never ask for your PIN, password or one-time codes through this website or by phone, SMS, WhatsApp or email. If you receive a message claiming to be from us that asks for these, do not reply. Call us on ${phone} and see <a href="security">banking safely</a>.`) },
    { id: 'digital', h: 'U-Connect and mobile money', body: p('U-Connect and our mobile money services are covered by their own terms, which you accept when you register. Download U-Connect only from the official App Store or Google Play, using the links on this website.') },
    { id: 'ip', h: 'Our name, logo and content', body: p(`The ${esc(BANK.short)} name, logo and the content of this website belong to the bank or are used with permission. You may link to our pages and share them for personal, non-commercial use. You may not use our name or logo in a way that suggests we endorse you, or on any website or message that could mislead people.`) },
    { id: 'links', h: 'Links to other websites', body: p('We link to other websites, such as app stores, Google Maps, WhatsApp, Facebook and news sources, for your convenience. We do not control them and are not responsible for their content or how they use your information. Their own terms and privacy notices apply.') },
    { id: 'availability', h: 'Availability', body: p('We try to keep the website available at all times, but we cannot promise that it will always be available or free of errors. We may suspend it for maintenance or security reasons without notice.') },
    { id: 'liability', h: 'Our responsibility to you', body: p('To the extent the law allows, we are not responsible for any loss caused by relying on general information on this website, by the website being unavailable, or by events outside our reasonable control.', 'Nothing in these terms limits any responsibility that cannot be limited under the laws of Ghana, or your rights under the agreement for any product you hold with us.') },
    { id: 'privacy', h: 'Your privacy', body: p('Our <a href="privacy">privacy notice</a> explains how we use personal information you give us through this website, and our <a href="cookies">cookies page</a> explains what is stored on your device.') },
    { id: 'changes', h: 'Changes to these terms', body: p('We may update these terms from time to time. The date at the top shows when they last changed. Using the website after a change means you accept the updated terms.') },
    { id: 'law', h: 'Governing law', body: p('These terms are governed by the laws of the Republic of Ghana, and the courts of Ghana have jurisdiction over any dispute about them.') },
  ],
})

/* ================= COOKIES ================= */
doc({
  file: 'cookies', title: 'Cookies and local storage', eb: 'Legal',
  description: 'This website uses no advertising or tracking cookies. Here is exactly what it stores on your device, and how to remove it.',
  intro: 'This website does not use advertising, tracking or analytics cookies. Here is exactly what it stores on your device, and how to remove it.',
  summary: [
    'No advertising, tracking or analytics cookies, and no third-party scripts.',
    'Our fonts and images are served from our own website, not from other companies.',
    'Your browser stores at most two small settings, and they never leave your device.',
    'If we ever add analytics, we will ask for your consent first.',
  ],
  sections: [
    { id: 'what-are-cookies', h: 'What cookies and local storage are', body: p('Cookies are small text files a website saves on your device. Local storage is a similar feature of your browser that lets a website remember a setting. Some are needed for a site to work; others track what you do across websites to show you advertising.', 'This website uses no cookies at all. It uses local storage only for the two settings described below.') },
    { id: 'what-we-store', h: 'What we store', body: `${tbl(['Name', 'Type', 'What it does', 'How long'], [
      ['<code>bank5-notice-[id]</code>', 'Local storage', 'Remembers that you closed a site notice, so it does not appear again.', 'Until you clear it'],
      ['<code>bank5-review</code>', 'Local storage', 'Used by bank staff only. Remembers review mode, which highlights figures waiting for approval. It is only set if you open a page with <code>?review=1</code>.', 'Until you clear it or open a page with <code>?review=0</code>'],
    ])}${p('Neither setting contains personal information, and neither is ever sent to us or to anyone else.')}` },
    { id: 'third-parties', h: 'Other companies', body: `${p('We do not embed content from other companies, so no other company can set cookies while you are on this website. Our fonts and images are stored on our own server.')}${p('Some links take you to other services. Once you are there, their cookies and privacy notices apply:')}${ul(['Google Maps, for branch directions', 'WhatsApp and Facebook, if you contact us or share a page', 'The App Store and Google Play, to download U-Connect'])}` },
    { id: 'forms', h: 'Forms on this website', body: p('When you fill in a form, what you type stays in your browser until you send it. We do not save half-finished forms. Read the <a href="privacy">privacy notice</a> to see how we use the details you send us.') },
    { id: 'manage', h: 'How to remove what is stored', body: `${p('You can remove our settings at any time by clearing this website\'s data in your browser:')}${ul([
      '<strong>Chrome (Android and computer):</strong> Settings, Privacy and security, Site settings, View permissions and data stored across sites.',
      '<strong>Safari (iPhone):</strong> Settings, Safari, Advanced, Website Data.',
      '<strong>Firefox:</strong> Settings, Privacy and Security, Cookies and Site Data, Manage Data.',
    ])}${p('The website works the same with or without these settings. A dismissed notice may simply appear again.')}` },
    { id: 'analytics', h: 'If we add analytics', body: p('If we decide to measure how people use the website, we will update this page first and ask for your consent with a clear choice to say no. We will not use analytics to build advertising profiles.') },
    { id: 'contact', h: 'Questions', body: p(`Email ${mail} or call ${phone}.`) },
  ],
})

/* ================= COMPLAINTS ================= */
const complaintForm = `<form class="form-card grid gap-4" id="complaint-form" data-form="complaint" novalidate>
  <div class="grid gap-4 sm:grid-cols-2">
    <label class="field"><span>Full name <span class="req">Required</span></span><input class="input" name="name" required autocomplete="name"></label>
    <label class="field"><span>Phone number <span class="req">Required</span></span><input class="input" type="tel" name="phone" required autocomplete="tel" inputmode="tel" placeholder="024 000 0000"></label>
    <label class="field"><span>Email <span class="opt">(optional)</span></span><input class="input" type="email" name="email" autocomplete="email"></label>
    <label class="field"><span>Your branch <span class="opt">(optional)</span></span><select class="input" name="branch">${branchOptions()}</select></label>
    <label class="field"><span>What is it about? <span class="req">Required</span></span><select class="input" name="type" required><option value="">Choose one</option><option>Service at a branch</option><option>A transaction or charge</option><option>A loan or overdraft</option><option>Susu collection</option><option>U-Connect or mobile money</option><option>Insurance</option><option>How my information was used</option><option>Fraud or a suspicious contact</option><option>Something else</option></select></label>
    <label class="field"><span>When did it happen? <span class="opt">(optional)</span></span><input class="input" type="date" name="when"></label>
    <label class="field"><span>Last 4 digits of your account <span class="opt">(optional)</span></span><input class="input" name="acct" inputmode="numeric" maxlength="4" placeholder="e.g. 4821" data-hint="acct-hint" aria-describedby="acct-hint"><span class="hint" id="acct-hint">Never send your full account number, PIN or password.</span></label>
    <label class="field"><span>How should we contact you?</span><select class="input" name="contact"><option>Phone call</option><option>WhatsApp</option><option>Email</option><option>Letter</option></select></label>
  </div>
  <label class="field"><span>What happened? <span class="req">Required</span></span><textarea class="input" name="message" required placeholder="Tell us what happened, who you dealt with, and any amounts or references."></textarea></label>
  <label class="field"><span>How would you like us to put it right? <span class="opt">(optional)</span></span><textarea class="input !min-h-[90px]" name="outcome"></textarea></label>
  <div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
  <label class="check"><input type="checkbox" name="consent" required data-msg="Please agree so that we can investigate and reply."><span class="text-[.95rem]">I agree that ${esc(BANK.short)} may use these details to investigate my complaint and reply to me, as set out in the <a class="prose-link" href="privacy">privacy notice</a>.</span></label>
  <button class="btn btn-brand justify-self-start" type="submit"><span>Send my complaint</span>${ic.send}</button>
</form>
<div class="success" data-form-ok="complaint-form" hidden role="status"><p class="flex items-center gap-2 font-display text-[1.3rem] font-bold text-deep"><span class="block size-6 text-brand">${ic.check}</span>Complaint received</p><p class="mt-2">Thank you for telling us. Your reference is <strong data-ref></strong>. Keep it safe: you will need it if you follow up.</p><p class="mt-2">We will acknowledge your complaint within 24 hours on working days<span data-confirm></span>, with the name of the person handling it.</p></div>`

const STEPS = [
  ['clock', 'Straight away', 'You tell us', `In a branch, by phone, by WhatsApp, by email, by letter or with the form below. You get a reference number immediately.`],
  ['check', 'Within 24 hours', 'We acknowledge it', 'On working days, with the name of the person who is handling your complaint and how to reach them.'],
  ['doc', 'Within 10 working days', 'We investigate and reply', 'We look at the records, talk to the staff involved and reply in writing with what we found and what we will do. If we need longer, we tell you why and when to expect an answer.'],
  ['scale', 'If you disagree', 'Internal review', 'Ask for your complaint to be reviewed by the Head of Risk and Compliance at the head office, who was not involved in the first decision.'],
  ['building', 'Still not resolved', 'Outside the bank', 'You can take your complaint to the Bank of Ghana. For complaints about personal information, you can also go to the Data Protection Commission.'],
]

page({ file: 'complaints', title: `Complaints | ${NAME}`, description: 'How to complain, what to include, how long each step takes, and where to go if you are not satisfied with our answer.', current: 'help', kind: 'Help', body: `
${titleBand({ title: 'We want to put it right', eb: 'Complaints', trail: [['Contact us', 'contact'], ['Complaints']], intro: 'If something has gone wrong, tell us. Every complaint gets a reference number, a named person and a clear timetable, and complaining never affects your accounts.', aside: `<div class="flex flex-wrap gap-2" data-confirm><span class="chip !cursor-default">${ic.check}<span>Reference straight away</span></span><span class="chip !cursor-default">${ic.clock}<span>Acknowledged within 24 hours</span></span><span class="chip !cursor-default">${ic.doc}<span>Answer within 10 working days</span></span></div><div class="mt-6 flex flex-wrap gap-3">${btn('Make a complaint', '#complaint')}${btn(`Call ${BANK.phone}`, tel(BANK.phone), 'btn-line', ic.phone)}</div>` })}

<section class="sec !pt-10"><div class="wrap">
  ${head('Ways to complain', 'Choose whatever is <em class="serif text-brand">easiest for you</em>')}
  <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">${[
    ['building', 'At any branch', 'Ask for the branch manager. They can write the complaint down for you.', 'branches', 'Find a branch'],
    ['phone', 'Call the hotline', `${BANK.phone}, Monday to Friday during banking hours.`, tel(BANK.phone), 'Call now'],
    ['wa', 'WhatsApp', `Message ${val(BANK.whatsapp)} and we will reply in working hours.`, wa(val(BANK.whatsapp)), 'Open WhatsApp'],
    ['mail', 'Email or letter', `${BANK.email}, or write to Customer Service, ${BANK.postal}.`, 'mailto:' + BANK.email, 'Send an email'],
    ['send', 'Online form', 'Use the form below, any time of day.', '#complaint', 'Go to the form'],
  ].map(([i, t, d, h, l], k) => `<a class="card p-6" href="${h}" data-reveal style="--d:${k * 60}ms"><span class="card-ic">${ic[i]}</span><span class="h-sm mt-6 block">${t}</span><span class="mt-2 block flex-1 text-[.93rem] text-muted [overflow-wrap:anywhere]">${d}</span><span class="mt-5 inline-flex items-center gap-1.5 text-[.9rem] font-semibold text-brand-2">${l}<span class="block size-4">${ic.arrow}</span></span></a>`).join('')}</div>
</div></section>

<section class="pb-[clamp(72px,9vw,128px)]"><div class="wrap">
  <div class="rounded-[clamp(28px,4vw,44px)] bg-white p-[clamp(24px,5vw,64px)] shadow-[0_0_0_1px_var(--color-line)]">
    ${head('What happens next', 'A clear timetable, <em class="serif text-brand">every time</em>', 'You will always know who is handling your complaint and when to expect an answer.')}
    <ol class="ctl mt-12" data-confirm>${STEPS.map(([i, when, t, d], k) => `<li data-reveal style="--d:${k * 80}ms"><span class="ctl-dot">${ic[i]}</span><p class="text-[.75rem] font-semibold uppercase tracking-[.14em] text-brand-2">${when}</p><h3 class="h-sm mt-1.5">${t}</h3><p class="mt-2 text-[.95rem] text-muted">${d}</p></li>`).join('')}</ol>
  </div>
</div></section>

<section class="pb-[clamp(72px,9vw,128px)]" id="complaint"><div class="wrap grid gap-12 lg:grid-cols-[1fr_1.45fr]">
  <div class="grid content-start gap-5">
    <div><p class="eyebrow">Complaint form</p><h2 class="h-lg mt-5">Tell us what happened</h2><p class="lede mt-4 text-muted">The more detail you give, the faster we can sort it out.</p></div>
    <div class="form-card"><h3 class="h-sm">Helpful to include</h3><ul class="ticks mt-4 text-[.95rem]">${['What happened, and when', 'The branch or staff member involved, if you know', 'Any amounts, dates and transaction references', 'Copies of receipts or messages, which you can bring to a branch', 'What you would like us to do'].map((t) => `<li>${ic.check}<span>${t}</span></li>`).join('')}</ul></div>
    <div class="form-card"><h3 class="h-sm">Need help to complain?</h3><p class="mt-2 text-[.95rem] text-muted">Staff at any branch can write your complaint down for you, in English, Dangme, Twi or Ga<span data-confirm></span>. Someone you trust can also complain on your behalf, with your written permission.</p></div>
    <p class="callout callout-danger">${ic.alert}<span><strong>Fraud or a lost phone?</strong> Do not wait for the form. Call ${BANK.phone} straight away so that we can protect your account.</span></p>
  </div>
  <div>${complaintForm}</div>
</div></section>

<section class="pb-[clamp(72px,9vw,128px)]"><div class="wrap grid gap-12 lg:grid-cols-[1fr_1.45fr]">
  ${head('Questions', 'About complaining')}
  <div class="grid gap-3">${[
    ['Will complaining affect my account or loan?', 'No. Complaining never affects your accounts, your loan applications or how our staff treat you.'],
    ['Does it cost anything?', 'No. Making a complaint and having it reviewed is free.<span data-confirm></span>'],
    ['Can I complain about something that happened a while ago?', 'Yes. It helps to tell us as soon as you can, because records are easier to check, but we will look at any complaint.'],
    ['Can I stay anonymous?', 'You can, and we will still look into it, but we cannot reply to you or put things right for you without your contact details.'],
    ['What if I am unhappy with the final answer?', 'Ask for an internal review by the Head of Risk and Compliance. If you are still not satisfied, you can take your complaint to the Bank of Ghana, or to the Data Protection Commission if it concerns your personal information.<span data-confirm></span>'],
    ['Can I compliment a member of staff?', 'Please do. Use the form above or write to the Managing Director through <a class="prose-link" href="md-direct">MD Direct</a>.'],
  ].map(([q, a]) => `<details class="acc"><summary>${q}<span class="acc-ic">${ic.plus}</span></summary><div class="acc-body text-body">${a}</div></details>`).join('')}</div>
</div></section>
` })
