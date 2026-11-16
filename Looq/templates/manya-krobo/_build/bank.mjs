// Every fact about the bank lives here. To build a site for another bank, copy this template and rewrite this file.
// Values set to null show "Ask us" on the site. Anything wrapped in confirm() is highlighted in review mode (?review=1)
// until the bank signs it off. Search for "confirm(" to find everything that still needs checking.

export const confirm = (v) => ({ v, confirm: true })

export const BANK = {
  name: 'Manya Krobo Rural Bank PLC',
  short: 'Manya Krobo Rural Bank',
  abbr: 'MKRB',
  ringTop: 'MANYA KROBO RURAL', // text around the logo ring
  tagline: '…your family banking centre',
  founded: 1978,
  // The 45th AGM (29 August 2026) was asked to ratify a change of name. Set show: true once it is final.
  rename: { show: false, to: 'Manya Krobo Community Bank PLC', ringTop: 'MANYA KROBO COMMUNITY', note: 'Same bank, same people, same accounts. Our name changed to meet a Bank of Ghana requirement for rural and community banks. You do not need to do anything.' },
  domain: 'manyakroboruralbank.com',
  email: 'info@manyakroboruralbank.com',
  phone: '+233 50 822 2743', // hotline, as printed on the site
  phoneAlt: '+233 20 996 9302', // head office line given in the dormant accounts notice
  whatsapp: confirm('+233 50 822 2743'),
  postal: 'P.O. Box 176, Odumase-Krobo',
  gps: 'EL-0028-1828',
  address: 'Head Office, Abanse, Odumase-Krobo, Eastern Region',
  licence: confirm('Licensed by the Bank of Ghana as a rural and community bank. A member of the ARB Apex Bank network.'),
  social: { facebook: 'https://web.facebook.com/manyakroboruralbankplc', linkedin: confirm('https://www.linkedin.com/company/104266931/'), x: null },
  app: { name: 'U-Connect', ios: confirm('https://apps.apple.com/'), android: confirm('https://play.google.com/store/'), ussd: confirm(null) },
  secretary: 'Ignatius Kutu Acheampong & Associates PRUC',
  // Opening hours for every branch unless a branch overrides them. From the Ashale Botwe and Zenu opening notices.
  hours: confirm({ weekdays: ['08:30', '16:00'], saturday: null }),
}

export const KEY_FACTS = [
  ['Since 1978', 'Founded by the Krobo Women Association at Abanse'],
  ['5th', 'Rural bank to be licensed in Ghana'],
  ['12', 'Places to bank: head office, 8 branches and 3 mobilisation centres'],
  ['Ghana Club 100', 'Ranked 31st in 2016 and listed again in 2018'],
]

export const MISSION = 'To offer high quality financial services to the communities in an efficient and competitive manner, through a value-oriented workforce dedicated to enhancing shareholder value.'
export const VISION = 'To grow the bank to be a first-class financial service provider, dedicated to protecting the interests of all our stakeholders.'

export const HISTORY = [
  ['1978', 'A bank started by women', 'The Krobo Women Association founds the bank at Abanse, in the Manya Krobo district of the Eastern Region, as a community bank for local farmers, traders and families. It is the fifth rural bank licensed in Ghana.'],
  ['1998', 'Best managed rural bank', 'The bank is named the best managed rural bank in Ghana.'],
  ['2001', 'Into the Ghana Club 100', 'The bank joins the Ghana Club 100, the grouping of the country\'s best performing companies.'],
  ['2016', 'Number 31 in Ghana', 'The bank climbs from 58th to 31st in the Ghana Club 100, and is the top rural bank in the Eastern Region. It also becomes an MTN Mobile Money super merchant.'],
  ['2018', 'Forty years', 'The bank marks 40 years with 11 branches, a health screening for 400 people, equipment for five CHPS compounds and a grand durbar at Abanse.'],
  ['Today', 'Your family banking centre', 'Eight branches and three mobilisation centres across the Krobo area and Greater Accra, the U-Connect mobile app, and scholarships for tertiary students every year.'],
]

