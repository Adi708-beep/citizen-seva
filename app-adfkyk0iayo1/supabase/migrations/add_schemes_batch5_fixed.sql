-- Batch 5: Add 69 schemes (40 Maharashtra + 29 West Bengal)
-- Target: Reach 241 total schemes with balanced state distribution

-- Insert Maharashtra schemes (40 schemes)
INSERT INTO schemes (id, name, description, state, category, eligibility_criteria, benefits, required_documents, application_url)
VALUES
-- Maharashtra Scheme 1
('aabym', 'Aam Aadmi Bima Yojana (Maharashtra)', 
'The "Aam Aadmi Bima Yojana" scheme is implemented by the Social Justice & Special Assistance Department, Government of Maharashtra. This Centrally Sponsored Scheme is aimed at providing insurance and scholarship benefits to landless labourers in rural areas, aged 18 to 59 years.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-59", "income": "Below poverty line", "occupation": "Landless labourer", "residency": "Maharashtra resident"}'::jsonb,
'Insurance and scholarship benefits',
NULL,
'https://www.myscheme.gov.in/schemes/aabym'),

-- Maharashtra Scheme 2
('awvsssi', 'Award Of Stipend To VJNT And SBC Students Studying In ITI',
'The Government of Maharashtra launched a scheme that provides to encourage Vimukta Jati and Nomadic Tribes (V.J.N.T.) & Special Backward Class (S.B.C.) students and promote the interest in Technical education.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-35", "category": "VJNT/SBC", "education": "ITI student", "residency": "Maharashtra resident"}'::jsonb,
'Stipend for ITI students',
NULL,
'https://www.myscheme.gov.in/schemes/awvsssi'),

-- Maharashtra Scheme 3
('bhausaheb-fundkar-horticulture-plantataion-scheme', 'Bhausaheb Fundkar Falbag Lagvad Scheme',
'This scheme includes, Plantation of sixteen perennial horticulture crops. Farmer from Konkan division can avail benefit of 0.10 Hector to 10.00 Hector and rest Of Maharashtra 0.20 Hector to 6.00 Hector',
'Maharashtra', 'Agriculture,Rural & Environment',
'{"age": "18-70", "occupation": "Farmer", "land": "0.10-10 hectares", "residency": "Maharashtra resident"}'::jsonb,
'Direct benefit transfer for horticulture plantation',
NULL,
'https://www.myscheme.gov.in/schemes/bhausaheb-fundkar-horticulture-plantataion-scheme'),

-- Maharashtra Scheme 4
('cmegp', 'CHIEF MINISTER EMPLOYMENT GENERATION PROGRAMME (CMEGP)',
'Government of Maharashtra has approved the introduction of a new credit linked subsidy program called Chief Minister Employment Generation Program(CMEGP) for generation of employment opportunities through establishment of Micro & Small Enterprises in rural as well as urban areas in state.',
'Maharashtra', 'Business & Entrepreneurship',
'{"age": "18-45", "category": "SC/ST/OBC/Female/PwD/VJNT", "residency": "Maharashtra resident"}'::jsonb,
'Credit linked subsidy for micro and small enterprises',
NULL,
'https://www.myscheme.gov.in/schemes/cmegp'),

-- Maharashtra Scheme 5
('chief-minister-sustainable-agriculture-irrigation-scheme', 'Chief Minister Sustainable Agriculture Irrigation Scheme - Magel Tyala Shettale (Individual Farm Pond)',
'Under this scheme subsidy payable to individual farmer is minimum Rs.14433/- and maximum Rs.75000/- depending on the size of the farm pond.',
'Maharashtra', 'Agriculture,Rural & Environment',
'{"age": "18-70", "occupation": "Farmer", "residency": "Maharashtra resident"}'::jsonb,
'Subsidy for individual farm pond construction (₹14,433 - ₹75,000)',
NULL,
'https://www.myscheme.gov.in/schemes/chief-minister-sustainable-agriculture-irrigation-scheme'),

-- Maharashtra Scheme 6
('cts-maharashtra', 'Craftsman Training Scheme - Maharashtra',
'The "Craftsman Training Scheme" provides vocational training to individuals, enhancing their skill & employability. This stipend aims to support the trainees financially & encourage them to pursue & complete their vocational training, thereby contributing to skilled manpower development in the state',
'Maharashtra', 'Skills & Employment',
'{"age": "14-40", "education": "8th pass or above", "residency": "Maharashtra resident"}'::jsonb,
'Stipend during vocational training',
NULL,
'https://www.myscheme.gov.in/schemes/cts-maharashtra'),

-- Maharashtra Scheme 7
('drpdhma', 'Dr. Panjabrao Deshmukh Hostel Maintenance Allowance',
'This scheme is for the Students whose parent''s annual Income is below 800000 and Students whose parents are Marginal Land Holder and registered laborers.',
'Maharashtra', 'Education & Learning',
'{"age": "18-25", "income": "Below ₹8,00,000", "occupation": "Student", "residency": "Maharashtra resident"}'::jsonb,
'Hostel maintenance allowance',
NULL,
'https://www.myscheme.gov.in/schemes/drpdhma'),

-- Maharashtra Scheme 8
('eafdc', 'Educational Assistance for Degree Course',
'The Educational Assistance for Degree Course scheme provides financial assistance to children of registered construction workers pursuing their undergraduate degree (1st, 2nd, 3rd, and 4th year, if applicable). This benefit is also extended to the wife of a registered male worker.',
'Maharashtra', 'Education & Learning',
'{"age": "18-25", "occupation": "Construction worker family", "education": "Degree student", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for degree courses',
NULL,
'https://www.myscheme.gov.in/schemes/eafdc'),

