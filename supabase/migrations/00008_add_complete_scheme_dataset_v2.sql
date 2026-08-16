-- Migration: Add complete scheme dataset with proper UUIDs
-- This migration adds schemes from Delhi, West Bengal, and Maharashtra

-- Delhi Schemes
INSERT INTO schemes (name, description, state, category, eligibility_criteria, benefits, required_documents, application_url, department) VALUES

-- 1. Accidental Death Assistance for the Construction Workers
('Accidental Death Assistance for the Construction Workers', 
'Welfare scheme that provides financial assistance of ₹2,00,000/- to the nominees/dependents of the members in case the death is due to an accident.',
'Delhi', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": 60, "professions": ["Self Employed", "Working Professional"], "income_max": null, "categories": ["Construction Workers", "Labour"]}',
'Financial assistance of ₹2,00,000/-', 
ARRAY['Death Certificate', 'Nominee ID Proof', 'Worker Registration Card'],
'https://www.myscheme.gov.in/schemes/adacw', 'Delhi Building and Other Construction Workers Welfare Board'),

-- 2. Artisan Promotion
('Artisan Promotion',
'Provides artisans with opportunities to participate in national fairs and exhibitions with financial support for participation fees, lodging, boarding, and stipends.',
'Delhi', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed", "Business Owner"], "income_max": null, "categories": ["Artisan", "SC", "OBC", "Minority"]}',
'Financial support for participation fees, lodging, boarding, and stipends',
ARRAY['Artisan ID Card', 'Caste Certificate', 'Income Certificate'],
'https://www.myscheme.gov.in/schemes/ap', 'DSFDC'),

