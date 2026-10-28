/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RateItem {
  id: string;
  code: string;
  category: 
    | 'Preventive Medi-Check Packages'
    | 'MTP & Abortion Services (MTP Act 2021)'
    | 'Contraception & Family Planning'
    | 'Gynaecology & Minor OPD Procedures'
    | 'Ultrasound (USG) & Imaging'
    | 'Laboratory & Pathology Investigations'
    | 'Walk-In & Day-Care Services';
  serviceName: string;
  description: string;
  standardFeeINR: number;
  bplSubsidizedFeeINR: number;
  isFreeForBpl: boolean;
  preparationAdvice?: string;
  turnaroundTime?: string;
  tags?: string[];
}

export const OFFICIAL_STREE_CLINIC_RATE_LIST: RateItem[] = [
  // ==========================================
  // 1. PREVENTIVE HEALTH & MEDI-CHECK PACKAGES
  // ==========================================
  {
    id: 'mc-01',
    code: 'MC-BASIC-FEMALE',
    category: 'Preventive Medi-Check Packages',
    serviceName: 'Basic Medi-Check (Women)',
    description: 'Conventional Pap Smear, Hemoglobin (Hb%), Urine Sugar & Albumin, Random Blood Sugar, Clinical Breast Examination & Breast Self-Examination (BSE) training.',
    standardFeeINR: 900,
    bplSubsidizedFeeINR: 450,
    isFreeForBpl: false,
    turnaroundTime: 'Same Day (Pap Smear report in 48-72h)',
    preparationAdvice: 'Avoid vaginal douches or sexual intercourse 24h prior to Pap smear.',
    tags: ['Medi-Check', 'Women Health', 'Pap Smear', 'Screening']
  },
  {
    id: 'mc-02',
    code: 'MC-COMP-FEMALE',
    category: 'Preventive Medi-Check Packages',
    serviceName: 'Comprehensive Medi-Check (Women)',
    description: 'Complete Hemogram (Hb, TLC, DLC, ESR, PCV), Urine R/E & M/E, Fasting & PP Blood Sugar, Liver Function Tests (LFT), Kidney Function Tests (KFT), Lipid Profile, Conventional Pap Smear & Breast Examination.',
    standardFeeINR: 2400,
    bplSubsidizedFeeINR: 1200,
    isFreeForBpl: false,
    turnaroundTime: '24 Hours',
    preparationAdvice: '10-12 hours overnight fasting mandatory for blood collection.',
    tags: ['Comprehensive', 'Executive', 'Full Body', 'Lipid', 'LFT']
  },
  {
    id: 'mc-03',
    code: 'MC-THYROID-HBA1C',
    category: 'Preventive Medi-Check Packages',
    serviceName: 'Comprehensive Medi-Check with Thyroid & HbA1c',
    description: 'All Comprehensive Medi-Check tests PLUS Thyroid Profile (Total T3, Total T4, Ultrasensitive TSH) and Glycated Hemoglobin (HbA1c) 3-month sugar average.',
    standardFeeINR: 3100,
    bplSubsidizedFeeINR: 1600,
    isFreeForBpl: false,
    turnaroundTime: '24-36 Hours',
    preparationAdvice: 'Overnight fasting (10-12 hours). Morning blood sample.',
    tags: ['Thyroid', 'HbA1c', 'Diabetes', 'Comprehensive Plus']
  },
  {
    id: 'mc-04',
    code: 'MC-PROC-VIA',
    category: 'Preventive Medi-Check Packages',
    serviceName: 'Medi-Check with VIA Cervical Screening',
    description: 'Visual Inspection with Acetic Acid (VIA) for cervical dysplasia/neoplasia, Hemoglobin %, Blood Sugar check, Clinical Breast Exam & Gynaecological physical.',
    standardFeeINR: 1200,
    bplSubsidizedFeeINR: 600,
    isFreeForBpl: false,
    turnaroundTime: 'Immediate (Same Day Results)',
    preparationAdvice: 'Non-menstruating days preferred.',
    tags: ['VIA', 'Cervical Cancer', 'Preventive']
  },
  {
    id: 'mc-05',
    code: 'MC-BASIC-MALE',
    category: 'Preventive Medi-Check Packages',
    serviceName: 'Basic Medi-Check (Men)',
    description: 'Hemoglobin (Hb%), Blood Sugar (Random), Urine Albumin & Sugar, Blood Pressure Screening, BMI & General Medical Consultation.',
    standardFeeINR: 750,
    bplSubsidizedFeeINR: 350,
    isFreeForBpl: false,
    turnaroundTime: 'Same Day',
    tags: ['Men Health', 'Basic Wellness']
  },
  {
    id: 'mc-06',
    code: 'MC-COMP-MALE',
    category: 'Preventive Medi-Check Packages',
    serviceName: 'Comprehensive Medi-Check (Men)',
    description: 'CBC, Urine Routine, Fasting & PP Blood Sugar, Lipid Profile, LFT, KFT, Serum Uric Acid, ECG & Clinical Physician Examination.',
    standardFeeINR: 2200,
    bplSubsidizedFeeINR: 1100,
    isFreeForBpl: false,
    turnaroundTime: '24 Hours',
    preparationAdvice: '10-12 hours fasting required.',
    tags: ['Men Health', 'Executive Health']
  },

  // ==========================================
  // 2. MTP & ABORTION SERVICES (MTP ACT 2021)
  // ==========================================
  {
    id: 'mtp-01',
    code: 'MTP-MA-PACK',
    category: 'MTP & Abortion Services (MTP Act 2021)',
    serviceName: 'Medical Abortion (MA) Comprehensive Package (≤9 Weeks / 63 Days)',
    description: 'Includes initial consultation, pre-procedure UPT card test, Tab Mifepristone 200mg (oral in clinic), Tab Misoprostol 800mcg (buccal for home), analgesic pack, 24x7 doctor helpline access, confirmatory ultrasound & Day 14 follow-up review.',
    standardFeeINR: 2600,
    bplSubsidizedFeeINR: 1200,
    isFreeForBpl: false,
    turnaroundTime: 'Day 1 OPD + Day 3 Check + Day 14 Follow-up',
    preparationAdvice: 'Confirmed intrauterine pregnancy on USG. No ectopic signs.',
    tags: ['MTP', 'Medical Abortion', 'Mifepristone', 'Misoprostol', 'Form C']
  },
  {
    id: 'mtp-02',
    code: 'MTP-MVA-6TO12',
    category: 'MTP & Abortion Services (MTP Act 2021)',
    serviceName: 'Surgical Abortion - First Trimester MVA / EVA (6 to 12 Weeks)',
    description: 'Manual Vacuum Aspiration (MVA) or Electric Vacuum Aspiration (EVA) using sterile Karman cannula under local paracervical block, pre-procedure prime, day-care recovery bed, post-abortal antibiotics, and Day 7 follow-up.',
    standardFeeINR: 3800,
    bplSubsidizedFeeINR: 1900,
    isFreeForBpl: false,
    turnaroundTime: 'Walk-in Walk-out (2-4 hours day-care stay)',
    preparationAdvice: '4 hours fasting before surgical procedure. Accompanying attendant.',
    tags: ['Surgical MTP', 'MVA', 'Karman Cannula', 'First Trimester']
  },
  {
    id: 'mtp-03',
    code: 'MTP-2ND-12TO20',
    category: 'MTP & Abortion Services (MTP Act 2021)',
    serviceName: 'Second Trimester Abortion (12 to 20 Weeks - Form 1 Certified)',
    description: 'Cervical priming with Misoprostol, Dilation & Evacuation (D&E) or medical induction by empanelled Gynaecologist Surgeon, Oxytocin infusion, day-care inpatient monitoring, and post-procedure counseling.',
    standardFeeINR: 6200,
    bplSubsidizedFeeINR: 3100,
    isFreeForBpl: false,
    turnaroundTime: 'Day-Care Inpatient (6-8 hours observation)',
    preparationAdvice: 'Form 1 certification by 1 Registered Medical Practitioner (RMP).',
    tags: ['Second Trimester', 'D&E', 'Form 1', 'MoHFW Standard']
  },
  {
    id: 'mtp-04',
    code: 'MTP-HIGH-20TO24',
    category: 'MTP & Abortion Services (MTP Act 2021)',
    serviceName: 'Higher Gestation Abortion (20 to 24 Weeks - Form E Dual RMP Opinion)',
    description: 'Statutory medical termination for eligible Rule 3B vulnerable categories. Dual RMP examination and consensus certification on Form E, comprehensive surgical/medical induction, emergency backup, and mandatory Form III confidential registry.',
    standardFeeINR: 9500,
    bplSubsidizedFeeINR: 4500,
    isFreeForBpl: false,
    turnaroundTime: '24-Hour Clinical Monitoring',
    preparationAdvice: 'Statutory consensus opinion by 2 Registered Medical Practitioners (RMPs) on Form E.',
    tags: ['Form E', '20-24 Weeks', 'Rule 3B', 'Dual RMP', 'Statutory MTP']
  },
  {
    id: 'mtp-05',
    code: 'MTP-INCOMPL-EVAC',
    category: 'MTP & Abortion Services (MTP Act 2021)',
    serviceName: 'Management of Incomplete / Spontaneous Abortion (MVA Evacuation)',
    description: 'Emergency assessment and gentle uterine evacuation with Karman suction for retained products of conception (POC), hemostatic support, prophylactic antibiotics, and counseling.',
    standardFeeINR: 2800,
    bplSubsidizedFeeINR: 1400,
    isFreeForBpl: false,
    turnaroundTime: 'Immediate Outpatient Care (1-2 hours)',
    tags: ['Emergency Care', 'Incomplete Abortion', 'MVA']
  },
  {
    id: 'mtp-06',
    code: 'MTP-ANTI-D-IGG',
    category: 'MTP & Abortion Services (MTP Act 2021)',
    serviceName: 'Anti-D (Rh Immunoglobulin) Prophylaxis',
    description: 'Intramuscular administration of Anti-D IgG for Rh-negative unsensitized women undergoing abortion or delivery to prevent Rh isoimmunization.',
    standardFeeINR: 2100,
    bplSubsidizedFeeINR: 1200,
    isFreeForBpl: false,
    turnaroundTime: 'Immediate post-procedure (within 72h)',
    tags: ['Rh Negative', 'Anti-D', 'Immunoglobulin']
  },

  // ==========================================
  // 3. CONTRACEPTION & FAMILY PLANNING
  // ==========================================
  {
    id: 'fp-01',
    code: 'FP-IUCD-380A',
    category: 'Contraception & Family Planning',
    serviceName: 'Intrauterine Device - Copper-T 380A (10 Years)',
    description: 'Pre-insertion pelvic examination, sterile insertion of Copper-T 380A (provides 10 years of non-hormonal contraception), thread trimming, post-insertion antibiotics & 1-month checkup.',
    standardFeeINR: 600,
    bplSubsidizedFeeINR: 0,
    isFreeForBpl: true,
    turnaroundTime: '15-20 Minutes OPD',
    preparationAdvice: 'Ideal post-menstrual (Day 5-10) or immediate post-abortal/post-partum.',
    tags: ['IUCD', 'Copper-T', '10 Years', 'Free For BPL', 'Spacing']
  },
  {
    id: 'fp-02',
    code: 'FP-MULTILOAD-375',
    category: 'Contraception & Family Planning',
    serviceName: 'Multiload Cu 375 Intrauterine Device (5 Years)',
    description: 'Sterile insertion of flexible Multiload Cu 375 with lower expulsion rates and minimal cramping, post-procedure guidance, and thread inspection.',
    standardFeeINR: 850,
    bplSubsidizedFeeINR: 0,
    isFreeForBpl: true,
    turnaroundTime: '15-20 Minutes OPD',
    tags: ['Multiload', 'IUCD', '5 Years', 'Free For BPL']
  },
  {
    id: 'fp-03',
    code: 'FP-ANTARA-DMPA',
    category: 'Contraception & Family Planning',
    serviceName: 'Injectable Contraceptive - Antara (DMPA 150 mg IM)',
    description: 'Deep intramuscular injection of Medroxyprogesterone Acetate (DMPA) 150 mg providing 3 months of highly effective reversible contraception, with cycle counseling.',
    standardFeeINR: 350,
    bplSubsidizedFeeINR: 100,
    isFreeForBpl: false,
    turnaroundTime: '5 Minutes',
    tags: ['Antara', 'DMPA', '3 Months Injectable', 'Hormonal']
  },
  {
    id: 'fp-04',
    code: 'FP-CHHAYA-PILLS',
    category: 'Contraception & Family Planning',
    serviceName: 'Centchroman (Chhaya) Non-Steroidal Oral Pills (Pack of 8)',
    description: 'Non-hormonal, non-steroidal oral contraceptive pill (Centchroman 30mg). Safe for breastfeeding mothers with zero estrogen-associated risks.',
    standardFeeINR: 80,
    bplSubsidizedFeeINR: 20,
    isFreeForBpl: false,
    tags: ['Chhaya', 'Centchroman', 'Non-Hormonal', 'Safe Lactation']
  },
  {
    id: 'fp-05',
    code: 'FP-STERI-MINILAP',
    category: 'Contraception & Family Planning',
    serviceName: 'Female Sterilization - Minilaparotomy (Pomeroy Method)',
    description: 'Permanent surgical family planning via small suprapubic minilap incision under local anesthesia with sedation. 100% Free for BPL under Government FPIS Scheme with cash compensation.',
    standardFeeINR: 2500,
    bplSubsidizedFeeINR: 0,
    isFreeForBpl: true,
    turnaroundTime: 'Day-Care OT (3-4 hours total)',
    preparationAdvice: 'Consent Form C, age 22-49, living child >1 year, negative pregnancy test.',
    tags: ['Sterilization', 'Minilap', 'Tubectomy', '100% Free BPL', 'FPIS Scheme']
  },
  {
    id: 'fp-06',
    code: 'FP-STERI-LAP-FALOPE',
    category: 'Contraception & Family Planning',
    serviceName: 'Female Sterilization - Laparoscopic Tubal Occlusion (Falope Rings)',
    description: 'Minimally invasive keyhole laparoscopic tubal sterilization with Silastic Falope rings, quick recovery, minimal scarring, and post-procedure day-care observation.',
    standardFeeINR: 3200,
    bplSubsidizedFeeINR: 0,
    isFreeForBpl: true,
    turnaroundTime: 'Day-Care OT (4-5 hours)',
    tags: ['Laparoscopy', 'Falope Ring', 'Permanent FP', '100% Free BPL']
  },
  {
    id: 'fp-07',
    code: 'FP-NSV-VASECTOMY',
    category: 'Contraception & Family Planning',
    serviceName: 'No-Scalpel Vasectomy (NSV for Men)',
    description: 'Safe, scalpel-free, stitch-free male sterilization under local anesthesia. Quick 15-minute procedure with fast return to work and 100% Free under National FPIS Scheme.',
    standardFeeINR: 1800,
    bplSubsidizedFeeINR: 0,
    isFreeForBpl: true,
    turnaroundTime: '15-20 Minutes (Walk-in Walk-out)',
    preparationAdvice: 'Barrier contraception (condoms) mandatory for 3 months post-op until azoospermia.',
    tags: ['NSV', 'Vasectomy', 'Male Contraception', '100% Free BPL', 'No Scalpel']
  },

  // ==========================================
  // 4. GYNAECOLOGY & MINOR OPD PROCEDURES
  // ==========================================
  {
    id: 'gyn-01',
    code: 'GYN-CONSULT-OPD',
    category: 'Gynaecology & Minor OPD Procedures',
    serviceName: 'Gynaecological OPD Consultation & Examination',
    description: 'Comprehensive evaluation of menstrual disorders, PCOD, vaginal discharge, pelvic pain, speculum examination, bimanual palpation, and free follow-up within 7 days.',
    standardFeeINR: 400,
    bplSubsidizedFeeINR: 200,
    isFreeForBpl: false,
    turnaroundTime: '20-30 Minutes',
    tags: ['Consultation', 'OPD', 'PCOD', 'Infections', 'Free Follow-up']
  },
  {
    id: 'gyn-02',
    code: 'GYN-SR-SPECIALIST',
    category: 'Gynaecology & Minor OPD Procedures',
    serviceName: 'Senior Consultant Gynecologist & Surgeon Review',
    description: 'Advanced consultation for complex gynaecological conditions, surgical fitness, second opinions on hysterectomy/fibroids, and high-risk case reviews.',
    standardFeeINR: 550,
    bplSubsidizedFeeINR: 300,
    isFreeForBpl: false,
    tags: ['Specialist', 'Senior Surgeon', 'Second Opinion']
  },
  {
    id: 'gyn-03',
    code: 'GYN-CRYOCAUTERY',
    category: 'Gynaecology & Minor OPD Procedures',
    serviceName: 'Cervical Cryocautery (Nitrous Oxide Cryotherapy)',
    description: 'Painless freezing treatment for chronic cervical erosion (ectopy), persistent discharge, and post-coital bleeding under direct speculum vision.',
    standardFeeINR: 1800,
    bplSubsidizedFeeINR: 900,
    isFreeForBpl: false,
    turnaroundTime: '15 Minutes OPD',
    tags: ['Cryocautery', 'Cervical Erosion', 'Minor OT']
  },
  {
    id: 'gyn-04',
    code: 'GYN-DANDC-THERAP',
    category: 'Gynaecology & Minor OPD Procedures',
    serviceName: 'Diagnostic & Therapeutic D&C (Dilation & Curettage)',
    description: 'Cervical dilation and fractional endometrial curettage under short IV sedation / paracervical block for abnormal uterine bleeding (AUB), endometrial hyperplasia, or post-menopausal bleeding.',
    standardFeeINR: 3400,
    bplSubsidizedFeeINR: 1700,
    isFreeForBpl: false,
    turnaroundTime: 'Day-Care OT (3 hours)',
    preparationAdvice: '4-6 hours fasting prior to procedure.',
    tags: ['D&C', 'Endometrial Curettage', 'Sedation']
  },
  {
    id: 'gyn-05',
    code: 'GYN-PUNCH-BIOPSY',
    category: 'Gynaecology & Minor OPD Procedures',
    serviceName: 'Cervical Punch Biopsy',
    description: 'Targeted punch biopsy of suspicious cervical lesions or margins under Lugol iodine / acetic acid guidance for histopathological evaluation.',
    standardFeeINR: 1400,
    bplSubsidizedFeeINR: 700,
    isFreeForBpl: false,
    tags: ['Biopsy', 'Cervix', 'Histopathology']
  },
  {
    id: 'gyn-06',
    code: 'GYN-ENDOMET-BIOPSY',
    category: 'Gynaecology & Minor OPD Procedures',
    serviceName: 'Endometrial Pipelle Sampling / Biopsy',
    description: 'Gentle, minimally invasive suction curettage using Pipelle device without general anesthesia for evaluating dysfunctional uterine bleeding.',
    standardFeeINR: 1600,
    bplSubsidizedFeeINR: 800,
    isFreeForBpl: false,
    tags: ['Pipelle', 'Endometrial Sampling', 'AUB']
  },
  {
    id: 'gyn-07',
    code: 'GYN-BARTHOLIN-DRAIN',
    category: 'Gynaecology & Minor OPD Procedures',
    serviceName: 'Bartholin Cyst / Abscess Drainage & Marsupialization',
    description: 'Incision and drainage or marsupialization under local anesthesia with Word catheter placement for infected Bartholin gland cysts.',
    standardFeeINR: 2200,
    bplSubsidizedFeeINR: 1100,
    isFreeForBpl: false,
    tags: ['Bartholin Cyst', 'Minor Surgery', 'Abscess']
  },
  {
    id: 'gyn-08',
    code: 'GYN-IUCD-REMOVAL',
    category: 'Gynaecology & Minor OPD Procedures',
    serviceName: 'IUCD Removal (Simple / Complex)',
    description: 'Gentle extraction of expired or discontinued Copper-T or hormonal IUS devices with speculum inspection.',
    standardFeeINR: 350,
    bplSubsidizedFeeINR: 100,
    isFreeForBpl: false,
    tags: ['IUCD Removal', 'OPD']
  },

  // ==========================================
  // 5. ULTRASOUND (USG) & IMAGING
  // ==========================================
  {
    id: 'usg-01',
    code: 'USG-PELVIS-TVS',
    category: 'Ultrasound (USG) & Imaging',
    serviceName: 'Pelvic Ultrasound (TVS - Transvaginal Scan)',
    description: 'High-resolution transvaginal sonography for early pregnancy confirmation, ectopic exclusion, uterine fibroids, endometrial thickness, and follicular status.',
    standardFeeINR: 950,
    bplSubsidizedFeeINR: 500,
    isFreeForBpl: false,
    turnaroundTime: 'Immediate Print & Report',
    preparationAdvice: 'Empty bladder immediately before scan.',
    tags: ['USG', 'TVS', 'Pelvis', 'Early Pregnancy', 'Sonography']
  },
  {
    id: 'usg-02',
    code: 'USG-PELVIS-TAS',
    category: 'Ultrasound (USG) & Imaging',
    serviceName: 'Pelvic Ultrasound (TAS - Transabdominal Scan)',
    description: 'Transabdominal sonographic scan for pelvic organs, adnexal masses, uterine size, and mid-trimester gestational dating.',
    standardFeeINR: 800,
    bplSubsidizedFeeINR: 400,
    isFreeForBpl: false,
    turnaroundTime: 'Immediate Print & Report',
    preparationAdvice: 'Full bladder required (drink 3-4 glasses of water 1 hour prior).',
    tags: ['USG', 'TAS', 'Pelvis', 'Abdominal Scan']
  },
  {
    id: 'usg-03',
    code: 'USG-FOLLICULAR-SERIES',
    category: 'Ultrasound (USG) & Imaging',
    serviceName: 'Follicular Tracking Sonography (Per Scan)',
    description: 'Serial follicular monitoring for ovulation assessment in infertility workup, measuring leading follicle size and endometrial lining growth.',
    standardFeeINR: 450,
    bplSubsidizedFeeINR: 250,
    isFreeForBpl: false,
    tags: ['Follicular Monitoring', 'Ovulation', 'Infertility']
  },

  // ==========================================
  // 6. LABORATORY & PATHOLOGY INVESTIGATIONS
  // ==========================================
  {
    id: 'lab-01',
    code: 'LAB-PAP-SMEAR',
    category: 'Laboratory & Pathology Investigations',
    serviceName: 'Conventional Pap Smear Cytology',
    description: 'Cervical scraping cytology stained by Papanicolaou method for early detection of cervical dysplasia and pre-cancerous lesions.',
    standardFeeINR: 450,
    bplSubsidizedFeeINR: 250,
    isFreeForBpl: false,
    turnaroundTime: '48-72 Hours',
    tags: ['Pap Smear', 'Cervical Cancer', 'Cytology']
  },
  {
    id: 'lab-02',
    code: 'LAB-CBC-HEMO',
    category: 'Laboratory & Pathology Investigations',
    serviceName: 'Complete Blood Count (CBC) with ESR',
    description: 'Automated 5-part differential blood count covering Hb, RBC, WBC, Platelets, Hematocrit, and Erythrocyte Sedimentation Rate.',
    standardFeeINR: 350,
    bplSubsidizedFeeINR: 180,
    isFreeForBpl: false,
    turnaroundTime: '2-4 Hours',
    tags: ['CBC', 'Hemogram', 'Anemia', 'Infection']
  },
  {
    id: 'lab-03',
    code: 'LAB-HB-TEST',
    category: 'Laboratory & Pathology Investigations',
    serviceName: 'Hemoglobin (Hb%) Fingerprick / Cyanmethemoglobin',
    description: 'Rapid quantitative hemoglobin estimation for screening maternal and pre-operative anemia.',
    standardFeeINR: 100,
    bplSubsidizedFeeINR: 40,
    isFreeForBpl: false,
    turnaroundTime: '10 Minutes',
    tags: ['Hb', 'Hemoglobin', 'Anemia Screening']
  },
  {
    id: 'lab-04',
    code: 'LAB-UPT-CARD',
    category: 'Laboratory & Pathology Investigations',
    serviceName: 'Urine Pregnancy Test (High-Sensitivity hCG Card)',
    description: 'Qualitative immunochromatographic detection of human chorionic gonadotropin (hCG) in urine for pregnancy confirmation.',
    standardFeeINR: 100,
    bplSubsidizedFeeINR: 30,
    isFreeForBpl: false,
    turnaroundTime: '5 Minutes',
    tags: ['UPT', 'Pregnancy Test', 'Rapid hCG']
  },
  {
    id: 'lab-05',
    code: 'LAB-BLOOD-GROUP',
    category: 'Laboratory & Pathology Investigations',
    serviceName: 'ABO Blood Grouping & Rh Typing',
    description: 'Standard slide & tube agglutination method for determining ABO blood group and Rh(D) status.',
    standardFeeINR: 150,
    bplSubsidizedFeeINR: 70,
    isFreeForBpl: false,
    turnaroundTime: '30 Minutes',
    tags: ['Blood Group', 'Rh Factor', 'Pre-op']
  },
  {
    id: 'lab-06',
    code: 'LAB-BLOOD-SUGAR',
    category: 'Laboratory & Pathology Investigations',
    serviceName: 'Blood Sugar (Fasting / Post-Prandial / Random)',
    description: 'Plasma glucose estimation by hexokinase / GOD-POD method for diabetes screening.',
    standardFeeINR: 90,
    bplSubsidizedFeeINR: 40,
    isFreeForBpl: false,
    turnaroundTime: '1 Hour',
    tags: ['Blood Sugar', 'Glucose', 'Diabetes']
  },
  {
    id: 'lab-07',
    code: 'LAB-LIPID-PROFILE',
    category: 'Laboratory & Pathology Investigations',
    serviceName: 'Lipid Profile (Full Cardiovascular Panel)',
    description: 'Total Cholesterol, HDL, LDL, VLDL, Triglycerides, and Total/HDL ratio.',
    standardFeeINR: 550,
    bplSubsidizedFeeINR: 280,
    isFreeForBpl: false,
    turnaroundTime: '6-8 Hours',
    tags: ['Lipid Profile', 'Cholesterol', 'Cardiovascular']
  },
  {
    id: 'lab-08',
    code: 'LAB-THYROID-T3T4TSH',
    category: 'Laboratory & Pathology Investigations',
    serviceName: 'Thyroid Profile (Total T3, Total T4, TSH)',
    description: 'Chemiluminescence immunoassay (CLIA) for diagnosing hyperthyroidism, hypothyroidism, and subclinical thyroiditis.',
    standardFeeINR: 550,
    bplSubsidizedFeeINR: 300,
    isFreeForBpl: false,
    turnaroundTime: '24 Hours',
    tags: ['Thyroid', 'T3', 'T4', 'TSH']
  },
  {
    id: 'lab-09',
    code: 'LAB-SEMEN-ANALYSIS',
    category: 'Laboratory & Pathology Investigations',
    serviceName: 'Semen Analysis (WHO 2021 Manual Standard)',
    description: 'Macroscopic and microscopic analysis for sperm count, rapid progressive motility, morphology, viability, and liquefaction time.',
    standardFeeINR: 450,
    bplSubsidizedFeeINR: 250,
    isFreeForBpl: false,
    turnaroundTime: '4 Hours',
    preparationAdvice: '3 to 5 days of sexual abstinence prior to sample collection.',
    tags: ['Semen Analysis', 'Male Fertility', 'Sperm Count']
  },
  {
    id: 'lab-10',
    code: 'LAB-RTI-KITS',
    category: 'Laboratory & Pathology Investigations',
    serviceName: 'RTI / STI Syndromic Diagnostic & Treatment Kit',
    description: 'NACO approved color-coded kit (Metronidazole, Fluconazole, Cefixime, Azithromycin) based on clinical discharge/ulcer syndromic diagnosis.',
    standardFeeINR: 350,
    bplSubsidizedFeeINR: 100,
    isFreeForBpl: false,
    tags: ['RTI', 'STI', 'NACO Kit', 'Syndromic']
  },

  // ==========================================
  // 7. WALK-IN & DAY-CARE SERVICES
  // ==========================================
  {
    id: 'wi-01',
    code: 'WI-BP-CHECK',
    category: 'Walk-In & Day-Care Services',
    serviceName: 'Blood Pressure & Vital Signs Check',
    description: 'Sphygmomanometer blood pressure check, pulse rate, oxygen saturation (SpO2), and pulse regularity check.',
    standardFeeINR: 50,
    bplSubsidizedFeeINR: 0,
    isFreeForBpl: true,
    turnaroundTime: 'Immediate',
    tags: ['Vitals', 'Blood Pressure', 'Free BPL']
  },
  {
    id: 'wi-02',
    code: 'WI-STITCH-REMOVAL',
    category: 'Walk-In & Day-Care Services',
    serviceName: 'Suture / Stitch Removal & Antiseptic Dressing',
    description: 'Sterile surgical stitch removal with surgical forceps, skin antiseptic cleaning, and waterproof dressing application.',
    standardFeeINR: 250,
    bplSubsidizedFeeINR: 100,
    isFreeForBpl: false,
    turnaroundTime: '15 Minutes',
    tags: ['Stitch Removal', 'Dressing', 'Post-Op']
  },
  {
    id: 'wi-03',
    code: 'WI-DAYCARE-BED',
    category: 'Walk-In & Day-Care Services',
    serviceName: 'Day-Care Recovery Bed & Monitoring (Per Half-Day)',
    description: 'Comfortable day-care recovery bed with nurse monitoring, vitals charting, hot beverage, and post-procedure observation.',
    standardFeeINR: 500,
    bplSubsidizedFeeINR: 200,
    isFreeForBpl: false,
    tags: ['Day-Care', 'Bed Occupancy', 'Nursing Care']
  }
];