-- Maharashtra Scheme 9
('eagrdc', 'Educational Assistance for Government Recognised Diploma Courses',
'The Educational Assistance for Government Recognised Diploma Courses scheme is designed to financially support children of registered construction workers, providing ₹20,000 per year for diploma courses and ₹25,000/- per year for postgraduate diploma courses.',
'Maharashtra', 'Education & Learning',
'{"age": "18-30", "occupation": "Construction worker family", "education": "Diploma student", "residency": "Maharashtra resident"}'::jsonb,
'₹20,000 for diploma, ₹25,000 for PG diploma per year',
NULL,
'https://www.myscheme.gov.in/schemes/eagrdc'),

-- Maharashtra Scheme 10
('eafmaec', 'Educational Assistance for Medical and Engineering Courses',
'The Maharashtra Building and Other Construction Workers Welfare Board provides educational assistance to the children and spouses of registered construction workers pursuing medical and engineering degrees.',
'Maharashtra', 'Education & Learning',
'{"age": "18-30", "occupation": "Construction worker family", "education": "Medical/Engineering student", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for medical and engineering courses',
NULL,
'https://www.myscheme.gov.in/schemes/eafmaec'),

-- Maharashtra Scheme 11
('eatt10t12s', 'Educational Assistance to the 10th to 12th Students',
'The Educational Assistance to the 10th to 12th Students scheme was launched by the Maharashtra Building And Other Construction Workers Welfare Board (MBOCWW), Labour Department Maharashtra.',
'Maharashtra', 'Education & Learning',
'{"age": "15-19", "occupation": "Construction worker family", "education": "10th-12th student", "residency": "Maharashtra resident"}'::jsonb,
'Educational assistance for secondary students',
NULL,
'https://www.myscheme.gov.in/schemes/eatt10t12s'),

-- Maharashtra Scheme 12
('eacrws11a12s', 'Educational Assistance to the Children of the Registered Worker Studying in 11th and 12th Standard',
'The "Educational Assistance" scheme provides financial support of ₹10,000 per year to children of registered construction workers who are studying in the 11th or 12th standard. The benefit applies to a maximum of two children per worker and extends to the wife of a registered male worker.',
'Maharashtra', 'Education & Learning',
'{"age": "16-19", "occupation": "Construction worker family", "education": "11th-12th student", "residency": "Maharashtra resident"}'::jsonb,
'₹10,000 per year for 11th-12th students',
NULL,
'https://www.myscheme.gov.in/schemes/eacrws11a12s'),

-- Maharashtra Scheme 13
('eacs1t7a8t10', 'Educational Assistance to the Children Studying in 1st to 7th and 8th to 10th Class',
'Under this scheme, educational assistance is provided of ₹2,500/- to the children studying in 1st to 7th standard and ₹5,000/- for the children studying in 8th to 10th standard of the registered construction worker. The scheme covers up to two children and the wife of a registered male worker.',
'Maharashtra', 'Education & Learning',
'{"age": "6-16", "occupation": "Construction worker family", "education": "1st-10th student", "residency": "Maharashtra resident"}'::jsonb,
'₹2,500 for 1st-7th, ₹5,000 for 8th-10th',
NULL,
'https://www.myscheme.gov.in/schemes/eacs1t7a8t10'),

-- Maharashtra Scheme 14
('faaadp', 'Financial Assistance For Aids And Appliances For Disabled Persons',
'The "Financial Assistance for Aids and Appliances for Disabled Persons" is a scheme by the Govt. of Maharashtra. The objective of this scheme is to provide assistance to Persons with Disabilities (PwDs) for the purchase of aids and appliances as per their age group and the type of disability.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "0-100", "disability": "40% or above", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for aids and appliances',
NULL,
'https://www.myscheme.gov.in/schemes/faaadp'),

-- Maharashtra Scheme 15
('fagcaha18', 'Financial Assistance for Girl Child Attend Her Age of 18',
'The Financial Assistance for Girl Child Attend Her Age of 18 scheme provides financial assistance in the form of a fixed deposit of ₹1,00,000/- for each female child of a registered worker or spouse who has undergone a family planning operation after the birth of one female child.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18", "gender": "Female", "occupation": "Construction worker family", "residency": "Maharashtra resident"}'::jsonb,
'Fixed deposit of ₹1,00,000 at age 18',
NULL,
'https://www.myscheme.gov.in/schemes/fagcaha18'),

-- Maharashtra Scheme 16
('fafnd', 'Financial Assistance for Natural Death',
'The scheme "Financial Assistance for Natural Death" was launched by the Maharashtra Building & Other Construction Workers Welfare Board (MBOCWW), Labour Department Maharashtra. Under the scheme, the Board provides financial assistance of ₹2,00,000/- to the legal heir of a registered worker who dies.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-100", "occupation": "Construction worker", "residency": "Maharashtra resident"}'::jsonb,
'₹2,00,000 to legal heir on natural death',
NULL,
'https://www.myscheme.gov.in/schemes/fafnd'),