// Branch network. type: branch | head | centre. region groups the finder. Phones as published on the site.
export const BRANCHES = [
  { slug: 'head-office', name: 'Head Office', town: 'Odumase-Krobo', region: 'krobo', type: 'head', where: '176 Odumase-Krobo, Abanse', phone: '+233 50 822 2743', gps: 'EL-0028-1828', img: 'head-office.jpg', note: 'Our head office and the home of the bank since 1978.' },
  { slug: 'abanse', name: 'Abanse Branch', town: 'Odumase-Krobo', region: 'krobo', type: 'branch', where: 'Abanse, Odumase-Krobo', phone: '+233 54 388 0511', gps: confirm(null) },
  { slug: 'somanya', name: 'Somanya Branch', town: 'Somanya', region: 'krobo', type: 'branch', where: 'Near the traffic light, Somanya', phone: '+233 20 517 8133', gps: confirm(null) },
  { slug: 'kpong', name: 'Kpong Branch', town: 'Kpong', region: 'krobo', type: 'branch', where: 'Opposite the main lorry station, Kpong', phone: '+233 20 491 2071', gps: confirm(null) },
  { slug: 'akuse', name: 'Akuse Branch', town: 'Akuse', region: 'krobo', type: 'branch', where: 'Near the VRA Club House, Akuse', phone: '+233 24 314 2877', gps: confirm(null) },
  { slug: 'agormanya', name: 'Agormanya Market Mobilisation Centre', town: 'Agormanya', region: 'krobo', type: 'centre', where: 'Inside the Agormanya Market', phone: null, gps: confirm(null) },
  { slug: 'madina', name: 'Madina Branch', town: 'Madina', region: 'accra', type: 'branch', where: 'Hannah Street, off Melcom Road, Madina', phone: '+233 54 504 8398', gps: confirm(null) },
  { slug: 'ashiyie', name: 'Ashiyie Branch', town: 'Ashiyie', region: 'accra', type: 'branch', where: 'Near Superior Oil Filling Station, Ashiyie', phone: '+233 26 320 4889', gps: confirm(null) },
  { slug: 'ashale-botwe', name: 'Ashale Botwe Branch', town: 'Ashale Botwe', region: 'accra', type: 'branch', where: 'Abudankade Junction, off the Riss Junction to School Junction road, Ashale Botwe', phone: '+233 54 978 3361', gps: confirm(null), serves: 'Ashale Botwe, Nanakrom, Ogbodjo, Adjiringanor, Adenta, Madina and School Junction' },
  { slug: 'ashaiman', name: 'Ashaiman Branch', town: 'Ashaiman', region: 'accra', type: 'branch', where: 'Opposite the Kaketo Junction, Ashaiman', phone: '+233 24 582 0281', gps: confirm(null) },
  { slug: 'kakasunaka', name: 'Kakasunaka No.1 Mobilisation Centre', town: 'Kakasunaka No.1', region: 'accra', type: 'centre', where: 'Next to the Kakasunaka No.1 main lorry park, off the Tema–Akosombo Highway', phone: null, gps: confirm(null), serves: 'Kakasunaka No.1 and No.2, Gbetsile, Sebrepor, Michel Camp, Gulf City, Mataheko and Afiaya', parent: 'ashaiman' },
  { slug: 'zenu', name: 'Zenu Mobilisation Centre', town: 'Zenu, Ashaiman', region: 'accra', type: 'centre', where: 'In front of the Zenu Market, off the Lebanon–Atadeka road', phone: '+233 50 571 3609', gps: confirm(null), serves: 'Zenu, Lebanon and Atadeka' },
]
export const REGIONS = { krobo: 'Krobo area, Eastern Region', accra: 'Greater Accra' }