-- 3. Big Loan Scheme
('Big Loan Scheme',
'Provides term loans up to ₹5,00,000/- for income-generating activities to eligible applicants from SC, OBC, Minorities, Safai Karamcharis, and PwDs.',
'Delhi', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed", "Business Owner", "Unemployed"], "income_max": null, "categories": ["SC", "OBC", "Minority", "PwD"]}',
'Term loans up to ₹5,00,000/-',
ARRAY['Caste Certificate', 'Income Certificate', 'Business Plan', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/bls', 'DSFDC'),

-- 4. Bus Traveling Facility For Visually Impaired
('Bus Traveling Facility For Visually Impaired/Bus Concession',
'Delhi Transport Corporation provides facility of free traveling in DTC Buses to the persons with vision impairment.',
'Delhi', 'Social welfare & Empowerment',
'{"age_min": null, "age_max": null, "professions": ["Student", "Working Professional", "Unemployed", "Self Employed"], "income_max": null, "categories": ["Visually Impaired", "PwD"]}',
'Free bus travel in DTC buses',
ARRAY['Disability Certificate', 'ID Proof', 'Residence Proof'],
'https://www.myscheme.gov.in/schemes/btfvibc', 'Delhi Social Welfare Department'),

-- 5. Composite Loan Scheme
('Composite Loan Scheme',
'Provides need-based financial support to individuals from SC, ST, OBC, Minorities, and PwDs to help them pursue various income-generating activities.',
'Delhi', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed", "Business Owner", "Unemployed"], "income_max": null, "categories": ["SC", "ST", "OBC", "Minority", "PwD"]}',
'Financial support for income-generating activities',
ARRAY['Caste Certificate', 'Income Certificate', 'Business Plan', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/cls', 'DSFDC'),

-- 6. Delhi Arogya Kosh
('Delhi Arogya Kosh',
'Provides financial assistance to needy eligible patients for treatment of any illness/treatment/intervention required by the patient undergoing treatment in a Government Hospital.',
'Delhi', 'Health & Wellness',
'{"age_min": null, "age_max": null, "professions": ["Student", "Working Professional", "Unemployed", "Self Employed", "Housewife", "Farmer"], "income_max": null, "categories": ["BPL", "General"]}',
'Financial assistance for medical treatment',
ARRAY['Medical Certificate', 'Income Certificate', 'ID Proof', 'Residence Proof'],
'https://www.myscheme.gov.in/schemes/dak', 'Delhi Government Health Department'),

-- 7. Delhi Arogya Nidhi
('Delhi Arogya Nidhi',
'Provides financial assistance upto ₹1.5 lacs to needy patients who have National Food Security Cards for the treatment of diseases in Government hospitals only.',
'Delhi', 'Health & Wellness',
'{"age_min": null, "age_max": null, "professions": ["Student", "Working Professional", "Unemployed", "Self Employed", "Housewife", "Farmer"], "income_max": null, "categories": ["NFSC Holder", "BPL"]}',
'Financial assistance up to ₹1.5 lakh',
ARRAY['National Food Security Card', 'Medical Certificate', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/dan', 'Delhi Government Health Department'),

-- 8. Delhi Pension Scheme To Women In Distress
('Delhi Pension Scheme To Women In Distress (Widow Pension)',
'Provides social security by way of financial assistance to widows, divorced, separated, abandoned, deserted or destitute women in the age group of 18 years of lifelong who do not have adequate means of subsistence.',
'Delhi', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": null, "professions": ["Unemployed", "Housewife", "Self Employed"], "income_max": null, "categories": ["Widow", "Divorced", "Destitute Women"]}',
'Monthly pension for women in distress',
ARRAY['Widow Certificate/Divorce Certificate', 'Income Certificate', 'ID Proof', 'Residence Proof'],
'https://www.myscheme.gov.in/schemes/dpswdwp', 'Delhi Social Welfare Department'),

-- 9. Dilli Swarojgar Yojna
('Dilli Swarojgar Yojna',
'Provides loans up to ₹5,00,000/- at 6% interest for income-generating activities targeting individuals from SC, ST, OBC, and Minority communities.',
'Delhi', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed", "Business Owner", "Unemployed"], "income_max": null, "categories": ["SC", "ST", "OBC", "Minority"]}',
'Loans up to ₹5,00,000/- at 6% interest',
ARRAY['Caste Certificate', 'Income Certificate', 'Business Plan', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/dsy', 'Delhi Government'),

-- 10. Disability Pension for the Construction Workers
('Disability Pension for the Construction Workers',
'Provides monthly disability pension of ₹3000/- to the permanently disabled member due to paralysis, leprosy, T.B and accidents.',
'Delhi', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": 60, "professions": ["Self Employed", "Working Professional", "Unemployed"], "income_max": null, "categories": ["Construction Workers", "PwD"]}',
'Monthly pension of ₹3000/-',
ARRAY['Disability Certificate', 'Worker Registration Card', 'Medical Certificate'],
'https://www.myscheme.gov.in/schemes/dpcw', 'Delhi Building and Other Construction Workers Welfare Board'),

-- 11. Dr. B. R. Ambedkar State Award
('Dr. B. R. Ambedkar State Award To SC/ST/OBC/Minorities Students',
'Recognise and reward meritorious SC/ST/OBC/Minority students pursuing graduation in recognised institutions.',
'Delhi', 'Education & Learning',
'{"age_min": 18, "age_max": 30, "professions": ["Student"], "income_max": null, "categories": ["SC", "ST", "OBC", "Minority"]}',
'State award and recognition',
ARRAY['Caste Certificate', 'Academic Records', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/dbrasa', 'Department For The Welfare Of SC/ST/OBC/Minorities'),

-- 12. Education Assistance for the Construction Workers
('Education Assistance for the Construction Workers',
'Provides scholarship to the children of the construction worker of the board.',
'Delhi', 'Education & Learning',
'{"age_min": 5, "age_max": 25, "professions": ["Student"], "income_max": null, "categories": ["Construction Workers Children"]}',
'Educational scholarship',
ARRAY['School/College Certificate', 'Parent Worker Registration Card', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/edftcw', 'Delhi Building and Other Construction Workers Welfare Board'),

-- 13. Education Loan Scheme - Delhi
('Education Loan Scheme - Delhi',
'Provides financial assistance to the SC/ST/OBC/PwD students for pursuing professional and technical education in India and abroad.',
'Delhi', 'Education & Learning',
'{"age_min": 18, "age_max": 35, "professions": ["Student"], "income_max": 500000, "categories": ["SC", "ST", "OBC", "PwD"]}',
'Loan limits of ₹7,50,000/- (India) and ₹15,00,000/- (abroad)',
ARRAY['Caste Certificate', 'Income Certificate', 'Admission Letter', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/els-delhi', 'Delhi Government'),

-- 14. Ex-gratia Payment for the Construction Workers
('Ex-gratia Payment for the Construction Workers',
'Provides an ex-gratia amount of ₹1,00,000/- in case of permanent disability.',
'Delhi', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": 60, "professions": ["Self Employed", "Working Professional"], "income_max": null, "categories": ["Construction Workers", "PwD"]}',
'Ex-gratia payment of ₹1,00,000/-',
ARRAY['Disability Certificate', 'Worker Registration Card', 'Medical Certificate'],
'https://www.myscheme.gov.in/schemes/epcw', 'Delhi Building and Other Construction Workers Welfare Board'),

-- 15. Family Pension (DBOCWWB)
('Family Pension (DBOCWWB)',
'Upon the death of the pensioner, the surviving spouse is provided 50% of the pension amount or ₹1500/-, whichever is higher.',
'Delhi', 'Social welfare & Empowerment',
'{"age_min": null, "age_max": null, "professions": ["Unemployed", "Housewife", "Self Employed"], "income_max": null, "categories": ["Construction Workers Family"]}',
'50% of pension or ₹1500/- (whichever is higher)',
ARRAY['Death Certificate', 'Marriage Certificate', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/fpdbocwwb', 'Delhi Building and Other Construction Workers Welfare Board'),

-- 16. Financial Assistance for Marriage for the Construction Workers
('Financial Assistance for Marriage for the Construction Workers',
'Provides financial assistance for marriage of self and for upto 2 children.',
'Delhi', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": 60, "professions": ["Self Employed", "Working Professional"], "income_max": null, "categories": ["Construction Workers"]}',
'Financial assistance for marriage',
ARRAY['Marriage Certificate', 'Worker Registration Card', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/famtw', 'Delhi Building and Other Construction Workers Welfare Board'),

-- 17. Financial Assistance for Miscarriage for the Construction Workers
('Financial Assistance for Miscarriage for the Construction Workers',
'Provides an amount of ₹3,000/- as financial assistance in case of miscarriage.',
'Delhi', 'Health & Wellness',
'{"age_min": 18, "age_max": 45, "professions": ["Self Employed", "Working Professional"], "income_max": null, "categories": ["Construction Workers", "Women"]}',
'Financial assistance of ₹3,000/-',
ARRAY['Medical Certificate', 'Worker Registration Card', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/famcw', 'Delhi Building and Other Construction Workers Welfare Board'),

-- 18. Financial Assistance For Purchase Of Stationery
('Financial Assistance For Purchase Of Stationery To SC/ST/OBC/Minorities Students',
'Provides help for purchase of stationery to SC/ST/OBC/Minorities Students of 1st to 12th class.',
'Delhi', 'Education & Learning',
'{"age_min": 6, "age_max": 18, "professions": ["Student"], "income_max": null, "categories": ["SC", "ST", "OBC", "Minority"]}',
'Financial assistance for stationery',
ARRAY['School Certificate', 'Caste Certificate', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/fafps', 'Department For The Welfare Of SC/ST/OBC/Minorities'),

-- 19. Financial Assistance For The Marriage Of Daughters Of Poor Widows
('Financial Assistance For The Marriage Of Daughters Of Poor Widows And Orphan Girls',
'Provides financial assistance to poor widows for performing the marriage of their daughters and to orphan girls.',
'Delhi', 'Women and Child',
'{"age_min": 18, "age_max": null, "professions": ["Unemployed", "Housewife"], "income_max": null, "categories": ["Widow", "Orphan", "Girl Child"]}',
'Financial assistance for marriage',
ARRAY['Widow Certificate/Orphan Certificate', 'Income Certificate', 'Marriage Certificate'],
'https://www.myscheme.gov.in/schemes/famdpwog', 'GNCTD'),

-- 20. Financial Assistance to SC Students for Pursuing Higher Studies Abroad
('Financial Assistance to SC Students for Pursuing Higher Studies Abroad',
'Supports SC students for higher education abroad in fields like Engineering, Sciences, and Humanities.',
'Delhi', 'Education & Learning',
'{"age_min": 18, "age_max": 35, "professions": ["Student"], "income_max": 800000, "categories": ["SC"]}',
'Up to ₹20,00,000/- for Ph.D. and ₹10,00,000 for Masters',
ARRAY['Caste Certificate', 'Income Certificate', 'Admission Letter', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/fatssfshsa', 'Delhi Government');

-- West Bengal Schemes
INSERT INTO schemes (name, description, state, category, eligibility_criteria, benefits, required_documents, application_url, department) VALUES

-- 1. Accidental Benefit
('Accidental Benefit',
'Provides financial assistance to the beneficiary in case of hospitalization and disability due to an accident.',
'West Bengal', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": 60, "professions": ["Self Employed", "Working Professional"], "income_max": null, "categories": ["Construction Workers"]}',
'Financial assistance for hospitalization and disability',
ARRAY['Medical Certificate', 'Worker Registration Card', 'Accident Report'],
'https://www.myscheme.gov.in/schemes/adwb', 'BOCW Welfare Board, Labour Department'),

-- 2. Akanksha Housing Scheme
('Akanksha Housing Scheme',
'Provides housing to the serving State Government employees.',
'West Bengal', 'Housing & Shelter',
'{"age_min": 18, "age_max": 60, "professions": ["Working Professional"], "income_max": null, "categories": ["State Government Employees"]}',
'Housing assistance',
ARRAY['Employment Certificate', 'Income Certificate', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/ahs', 'Housing Department, Government of West Bengal'),

-- 3. Banglar Awaas Yojana (BAY)
('Banglar Awaas Yojana (BAY)',
'Provides financial assistance to houseless households and those living in kutcha or dilapidated houses.',
'West Bengal', 'Housing & Shelter',
'{"age_min": 18, "age_max": null, "professions": ["Farmer", "Self Employed", "Unemployed", "Working Professional"], "income_max": null, "categories": ["BPL", "General"]}',
'Financial assistance for pucca house construction',
ARRAY['Income Certificate', 'Residence Proof', 'BPL Card (if applicable)'],
'https://www.myscheme.gov.in/schemes/bay', 'Government of West Bengal'),

-- 4. Banglar Yuba Sathi
('Banglar Yuba Sathi',
'Provides monthly financial assistance to educated unemployed youth of West Bengal.',
'West Bengal', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": 35, "professions": ["Unemployed"], "income_max": null, "categories": ["Youth", "Educated"]}',
'Monthly financial assistance for up to 5 years',
ARRAY['Educational Certificate', 'ID Proof', 'Residence Proof'],
'https://www.myscheme.gov.in/schemes/byswb', 'Government of West Bengal'),

-- 5. Kanyashree Prakalpa
('Kanyashree Prakalpa',
'Improves the status and wellbeing of girls through Conditional Cash Transfers to incentivise education and prevent child marriage.',
'West Bengal', 'Education & Learning',
'{"age_min": 13, "age_max": 19, "professions": ["Student"], "income_max": null, "categories": ["Girl Child", "General"]}',
'Conditional cash transfers for education',
ARRAY['School Certificate', 'Birth Certificate', 'Bank Account Details'],
'https://www.myscheme.gov.in/schemes/wbkanyashree', 'Government of West Bengal'),

-- 6. Karma Sathi Prakalpa
('Karma Sathi Prakalpa',
'Helps young entrepreneurs establish new manufacturing enterprises and small businesses with soft loans and subsidies.',
'West Bengal', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": 45, "professions": ["Self Employed", "Business Owner", "Unemployed"], "income_max": null, "categories": ["Youth", "Entrepreneur"]}',
'Soft loans and subsidies for new income-generating projects',
ARRAY['Business Plan', 'ID Proof', 'Residence Proof'],
'https://www.myscheme.gov.in/schemes/ksp', 'Government of West Bengal'),

-- 7. Krishak Bandhu Scheme
('Krishak Bandhu Scheme',
'Provides financial security to farmers through direct income support and death/disability benefits.',
'West Bengal', 'Agriculture,Rural & Environment',
'{"age_min": 18, "age_max": null, "professions": ["Farmer"], "income_max": null, "categories": ["Small and Marginal Farmers"]}',
'Annual assistance of ₹5,000/- per acre and ₹2,00,000/- in case of death',
ARRAY['Land Records', 'Bank Account Details', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/kbs', 'Government of West Bengal'),

-- 8. Lakshmir Bhandar Scheme
('Lakshmir Bhandar Scheme',
'Provides financial assistance to women from economically weaker sections for empowerment.',
'West Bengal', 'Women and Child',
'{"age_min": 25, "age_max": 60, "professions": ["Housewife", "Self Employed", "Unemployed"], "income_max": null, "categories": ["Women", "General"]}',
'Monthly financial assistance',
ARRAY['Swasthya Sathi Card', 'Bank Account Details', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/lbs-wb', 'Government of West Bengal'),

-- 9. Lokprasar Prakalpo Scheme
('Lokprasar Prakalpo Scheme',
'Revives Folk and Tribal Culture with pension and performance fees for artists.',
'West Bengal', 'Sports & Culture',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed"], "income_max": null, "categories": ["Folk Artists", "Tribal Culture"]}',
'Pension and performance fees',
ARRAY['Artist Registration', 'ID Proof', 'Performance Records'],
'https://www.myscheme.gov.in/schemes/lps', 'Department of Information & Cultural Affairs'),

-- 10. Manabik Scheme
('Manabik Scheme',
'Provides monthly pensions to individuals with disabilities in West Bengal.',
'West Bengal', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": null, "professions": ["Unemployed", "Self Employed", "Working Professional"], "income_max": null, "categories": ["PwD"]}',
'Monthly pension',
ARRAY['Disability Certificate', 'ID Proof', 'Income Certificate'],
'https://www.myscheme.gov.in/schemes/ms', 'Government of West Bengal'),

-- 11. Rupashree Prakalpa
('Rupashree Prakalpa',
'Provides one-time financial grant of ₹25,000/- to economically stressed families at the time of their adult daughters marriages.',
'West Bengal', 'Women and Child',
'{"age_min": 18, "age_max": null, "professions": ["Unemployed", "Housewife", "Self Employed"], "income_max": null, "categories": ["BPL", "Poor Families"]}',
'One-time grant of ₹25,000/-',
ARRAY['Income Certificate', 'Marriage Certificate', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/wbrupashree', 'Government of West Bengal'),

-- 12. Sabooj Sathi
('Sabooj Sathi',
'Provides bicycles free of cost to students studying in government and government-aided schools from classes IX to XII.',
'West Bengal', 'Social welfare & Empowerment',
'{"age_min": 14, "age_max": 18, "professions": ["Student"], "income_max": null, "categories": ["General"]}',
'Free bicycle',
ARRAY['School Certificate', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/wbsaboojsathi', 'Government of West Bengal'),

-- 13. Sishu Saathi
('Sishu Saathi',
'Treats Indian children of 0-18 years age group with zero out of pocket expenditure.',
'West Bengal', 'Health & Wellness',
'{"age_min": 0, "age_max": 18, "professions": ["Student"], "income_max": null, "categories": ["Children", "General"]}',
'Free medical treatment',
ARRAY['Birth Certificate', 'ID Proof', 'Medical Records'],
'https://www.myscheme.gov.in/schemes/wbsishusathi', 'Health and Family Welfare Department'),

-- 14. Swami Vivekananda Merit-cum-Means Scholarship
('Swami Vivekananda Merit-cum-Means Scholarship',
'Provides financial assistance to students for higher education.',
'West Bengal', 'Education & Learning',
'{"age_min": 18, "age_max": 30, "professions": ["Student"], "income_max": null, "categories": ["General"]}',
'Merit-cum-means scholarship',
ARRAY['Income Certificate', 'Academic Records', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/svmcms', 'Higher Education Department'),

-- 15. Yuvasree Prakalpa
('Yuvasree Prakalpa',
'Provides financial assistance to jobseekers for employment and placement.',
'West Bengal', 'Skills & Employment',
'{"age_min": 18, "age_max": 35, "professions": ["Unemployed"], "income_max": null, "categories": ["Job Seekers"]}',
'Financial assistance for job placement',
ARRAY['Educational Certificate', 'ID Proof', 'Residence Proof'],
'https://www.myscheme.gov.in/schemes/yuvasree', 'Labour Department, Government of West Bengal');

-- Maharashtra Schemes
INSERT INTO schemes (name, description, state, category, eligibility_criteria, benefits, required_documents, application_url, department) VALUES

-- 1. Aam Aadmi Bima Yojana (Maharashtra)
('Aam Aadmi Bima Yojana (Maharashtra)',
'Provides insurance and scholarship benefits to landless labourers in rural areas, aged 18 to 59 years.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age_min": 18, "age_max": 59, "professions": ["Farmer", "Self Employed", "Unemployed"], "income_max": null, "categories": ["Landless Labourers", "Rural"]}',
'Insurance and scholarship benefits',
ARRAY['Income Certificate', 'Residence Proof', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/aabym', 'Social Justice & Special Assistance Department'),

-- 2. Bhausaheb Fundkar Falbag Lagvad Scheme
('Bhausaheb Fundkar Falbag Lagvad Scheme',
'Plantation of sixteen perennial horticulture crops with subsidy support.',
'Maharashtra', 'Agriculture,Rural & Environment',
'{"age_min": 18, "age_max": null, "professions": ["Farmer"], "income_max": null, "categories": ["General"]}',
'Subsidy for horticulture plantation',
ARRAY['Land Records', 'Bank Account Details', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/bhausaheb-fundkar-horticulture-plantataion-scheme', 'Agriculture Department'),

-- 3. Chief Minister Employment Generation Programme (CMEGP)
('Chief Minister Employment Generation Programme (CMEGP)',
'Credit linked subsidy program for generation of employment opportunities through establishment of Micro & Small Enterprises.',
'Maharashtra', 'Business & Entrepreneurship',
'{"age_min": 18, "age_max": null, "professions": ["Self Employed", "Business Owner", "Unemployed"], "income_max": null, "categories": ["SC", "ST", "OBC", "Female", "PwD"]}',
'Credit linked subsidy',
ARRAY['Caste Certificate (if applicable)', 'Business Plan', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/cmegp', 'Government of Maharashtra'),

-- 4. Craftsman Training Scheme - Maharashtra
('Craftsman Training Scheme - Maharashtra',
'Provides vocational training to individuals with stipend support.',
'Maharashtra', 'Skills & Employment',
'{"age_min": 14, "age_max": 40, "professions": ["Student", "Unemployed"], "income_max": null, "categories": ["General"]}',
'Vocational training with stipend',
ARRAY['Educational Certificate', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/cts-maharashtra', 'Government of Maharashtra'),

-- 5. Dr. Panjabrao Deshmukh Hostel Maintenance Allowance
('Dr. Panjabrao Deshmukh Hostel Maintenance Allowance',
'Hostel maintenance allowance for students whose parents annual income is below ₹8,00,000.',
'Maharashtra', 'Education & Learning',
'{"age_min": 15, "age_max": 25, "professions": ["Student"], "income_max": 800000, "categories": ["General"]}',
'Hostel maintenance allowance',
ARRAY['Income Certificate', 'Hostel Certificate', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/drpdhma', 'Government of Maharashtra'),

-- 6. Educational Assistance for Degree Course
('Educational Assistance for Degree Course',
'Provides financial assistance to children of registered construction workers pursuing undergraduate degree.',
'Maharashtra', 'Education & Learning',
'{"age_min": 18, "age_max": 25, "professions": ["Student"], "income_max": null, "categories": ["Construction Workers Children"]}',
'Financial assistance for degree course',
ARRAY['Degree Certificate', 'Parent Worker Registration Card', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/eafdc', 'Maharashtra Building And Other Construction Workers Welfare Board'),

-- 7. Educational Assistance for Government Recognised Diploma Courses
('Educational Assistance for Government Recognised Diploma Courses',
'Provides ₹20,000 per year for diploma courses and ₹25,000/- per year for postgraduate diploma courses.',
'Maharashtra', 'Education & Learning',
'{"age_min": 18, "age_max": 30, "professions": ["Student"], "income_max": null, "categories": ["Construction Workers Children"]}',
'₹20,000 per year for diploma, ₹25,000/- for PG diploma',
ARRAY['Diploma Certificate', 'Parent Worker Registration Card', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/eagrdc', 'Maharashtra Building And Other Construction Workers Welfare Board'),

-- 8. Educational Assistance for Medical and Engineering Courses
('Educational Assistance for Medical and Engineering Courses',
'Provides educational assistance to children and spouses of registered construction workers pursuing medical and engineering degrees.',
'Maharashtra', 'Education & Learning',
'{"age_min": 18, "age_max": 30, "professions": ["Student"], "income_max": null, "categories": ["Construction Workers Children"]}',
'Financial assistance for medical and engineering courses',
ARRAY['Admission Letter', 'Parent Worker Registration Card', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/eafmaec', 'Maharashtra Building And Other Construction Workers Welfare Board'),

-- 9. Mahatma Jyotirao Phule Jan Arogya Yojana
('Mahatma Jyotirao Phule Jan Arogya Yojana',
'Offers cashless treatment for identified diseases through a network of government and private healthcare providers.',
'Maharashtra', 'Health & Wellness',
'{"age_min": null, "age_max": null, "professions": ["Student", "Working Professional", "Unemployed", "Self Employed", "Housewife", "Farmer"], "income_max": null, "categories": ["BPL", "General"]}',
'Cashless medical treatment',
ARRAY['Income Certificate', 'ID Proof', 'Medical Records'],
'https://www.myscheme.gov.in/schemes/mjpjay', 'Government of Maharashtra'),

-- 10. Mukhyamantri - Majhi Ladki Bahin Yojana
('Mukhyamantri - Majhi Ladki Bahin Yojana',
'Provides financial benefit for economic freedom of women in the age group of 21 to 65.',
'Maharashtra', 'Women and Child',
'{"age_min": 21, "age_max": 65, "professions": ["Housewife", "Self Employed", "Unemployed"], "income_max": null, "categories": ["Women", "General"]}',
'Monthly financial benefit through DBT',
ARRAY['Bank Account Details', 'ID Proof', 'Residence Proof'],
'https://www.myscheme.gov.in/schemes/mmlby', 'Government of Maharashtra'),

-- 11. Mukhyamantri Yuva Karya Prashikshan Yojana
('Mukhyamantri Yuva Karya Prashikshan Yojana',
'Enhances candidates employability through practical training with entrepreneurs.',
'Maharashtra', 'Skills & Employment',
'{"age_min": 18, "age_max": 35, "professions": ["Unemployed", "Student"], "income_max": null, "categories": ["Youth", "PwD"]}',
'Vocational training with stipend',
ARRAY['Educational Certificate', 'ID Proof', 'Residence Proof'],
'https://www.myscheme.gov.in/schemes/mmykpy', 'Department of Skill, Employment, Entrepreneurship and Innovation'),

-- 12. Namo Shetkari Mahasanman Nidhi Yojana
('Namo Shetkari Mahasanman Nidhi Yojana',
'Provides additional amount of ₹6000/- per year to cultivable land holding farmer families.',
'Maharashtra', 'Agriculture,Rural & Environment',
'{"age_min": 18, "age_max": null, "professions": ["Farmer"], "income_max": null, "categories": ["Land Holding Farmers"]}',
'₹6000/- per year (in addition to PM-KISAN)',
ARRAY['Land Records', 'Bank Account Details', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/namo-shetkari-mahasanman-nidhi-yojana', 'Agriculture Department'),

-- 13. Nanaji Deshmukh Krishi Sanjivani Prakalp
('Nanaji Deshmukh Krishi Sanjivani Prakalp',
'Enhances climate-resilience and profitability of smallholder farming systems.',
'Maharashtra', 'Agriculture,Rural & Environment',
'{"age_min": 18, "age_max": null, "professions": ["Farmer"], "income_max": null, "categories": ["Small Farmers", "Drought-prone areas"]}',
'Climate resilient technology and commodity value chain support',
ARRAY['Land Records', 'ID Proof', 'Residence Proof'],
'https://www.myscheme.gov.in/schemes/pocra', 'Government of Maharashtra'),

-- 14. Rajarshri Chhatrapati Shahu Maharaj Merit Scholarship
('Rajarshri Chhatrapati Shahu Maharaj Merit Scholarship',
'Encourages scheduled caste students to pursue higher secondary education.',
'Maharashtra', 'Education & Learning',
'{"age_min": 15, "age_max": 20, "professions": ["Student"], "income_max": null, "categories": ["SC"]}',
'Merit scholarship',
ARRAY['Caste Certificate', 'Academic Records', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/rcsmms', 'Government of Maharashtra'),

-- 15. Swami Vivekananda Merit-cum-Means Scholarship
('Swami Vivekananda Merit-cum-Means Scholarship',
'Provides financial assistance to students for higher education.',
'Maharashtra', 'Education & Learning',
'{"age_min": 18, "age_max": 30, "professions": ["Student"], "income_max": null, "categories": ["General"]}',
'Merit-cum-means scholarship',
ARRAY['Income Certificate', 'Academic Records', 'ID Proof'],
'https://www.myscheme.gov.in/schemes/svmcms', 'Higher Education Department');