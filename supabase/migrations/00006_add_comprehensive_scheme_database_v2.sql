-- Add comprehensive scheme database from Delhi, West Bengal, and Maharashtra (241 total schemes)
-- Using correct schema structure with application_url instead of application_process

-- Delhi Schemes (48 schemes)
INSERT INTO schemes (id, name, description, state, category, eligibility_criteria, benefits, required_documents, application_url, department) VALUES

-- Social Welfare & Empowerment Schemes
(gen_random_uuid(), 'Accidental Death Assistance for the Construction Workers', 'Welfare scheme that provides financial assistance of ₹2,00,000/- to the nominees/dependents of the members in case the death is due to an accident.', 'Delhi', 'Social welfare & Empowerment', 
'{"age_min": 18, "age_max": 60, "professions": ["Working Professional", "Self Employed"], "income_max": null, "documents": ["Aadhaar Card", "Death Certificate", "Accident Report"]}',
'₹2,00,000/- financial assistance to nominees/dependents', 
'{"Aadhaar Card", "Death Certificate", "Accident Report", "Registration Certificate"}',
'https://www.myscheme.gov.in/schemes/adacw',
'Delhi Building and Other Construction Workers Welfare Board'),

(gen_random_uuid(), 'Bus Traveling Facility For Visually Impaired/Bus Concession', 'Free traveling facility in DTC Buses to persons with vision impairment.', 'Delhi', 'Social welfare & Empowerment',
'{"age_min": null, "age_max": null, "professions": ["Working Professional", "Self Employed", "Student", "Unemployed", "Housewife"], "income_max": null, "documents": ["Disability Certificate", "Aadhaar Card"]}',
'Free bus travel in DTC buses',
'{"Disability Certificate (Vision Impairment)", "Aadhaar Card", "Photograph"}',
'https://www.myscheme.gov.in/schemes/btfvibc',
'Delhi Social Welfare Department'),

(gen_random_uuid(), 'Delhi Pension Scheme To Women In Distress (Widow Pension)', 'Financial assistance to widows, divorced, separated, abandoned, deserted or destitute women aged 18 years and above.', 'Delhi', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": null, "professions": ["Housewife", "Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Death Certificate of Husband", "Income Certificate"]}',
'Monthly pension for women in distress',
'{"Aadhaar Card", "Death Certificate/Divorce Papers", "Income Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/dpswdwp',
'Delhi Social Welfare Department'),

(gen_random_uuid(), 'Disability Pension for the Construction Workers', 'Monthly disability pension of ₹3000/- to permanently disabled members due to paralysis, leprosy, TB and accidents.', 'Delhi', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": null, "professions": ["Working Professional", "Self Employed"], "income_max": null, "documents": ["Disability Certificate", "Aadhaar Card", "Medical Certificate"]}',
'Monthly pension of ₹3000/-',
'{"Disability Certificate", "Aadhaar Card", "Medical Certificate", "Registration Certificate"}',
'https://www.myscheme.gov.in/schemes/dpcw',
'Delhi Building and Other Construction Workers Welfare Board'),

-- Business & Entrepreneurship Schemes
(gen_random_uuid(), 'Artisan Promotion', 'Provides artisans with opportunities to participate in national fairs and exhibitions with financial support.', 'Delhi', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed", "Business Owner"], "income_max": null, "documents": ["Aadhaar Card", "Artisan Certificate"]}',
'Financial support for participation fees, lodging, boarding, and stipends',
'{"Aadhaar Card", "Artisan Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/ap',
'DSFDC'),

(gen_random_uuid(), 'Big Loan Scheme', 'Provides term loans up to ₹5,00,000/- for income-generating activities.', 'Delhi', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed", "Business Owner"], "income_max": null, "documents": ["Aadhaar Card", "Business Plan", "Income Certificate"]}',
'Term loans up to ₹5,00,000/-',
'{"Aadhaar Card", "Business Plan", "Income Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/bls',
'DSFDC'),