-- Maharashtra Scheme 17
('fandsd', 'Financial Assistance for Normal Delivery and Surgical Delivery',
'The "Financial Assistance for Normal Delivery and Surgical Delivery" scheme was launched by the Maharashtra Building And Other Construction Workers Welfare Board (MBOCWW), Labour Department Maharashtra.',
'Maharashtra', 'Women and Child',
'{"age": "18-45", "gender": "Female", "occupation": "Construction worker family", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for delivery',
NULL,
'https://www.myscheme.gov.in/schemes/fandsd'),

-- Maharashtra Scheme 18
('fawwrcw', 'Financial Assistance for Widow or Widower of Registered Construction Worker',
'The scheme is implemented by the Maharashtra Building and Other Construction Workers Welfare Board. Under this scheme, financial assistance of ₹24,000/- p.a. up to 5 years to the widow or widower in case of death of a registered worker during the course of employment.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-100", "occupation": "Construction worker family", "marital_status": "Widow/Widower", "residency": "Maharashtra resident"}'::jsonb,
'₹24,000 per year for 5 years',
NULL,
'https://www.myscheme.gov.in/schemes/fawwrcw'),

-- Maharashtra Scheme 19
('fat75opd', 'Financial Assistance to 75% or Permanent Disability',
'The Financial Assistance to 75% or Permanent Disability was launched by the Maharashtra Building & Other Construction Workers Welfare Board (MBOCWW), Labor Department Maharashtra. In scheme, financial assistance of ₹2,00,000/- to the registered worker in case of 75 % or more permanent disability.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-60", "disability": "75% or above", "occupation": "Construction worker", "residency": "Maharashtra resident"}'::jsonb,
'₹2,00,000 for 75% or more permanent disability',
NULL,
'https://www.myscheme.gov.in/schemes/fat75opd'),

-- Maharashtra Scheme 20
('fadse', 'Financial Assistance To Disabled For Self Employment',
'The objective of this scheme is to facilitate the self-employment of unemployed disabled persons. Under this scheme, financial assistance is provided to persons with disabilities for self-employment, small-scale business, and agro-based project. This scheme is 100% funded by Govt. of Maharashtra.',
'Maharashtra', 'Skills & Employment',
'{"age": "18-55", "disability": "40% or above", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for self-employment',
NULL,
'https://www.myscheme.gov.in/schemes/fadse'),

-- Maharashtra Scheme 21
('fatnukyv', 'Financial Assistance to Newlyweds under Kanyadan Yojana (Vijabhaj)',
'"Financial Assistance to Newlyweds under Kanyadan Yojana (Vijabhaj)" was launched by the Dept of Social Justice & Special Assistance, Govt of Maharashtra. The scheme aims to reduce the economic, social, and educational backwardness of Scheduled Castes, Freed Castes, Nomadic Tribes, etc.',
'Maharashtra', 'Women and Child',
'{"age": "18-35", "category": "SC/ST/NT", "marital_status": "Newlywed", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for marriage',
NULL,
'https://www.myscheme.gov.in/schemes/fatnukyv'),

-- Maharashtra Scheme 22
('fasetdp', 'Financial Assistance To Self-Employment For Trained Disabled Persons',
'The "Financial Assistance to Self-Employment for Trained Disabled Persons" is a scheme by the Govt. of Maharashtra. The objective of this scheme is to provide financial assistance to facilitate the purchase of equipment for those disabled persons who are completing their vocational training.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-55", "disability": "40% or above", "education": "Vocational training completed", "residency": "Maharashtra resident"}'::jsonb,
'Financial assistance for equipment purchase',
NULL,
'https://www.myscheme.gov.in/schemes/fasetdp'),

-- Maharashtra Scheme 23
('fsme', 'First Self Marriage Expenses',
'The Maharashtra Building and Other Construction Workers Welfare Board implemented the "First Self Marriage Expenses" scheme. Under this scheme, financial assistance of ₹30,000/- towards the first self marriage expenses to the registered worker.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-35", "occupation": "Construction worker", "marital_status": "Unmarried", "residency": "Maharashtra resident"}'::jsonb,
'₹30,000 for first marriage',
NULL,
'https://www.myscheme.gov.in/schemes/fsme'),

-- Maharashtra Scheme 24
('fa', 'Funeral Assistance',
'Under this scheme, the "Maharashtra Building & Other Construction Workers Welfare Board" (MBOCWW) provides financial assistance for funeral expenses of ₹10,000/- to the nominated heir of the deceased registered worker in the event of their death.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-100", "occupation": "Construction worker", "residency": "Maharashtra resident"}'::jsonb,
'₹10,000 for funeral expenses',
NULL,
'https://www.myscheme.gov.in/schemes/fa'),

-- Maharashtra Scheme 25
('gopinath-munde-shetkari-apghat-suraksha-sanugrah-audhan-yojana', 'Gopinath Munde Shetkari Apghat Suraksha Sanugrah Audhan Yojana',
'In order to give financial support to the aggrieved family members of the ill-fated farmers the State Govt. has provided accident claim cover through Gopinath Munde Shetkari Apghat Suraksha Sanugrah Audhan Yojana in the year 2023-24.',
'Maharashtra', 'Agriculture,Rural & Environment',
'{"age": "18-70", "occupation": "Farmer", "residency": "Maharashtra resident"}'::jsonb,
'Accident claim cover for farmers',
NULL,
'https://www.myscheme.gov.in/schemes/gopinath-munde-shetkari-apghat-suraksha-sanugrah-audhan-yojana'),