export const BOARD = [
  ['Patrick Amanor Buckor', 'Chairman', 'board-patrick-buckor.jpg'],
  ['Richard Azina Nartey', 'Vice Chairman', 'board-richard-azina-nartey.jpg'],
  ['Barbara Okai-Tettey', 'Director', 'board-barbara-okai-tettey.jpg'],
  ['Dr. Padikor Madjitey', 'Director', 'board-padikor-madjitey.jpg'],
  ['Augustus Djabatey', 'Director', 'board-augustus-djabatey.jpg'],
  ['Emmanuel Ofosu', 'Director', 'board-emmanuel-ofosu.jpg'],
  ['Edward Nartey Tetteh', 'Director', 'board-edward-nartey-tetteh.jpg'],
]
export const MANAGEMENT = [
  ['Godfred Asante Hanson', 'Chief Executive Officer', 'mgt-godfred-asante-hanson.jpg'],
  ['Ebenezer Akumatey', 'Deputy Chief Executive Officer', 'mgt-ebenezer-akumatey.jpg'],
  ['Philip Tetteh', 'Head, Credit', 'mgt-philip-tetteh.jpg'],
  ['Solomon Godwin Koomson', 'Head, Finance and Administration', 'mgt-solomon-godwin-koomson.jpg'],
  ['Monica Padi', 'Head, Human Resources', 'mgt-monica-padi.jpg'],
  ['Ernest Kpogli', 'Head, Internal Audit', 'mgt-ernest-kpogli.jpg'],
  ['Emile Dor Dautey', 'Head, Risk and Compliance (AMLRO)', 'mgt-emile-dor-dautey.jpg'],
  ['Alvin Omaboe', 'Head, Business Development and Marketing', 'mgt-alvin-omaboe.jpg'],
]

/* ---------- Products ----------
 Every product page uses the same structure: summary, who it is for, benefits, what you need, key facts, how to open, FAQs.
 Facts set to null show "Ask us". Write figures as text, for example '1.5% to 5% a year'.
*/
const IDS = ['Your Ghana Card (required for every account since July 2022)', 'Two recent passport photographs', 'Your GhanaPost GPS address or proof of address']
export const GROUPS = {
  save: { name: 'Save', title: 'Accounts', line: 'Accounts for every pocket, from a daily susu to a full current account', icon: 'piggy', hero: 'gallery-madina-1.jpg' },
  invest: { name: 'Invest', title: 'Invest', line: 'Grow your money, and own a share of your community bank', icon: 'chart', hero: 'agm-43.jpg' },
  insure: { name: 'Insure', title: 'Insurance', line: 'Cover for your car, your home, yourself and your family', icon: 'shield', hero: 'gallery-uconnect.jpg' },
  borrow: { name: 'Borrow', title: 'Loans', line: 'Loans for salaried workers, traders, groups, farmers and families', icon: 'coins', hero: 'salary-loan.jpg' },
}