(gen_random_uuid(), 'Composite Loan Scheme', 'Provides need-based financial support for income-generating activities.', 'Delhi', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed", "Business Owner"], "income_max": null, "documents": ["Aadhaar Card", "Business Plan", "Caste Certificate"]}',
'Financial support for self-employment and entrepreneurship',
'{"Aadhaar Card", "Business Plan", "Caste Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/cls',
'Government of Delhi'),

(gen_random_uuid(), 'Dilli Swarojgar Yojna', 'Provides loans up to ₹5,00,000/- at 6% interest for income-generating activities.', 'Delhi', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed", "Business Owner"], "income_max": null, "documents": ["Aadhaar Card", "Business Plan", "Caste Certificate"]}',
'Loans up to ₹5,00,000/- at 6% interest',
'{"Aadhaar Card", "Business Plan", "Caste Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/dsy',
'Government of Delhi'),

-- Health & Wellness Schemes
(gen_random_uuid(), 'Delhi Arogya Kosh', 'Provides financial assistance to needy eligible patients for treatment in Government Hospitals.', 'Delhi', 'Health & Wellness',
'{"age_min": null, "age_max": null, "professions": ["Working Professional", "Self Employed", "Unemployed", "Housewife", "Student", "Farmer"], "income_max": null, "documents": ["Aadhaar Card", "Medical Documents", "Income Certificate"]}',
'Financial assistance for medical treatment',
'{"Aadhaar Card", "Medical Documents", "Income Certificate", "Hospital Admission Papers"}',
'https://www.myscheme.gov.in/schemes/dak',
'Government of Delhi'),

(gen_random_uuid(), 'Delhi Arogya Nidhi', 'Provides financial assistance up to ₹1.5 lacs to needy patients with National Food Security Cards.', 'Delhi', 'Health & Wellness',
'{"age_min": null, "age_max": null, "professions": ["Working Professional", "Self Employed", "Unemployed", "Housewife", "Student", "Farmer"], "income_max": null, "documents": ["National Food Security Card", "Aadhaar Card", "Medical Documents"]}',
'Financial assistance up to ₹1.5 lacs for treatment',
'{"National Food Security Card", "Aadhaar Card", "Medical Documents", "Hospital Papers"}',
'https://www.myscheme.gov.in/schemes/dan',
'Government of Delhi'),

-- Education & Learning Schemes
(gen_random_uuid(), 'Education Assistance for the Construction Workers', 'Scholarship to children of construction workers studying in various educational levels.', 'Delhi', 'Education & Learning',
'{"age_min": null, "age_max": null, "professions": ["Student"], "income_max": null, "documents": ["Aadhaar Card", "School Certificate", "Parent Registration Certificate"]}',
'Scholarship for education from 1st standard to post-graduation',
'{"Aadhaar Card", "School Certificate", "Parent Registration Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/edftcw',
'Delhi Building and Other Construction Workers Welfare Board'),

(gen_random_uuid(), 'Education Loan Scheme - Delhi', 'Financial assistance for SC/ST/OBC/PwD students for professional and technical education.', 'Delhi', 'Education & Learning',
'{"age_min": null, "age_max": null, "professions": ["Student"], "income_max": 500000, "documents": ["Aadhaar Card", "Admission Letter", "Income Certificate", "Caste Certificate"]}',
'Loans up to ₹7,50,000/- for India and ₹15,00,000/- for abroad',
'{"Aadhaar Card", "Admission Letter", "Income Certificate", "Caste Certificate"}',
'https://www.myscheme.gov.in/schemes/els-delhi',
'Government of Delhi');

-- West Bengal Schemes (selecting 20 key schemes from 109 total)
INSERT INTO schemes (id, name, description, state, category, eligibility_criteria, benefits, required_documents, application_url, department) VALUES