-- Maharashtra Scheme 26
('gaoah', 'Grant In Aid To Old Age Home',
'The "Grant in Aid to Old Age Home" is a scheme by the Dept. of Social Justice & Special Assistance, Govt. of Maharashtra. In this scheme, grants are provided to the NGOs for accommodating old men & women, destitute, disabled victims, into Old Age Homes, and providing them with food, & accommodation.',
'Maharashtra', 'Housing & Shelter',
'{"age": "60-100", "residency": "Maharashtra resident"}'::jsonb,
'Grant to NGOs for old age homes',
NULL,
'https://www.myscheme.gov.in/schemes/gaoah'),

-- Maharashtra Scheme 27
('gsgos', 'Group Supply Of Goats And Sheep',
'Group supply of goats and sheep refers to the practice of selling or distributing goats and sheep in groups, rather than as individual animals. In Maharashtra, this practice is common among farmers, livestock traders, and cooperative organizations.',
'Maharashtra', 'Business & Entrepreneurship',
'{"age": "18-60", "occupation": "Farmer/Tribal", "residency": "Maharashtra resident"}'::jsonb,
'Group supply of goats and sheep',
NULL,
'https://www.myscheme.gov.in/schemes/gsgos'),

-- Maharashtra Scheme 28
('hiip', 'Homes For Intellectually Impaired Persons',
'The "Homes for Intellectually Impaired Persons" is a scheme by the Department of Social Justice & Special Assistance, Govt. of Maharashtra. In this scheme, Mentally Deficient Children who are in need of care and protection are admitted into shelter homes through the Child Welfare Committees.',
'Maharashtra', 'Housing & Shelter',
'{"age": "0-18", "disability": "Intellectual impairment", "residency": "Maharashtra resident"}'::jsonb,
'Shelter homes for intellectually impaired children',
NULL,
'https://www.myscheme.gov.in/schemes/hiip'),

-- Maharashtra Scheme 29
('igteicm', 'Incentive given to Encourage Inter caste Marriages',
'The "Incentive for Encouraging Inter-Caste Marriages" scheme is implemented by the Department of Social Justice & Special Assistance, Government of Maharashtra, and funded jointly by the State and Central Government (50:50). The scheme provides financial incentives to support inter-caste marriages.',
'Maharashtra', 'Women and Child',
'{"age": "18-35", "marital_status": "Inter-caste marriage", "residency": "Maharashtra resident"}'::jsonb,
'Financial incentive for inter-caste marriages',
NULL,
'https://www.myscheme.gov.in/schemes/igteicm'),

-- Maharashtra Scheme 30
('igndpsm', 'Indira Gandhi National Disability Pension Scheme (Maharashtra)',
'The "Indira Gandhi National Disability Pension Scheme (Maharashtra)" is implemented by the Social Justice & Special Assistance Dept., Govt. of Maharashtra. The differently-abled individuals aged 18 to 65 years with a disability of 80% and above are eligible to receive a pension of ₹600/- per month.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-65", "disability": "80% or above", "income": "Below poverty line", "residency": "Maharashtra resident"}'::jsonb,
'₹600 per month pension',
NULL,
'https://www.myscheme.gov.in/schemes/igndpsm'),

-- Maharashtra Scheme 31
('igoapsm', 'Indira Gandhi National Old Age Pension Scheme (Maharashtra)',
'The scheme "Indira Gandhi National Old Age Pension" is a social welfare scheme by the Social Justice & Special Assistance Department, Government of Maharashtra. In this scheme, ₹600 per month is provided to elderly individuals aged 65 years and above from BPL families.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "65-100", "income": "Below poverty line", "residency": "Maharashtra resident"}'::jsonb,
'₹600 per month pension',
NULL,
'https://www.myscheme.gov.in/schemes/igoapsm'),

-- Maharashtra Scheme 32
('ignwpsm', 'Indira Gandhi National Widow Pension Scheme (Maharashtra)',
'"Indira Gandhi National Widow Pension Scheme (Maharashtra)" is a scheme by the Social Justice & Special Assistance Dept, Govt of Maharashtra. In this scheme, widows aged 40 to 79 years who are from a BPL family receive a pension of ₹1500/- per month.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "40-79", "gender": "Female", "marital_status": "Widow", "income": "Below poverty line", "residency": "Maharashtra resident"}'::jsonb,
'₹1,500 per month pension',
NULL,
'https://www.myscheme.gov.in/schemes/ignwpsm'),

-- Maharashtra Scheme 33
('kvdgssy', 'Karma Veer Dadasaheb Gaikwad Sabalikaran & Swabhiman Yojana',
'The main objective of this scheme is to improve the financial condition of the scheduled castes and Nav-Buddhists who are landless workers and are from "Below Poverty Line". Only citizens who are permanent residents of Maharashtra are eligible. This scheme is 100% funded by the State Govt.',
'Maharashtra', 'Agriculture,Rural & Environment',
'{"age": "18-60", "category": "SC/Nav-Buddhist", "income": "Below poverty line", "occupation": "Landless worker", "residency": "Maharashtra resident"}'::jsonb,
'Loan and subsidy for landless workers',
NULL,
'https://www.myscheme.gov.in/schemes/kvdgssy'),

-- Maharashtra Scheme 34
('kpdgbcpd', 'Karmaveer Padmashri Dadasaheb Gaikwad Birth Centenary And Prize Distribution',
'The "Karmaveer Padmashri Dadasaheb Gaikwad Birth Centenary and Prize Distribution" is an award by the Govt. of Maharashtra. The award is given to individuals and organizations working for the social movement against traditional customs and untouchability and for landless farm workers.',
'Maharashtra', 'Social welfare & Empowerment',
'{"age": "18-100", "residency": "Maharashtra resident"}'::jsonb,
'Award for social work',
NULL,
'https://www.myscheme.gov.in/schemes/kpdgbcpd'),