export const PRODUCTS = [
  // Save
  { slug: 'savings-account', group: 'save', name: 'Savings Account', icon: 'piggy', short: 'Keep your money safe and earn interest on what you save.',
    summary: 'A simple account for putting money aside and earning interest on it. Deposit and withdraw at any of our branches and mobilisation centres.',
    who: 'Anyone 18 or over who wants to save regularly: workers, traders, farmers and families.',
    benefits: ['Earn interest on your balance', 'Bank at any of our 12 locations, because every branch is networked', 'Pay in through U-Connect and MTN Mobile Money', 'Build a record with us that helps when you need a loan'],
    docs: IDS, facts: { 'Opening deposit': null, 'Interest': null, 'Withdrawals': 'Over the counter at any branch', 'Monthly fee': null },
    faq: [['Can I open it for someone else?', 'You can open a joint account with another adult. For a child, see the School Child Account.'], ['Can I use it with mobile money?', 'Yes. You can move money between your account and MTN Mobile Money. Ask at any branch to link them.']] },
  { slug: 'current-account', group: 'save', name: 'Current Account', icon: 'briefcase', short: 'An everyday account with a cheque book, for individuals and businesses.',
    summary: 'For people and businesses who pay and get paid often. Comes with a cheque book, and can be linked to an overdraft.',
    who: 'Salaried workers, business owners, churches, associations and companies.',
    benefits: ['Cheque book for payments', 'Salary and business overdrafts available on request', 'Bank at any branch across the network', 'Statements whenever you need them'],
    docs: [...IDS, 'For businesses: certificate of registration and the Ghana Cards of signatories', 'For associations and churches: constitution and a resolution naming the signatories'], facts: { 'Opening deposit': null, 'Cheque book': null, 'Monthly fee': null, 'Overdraft': 'Available, subject to approval' },
    faq: [['What happens if a cheque bounces?', 'Issuing a cheque without enough money in the account is an offence under section 313(A) of the Criminal Offences Act, 1960 (Act 29), punishable by a fine or up to five years in prison. Always check your balance first.'], ['Can my business get an overdraft?', 'Yes. See Business Overdrafts.']] },
  { slug: 'susu-savings-account', group: 'save', name: 'Susu Savings Account', icon: 'store', short: 'Save a little every day. Our mobile bankers collect it from your stall or home.',
    summary: 'Our susu account brings the bank to you. A mobile banker visits your shop, stall or home on agreed days and collects your contribution, so you save a little every day without leaving your work.',
    who: 'Market women, traders, artisans, drivers and anyone who earns daily.',
    benefits: ['A mobile banker collects at your place of work', 'Save any amount, as often as daily', 'Your money is held in a licensed bank, not with an individual collector', 'A good savings record can help you qualify for a micro loan'],
    docs: IDS, facts: { 'Minimum daily amount': null, 'Collection': 'Daily or on agreed days', 'Withdrawals': null, 'Fees': null },
    faq: [['How do I know my contribution is recorded?', 'Every collection is recorded in your susu card and on your account. Ask for your balance at any branch, or check on U-Connect.'], ['Can I get a loan from my susu account?', 'Regular savers can apply for a Micro Loan. Your savings history is part of the assessment.']] },
  { slug: 'school-child-account', group: 'save', name: 'School Child Account', icon: 'school', short: 'Save for your child\'s school fees and teach them to save early.',
    summary: 'An account in your child\'s name, run by you until they are old enough. Use it to put money aside for school fees, uniforms and books, and to teach children the habit of saving.',
    who: 'Parents and guardians saving for a child under 18.',
    benefits: ['An account in the child\'s own name', 'Plan ahead for each school term', 'Children learn to save from an early age', 'Pairs well with a School Fees Loan when the term starts'],
    docs: ['The child\'s birth certificate', 'The parent or guardian\'s Ghana Card', 'Two passport photographs of the child', 'Two passport photographs of the parent or guardian'], facts: { 'Age': 'Under 18', 'Opening deposit': null, 'Interest': null, 'Withdrawals': 'By the parent or guardian' },
    faq: [['What happens when my child turns 18?', 'The account can be converted to a Savings Account in their own name. Bring their Ghana Card to any branch.'], ['Can grandparents pay in?', 'Yes. Anyone can deposit into the account at a branch.']] },
  { slug: 'sikatso-account', group: 'save', also: 'invest', name: 'Sikatso Account', icon: 'tree', short: 'A savings and investment account for money you plan to leave to grow.',
    summary: confirm('Sikatso is our savings and investment account for money you can leave untouched for longer. You agree a period with us and earn a better return than on a regular savings account.'),
    who: 'Customers saving towards a big goal: a building project, a business, retirement or a family event.',
    benefits: confirm(['A higher return than a regular savings account', 'Choose how long to save for', 'Withdraw at the end of the agreed period', 'Can be used as security for a loan']),
    docs: IDS, facts: { 'Minimum amount': null, 'Period': null, 'Return': null, 'Early withdrawal': null },
    faq: [['What does Sikatso mean?', confirm('Ask any branch about the name and its history.')], ['Can I add to it?', confirm('Ask at a branch about topping up during the agreed period.')]] },
  // Invest
  { slug: 'shares', group: 'invest', name: 'Shares', icon: 'chart', short: 'Own part of the bank and share in its profits.',
    summary: 'Manya Krobo Rural Bank is owned by its shareholders, most of them people from the communities we serve. Buy shares to become an owner, vote at the Annual General Meeting and receive dividends when they are declared.',
    who: 'Customers, families and organisations who want to invest in their community bank.',
    benefits: ['Receive dividends when declared at the AGM, subject to Bank of Ghana approval', 'Vote at the Annual General Meeting', 'Invest in your own community', 'Annual reports and financial statements published every year'],
    docs: [...IDS, 'An account with the bank to receive dividends'], facts: { 'Share price': null, 'Minimum purchase': null, 'Last dividend': null, 'Next AGM': 'Announced on our news page' },
    faq: [['How do I buy shares?', 'Visit any branch with your Ghana Card. Staff will take you through the share application form.'], ['Where can I read the latest results?', 'Annual reports and financial statements are on the Reports page.']] },
  // Insure
  { slug: 'motor-insurance', group: 'insure', name: 'Motor Insurance', icon: 'car', short: 'Third party and comprehensive cover for cars, taxis, trotros and trucks.',
    summary: 'Insure your private or commercial vehicle through your bank. Pay premiums from your account and get help with claims at your branch.',
    who: 'Car owners, taxi and trotro operators, and businesses with vehicles.',
    benefits: ['Third party and comprehensive cover', 'Pay premiums from your account', 'Help with claims at your branch', 'Pairs with our Auto and Vehicle Loans'],
    docs: ['Your Ghana Card', 'Vehicle registration documents', 'Your current insurance sticker, if renewing'], facts: { 'Insurer': confirm(null), 'Cover': 'Third party, third party fire and theft, comprehensive', 'Premium': null, 'Claims': 'Start at any branch' },
    faq: [['Who provides the cover?', confirm('Insurance is provided by our partner insurer and sold by the bank as an agent. Ask at a branch for the policy documents.')]] },
  { slug: 'fire-insurance', group: 'insure', name: 'Fire Insurance', icon: 'fire', short: 'Protect your home, shop or warehouse against fire.',
    summary: 'Cover for buildings and their contents against fire and related damage. For homes, shops, stores and warehouses.',
    who: 'Home owners, landlords, traders and businesses with stock.',
    benefits: ['Cover for the building, its contents or both', 'Protect business stock', 'Pay premiums from your account', 'Help with claims at your branch'],
    docs: ['Your Ghana Card', 'Details and value of the property and contents'], facts: { 'Insurer': confirm(null), 'Cover': 'Building and contents', 'Premium': null, 'Claims': 'Start at any branch' },
    faq: [['Does it cover market stalls?', confirm('Ask at a branch. Cover depends on the property and the insurer\'s terms.')]] },
  { slug: 'personal-accident-insurance', group: 'insure', name: 'Personal Accident Insurance', icon: 'heart', short: 'A payout if an accident injures you or stops you working.',
    summary: 'Pays out if you are injured, disabled or killed in an accident, so you and your family are not left without income.',
    who: 'Workers, drivers, artisans and anyone whose income depends on their health.',
    benefits: ['Cover for accidental death and disability', 'Medical expenses after an accident', 'Low premiums', 'Pay from your account'],
    docs: ['Your Ghana Card', 'Details of the people you want to benefit'], facts: { 'Insurer': confirm(null), 'Cover': null, 'Premium': null, 'Claims': 'Start at any branch' },
    faq: [] },
  { slug: 'funeral-insurance', group: 'insure', name: 'Farewell and Funeral Insurance', icon: 'dove', short: 'Help with funeral costs, so your family can say goodbye with dignity.',
    summary: 'Pays a lump sum to your family when a covered person dies, to help with funeral costs at a difficult time.',
    who: 'Families who want to plan ahead for funeral costs.',
    benefits: ['A lump sum paid to your family', 'Cover for yourself and your relatives', 'Small, regular premiums from your account', 'Quick payment to help with arrangements'],
    docs: ['Your Ghana Card', 'Names and ages of the relatives you want to cover'], facts: { 'Insurer': confirm(null), 'Cover': null, 'Premium': null, 'Waiting period': null },
    faq: [] },
  // Borrow
  { slug: 'salary-loans', group: 'borrow', name: 'Salary Loans', icon: 'wallet', short: 'Loans of up to 60 months for staff of GES, GHS, VRA, VREL and Golden Exotics.', img: 'salary-loan.jpg', calc: { min: 1000, max: 100000, months: 60 },
    summary: 'If your salary is paid into Manya Krobo Rural Bank, you can borrow and repay over up to 60 months, so repayments take only a small part of your take-home pay.',
    who: 'Staff of the Ghana Education Service (GES), Ghana Health Service (GHS), Golden Exotics, VRA and VREL who take their salary at the bank.',
    benefits: ['Repay over up to 60 months', 'Borrow more than you could before', 'Top up: settle your current loan with a new one once you have repaid at least half of its term', 'You can still use a salary overdraft', 'Small monthly repayments that leave more of your take-home pay'],
    docs: ['Your Ghana Card', 'Your last three payslips', 'Your staff ID', 'Your salary must be paid into an account with us'], facts: { 'Repayment period': 'Up to 60 months', 'Amount': null, 'Interest': null, 'Processing fee': null },
    faq: [['My salary is paid elsewhere. Can I apply?', 'Move your salary to Manya Krobo Rural Bank first. Staff at any branch can help you with the transfer letter.'], ['Can I take a new loan before this one ends?', 'Yes, once you have repaid at least half of the loan term, you can settle it with a new, larger loan.']] },
  { slug: 'personal-loans', group: 'borrow', name: 'Personal Loans', icon: 'user', short: 'For rent, building, emergencies, and the plans that cannot wait.', calc: { min: 500, max: 50000, months: 24 },
    summary: 'A loan for personal needs: rent advance, building materials, medical bills, a wedding or a family emergency.',
    who: 'Salaried workers and self-employed customers with a regular income.',
    benefits: ['Use it for what matters to you', 'Repay in fixed monthly instalments', 'Quick decisions for existing customers', 'Repay from your account automatically'],
    docs: ['Your Ghana Card', 'Proof of income: payslips or six months of bank statements', 'A guarantor, if required'], facts: { 'Amount': null, 'Repayment period': null, 'Interest': null, 'Processing fee': null },
    faq: [] },
  { slug: 'business-loans', group: 'borrow', name: 'Business Loans', icon: 'store', short: 'Working capital and equipment for small and growing businesses.', calc: { min: 2000, max: 200000, months: 36 },
    summary: 'Finance to grow your business: buy stock, equipment or a vehicle, or bridge the gap while customers pay you.',
    who: 'Registered businesses, traders, farmers, fish mongers and manufacturers.',
    benefits: ['Working capital and asset finance', 'Repayments that match your cash flow', 'Support from a relationship officer', 'Pair with a Business Overdraft for day-to-day needs'],
    docs: ['Ghana Cards of the owners or directors', 'Business registration documents', 'Six months of bank statements', 'Collateral or a guarantor, depending on the amount'], facts: { 'Amount': null, 'Repayment period': null, 'Interest': null, 'Collateral': 'Depends on the amount' },
    faq: [] },
  { slug: 'micro-loans', group: 'borrow', name: 'Micro Loans', icon: 'coins', short: 'Small loans for traders and susu savers to grow their trade.', calc: { min: 200, max: 10000, months: 12 },
    summary: 'Small, short loans for market traders and micro businesses. Your susu savings record helps you qualify, and repayments can be collected by our mobile bankers.',
    who: 'Market traders, artisans and susu savers, many of them women.',
    benefits: ['Small amounts for real trading needs', 'Your susu record counts', 'Repayments collected at your stall', 'Larger loans as you build a track record'],
    docs: ['Your Ghana Card', 'Your susu or savings account history'], facts: { 'Amount': null, 'Repayment period': null, 'Interest': null, 'Repayments': 'Daily or weekly' },
    faq: [] },
  { slug: 'group-loans', group: 'borrow', name: 'Group Loans', icon: 'users', short: 'Loans for trusted groups of traders, farmers and artisans who guarantee each other.', calc: { min: 500, max: 20000, months: 12 },
    summary: 'Members of a group borrow individually but guarantee one another. It is how many of our market women first got credit without collateral.',
    who: 'Groups of traders, farmers, artisans or association members who know and trust each other.',
    benefits: ['No collateral: group members guarantee each other', 'Each member gets their own loan', 'Regular group meetings with a loan officer', 'Repeat loans for groups that repay well'],
    docs: ['Ghana Cards of all members', 'Group constitution or list of members', 'Each member\'s savings account with the bank'], facts: { 'Group size': null, 'Amount per member': null, 'Interest': null, 'Repayments': 'Weekly or monthly' },
    faq: [] },
  { slug: 'auto-loans', group: 'borrow', name: 'Auto and Vehicle Loans', icon: 'car', short: 'Buy a car, taxi, trotro or truck and pay over time.', calc: { min: 10000, max: 300000, months: 48 },
    summary: 'Finance for private cars and commercial vehicles, including taxis, trotros and trucks that earn an income.',
    who: 'Salaried workers buying a car, and drivers or businesses buying a commercial vehicle.',
    benefits: ['Finance for new and used vehicles', 'Commercial vehicles can repay from their earnings', 'Add Motor Insurance from the bank', 'Fixed monthly repayments'],
    docs: ['Your Ghana Card', 'A pro forma invoice for the vehicle', 'Proof of income', 'An equity contribution, if required'], facts: { 'Amount': null, 'Repayment period': null, 'Interest': null, 'Your contribution': null },
    faq: [] },
  { slug: 'school-fees-loans', group: 'borrow', name: 'School Fees Loans', icon: 'school', short: 'Pay school fees on time and spread the cost over the term.', calc: { min: 300, max: 20000, months: 6 },
    summary: 'Pay school, university or training fees when they are due, then repay over the term.',
    who: 'Parents, guardians and students with a regular income.',
    benefits: ['Fees paid on time, every term', 'Repay over the school term', 'Can be paid straight to the school', 'Pair with a School Child Account to save for next term'],
    docs: ['Your Ghana Card', 'The school\'s fee schedule or admission letter', 'Proof of income'], facts: { 'Amount': null, 'Repayment period': null, 'Interest': null, 'Paid to': 'You or the school' },
    faq: [] },
  { slug: 'christmas-easter-loans', group: 'borrow', name: 'Christmas and Easter Loans', icon: 'gift', seasonal: confirm('Available before Christmas and Easter. Ask at any branch for this year\'s dates.'), short: 'Short loans for the festive season, repaid in the months after.', calc: { min: 300, max: 10000, months: 6 },
    summary: 'A short-term loan for festive costs: stock for the busy season, travel home, gifts and celebrations.',
    who: 'Salaried workers and traders preparing for the festive season.',
    benefits: ['Money ready before the holidays', 'Traders can stock up for the busy season', 'Short repayment period', 'Quick decisions for existing customers'],
    docs: ['Your Ghana Card', 'Proof of income'], facts: { 'Amount': null, 'Repayment period': null, 'Interest': null, 'When': 'Before Christmas and Easter' },
    faq: [] },
  { slug: 'business-overdrafts', group: 'borrow', name: 'Business Overdrafts', icon: 'briefcase', short: 'Draw beyond your balance when your business needs it.',
    summary: 'An agreed limit on your business current account, so you can pay suppliers and staff even when customers pay late. You pay interest only on what you use.',
    who: 'Businesses with a current account and regular turnover.',
    benefits: ['Pay interest only on what you use', 'Money there when cash flow is tight', 'Renew each year', 'Works with your cheque book'],
    docs: ['Business registration documents', 'Ghana Cards of the directors', 'Six months of bank statements'], facts: { 'Limit': null, 'Interest': null, 'Renewal': 'Yearly', 'Fees': null },
    faq: [] },
  { slug: 'salary-overdrafts', group: 'borrow', name: 'Salary Overdrafts', icon: 'wallet', short: 'A short-term limit on your salary account before payday.',
    summary: 'An agreed limit on the account your salary is paid into, for the days before payday. It is cleared when your salary comes in.',
    who: 'Customers whose salary is paid into Manya Krobo Rural Bank.',
    benefits: ['Cash before payday', 'Cleared automatically by your salary', 'Can be used alongside a Salary Loan', 'Interest only on what you use'],
    docs: ['Your Ghana Card', 'Your last three payslips'], facts: { 'Limit': null, 'Interest': null, 'Cleared': 'From your next salary', 'Fees': null },
    faq: [] },
]