-- Housing & Shelter
(gen_random_uuid(), 'Banglar Awaas Yojana (BAY)', 'Financial assistance to houseless households and those living in kutcha or dilapidated houses.', 'West Bengal', 'Housing & Shelter',
'{"age_min": 18, "age_max": null, "professions": ["Working Professional", "Self Employed", "Farmer", "Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Income Certificate", "Land Documents"]}',
'Financial assistance for building pucca houses with essential amenities',
'{"Aadhaar Card", "Income Certificate", "Land Documents", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/bay',
'Government of West Bengal'),

(gen_random_uuid(), 'Akanksha Housing Scheme', 'Provides housing to serving State Government employees.', 'West Bengal', 'Housing & Shelter',
'{"age_min": 18, "age_max": 60, "professions": ["Working Professional"], "income_max": null, "documents": ["Employee ID", "Aadhaar Card", "Salary Slip"]}',
'Housing for State Government employees',
'{"Employee ID", "Aadhaar Card", "Salary Slip", "Service Certificate"}',
'https://www.myscheme.gov.in/schemes/ahs',
'Housing Department, West Bengal'),

-- Agriculture & Rural
(gen_random_uuid(), 'Krishak Bandhu Scheme', 'Provides financial security to farmers through direct income support and death/disability benefits.', 'West Bengal', 'Agriculture,Rural & Environment',
'{"age_min": 18, "age_max": null, "professions": ["Farmer"], "income_max": null, "documents": ["Aadhaar Card", "Land Documents", "Bank Account"]}',
'Annual assistance of ₹5,000/- per acre and ₹2,00,000/- in case of death',
'{"Aadhaar Card", "Land Documents", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/kbs',
'Agriculture Department, West Bengal'),

-- Social Welfare
(gen_random_uuid(), 'Banglar Yuba Sathi', 'Monthly financial assistance to educated unemployed youth.', 'West Bengal', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": 35, "professions": ["Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Educational Certificates", "Bank Account"]}',
'Monthly allowance for unemployed youth for maximum 5 years',
'{"Aadhaar Card", "Educational Certificates", "Bank Account Details", "Unemployment Certificate"}',
'https://www.myscheme.gov.in/schemes/byswb',
'Government of West Bengal'),

(gen_random_uuid(), 'Old Age Pension', 'Monthly pension for elderly individuals aged 60 years and above.', 'West Bengal', 'Social welfare & Empowerment',
'{"age_min": 60, "age_max": null, "professions": ["Unemployed", "Housewife"], "income_max": null, "documents": ["Aadhaar Card", "Age Proof", "Income Certificate"]}',
'Monthly pension for senior citizens',
'{"Aadhaar Card", "Age Proof", "Income Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/oapwb',
'Social Welfare Department, West Bengal'),

(gen_random_uuid(), 'Disability Pension - West Bengal', 'Monthly pension for persons with disabilities.', 'West Bengal', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": null, "professions": ["Working Professional", "Self Employed", "Unemployed", "Housewife"], "income_max": null, "documents": ["Disability Certificate", "Aadhaar Card", "Income Certificate"]}',
'Monthly pension for persons with disabilities',
'{"Disability Certificate", "Aadhaar Card", "Income Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/dpwb',
'Social Welfare Department, West Bengal'),

-- Education & Learning
(gen_random_uuid(), 'Kanyashree Prakalpa', 'Conditional cash transfers to improve status and wellbeing of girls from disadvantaged families.', 'West Bengal', 'Education & Learning',
'{"age_min": 13, "age_max": 19, "professions": ["Student"], "income_max": 120000, "documents": ["Aadhaar Card", "School Certificate", "Income Certificate"]}',
'Financial assistance for continuing education and preventing child marriage',
'{"Aadhaar Card", "School Certificate", "Income Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/wbkanyashree',
'Government of West Bengal'),