-- Maharashtra Scheme 35
('l50ss', 'LIDCOM 50% Subsidy Scheme',
'The "50% Subsidy Scheme" is a scheme by LIDCOM, Govt. of Maharashtra. In this scheme, 50% amount is being given as a subsidy on a maximum loan amount of ₹50,000/-. The subsidy is subject to the maximum limit of ₹10,000/-. The bank charge of interest is as per the existing rate.',
'Maharashtra', 'Banking,Financial Services and Insurance',
'{"age": "18-55", "category": "Charmakar Community/SC", "residency": "Maharashtra resident"}'::jsonb,
'50% subsidy up to ₹10,000 on loan',
NULL,
'https://www.myscheme.gov.in/schemes/l50ss'),

-- Maharashtra Scheme 36
('lels', 'LIDCOM Education Loan Scheme',
'The "Education Loan Scheme" is a scheme by the Leather Industries Development Corporation (LIDCOM), Govt. of Maharashtra. In this scheme, finance of upto ₹ 20,00,000 is provided for post graduate students in the 18-50 years age group from Charmakar Community for studies in India and in abroad.',
'Maharashtra', 'Education & Learning',
'{"age": "18-50", "category": "Charmakar Community/SC", "education": "Post graduate student", "residency": "Maharashtra resident"}'::jsonb,
'Education loan up to ₹20,00,000',
NULL,
'https://www.myscheme.gov.in/schemes/lels'),

-- Maharashtra Scheme 37
('lgss', 'LIDCOM Gattai Stall Scheme',
'Being implemented by LIDCOM, Govt. of Maharashtra for the Roadsides Cobblers from the (Scheduled Caste) Charmakar Community, this scheme provides a 100% subsidy for the erection of a Tin Stall of Size 4'' x 5'' x 6.5'' costing ₹16367/- per stall and ₹500/- incidental charges.',
'Maharashtra', 'Business & Entrepreneurship',
'{"age": "18-60", "category": "Charmakar Community/SC", "occupation": "Cobbler", "residency": "Maharashtra resident"}'::jsonb,
'100% subsidy for tin stall',
NULL,
'https://www.myscheme.gov.in/schemes/lgss'),

-- Maharashtra Scheme 38
('lmmls', 'LIDCOM Margin Money Loan Scheme',
'In this scheme, for a loan limit from ₹50,001 to ₹5,00,000/-, 20% of the Project cost loan as Seed Capital is paid by the Corporation @ 4% interest per annum. A maximum of ₹10,000/- will be paid as a subsidy by Corporation. A 5% amount of project cost will have to be contributed by the beneficiary.',
'Maharashtra', 'Banking,Financial Services and Insurance',
'{"age": "18-55", "category": "Charmakar Community/SC", "residency": "Maharashtra resident"}'::jsonb,
'Margin money loan with subsidy',
NULL,
'https://www.myscheme.gov.in/schemes/lmmls'),

-- Maharashtra Scheme 39
('lts', 'LIDCOM Training Scheme',
'Being implemented particularly for the Charmakar Community, the "Training Scheme" is a scheme by the Leather Industries Development Corporation (LIDCOM), Govt. of Maharashtra. This scheme is being implemented for the students to enable them to start their own businesses, trade, or get a job.',
'Maharashtra', 'Business & Entrepreneurship',
'{"age": "18-35", "category": "Charmakar Community/SC", "residency": "Maharashtra resident"}'::jsonb,
'Vocational training for self-employment',
NULL,
'https://www.myscheme.gov.in/schemes/lts'),

-- Maharashtra Scheme 40
('mjpjay', 'Mahatma Jyotirao Phule Jan Arogya Yojana',
'The Mahatma Jyotirao Phule Jan Arogya Yojana, launched by the Government of Maharashtra, offers cashless treatment for identified diseases through a network of government and private healthcare providers.',
'Maharashtra', 'Health & Wellness',
'{"age": "0-100", "income": "Below poverty line", "residency": "Maharashtra resident"}'::jsonb,
'Cashless treatment for identified diseases',
NULL,
'https://www.myscheme.gov.in/schemes/mjpjay'),

-- West Bengal Scheme 1
('ismpsscis', 'Incentive Scheme for MSMEs in Powerloom Sector: State Capital Investment Subsidy',
'"State Capital Investment Subsidy" incentives under "Incentive Scheme for MSMEs in Powerloom Sector" scheme implemented by the Dept. of MSME & T, Government of West Bengal, aims to provide subsidy of the fixed capital investment made for its approved project.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "MSME owner", "sector": "Powerloom", "residency": "West Bengal resident"}'::jsonb,
'Subsidy on fixed capital investment',
NULL,
'https://www.myscheme.gov.in/schemes/ismpsscis'),

-- West Bengal Scheme 2
('wbisaito', 'The West Bengal Incentive Scheme: Additional Incentive for Adventure Tour Operators',
'"Additional Incentive for Adventure Tour Operators" incentives under the "WBIS" scheme by the Dept. of Tourism, Government of West Bengal, aims to provide reimbursement incentives with SGST payments for purchasing tents, dinghies, adventure & sports equipment, and related accessories.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Tour operator", "sector": "Adventure tourism", "residency": "West Bengal resident"}'::jsonb,
'SGST reimbursement for adventure equipment',
NULL,
'https://www.myscheme.gov.in/schemes/wbisaito'),