// Published rates. value: null shows "Ask any branch". Always set effective when you change a value.
export const RATES = {
  effective: confirm(null), // for example '1 November 2026'
  owner: 'Finance and Administration',
  rows: [
    ['Lending base rate', null, 'The rate our loan prices are built from. Updated monthly.'],
    ['Savings Account interest', null, 'Per year, paid on your balance'],
    ['Call account interest', null, 'Per year, for money you can call on demand'],
    ['Sikatso return', null, 'Per year, depends on the period you choose'],
    ['Salary Loans', null, 'Per year, up to 60 months'],
    ['Personal and business loans', null, 'Per year, depends on the loan'],
  ],
  fees: [
    ['Account opening', null], ['Monthly account maintenance', null], ['Cheque book', null], ['Bank statement', null], ['Loan processing', null], ['Standing order', null],
  ],
}

export const FAQ = [
  ['accounts', 'What do I need to open an account?', 'Your Ghana Card, two passport photographs and your GhanaPost GPS address. Some accounts need more: for a child you also need their birth certificate, and businesses need their registration documents.'],
  ['accounts', 'Can I use my account at any branch?', 'Yes. All our branches and mobilisation centres are networked, so you can deposit and withdraw at any of them.'],
  ['accounts', 'Do I need to update my records with my Ghana Card?', 'Yes. Since July 2022 the Ghana Card is the only identification accepted for banking. If you have not linked yours, visit any branch with your card.'],
  ['accounts', 'My account has been inactive for years. What happens?', 'Under the Banks and Specialised Deposit-Taking Institutions Act, 2016 (Act 930), accounts not used for five years become dormant and are listed in our dormant accounts register, then transferred to the Bank of Ghana. Visit a branch with your Ghana Card to reactivate yours.'],
  ['loans', 'How long does a loan decision take?', null],
  ['loans', 'Do I need collateral?', 'It depends on the loan. Salary Loans are secured by your salary, Group Loans by the group guarantee, and larger business loans may need collateral.'],
  ['loans', 'Can I repay early?', null],
  ['digital', 'What is U-Connect?', 'U-Connect is our mobile banking app. Check your balance, transfer money and pay bills from your phone.'],
  ['digital', 'Can I use MTN Mobile Money with my account?', 'Yes. We are an MTN Mobile Money super merchant. Ask at any branch to link your account and wallet.'],
  ['help', 'How do I make a complaint?', 'Speak to the branch manager, call our hotline or use the complaints form. See the complaints page for how we handle it and how long it takes.'],
  ['help', 'Will the bank ever ask for my PIN?', 'Never. We will never ask for your PIN, password or full card number by phone, SMS, WhatsApp or email. If someone does, it is a fraud. Hang up and call us.'],
]