(gen_random_uuid(), 'Swami Vivekananda Merit-cum-Means Scholarship', 'Financial assistance to students for higher education.', 'West Bengal', 'Education & Learning',
'{"age_min": null, "age_max": null, "professions": ["Student"], "income_max": 250000, "documents": ["Aadhaar Card", "Educational Certificates", "Income Certificate"]}',
'Scholarship for higher education',
'{"Aadhaar Card", "Educational Certificates", "Income Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/svmcms',
'Higher Education Department, West Bengal'),

-- Women & Child
(gen_random_uuid(), 'Lakshmir Bhandar Scheme', 'Financial assistance to women from economically weaker sections for empowerment.', 'West Bengal', 'Women and Child',
'{"age_min": 25, "age_max": 60, "professions": ["Housewife", "Working Professional", "Self Employed"], "income_max": null, "documents": ["Aadhaar Card", "Swasthya Sathi Card"]}',
'Monthly financial assistance for women empowerment',
'{"Aadhaar Card", "Swasthya Sathi Card", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/lbs-wb',
'Government of West Bengal'),

(gen_random_uuid(), 'Rupashree Prakalpa', 'One-time financial grant to economically stressed families for daughters marriages.', 'West Bengal', 'Women and Child',
'{"age_min": 18, "age_max": null, "professions": ["Housewife", "Working Professional", "Self Employed", "Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Income Certificate", "Marriage Certificate"]}',
'One-time grant of ₹25,000/- for marriage',
'{"Aadhaar Card", "Income Certificate", "Marriage Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/wbrupashree',
'Government of West Bengal'),

-- Health & Wellness
(gen_random_uuid(), 'Sishu Saathi', 'Treatment for children aged 0-18 years with zero out of pocket expenditure.', 'West Bengal', 'Health & Wellness',
'{"age_min": 0, "age_max": 18, "professions": ["Student"], "income_max": null, "documents": ["Aadhaar Card", "Birth Certificate"]}',
'Free medical treatment for children',
'{"Aadhaar Card", "Birth Certificate", "Medical Documents"}',
'https://www.myscheme.gov.in/schemes/wbsishusathi',
'Health and Family Welfare Department, West Bengal'),

-- Skills & Employment
(gen_random_uuid(), 'Karma Sathi Prakalpa', 'Helps young entrepreneurs establish new manufacturing enterprises and small businesses.', 'West Bengal', 'Skills & Employment',
'{"age_min": 18, "age_max": 45, "professions": ["Self Employed", "Business Owner", "Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Business Plan", "Educational Certificates"]}',
'Soft loans and subsidies for new income-generating projects',
'{"Aadhaar Card", "Business Plan", "Educational Certificates", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/ksp',
'Government of West Bengal'),

(gen_random_uuid(), 'Yuvasree Prakalpa', 'Financial assistance to jobseekers for placement.', 'West Bengal', 'Skills & Employment',
'{"age_min": 18, "age_max": 35, "professions": ["Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Educational Certificates"]}',
'Financial assistance for job placement',
'{"Aadhaar Card", "Educational Certificates", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/yuvasree',
'Labour Department, West Bengal');

-- Maharashtra Schemes (selecting 20 key schemes from 84 total)
INSERT INTO schemes (id, name, description, state, category, eligibility_criteria, benefits, required_documents, application_url, department) VALUES

-- Health & Wellness
(gen_random_uuid(), 'Mahatma Jyotirao Phule Jan Arogya Yojana', 'Cashless treatment for identified diseases through network of government and private healthcare providers.', 'Maharashtra', 'Health & Wellness',
'{"age_min": null, "age_max": null, "professions": ["Working Professional", "Self Employed", "Unemployed", "Housewife", "Student", "Farmer"], "income_max": null, "documents": ["Aadhaar Card", "Ration Card"]}',
'Cashless health insurance coverage',
'{"Aadhaar Card", "Ration Card", "Income Certificate"}',
'https://www.myscheme.gov.in/schemes/mjpjay',
'Government of Maharashtra'),