-- West Bengal Scheme 3
('wbisaige', 'The West Bengal Incentive Scheme: Additional Incentive on Generation of Employment',
'"Additional Incentive on Generation of Employment" incentives under "The West Bengal Incentive Scheme" scheme by the Dept. of Tourism, Government of West Bengal, aims to provide reimbursement of expenditure incurred for paying contribution towards ESI and EPF.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Tourism unit owner", "residency": "West Bengal resident"}'::jsonb,
'Reimbursement of ESI and EPF contributions',
NULL,
'https://www.myscheme.gov.in/schemes/wbisaige'),

-- West Bengal Scheme 4
('wbiscu', 'The West Bengal Incentive Scheme: Capacity Utilisation',
'"Capacity Utilisation" incentives under the "The West Bengal Incentive Scheme" implemented by the Dept. of Tourism, Government of West Bengal, aims to provide additional Floor Area Ratio (FAR) over and above the maximum permissible FAR as may be fixed by the competent authority.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Tourism unit owner", "residency": "West Bengal resident"}'::jsonb,
'Additional Floor Area Ratio (FAR)',
NULL,
'https://www.myscheme.gov.in/schemes/wbiscu'),

-- West Bengal Scheme 5
('wbisistl', 'The West Bengal Incentive Scheme: Interest Subsidy on Term Loan',
'"Interest Subsidy on Term Loan" incentives under "The West Bengal Incentive Scheme" scheme by the Dept. of Tourism, Government of West Bengal, aims to provide Interest Subsidy on annual interest liability on the Term Loan borrowed from a Bank to an approved project of an eligible unit.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Tourism unit owner", "residency": "West Bengal resident"}'::jsonb,
'Interest subsidy on term loan',
NULL,
'https://www.myscheme.gov.in/schemes/wbisistl'),

-- West Bengal Scheme 6
('wbisrsdrf', 'The West Bengal Incentive Scheme: Reimbursement of Stamp Duty and Registration Fee',
'"Reimbursement of Stamp Duty and Registration Fee" incentives under the "WBIS" scheme implemented by the Dept. of Tourism, Government of West Bengal, aims to provide a reimbursement of stamp duty and registration fee paid by the eligible units for the purpose of registration of documents.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Tourism unit owner", "residency": "West Bengal resident"}'::jsonb,
'Reimbursement of stamp duty and registration fee',
NULL,
'https://www.myscheme.gov.in/schemes/wbisrsdrf'),

-- West Bengal Scheme 7
('wbisscis', 'The West Bengal Incentive Scheme: State Capital Investment Subsidy',
'"State Capital Investment Subsidy" incentives under "The West Bengal Incentive Scheme" scheme implemented by the Dept. of Tourism, Government of West Bengal, aims to provide a State Capital Investment Subsidy of the fixed capital investment.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Tourism unit owner", "residency": "West Bengal resident"}'::jsonb,
'State capital investment subsidy',
NULL,
'https://www.myscheme.gov.in/schemes/wbisscis'),

-- West Bengal Scheme 8
('wbissqi', 'The West Bengal Incentive Scheme: Subsidy for Quality Improvement',
'"Subsidy for Quality Improvement" incentives under the "WBIS" scheme aims to provide a reimbursement for the fixed capital investment expenditure incurred for quality improvement, modernization and installation of pollution control devices and for obtaining ISI/BIS/ISO certification.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Tourism unit owner", "residency": "West Bengal resident"}'::jsonb,
'Subsidy for quality improvement and certification',
NULL,
'https://www.myscheme.gov.in/schemes/wbissqi'),

-- West Bengal Scheme 9
('wbistpais', 'The West Bengal Incentive Scheme: Tourism Promotion Assistance in lieu of Interest Subsidy',
'"Tourism Promotion Assistance in lieu of Interest Subsidy" incentive under the "The West Bengal Incentive Scheme" aims to provide Tourism Promotion Assistance for SGST irrespective of the location of the project, which will be in lieu of interest subsidy.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Tourism unit owner", "residency": "West Bengal resident"}'::jsonb,
'Tourism promotion assistance (SGST)',
NULL,
'https://www.myscheme.gov.in/schemes/wbistpais'),

-- West Bengal Scheme 10
('wbiswed', 'The West Bengal Incentive Scheme: Waiver of Electricity Duty',
'"Waiver of Electricity Duty" incentives under "The West Bengal Incentive Scheme" scheme implemented by the Dept. of Tourism, Government of West Bengal, aims to provide waiver of electricity duty on the electricity consumed in its approved project.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Tourism unit owner", "residency": "West Bengal resident"}'::jsonb,
'Waiver of electricity duty',
NULL,
'https://www.myscheme.gov.in/schemes/wbiswed'),

-- West Bengal Scheme 11
('wbtisiee', 'West Bengal Textile Incentive Scheme: Incentive for Energy Efficiency',
'"Incentive for Energy Efficiency" incentives under "West Bengal Textile Incentive Scheme" scheme implemented by the Dept. of MSME&T, Government of West Bengal, aims to provide a reimbursement for the cost of energy and installations for energy conservation as per energy audit.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Textile unit owner", "residency": "West Bengal resident"}'::jsonb,
'Reimbursement for energy efficiency',
NULL,
'https://www.myscheme.gov.in/schemes/wbtisiee'),

