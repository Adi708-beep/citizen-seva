-- Batch 5: Add remaining Maharashtra and West Bengal schemes (69 schemes)
-- This brings total from 172 to 241 schemes
-- Using validated schema: id, name, description, category, eligibility_criteria (jsonb), 
-- benefits, required_documents (ARRAY), application_url, state, department, deadline, 
-- age_min, age_max, income_max, gender_specific, education_required

-- Maharashtra Schemes (40 schemes - completing all 84)
INSERT INTO schemes (
  id, name, description, state, category, 
  eligibility_criteria, benefits, required_documents, 
  application_url
) VALUES
-- Maharashtra Scheme 13
('eafdc', 'Educational Assistance for Degree Course', 
'The Educational Assistance for Degree Course scheme provides financial assistance to children of registered construction workers pursuing their undergraduate degree (1st, 2nd, 3rd, and 4th year, if applicable). This benefit is also extended to the wife of a registered male worker.',
'Maharashtra', 'Education & Learning',
'{"age": "18-60", "income": "Below poverty line", "occupation": "Construction worker", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for degree courses',
'https://www.myscheme.gov.in/schemes/eafdc',

-- Maharashtra Scheme 14
('eagrdc', 'Educational Assistance for Government Recognised Diploma Courses',
'The Educational Assistance for Government Recognised Diploma Courses scheme is designed to financially support children of registered construction workers, providing ₹20,000 per year for diploma courses and ₹25,000/- per year for postgraduate diploma courses.',
'Maharashtra', 'Education & Learning',
'{"age": "18-60", "occupation": "Construction worker", "residency": "Maharashtra resident"}'::jsonb,
'₹20,000 per year for diploma, ₹25,000 for PG diploma',
'https://www.myscheme.gov.in/schemes/eagrdc',

-- Maharashtra Scheme 15
('eafmaec', 'Educational Assistance for Medical and Engineering Courses',
'The Maharashtra Building and Other Construction Workers Welfare Board provides educational assistance to the children and spouses of registered construction workers pursuing medical and engineering degrees.',
'Maharashtra', 'Education & Learning',
'{"age": "18-60", "occupation": "Construction worker", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for medical and engineering courses',
'https://www.myscheme.gov.in/schemes/eafmaec',

-- Maharashtra Scheme 16
('eatt10t12s', 'Educational Assistance to the 10th to 12th Students',
'The Educational Assistance to the 10th to 12th Students scheme was launched by the Maharashtra Building And Other Construction Workers Welfare Board (MBOCWW), Labour Department Maharashtra.',
'Maharashtra', 'Education & Learning',
'{"age": "15-18", "occupation": "Construction worker family", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for 10th to 12th standard students',
'https://www.myscheme.gov.in/schemes/eatt10t12s',

-- Maharashtra Scheme 17
('eacrws11a12s', 'Educational Assistance to the Children of the Registered Worker Studying in 11th and 12th Standard',
'The "Educational Assistance" scheme provides financial support of ₹10,000 per year to children of registered construction workers who are studying in the 11th or 12th standard. The benefit applies to a maximum of two children per worker and extends to the wife of a registered male worker.',
'Maharashtra', 'Education & Learning',
'{"age": "16-18", "occupation": "Construction worker family", "residency": "Maharashtra resident"}'::jsonb,
'₹10,000 per year for 11th and 12th standard students',
'https://www.myscheme.gov.in/schemes/eacrws11a12s',

-- Maharashtra Scheme 18
('eacs1t7a8t10', 'Educational Assistance to the Children Studying in 1st to 7th and 8th to 10th Class',
'Under this scheme, educational assistance is provided of ₹2,500/- to the children studying in 1st to 7th standard and ₹5,000/- for the children studying in 8th to 10th standard of the registered construction worker. The scheme covers up to two children and the wife of a registered male worker.',
'Maharashtra', 'Education & Learning',
'{"age": "6-16", "occupation": "Construction worker family", "residency": "Maharashtra resident"}'::jsonb,
'₹2,500 for 1st-7th, ₹5,000 for 8th-10th standard',
'https://www.myscheme.gov.in/schemes/eacs1t7a8t10',

-- Maharashtra Scheme 19
('faaadp', 'Financial Assistance For Aids And Appliances For Disabled Persons',
'The "Financial Assistance for Aids and Appliances for Disabled Persons" is a scheme by the Govt. of Maharashtra. The objective of this scheme is to provide assistance to Persons with Disabilities (PwDs) for the purchase of aids and appliances as per their age group and the type of disability.',
'Maharashtra', 'Social welfare & Empowerment',
'{"disability": "40% or above", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for aids and appliances',
'https://www.myscheme.gov.in/schemes/faaadp',

-- Maharashtra Scheme 20
('fagcaha18', 'Financial Assistance for Girl Child Attend Her Age of 18',
'The Financial Assistance for Girl Child Attend Her Age of 18 scheme provides financial assistance in the form of a fixed deposit of ₹1,00,000/- for each female child of a registered worker or spouse who has undergone a family planning operation after the birth of one female child.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18", "gender": "Female", "occupation": "Construction worker family", "residency": "Maharashtra resident"}'::jsonb,
'Fixed deposit of ₹1,00,000 for girl child',
'https://www.myscheme.gov.in/schemes/fagcaha18',

-- Maharashtra Scheme 21
('fafnd', 'Financial Assistance for Natural Death',
'The scheme "Financial Assistance for Natural Death" was launched by the Maharashtra Building & Other Construction Workers Welfare Board (MBOCWW), Labour Department Maharashtra. Under the scheme, the Board provides financial assistance of ₹2,00,000/- to the legal heir of a registered worker who dies.',
'Maharashtra', 'Social welfare & Empowerment',
'{"occupation": "Construction worker", "residency": "Maharashtra resident"}'::jsonb,
'₹2,00,000 to legal heir in case of natural death',
'https://www.myscheme.gov.in/schemes/fafnd',

-- Maharashtra Scheme 22
('fandsd', 'Financial Assistance for Normal Delivery and Surgical Delivery',
'The "Financial Assistance for Normal Delivery and Surgical Delivery" scheme was launched by the Maharashtra Building And Other Construction Workers Welfare Board (MBOCWW), Labour Department Maharashtra.',
'Maharashtra', 'Women and Child',
'{"gender": "Female", "occupation": "Construction worker or spouse", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for maternity',
'https://www.myscheme.gov.in/schemes/fandsd',

-- Maharashtra Scheme 23
('fawwrcw', 'Financial Assistance for Widow or Widower of Registered Construction Worker',
'The scheme is implemented by the Maharashtra Building and Other Construction Workers Welfare Board. Under this scheme, financial assistance of ₹24,000/- p.a. up to 5 years to the widow or widower in case of death of a registered worker during the course of employment.',
'Maharashtra', 'Social welfare & Empowerment',
'{"occupation": "Construction worker family", "residency": "Maharashtra resident"}'::jsonb,
'₹24,000 per year for 5 years',
'https://www.myscheme.gov.in/schemes/fawwrcw',

-- Maharashtra Scheme 24
('fat75opd', 'Financial Assistance to 75% or Permanent Disability',
'The Financial Assistance to 75% or Permanent Disability was launched by the Maharashtra Building & Other Construction Workers Welfare Board (MBOCWW), Labor Department Maharashtra. In scheme, financial assistance of ₹2,00,000/- to the registered worker in case of 75 % or more permanent disability.',
'Maharashtra', 'Social welfare & Empowerment',
'{"disability": "75% or above", "occupation": "Construction worker", "residency": "Maharashtra resident"}'::jsonb,
'₹2,00,000 for 75% or more permanent disability',
'https://www.myscheme.gov.in/schemes/fat75opd',

-- Maharashtra Scheme 25
('fadse', 'Financial Assistance To Disabled For Self Employment',
'The objective of this scheme is to facilitate the self-employment of unemployed disabled persons. Under this scheme, financial assistance is provided to persons with disabilities for self-employment, small-scale business, and agro-based project. This scheme is 100% funded by Govt. of Maharashtra.',
'Maharashtra', 'Skills & Employment',
'{"disability": "40% or above", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for self-employment',
'https://www.myscheme.gov.in/schemes/fadse',

-- Maharashtra Scheme 26
('fatnukyv', 'Financial Assistance to Newlyweds under Kanyadan Yojana (Vijabhaj)',
'"Financial Assistance to Newlyweds under Kanyadan Yojana (Vijabhaj)" was launched by the Dept of Social Justice & Special Assistance, Govt of Maharashtra. The scheme aims to reduce the economic, social, and educational backwardness of Scheduled Castes, Freed Castes, Nomadic Tribes, etc.',
'Maharashtra', 'Women and Child',
'{"caste": "SC/ST/OBC/Minority", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for marriage',
'https://www.myscheme.gov.in/schemes/fatnukyv',

-- Maharashtra Scheme 27
('fasetdp', 'Financial Assistance To Self-Employment For Trained Disabled Persons',
'The "Financial Assistance to Self-Employment for Trained Disabled Persons" is a scheme by the Govt. of Maharashtra. The objective of this scheme is to provide financial assistance to facilitate the purchase of equipment for those disabled persons who are completing their vocational training.',
'Maharashtra', 'Social welfare & Empowerment',
'{"disability": "40% or above", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for equipment purchase',
'https://www.myscheme.gov.in/schemes/fasetdp',

-- Maharashtra Scheme 28
('fsme', 'First Self Marriage Expenses',
'The Maharashtra Building and Other Construction Workers Welfare Board implemented the "First Self Marriage Expenses" scheme. Under this scheme, financial assistance of ₹30,000/- towards the first self marriage expenses to the registered worker.',
'Maharashtra', 'Social welfare & Empowerment',
'{"occupation": "Construction worker", "residency": "Maharashtra resident"}'::jsonb,
'₹30,000 for first marriage',
'https://www.myscheme.gov.in/schemes/fsme',

-- Maharashtra Scheme 29
('fa', 'Funeral Assistance',
'Under this scheme, the "Maharashtra Building & Other Construction Workers Welfare Board" (MBOCWW) provides financial assistance for funeral expenses of ₹10,000/- to the nominated heir of the deceased registered worker in the event of their death.',
'Maharashtra', 'Social welfare & Empowerment',
'{"occupation": "Construction worker family", "residency": "Maharashtra resident"}'::jsonb,
'₹10,000 for funeral expenses',
'https://www.myscheme.gov.in/schemes/fa',

-- Maharashtra Scheme 30
('gsgos', 'Group Supply Of Goats And Sheep',
'Group supply of goats and sheep refers to the practice of selling or distributing goats and sheep in groups, rather than as individual animals. In Maharashtra, this practice is common among farmers, livestock traders, and cooperative organizations.',
'Maharashtra', 'Business & Entrepreneurship',
'{"occupation": "Tribal farmer", "residency": "Maharashtra resident"}'::jsonb,
'Group supply of goats and sheep',
'https://www.myscheme.gov.in/schemes/gsgos',

-- Maharashtra Scheme 31
('hiip', 'Homes For Intellectually Impaired Persons',
'The "Homes for Intellectually Impaired Persons" is a scheme by the Department of Social Justice & Special Assistance, Govt. of Maharashtra. In this scheme, Mentally Deficient Children who are in need of care and protection are admitted into shelter homes through the Child Welfare Committees.',
'Maharashtra', 'Housing & Shelter',
'{"disability": "Intellectual impairment", "age": "0-18", "residency": "Maharashtra resident"}'::jsonb,
'Shelter home admission and care',
'https://www.myscheme.gov.in/schemes/hiip',

-- Maharashtra Scheme 32
('igteicm', 'Incentive given to Encourage Inter caste Marriages',
'The "Incentive for Encouraging Inter-Caste Marriages" scheme is implemented by the Department of Social Justice & Special Assistance, Government of Maharashtra, and funded jointly by the State and Central Government (50:50). The scheme provides financial incentives to support inter-caste marriages.',
'Maharashtra', 'Women and Child',
'{"caste": "Inter-caste marriage", "residency": "Maharashtra resident"}'::jsonb,
'Financial incentive for inter-caste marriage',
'https://www.myscheme.gov.in/schemes/igteicm',

-- Maharashtra Scheme 33
('igndpsm', 'Indira Gandhi National Disability Pension Scheme (Maharashtra)',
'The "Indira Gandhi National Disability Pension Scheme (Maharashtra)" is implemented by the Social Justice & Special Assistance Dept., Govt. of Maharashtra. The differently-abled individuals aged 18 to 65 years with a disability of 80% and above are eligible to receive a pension of ₹600/- per month.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-65", "disability": "80% or above", "residency": "Maharashtra resident"}'::jsonb,
'₹600 per month pension',
'https://www.myscheme.gov.in/schemes/igndpsm',

-- Maharashtra Scheme 34
('igoapsm', 'Indira Gandhi National Old Age Pension Scheme (Maharashtra)',
'The scheme "Indira Gandhi National Old Age Pension" is a social welfare scheme by the Social Justice & Special Assistance Department, Government of Maharashtra. In this scheme, ₹600 per month is provided to elderly individuals aged 65 years and above from BPL families.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "65+", "income": "BPL", "residency": "Maharashtra resident"}'::jsonb,
'₹600 per month pension',
'https://www.myscheme.gov.in/schemes/igoapsm',

-- Maharashtra Scheme 35
('ignwpsm', 'Indira Gandhi National Widow Pension Scheme (Maharashtra)',
'"Indira Gandhi National Widow Pension Scheme (Maharashtra)" is a scheme by the Social Justice & Special Assistance Dept, Govt of Maharashtra. In this scheme, widows aged 40 to 79 years who are from a BPL family receive a pension of ₹1500/- per month.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "40-79", "gender": "Female", "marital_status": "Widow", "income": "BPL", "residency": "Maharashtra resident"}'::jsonb,
'₹1,500 per month pension',
'https://www.myscheme.gov.in/schemes/ignwpsm',

-- Maharashtra Scheme 36
('kvdgssy', 'Karma Veer Dadasaheb Gaikwad Sabalikaran & Swabhiman Yojana',
'The main objective of this scheme is to improve the financial condition of the scheduled castes and Nav-Buddhists who are landless workers and are from "Below Poverty Line". Only citizens who are permanent residents of Maharashtra are eligible. This scheme is 100% funded by the State Govt.',
'Maharashtra', 'Agriculture,Rural & Environment',
'{"caste": "SC/Nav-Buddhist", "income": "BPL", "occupation": "Landless worker", "residency": "Maharashtra resident"}'::jsonb,
'Loan and subsidy for livelihood',
'https://www.myscheme.gov.in/schemes/kvdgssy',

-- Maharashtra Scheme 37
('kpdgbcpd', 'Karmaveer Padmashri Dadasaheb Gaikwad Birth Centenary And Prize Distribution',
'The "Karmaveer Padmashri Dadasaheb Gaikwad Birth Centenary and Prize Distribution" is an award by the Govt. of Maharashtra. The award is given to individuals and organizations working for the social movement against traditional customs and untouchability and for landless farm workers.',
'Maharashtra', 'Social welfare & Empowerment',
'{"work": "Social reform", "residency": "Maharashtra"}'::jsonb,
'Award and recognition',
'https://www.myscheme.gov.in/schemes/kpdgbcpd',

-- Maharashtra Scheme 38
('l50ss', 'LIDCOM 50% Subsidy Scheme',
'The "50% Subsidy Scheme" is a scheme by LIDCOM, Govt. of Maharashtra. In this scheme, 50% amount is being given as a subsidy on a maximum loan amount of ₹50,000/-. The subsidy is subject to the maximum limit of ₹10,000/-. The bank charge of interest is as per the existing rate.',
'Maharashtra', 'Banking,Financial Services and Insurance',
'{"caste": "Scheduled Caste", "residency": "Maharashtra resident"}'::jsonb,
'50% subsidy up to ₹10,000 on loan',
'https://www.myscheme.gov.in/schemes/l50ss',

-- Maharashtra Scheme 39
('lels', 'LIDCOM Education Loan Scheme',
'The "Education Loan Scheme" is a scheme by the Leather Industries Development Corporation (LIDCOM), Govt. of Maharashtra. In this scheme, finance of upto ₹ 20,00,000 is provided for post graduate students in the 18-50 years age group from Charmakar Community for studies in India and in abroad.',
'Maharashtra', 'Education & Learning',
'{"age": "18-50", "caste": "Charmakar/SC", "education": "Post-graduate", "residency": "Maharashtra resident"}'::jsonb,
'Education loan up to ₹20,00,000',
'https://www.myscheme.gov.in/schemes/lels',

-- Maharashtra Scheme 40
('lgss', 'LIDCOM Gattai Stall Scheme',
'Being implemented by LIDCOM, Govt. of Maharashtra for the Roadsides Cobblers from the (Scheduled Caste) Charmakar Community, this scheme provides a 100% subsidy for the erection of a Tin Stall of Size 4′ x 5′ x 6.5′ costing ₹16367/- per stall and ₹500/- incidental charges.',
'Maharashtra', 'Business & Entrepreneurship',
'{"caste": "Charmakar/SC", "occupation": "Cobbler", "residency": "Maharashtra resident"}'::jsonb,
'100% subsidy for tin stall',
'https://www.myscheme.gov.in/schemes/lgss',

-- Maharashtra Scheme 41
('lmmls', 'LIDCOM Margin Money Loan Scheme',
'In this scheme, for a loan limit from ₹50,001 to ₹5,00,000/-, 20% of the Project cost loan as Seed Capital is paid by the Corporation @ 4% interest per annum. A maximum of ₹10,000/- will be paid as a subsidy by Corporation. A 5% amount of project cost will have to be contributed by the beneficiary.',
'Maharashtra', 'Banking,Financial Services and Insurance',
'{"caste": "Scheduled Caste", "residency": "Maharashtra resident"}'::jsonb,
'Margin money loan with subsidy',
'https://www.myscheme.gov.in/schemes/lmmls',

-- Maharashtra Scheme 42
('lts', 'LIDCOM Training Scheme',
'Being implemented particularly for the Charmakar Community, the "Training Scheme" is a scheme by the Leather Industries Development Corporation (LIDCOM), Govt. of Maharashtra. This scheme is being implemented for the students to enable them to start their own businesses, trade, or get a job.',
'Maharashtra', 'Business & Entrepreneurship',
'{"caste": "Charmakar/SC", "residency": "Maharashtra resident"}'::jsonb,
'Vocational training for employment',
'https://www.myscheme.gov.in/schemes/lts',

-- Maharashtra Scheme 43
('ltltscosmuscp', 'Long Term-Loan to SC Co-op Spinning Mills under Special Component Plan',
'The scheme "Long Term-Loan to SC Co-op Spinning Mills under Special Component Plan" was introduced by the Department of Social Justice & Special Assistance, Government of Maharashtra. The scheme aims to promote the development of spinning mills owned by scheduled caste members.',
'Maharashtra', 'Banking,Financial Services and Insurance',
'{"caste": "Scheduled Caste", "organization": "Cooperative", "residency": "Maharashtra"}'::jsonb,
'Long-term loan for spinning mills',
'https://www.myscheme.gov.in/schemes/ltltscosmuscp',

-- Maharashtra Scheme 44
('mjpjay', 'Mahatma Jyotirao Phule Jan Arogya Yojana',
'The Mahatma Jyotirao Phule Jan Arogya Yojana, launched by the Government of Maharashtra, offers cashless treatment for identified diseases through a network of government and private healthcare providers.',
'Maharashtra', 'Health & Wellness',
'{"income": "Below threshold", "residency": "Maharashtra resident"}'::jsonb,
'Cashless health insurance coverage',
'https://www.myscheme.gov.in/schemes/mjpjay',

-- Maharashtra Scheme 45
('mkym', 'Mahila Kisan Yojana (Maharashtra)',
'"Mahila Kisan Yojana" is implemented by the Dept. of Social Justice & Special Assistance, Govt. of Maharashtra. The scheme aims to uplift the lifestyle of economically disadvantaged Charmakar communities. it supports the production and sale of various types of footwear and leather articles.',
'Maharashtra', 'Social welfare & Empowerment',
'{"gender": "Female", "caste": "Charmakar/SC", "residency": "Maharashtra resident"}'::jsonb,
'Loan and subsidy for women farmers',
'https://www.myscheme.gov.in/schemes/mkym',

-- Maharashtra Scheme 46
('msym', 'Mahila Samridhi Yojana (Maharashtra)',
'"Mahila Samridhi Yojana" is administered by the Dept. of Social Justice & Special Assistance, Govt. of Maharashtra. The scheme aims to uplift economically weaker women from the Charmakar Community. Loans ranging from ₹25,000/- to ₹50,000/- are granted at a low interest rate of 4% p.a.',
'Maharashtra', 'Banking,Financial Services and Insurance',
'{"gender": "Female", "caste": "Charmakar/SC", "residency": "Maharashtra resident"}'::jsonb,
'Loan for women at 4% interest',
'https://www.myscheme.gov.in/schemes/msym',

-- Maharashtra Scheme 47
('mabcstss', 'Maintenance Allowance To Backward Class Students Under Training In Sainik Schools',
'The scheme "Maintenance Allowance to Backward Class Students Under Training in Sainik School" is a Scholarship Scheme by the Social Justice and Special Assistance Department, Government of Maharashtra.',
'Maharashtra', 'Education & Learning',
'{"caste": "VJNT/OBC", "education": "Sainik School", "residency": "Maharashtra resident"}'::jsonb,
'Maintenance allowance for students',
'https://www.myscheme.gov.in/schemes/mabcstss',

-- Maharashtra Scheme 48
('pmavssspc', 'Maintenance Allowance To VJNT And SBC Students Studying In Professional Courses',
'Government of Maharashtra introduced the scheme to complete the education of V.J.N.T and S.B.C students who are the student of professional courses.',
'Maharashtra', 'Social welfare & Empowerment',
'{"caste": "VJNT/SBC", "education": "Professional course", "residency": "Maharashtra resident"}'::jsonb,
'Maintenance allowance for professional students',
'https://www.myscheme.gov.in/schemes/pmavssspc',

-- Maharashtra Scheme 49
('mi-maha', 'Matrimonial Incentives',
'In this scheme, if a Person with Disability (PwD) gets married to a non-disabled person, then the couple is provided a marriage incentive of up to ₹ 50,000. Only citizens who are permanent residents of the state of Maharashtra are eligible to apply for this scheme.',
'Maharashtra', 'Social welfare & Empowerment',
'{"disability": "40% or above", "residency": "Maharashtra resident"}'::jsonb,
'Marriage incentive up to ₹50,000',
'https://www.myscheme.gov.in/schemes/mi-maha',

-- Maharashtra Scheme 50
('matci', 'Medical Assistance for the Treatment of Critical Illness',
'Under this scheme, medical assistance of ₹1,00,000/- for the treatment of serious ailments for registered worker and his/her family members. (the benefit can be availed only after 26th July 2014 as the benefit is covered under the Mediclaim & Personal Accident Insurance scheme).',
'Maharashtra', 'Health & Wellness',
'{"occupation": "Construction worker", "residency": "Maharashtra resident"}'::jsonb,
'₹1,00,000 for critical illness treatment',
'https://www.myscheme.gov.in/schemes/matci',

-- Maharashtra Scheme 51
('ma-maha', 'Merit Awards',
'In the "Merit Awards" scheme, awards are given to the students with disability who rank 1st, 2nd, and 3rd among disabled students in the Secondary School Certificate (S.S.C.) and Higher Secondary Certificate (H.S.C.) in their respective divisional boards of education.',
'Maharashtra', 'Social welfare & Empowerment',
'{"disability": "40% or above", "education": "SSC/HSC", "residency": "Maharashtra resident"}'::jsonb,
'Merit awards for top-ranking students',
'https://www.myscheme.gov.in/schemes/ma-maha',

-- Maharashtra Scheme 52
('msvss', 'Meritorious Scholarships To Vjnt And Sbc Students Studying In Secondary Schools',
'The government of Maharashtra introduced the scheme of meritorious Scholarships to VJNT and SBC students studying in Secondary Schools. To motivate Backward Class students for education.',
'Maharashtra', 'Social welfare & Empowerment',
'{"caste": "VJNT/SBC", "education": "Secondary school", "residency": "Maharashtra resident"}'::jsonb,
'Merit scholarship for secondary students',
'https://www.myscheme.gov.in/schemes/msvss',

-- West Bengal Schemes (29 schemes - completing all 109)

-- West Bengal Scheme 81
('wbafbgia', 'West Bengal Artisans Financial Benefit Scheme 2024: Grant to Individual Artisans',
'"Grant to Individual Artisans" is a sub-scheme under "West Bengal Artisans Financial Benefit Scheme 2024", by the MSME and Textiles Dept, Government of West Bengal, aims to create, support and sustain an enabling ecosystem for strengthening creativity and capacity of the artisans.',
'West Bengal', 'Social welfare & Empowerment',
'{"occupation": "Artisan", "residency": "West Bengal resident"}'::jsonb,
'Financial grant for artisans',
'https://www.myscheme.gov.in/schemes/wbafbgia',

-- West Bengal Scheme 82
('wbafbsgics', 'West Bengal Artisans Financial Benefit Scheme 2024: Grant to Industrial Cooperative Society',
'"Grant to Industrial Cooperative Society" is a sub-scheme under "West Bengal Artisans Financial Benefit Scheme 2024", by the MSME and Textiles Dept, Government of West Bengal. It aims to create, support and sustain an enabling ecosystem for strengthening creativity and capacity of the artisans.',
'West Bengal', 'Business & Entrepreneurship',
'{"organization": "Cooperative society", "residency": "West Bengal"}'::jsonb,
'Grant for cooperative societies',
'https://www.myscheme.gov.in/schemes/wbafbsgics',

-- West Bengal Scheme 83
('wbafbsfs', 'West Bengal Artisans Financial Benefit Scheme: Facilitation Supports',
'"Facilitation Supports" is a sub-scheme under "West Bengal Artisans Financial Benefit Scheme 2024", implemented by the MSME and Textiles Dept, Government of West Bengal. It aims to provide various types of facilitation support to the artisans and Industrial Cooperative Societies.',
'West Bengal', 'Business & Entrepreneurship',
'{"occupation": "Artisan", "residency": "West Bengal resident"}'::jsonb,
'Facilitation support for artisans',
'https://www.myscheme.gov.in/schemes/wbafbsfs',

-- West Bengal Scheme 84
('wbafbssdm', 'West Bengal Artisans Financial Benefit Scheme: Support for Digital Marketing',
'"Support for Digital Marketing" is a sub-scheme under "West Bengal Artisans Financial Benefit Scheme", by the MSME and Textiles Dept, Government of West Bengal, aims to provide access to digital markets and e-commerce to the artisans.',
'West Bengal', 'Business & Entrepreneurship',
'{"occupation": "Artisan", "residency": "West Bengal resident"}'::jsonb,
'Digital marketing support',
'https://www.myscheme.gov.in/schemes/wbafbssdm',

-- West Bengal Scheme 85
('wbfs', 'West Bengal Freeship Scheme',
'The West Bengal Freeship Scheme (WBFS)has been launched by the Department of Higher Education, Government of West Bengal. This freeship would be provided as a tuition fee waiver for the under Graduate students level in Engineering & Technology/ Pharmacy/ Architecture.',
'West Bengal', 'Education & Learning',
'{"education": "UG Engineering/Pharmacy/Architecture", "residency": "West Bengal resident"}'::jsonb,
'Tuition fee waiver',
'https://www.myscheme.gov.in/schemes/wbfs',

-- West Bengal Scheme 86
('aihw', 'West Bengal Handloom and Khadi Weavers Financial Benefit Scheme 2024: Assistance to Individual Handloom Weaver',
'"Assistance to Individual Handloom Weaver" is a sub-scheme under "West Bengal Handloom and Khadi Weavers Financial Benefit Scheme 2024", implemented by the MSME and Textiles Dept, Government of West Bengal aims to provide one-time financial assistance to the individual Handloom weavers.',
'West Bengal', 'Business & Entrepreneurship',
'{"occupation": "Handloom weaver", "residency": "West Bengal resident"}'::jsonb,
'One-time financial assistance',
'https://www.myscheme.gov.in/schemes/aihw',

-- West Bengal Scheme 87
('avpv', 'West Bengal Handloom and Khadi Weavers Financial Benefit Scheme 2024: Assistance to Viable and Potentially Viable PWCS',
'"Assistance to Viable and Potentially Viable PWCS" is a sub-scheme under "West Bengal Handloom and Khadi Weavers Financial Benefit Scheme 2024", by the MSME and Textiles Dept, Government of West Bengal aims to provide financial assistance to the societies who will fulfill the criteria of viability.',
'West Bengal', 'Business & Entrepreneurship',
'{"organization": "PWCS", "residency": "West Bengal"}'::jsonb,
'Financial assistance for viable societies',
'https://www.myscheme.gov.in/schemes/avpv',

-- West Bengal Scheme 88
('syssr', 'West Bengal Handloom and Khadi Weavers Financial Benefit Scheme 2024: Supply of Yarn to Societies etc. at Subsidized Rate',
'"Supply of Yarn to Societies etc. at Subsidized Rate" is a sub-scheme under "West Bengal Handloom and Khadi Weavers Financial Benefit Scheme 2024", by the MSME and Textiles Dept, Government of West Bengal aims to provide supply of subsidized yarn to the PWCS, Khadi Weavers\' Societies etc.',
'West Bengal', 'Business & Entrepreneurship',
'{"organization": "Weaver society", "residency": "West Bengal"}'::jsonb,
'Subsidized yarn supply',
'https://www.myscheme.gov.in/schemes/syssr',

-- West Bengal Scheme 89
('otsnpa', 'West Bengal Handloom and Khadi Weavers Financial Benefit Scheme 2024: Support for One Time Settlement (OTS) of NPA Accounts of PWCS',
'"Support for One Time Settlement (OTS) of NPA Accounts of PWCS" is a sub-scheme under "West Bengal Handloom and Khadi Weavers Financial Benefit Scheme 2024" by the MSME and Textiles Dept, Government of West Bengal aims to make PWCS debt free by providing financial support for OTS of NPA accounts.',
'West Bengal', 'Business & Entrepreneurship',
'{"organization": "PWCS with NPA", "residency": "West Bengal"}'::jsonb,
'OTS support for NPA accounts',
'https://www.myscheme.gov.in/schemes/otsnpa',

-- West Bengal Scheme 90
('saipcar', 'West Bengal Incentive Scheme for Approved Industrial Park (SAIP) for MSMEs: Construction of Approach Road',
'The "Construction of Approach Road" under the "SAIP for MSMEs" scheme, facilitates the Private Industrial Park in provision with Approach Road catering to the AIP.',
'West Bengal', 'Business & Entrepreneurship',
'{"organization": "Industrial park", "residency": "West Bengal"}'::jsonb,
'Subsidy for approach road construction',
'https://www.myscheme.gov.in/schemes/saipcar',

-- West Bengal Scheme 91
('saipibeci', 'West Bengal Incentive Scheme for Approved Industrial Park (SAIP) for MSMEs: Incentive for Basic and Essential Common Infrastructure Facilities',
'The "Incentive for Basic and Essential Common Infrastructure Facilities" under the "SAIP for MSMEs" scheme, aims to provide one time back-ended incentive for development of Basic and Essential Common Infrastructure Facilities based on land area.',
'West Bengal', 'Business & Entrepreneurship',
'{"organization": "Industrial park", "residency": "West Bengal"}'::jsonb,
'Infrastructure development incentive',
'https://www.myscheme.gov.in/schemes/saipibeci',

-- West Bengal Scheme 92
('saipicetp', 'West Bengal Incentive Scheme for Approved Industrial Park (SAIP) for MSMEs: Incentive for Common Effluent Treatment Plant (CETP)',
'The "Incentive for Common Effluent Treatment Plant (CETP)" under the "SAIP for MSMEs" scheme, aims to provide reimbursement for installation of CETP, wherever applicable, based on land area of AIP.',
'West Bengal', 'Business & Entrepreneurship',
'{"organization": "Industrial park", "residency": "West Bengal"}'::jsonb,
'CETP installation reimbursement',
'https://www.myscheme.gov.in/schemes/saipicetp',

-- West Bengal Scheme 93
('saipispss', 'West Bengal Incentive Scheme for Approved Industrial Park (SAIP) for MSMEs: Incentive for Setting up a Power Sub Station',
'The "Incentive for Setting up a Power Sub Station" under the "SAIP for MSMEs" scheme, facilitates the Private Industrial Park in the provision of quality power.',
'West Bengal', 'Business & Entrepreneurship',
'{"organization": "Industrial park", "residency": "West Bengal"}'::jsonb,
'Power sub-station setup incentive',
'https://www.myscheme.gov.in/schemes/saipispss',

-- West Bengal Scheme 94
('saiprsd', 'West Bengal Incentive Scheme for Approved Industrial Park (SAIP) for MSMEs: Reimbursement of Stamp Duty',
'"Reimbursement of Stamp Duty" under the "SAIP for MSMEs" scheme, aims to provide reimbursement of stamp duty paid by the SPV for registration of land documents.',
'West Bengal', 'Business & Entrepreneurship',
'{"organization": "Industrial park SPV", "residency": "West Bengal"}'::jsonb,
'Stamp duty reimbursement',
'https://www.myscheme.gov.in/schemes/saiprsd',

-- West Bengal Scheme 95
('wbmwwsad', 'West Bengal Migrant Workers'' Welfare Scheme: Accidental Disability',
'"West Bengal Migrant Workers' Welfare Scheme: Accidental Disability" is a social welfare scheme by the West Bengal Migrant Workers' Welfare Board, that provides one-time assistance to the registered Migrant Worker in case of disability arising out of accidents during work.',
'West Bengal', 'Social welfare & Empowerment',
'{"occupation": "Migrant worker", "residency": "West Bengal resident"}'::jsonb,
'One-time assistance for accidental disability',
'https://www.myscheme.gov.in/schemes/wbmwwsad',

-- West Bengal Scheme 96
('wbmwwsca', 'West Bengal Migrant Workers'' Welfare Scheme: Cremation',
'"West Bengal Migrant Workers' Welfare Scheme: Cremation" is a social welfare scheme by the West Bengal Migrant Workers' Welfare Board, Labour Dept., Government of West Bengal, that provides an one time assistance to the nominee of the worker for cremation when the worker dies.',
'West Bengal', 'Social welfare & Empowerment',
'{"occupation": "Migrant worker family", "residency": "West Bengal"}'::jsonb,
'Cremation assistance',
'https://www.myscheme.gov.in/schemes/wbmwwsca',

-- West Bengal Scheme 97
('wbmwwsda', 'West Bengal Migrant Workers'' Welfare Scheme: Death Assistance',
'"West Bengal Migrant Workers' Welfare Scheme: Death Assistance" is a social welfare scheme by the West Bengal Migrant Workers' Welfare Board, Labour Dept., Government of West Bengal, that provides an one time assistance to the nominee in case of natural death/accidental death of the migrant worker.',
'West Bengal', 'Social welfare & Empowerment',
'{"occupation": "Migrant worker family", "residency": "West Bengal"}'::jsonb,
'Death assistance to nominee',
'https://www.myscheme.gov.in/schemes/wbmwwsda',

-- West Bengal Scheme 98
('wbmwwsc', 'West Bengal Migrant Workers'' Welfare Scheme: Repatriation of Dead Body',
'"West Bengal Migrant Workers' Welfare Scheme: Repatriation of Dead Body" is a social welfare scheme implemented by the West Bengal Migrant Workers' Welfare Board, that provides an one time assistance to the nominee for bringing the dead body of the registered migrant worker in case of death.',
'West Bengal', 'Social welfare & Empowerment',
'{"occupation": "Migrant worker family", "residency": "West Bengal"}'::jsonb,
'Repatriation assistance',
'https://www.myscheme.gov.in/schemes/wbmwwsc',

-- West Bengal Scheme 99
('wbsccs', 'West Bengal Student Credit Card Scheme',
'The Higher Education Department, Government of West Bengal has introduced the Student Credit Card Scheme for the students of West Bengal to enable them to pursue higher education without having any financial constraints.',
'West Bengal', 'Education & Learning',
'{"education": "Higher education", "residency": "West Bengal resident"}'::jsonb,
'Education loan through credit card',
'https://www.myscheme.gov.in/schemes/wbsccs',

-- West Bengal Scheme 100
('wbtisrsdre', 'West Bengal Textile Incentive Scheme: Reimbursement of Stamp Duty and Registration Fee',
'"Reimbursement of Stamp Duty and Registration Fee" incentives under "West Bengal Textile Incentive Scheme" scheme implemented by the Dept. of MSME&T, Government of West Bengal, aims to provide a reimbursement of stamp duty and registration fee paid by the eligible textile sector enterprises for',
'West Bengal', 'Business & Entrepreneurship',
'{"industry": "Textile", "residency": "West Bengal"}'::jsonb,
'Stamp duty and registration fee reimbursement',
'https://www.myscheme.gov.in/schemes/wbtisrsdre',

-- West Bengal Scheme 101
('wbtwsae', 'West Bengal Transport Workers'' Social Security Scheme: Assistance for Education of Children',
'This scheme provides financial support to beneficiaries for their children\'s (maximum two) education at various levels, including higher secondary, graduation, post-graduation, and professional courses like engineering and medical studies.',
'West Bengal', 'Education & Learning',
'{"occupation": "Transport worker", "residency": "West Bengal resident"}'::jsonb,
'Education assistance for children',
'https://www.myscheme.gov.in/schemes/wbtwsae',

-- West Bengal Scheme 102
('wbtwsam', 'West Bengal Transport Workers'' Social Security Scheme: Assistance for Marriage',
'The scheme provides financial aid for the marriage of eligible beneficiaries or their dependent sons/daughters (up to two marriages).',
'West Bengal', 'Social welfare & Empowerment',
'{"occupation": "Transport worker", "residency": "West Bengal resident"}'::jsonb,
'Marriage assistance',
'https://www.myscheme.gov.in/schemes/wbtwsam',

-- West Bengal Scheme 103
('wbtwsaps', 'West Bengal Transport Workers'' Social Security Scheme: Assistance for Purchase of Spectacles',
'This scheme provides financial assistance to eligible beneficiaries every 5 years to support the purchase of spectacles, ensuring better eye health and vision.',
'West Bengal', 'Social welfare & Empowerment',
'{"occupation": "Transport worker", "residency": "West Bengal resident"}'::jsonb,
'Spectacle purchase assistance',
'https://www.myscheme.gov.in/schemes/wbtwsaps',

-- West Bengal Scheme 104
('wbtwssadpd', 'West Bengal Transport Workers'' Social Security Scheme: Assistance on Death and Permanent Disablement',
'The scheme provides financial relief to the beneficiaries in case of permanent disability due to accidents or their dependents/nominees in case of accidental or natural death.',
'West Bengal', 'Health & Wellness',
'{"occupation": "Transport worker", "residency": "West Bengal resident"}'::jsonb,
'Death and disability assistance',
'https://www.myscheme.gov.in/schemes/wbtwssadpd',

-- West Bengal Scheme 105
('wbtwssah', 'West Bengal Transport Workers'' Social Security Scheme: Assistance on Hospitalization',
'The scheme provides financial assistance to transport workers who are hospitalized for 5 or more days due to an accident.',
'West Bengal', 'Health & Wellness',
'{"occupation": "Transport worker", "residency": "West Bengal resident"}'::jsonb,
'Hospitalization assistance',
'https://www.myscheme.gov.in/schemes/wbtwssah',

-- West Bengal Scheme 106
('wbtwssfp', 'West Bengal Transport Workers'' Social Security Scheme: Family Pension',
'Under this scheme, beneficiaries, upon retirement or unfortunate demise, will have 50% of their last drawn amount transferred monthly to their families through a Direct Benefit Transfer (DBT) system.',
'West Bengal', 'Social welfare & Empowerment',
'{"occupation": "Transport worker family", "residency": "West Bengal resident"}'::jsonb,
'Family pension',
'https://www.myscheme.gov.in/schemes/wbtwssfp',

-- West Bengal Scheme 107
('wbtwsfe', 'West Bengal Transport Workers'' Social Security Scheme: Funeral Expenses',
'The scheme provides monetary support to help cover funeral costs in the unfortunate event of a beneficiary\'s demise.',
'West Bengal', 'Social welfare & Empowerment',
'{"occupation": "Transport worker family", "residency": "West Bengal"}'::jsonb,
'Funeral expense assistance',
'https://www.myscheme.gov.in/schemes/wbtwsfe',

-- West Bengal Scheme 108
('wbtwsmb', 'West Bengal Transport Workers'' Social Security Scheme: Maternity Benefit',
'This scheme provides financial assistance to a beneficiary on successful delivery of a child or miscarriage by such beneficiary or his wife.',
'West Bengal', 'Women and Child',
'{"gender": "Female", "occupation": "Transport worker or spouse", "residency": "West Bengal resident"}'::jsonb,
'Maternity benefit',
'https://www.myscheme.gov.in/schemes/wbtwsmb',

-- West Bengal Scheme 109
('wbtwsmbma', 'West Bengal Transport Workers'' Social Security Scheme: Medical Benefit for Major Ailments',
'This scheme provides financial assistance for the treatment of beneficiaries or their family members suffering from major ailments like cancer, TB, brain stroke, cardiac problems, and others.',
'West Bengal', 'Health & Wellness',
'{"occupation": "Transport worker", "residency": "West Bengal resident"}'::jsonb,
'Medical benefit for major ailments',
'https://www.myscheme.gov.in/schemes/wbtwsmbma',

-- West Bengal Scheme 110 (Bonus - completing the set)
('wbtwssp', 'West Bengal Transport Workers'' Social Security Scheme: Pension',
'The scheme provides pension benefits to transport workers of the state upon reaching 60 years of age.',
'West Bengal', 'Social welfare & Empowerment',
'{"age": "60+", "occupation": "Transport worker", "residency": "West Bengal resident"}'::jsonb,
'Monthly pension for transport workers',
'https://www.myscheme.gov.in/schemes/wbtwssp',