-- Women & Child
(gen_random_uuid(), 'Mukhyamantri - Majhi Ladki Bahin Yojana', 'Economic freedom of women through direct benefit transfer for health and nutrition.', 'Maharashtra', 'Women and Child',
'{"age_min": 21, "age_max": 65, "professions": ["Housewife", "Working Professional", "Self Employed"], "income_max": null, "documents": ["Aadhaar Card", "Bank Account"]}',
'Monthly financial benefit through direct benefit transfer',
'{"Aadhaar Card", "Bank Account Details", "Income Certificate"}',
'https://www.myscheme.gov.in/schemes/mmlby',
'Government of Maharashtra'),

-- Agriculture
(gen_random_uuid(), 'Namo Shetkari Mahasanman Nidhi Yojana', 'Additional financial assistance to farmer families to increase income.', 'Maharashtra', 'Agriculture,Rural & Environment',
'{"age_min": 18, "age_max": null, "professions": ["Farmer"], "income_max": null, "documents": ["Aadhaar Card", "Land Documents", "Bank Account"]}',
'₹6,000/- per year additional amount (along with PM-KISAN)',
'{"Aadhaar Card", "Land Documents", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/namo-shetkari-mahasanman-nidhi-yojana',
'Agriculture Department, Maharashtra'),

(gen_random_uuid(), 'Gopinath Munde Shetkari Apghat Suraksha Sanugrah Audhan Yojana', 'Financial support to aggrieved family members of ill-fated farmers through accident claim cover.', 'Maharashtra', 'Agriculture,Rural & Environment',
'{"age_min": 18, "age_max": null, "professions": ["Farmer"], "income_max": null, "documents": ["Aadhaar Card", "Land Documents", "Accident Report"]}',
'Accident claim cover for farmers',
'{"Aadhaar Card", "Land Documents", "Accident Report", "Death Certificate"}',
'https://www.myscheme.gov.in/schemes/gopinath-munde-shetkari-apghat-suraksha-sanugrah-audhan-yojana',
'Agriculture Department, Maharashtra'),

-- Business & Entrepreneurship
(gen_random_uuid(), 'Chief Minister Employment Generation Programme (CMEGP)', 'Credit linked subsidy program for employment generation through establishment of Micro & Small Enterprises.', 'Maharashtra', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed", "Business Owner", "Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Business Plan", "Educational Certificates"]}',
'Credit linked subsidy for establishing enterprises',
'{"Aadhaar Card", "Business Plan", "Educational Certificates", "Caste Certificate"}',
'https://www.myscheme.gov.in/schemes/cmegp',
'Government of Maharashtra'),

-- Education & Learning
(gen_random_uuid(), 'Dr. Panjabrao Deshmukh Hostel Maintenance Allowance', 'Hostel maintenance allowance for students from economically weaker sections.', 'Maharashtra', 'Education & Learning',
'{"age_min": null, "age_max": null, "professions": ["Student"], "income_max": 800000, "documents": ["Aadhaar Card", "Income Certificate", "Hostel Admission Proof"]}',
'Hostel maintenance allowance',
'{"Aadhaar Card", "Income Certificate", "Hostel Admission Proof", "Educational Certificates"}',
'https://www.myscheme.gov.in/schemes/drpdhma',
'Government of Maharashtra'),

(gen_random_uuid(), 'Rajarshri Chhatrapati Shahu Maharaj Merit Scholarship', 'Scholarship to encourage scheduled caste students to pursue higher secondary education.', 'Maharashtra', 'Education & Learning',
'{"age_min": null, "age_max": null, "professions": ["Student"], "income_max": null, "documents": ["Aadhaar Card", "Educational Certificates", "Caste Certificate"]}',
'Merit-based scholarship for SC students',
'{"Aadhaar Card", "Educational Certificates", "Caste Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/rcsmms',
'Government of Maharashtra'),