-- West Bengal Scheme 12
('wbisps', 'West Bengal Textile Incentive Scheme: Power Subsidy',
'"Power Subsidy" incentives under "West Bengal Textile Incentive Scheme" scheme implemented by the Dept. of MSME&T, Government of West Bengal, aims to provide power subsidy on electricity consumption for 5 years from the date of commencement of production.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Textile unit owner", "residency": "West Bengal resident"}'::jsonb,
'Power subsidy for 5 years',
NULL,
'https://www.myscheme.gov.in/schemes/wbisps'),

-- West Bengal Scheme 13
('wbtisscis', 'West Bengal Textile Incentive Scheme: State Capital Investment Subsidy',
'"State Capital Investment Subsidy" incentives under "West Bengal Textile Incentive Scheme" scheme implemented by the Dept. of MSME&T, Government of West Bengal, aims to provide a State Capital Investment Subsidy of the fixed capital investment.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Textile unit owner", "residency": "West Bengal resident"}'::jsonb,
'State capital investment subsidy',
NULL,
'https://www.myscheme.gov.in/schemes/wbtisscis'),

-- West Bengal Scheme 14
('wbtisswcec', 'West Bengal Textile Incentive Scheme: Subsidy for Water conservation/ Environment Compliance',
'"Subsidy for Water Conservation/ Environment Compliance" incentives under "West Bengal Textile Incentive Scheme" scheme by the Dept. of MSME&T , Government of West Bengal, aims to provide reimbursement of expenditure incurred by it towards the cost of captive Effluent Water Treatment Plant.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Textile unit owner", "residency": "West Bengal resident"}'::jsonb,
'Subsidy for water conservation and environment compliance',
NULL,
'https://www.myscheme.gov.in/schemes/wbtisswcec'),

-- West Bengal Scheme 15
('wbtiswed', 'West Bengal Textile Incentive Scheme: Waiver of Electricity Duty',
'"Waiver of Electricity Duty" incentives under "West Bengal Textile Incentive Scheme" scheme implemented by the Dept. of MSME&T, Government of West Bengal,  aims to provide waiver of electricity duty on the electricity consumed in its approved project.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Textile unit owner", "residency": "West Bengal resident"}'::jsonb,
'Waiver of electricity duty',
NULL,
'https://www.myscheme.gov.in/schemes/wbtiswed'),

-- West Bengal Scheme 16
('wbtiswfflcm', 'West Bengal Textile Incentive Scheme: Waiver of Fees for Land Conversion and Mutation',
'"Waiver of Fees for Land Conversion and Mutation" incentives under "West Bengal Textile Incentive Scheme" scheme implemented by the Dept. of MSME&T, Government of West Bengal, aims to provide a waiver of fees for conversion and mutation of the land as approved in the project.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "Textile unit owner", "residency": "West Bengal resident"}'::jsonb,
'Waiver of land conversion and mutation fees',
NULL,
'https://www.myscheme.gov.in/schemes/wbtiswfflcm'),

-- West Bengal Scheme 17
('adwb', 'Accidental Benefit',
'The "Accidental Benefit" scheme by the BOCW Welfare Board, Labour Department,West Bengal, is a welfare scheme that provides financial assistance to the beneficiary in case of hospitalization and disability due to an accident.',
'West Bengal', 'Social welfare & Empowerment',
'{"age": "18-60", "occupation": "Construction worker", "residency": "West Bengal resident"}'::jsonb,
'Financial assistance for accident-related hospitalization and disability',
NULL,
'https://www.myscheme.gov.in/schemes/adwb'),

-- West Bengal Scheme 18
('ahs', 'Akanksha Housing Scheme',
'Akanksha Housing Scheme was launched by the Housing Department, Government of West Bengal on 28/02/2014 to provide housing to the serving State Government employees.',
'West Bengal', 'Housing & Shelter',
'{"age": "25-60", "occupation": "State government employee", "residency": "West Bengal resident"}'::jsonb,
'Housing for state government employees',
NULL,
'https://www.myscheme.gov.in/schemes/ahs'),

-- West Bengal Scheme 19
('bay', 'Banglar Awaas Yojana (BAY)',
'"Banglar Awaas Yojana (BAY)" provides financial assistance to houseless households and those living in kutcha or dilapidated houses, helping them build pucca houses with essential amenities. The scheme offers financial assistance with additional support for toilets and unskilled workdays.',
'West Bengal', 'Housing & Shelter',
'{"age": "18-100", "income": "Below poverty line", "residency": "West Bengal resident"}'::jsonb,
'Financial assistance for pucca house construction',
NULL,
'https://www.myscheme.gov.in/schemes/bay'),

-- West Bengal Scheme 20
('byswb', 'Banglar Yuba Sathi',
'The scheme aims to provide monthly financial assistance to educated unemployed youth of West Bengal to support them until they get employment or join another scheme. The objective is to ensure income support for eligible unemployed youth for a maximum period of 5 years.',
'West Bengal', 'Social welfare & Empowerment',
'{"age": "18-45", "education": "Graduate or above", "employment_status": "Unemployed", "residency": "West Bengal resident"}'::jsonb,
'Monthly allowance for unemployed youth',
NULL,
'https://www.myscheme.gov.in/schemes/byswb'),