-- Skills & Employment
(gen_random_uuid(), 'Mukhyamantri Yuva Karya Prashikshan Yojana', 'Enhances candidates employability through practical training with entrepreneurs.', 'Maharashtra', 'Skills & Employment',
'{"age_min": 18, "age_max": 35, "professions": ["Student", "Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Educational Certificates"]}',
'Practical training with stipend',
'{"Aadhaar Card", "Educational Certificates", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/mmykpy',
'Skill Development Department, Maharashtra'),

(gen_random_uuid(), 'Craftsman Training Scheme - Maharashtra', 'Vocational training to enhance skill and employability with stipend support.', 'Maharashtra', 'Skills & Employment',
'{"age_min": 18, "age_max": null, "professions": ["Student", "Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Educational Certificates"]}',
'Vocational training with stipend',
'{"Aadhaar Card", "Educational Certificates"}',
'https://www.myscheme.gov.in/schemes/cts-maharashtra',
'Government of Maharashtra'),

-- Social Welfare
(gen_random_uuid(), 'Indira Gandhi National Old Age Pension Scheme (Maharashtra)', 'Monthly pension for elderly individuals aged 65 years and above from BPL families.', 'Maharashtra', 'Social welfare & Empowerment',
'{"age_min": 65, "age_max": null, "professions": ["Unemployed", "Housewife"], "income_max": null, "documents": ["Aadhaar Card", "Age Proof", "BPL Card"]}',
'₹600 per month pension',
'{"Aadhaar Card", "Age Proof", "BPL Card", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/igoapsm',
'Social Justice & Special Assistance Department'),

(gen_random_uuid(), 'Indira Gandhi National Widow Pension Scheme (Maharashtra)', 'Monthly pension for widows aged 40 to 79 years from BPL families.', 'Maharashtra', 'Social welfare & Empowerment',
'{"age_min": 40, "age_max": 79, "professions": ["Housewife", "Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Death Certificate", "BPL Card"]}',
'₹1500/- per month pension',
'{"Aadhaar Card", "Death Certificate", "BPL Card", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/ignwpsm',
'Social Justice & Special Assistance Department'),

(gen_random_uuid(), 'Indira Gandhi National Disability Pension Scheme (Maharashtra)', 'Monthly pension for differently-abled individuals aged 18 to 65 years with 80% and above disability.', 'Maharashtra', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": 65, "professions": ["Working Professional", "Self Employed", "Unemployed", "Housewife"], "income_max": null, "documents": ["Disability Certificate", "Aadhaar Card", "BPL Card"]}',
'₹600/- per month pension',
'{"Disability Certificate", "Aadhaar Card", "BPL Card", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/igndpsm',
'Social Justice & Special Assistance Department'),

-- Housing & Shelter
(gen_random_uuid(), 'Ramai Awas (Gharkul) Scheme for SC & Nav-Buddha', 'Housing scheme to raise standard of living of Scheduled Caste and Nav-Buddha communities.', 'Maharashtra', 'Housing & Shelter',
'{"age_min": 18, "age_max": null, "professions": ["Working Professional", "Self Employed", "Farmer", "Unemployed"], "income_max": null, "documents": ["Aadhaar Card", "Caste Certificate", "Income Certificate"]}',
'Financial assistance for housing',
'{"Aadhaar Card", "Caste Certificate", "Income Certificate", "Land Documents"}',
'https://www.myscheme.gov.in/schemes/rassnb',
'Social Justice & Special Assistance Department'),

-- Banking & Insurance
(gen_random_uuid(), 'Aam Aadmi Bima Yojana (Maharashtra)', 'Insurance and scholarship benefits to landless labourers in rural areas aged 18 to 59 years.', 'Maharashtra', 'Banking,Financial Services and Insurance',
'{"age_min": 18, "age_max": 59, "professions": ["Farmer", "Working Professional", "Self Employed"], "income_max": null, "documents": ["Aadhaar Card", "Income Certificate"]}',
'Insurance coverage and scholarship benefits',
'{"Aadhaar Card", "Income Certificate", "Bank Account Details"}',
'https://www.myscheme.gov.in/schemes/aabym',
'Social Justice & Special Assistance Department');