-- West Bengal Scheme 21
('bis', 'Banglashree for Micro, Small and Medium Enterprises: Interest Subsidy on Term Loan (IS)',
'"Interest Subsidy on Term Loan (IS)" incentives under "Banglashree for MSMEs" scheme implemented by the MSMEs Dept., Government of West Bengal, aims to provide Interest Subsidy on annual interest liability on the Term Loan borrowed from a Commercial Bank to an eligible micro or small enterprise.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "MSME owner", "residency": "West Bengal resident"}'::jsonb,
'Interest subsidy on term loan',
NULL,
'https://www.myscheme.gov.in/schemes/bis'),

-- West Bengal Scheme 22
('bmsmeps', 'Banglashree for Micro, Small and Medium Enterprises: Power Subsidy (PS)',
'"Power Subsidy (PS)" incentives under "Banglashree for MSMEs" scheme implemented by the MSMEs Dept., Government of West Bengal, aims to provide power subsidy on the electricity consumed for the manufacturing activity to an eligible micro or small enterprise.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "MSME owner", "residency": "West Bengal resident"}'::jsonb,
'Power subsidy on electricity consumption',
NULL,
'https://www.myscheme.gov.in/schemes/bmsmeps'),

-- West Bengal Scheme 23
('cis', 'Banglashree for Micro, Small and Medium Enterprises: State Capital Investment Subsidy (CIS)',
'"State Capital Investment Subsidy (CIS)" incentives under "Banglashree for MSMEs" scheme implemented by the MSMEs Department, Government of West Bengal, aims to provide Capital Investment Subsidy for its approved project to an eligible micro or small enterprise.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "MSME owner", "residency": "West Bengal resident"}'::jsonb,
'Capital investment subsidy',
NULL,
'https://www.myscheme.gov.in/schemes/cis'),

-- West Bengal Scheme 24
('ees', 'Banglashree for Micro, Small and Medium Enterprises: Subsidy for Energy Efficiency (EES)',
'"Subsidy for Energy Efficiency (EES)" incentives under "Banglashree for MSMEs" scheme implemented by the MSMEs Dept., Government of West Bengal, aims to provide a reimbursement for the cost of energy and installations for energy conservation as per energy audit.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "MSME owner", "residency": "West Bengal resident"}'::jsonb,
'Subsidy for energy efficiency',
NULL,
'https://www.myscheme.gov.in/schemes/ees'),

-- West Bengal Scheme 25
('bmsmeprs', 'Banglashree for Micro, Small and Medium Enterprises: Subsidy for Patent Registration (PRS)',
'"Subsidy for Patent Registration (PRS)" incentives under "Banglashree for MSMEs" scheme implemented by the MSMEs Dept., Government of West Bengal, aims to provide reimbursement of expenditure incurred for obtaining Patent Registration.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "MSME owner", "residency": "West Bengal resident"}'::jsonb,
'Subsidy for patent registration',
NULL,
'https://www.myscheme.gov.in/schemes/bmsmeprs'),

-- West Bengal Scheme 26
('bmsmesccs', 'Banglashree for Micro, Small and Medium Enterprises: Subsidy for Standard Quality Compliance (SCCS)',
'"Subsidy for Standard Quality Compliance (SCCS)" incentives under "Banglashree for MSMEs" scheme implemented by the MSMEs Dept., Government of West Bengal, aims to provide reimbursement of the expenditure incurred for obtaining certification from approved Institutions/ Research Laboratories.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "MSME owner", "residency": "West Bengal resident"}'::jsonb,
'Subsidy for quality compliance certification',
NULL,
'https://www.myscheme.gov.in/schemes/bmsmesccs'),

-- West Bengal Scheme 27
('bmsmesgst', 'Banglashree for Micro, Small and Medium Enterprises: Subsidy for State Goods and Services Tax (SGST)',
'"Subsidy for State Goods and Services Tax (SGST)" incentives under "Banglashree for MSMEs" scheme implemented by the MSMEs Dept., Government of West Bengal, aims to provide refunds for net SGST paid to the Government of West Bengal.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "MSME owner", "residency": "West Bengal resident"}'::jsonb,
'SGST refund',
NULL,
'https://www.myscheme.gov.in/schemes/bmsmesgst'),

-- West Bengal Scheme 28
('bmsmewcs', 'Banglashree for Micro, Small and Medium Enterprises: Subsidy for Water Conservation/Environment Compliance (WCS)',
'"Subsidy for Water Conservation/Environment Compliance" incentives  by the MSMEs Dept., Government of West Bengal, aims to provide reimbursement of expenditure incurred by it towards the cost of captive Effluent Water Treatment Plant for wastewater recycling and/ or other pollution control devices.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "MSME owner", "residency": "West Bengal resident"}'::jsonb,
'Subsidy for water conservation and environment compliance',
NULL,
'https://www.myscheme.gov.in/schemes/bmsmewcs'),

-- West Bengal Scheme 29
('bmsmewwas', 'Banglashree for Micro, Small and Medium Enterprises: Subsidy for Work Force Welfare Assistance (WWAS)',
'"Subsidy for Work Force Welfare Assistance (WWAS)" incentives under "Banglashree for MSMEs" scheme implemented by the MSMEs Dept., Government of West Bengal, aims to provide reimbursement of expenditure incurred for paying contribution towards Employees State Insurance (ESI) and Employees Provident.',
'West Bengal', 'Business & Entrepreneurship',
'{"age": "18-70", "occupation": "MSME owner", "residency": "West Bengal resident"}'::jsonb,
'Subsidy for ESI and EPF contributions',
NULL,
'https://www.myscheme.gov.in/schemes/bmsmewwas');
