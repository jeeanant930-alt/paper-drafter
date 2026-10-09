import { QuestionPaper } from '../types';

export const SAMPLE_PAPERS: QuestionPaper[] = [
  {
    id: 'sample-cbse-10-science',
    title: 'Class 10 Science - Half-Yearly Examination (80 Marks)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examDetails: {
      schoolName: 'ST. XAVIER SENIOR SECONDARY SCHOOL, NEW DELHI',
      examName: 'HALF-YEARLY EXAMINATION (2025 - 2026)',
      grade: 'Class 10',
      board: 'CBSE',
      subject: 'Science',
      session: '2025 - 2026',
      durationFormatted: '3 Hours',
      maxMarks: 80,
      setLabel: 'Set A',
      generalInstructions: [
        'This question paper consists of 39 questions in 5 sections.',
        'All questions are compulsory. However, an internal choice is provided in some questions.',
        'Section A consists of 20 objective type questions carrying 1 mark each.',
        'Section B consists of 6 Very Short questions carrying 02 marks each. Answers should be in the range of 30 to 50 words.',
        'Section C consists of 7 Short Answer type questions carrying 03 marks each. Answers should be in the range of 50 to 80 words.',
        'Section D consists of 3 Long Answer type questions carrying 05 marks each. Answers should be in the range of 80 to 120 words.',
        'Section E consists of 3 source-based/case-based units of assessment of 04 marks each with sub-parts.'
      ]
    },
    includeAnswerKey: true,
    includeMarkingScheme: true,
    sections: [
      {
        id: 'sec-a',
        name: 'SECTION A',
        description: 'Objective Type Questions & Assertion-Reason (Questions 1 to 20 carry 1 mark each)',
        questions: [
          {
            id: 'q-1',
            questionNumber: 1,
            type: 'mcq',
            chapter: 'Chemical Reactions and Equations',
            text: 'When aqueous solutions of potassium iodide and lead nitrate are mixed, an insoluble precipitate is formed. What is the colour of the precipitate and what compound is formed?',
            options: [
              'White precipitate of Potassium nitrate',
              'Yellow precipitate of Lead iodide',
              'Yellow precipitate of Potassium iodide',
              'White precipitate of Lead nitrate'
            ],
            marks: 1,
            answer: 'Option (B): Yellow precipitate of Lead iodide [PbI2]',
            markingScheme: '1 mark for correct identification of PbI2 and yellow colour.',
            difficulty: 'Easy'
          },
          {
            id: 'q-2',
            questionNumber: 2,
            type: 'mcq',
            chapter: 'Acids, Bases and Salts',
            text: 'A student adds dilute hydrochloric acid to granulated zinc metal in a test tube. The gas evolved turns a burning splinter with a pop sound. The gas evolved is:',
            options: ['Oxygen', 'Carbon dioxide', 'Hydrogen', 'Chlorine'],
            marks: 1,
            answer: 'Option (C): Hydrogen gas [H2]',
            markingScheme: '1 mark for correct option C.',
            difficulty: 'Easy'
          },
          {
            id: 'q-3',
            questionNumber: 3,
            type: 'mcq',
            chapter: 'Life Processes',
            text: 'In which part of the alimentary canal is food completely digested into glucose, amino acids, fatty acids, and glycerol?',
            options: ['Stomach', 'Small intestine', 'Large intestine', 'Mouth cavity'],
            marks: 1,
            answer: 'Option (B): Small intestine',
            markingScheme: '1 mark for correct option.',
            difficulty: 'Easy'
          },
          {
            id: 'q-4',
            questionNumber: 4,
            type: 'mcq',
            chapter: 'Light - Reflection and Refraction',
            text: 'A concave mirror produces three times magnified real image of an object placed at 10 cm in front of it. Where is the image located?',
            options: ['-30 cm', '+30 cm', '-20 cm', '+15 cm'],
            marks: 1,
            answer: 'Option (A): -30 cm (Magnification m = -v/u = -3, so v = 3u = 3(-10) = -30 cm)',
            markingScheme: '1 mark for correct calculation and sign convention.',
            difficulty: 'Medium'
          },
          {
            id: 'q-5',
            questionNumber: 5,
            type: 'assertion_reason',
            chapter: 'Electricity',
            text: 'Directions: In question 5, a statement of Assertion (A) is followed by a statement of Reason (R). Choose the correct option.',
            assertion: 'The resistance of an ideal ammeter should be zero.',
            reason: 'An ammeter is always connected in series in the circuit and should not change the circuit current.',
            options: [
              'Both (A) and (R) are true and (R) is the correct explanation of (A).',
              'Both (A) and (R) are true but (R) is NOT the correct explanation of (A).',
              '(A) is true but (R) is false.',
              '(A) is false but (R) is true.'
            ],
            marks: 1,
            answer: 'Option (A): Both (A) and (R) are true and (R) is the correct explanation of (A).',
            markingScheme: '1 mark for correct logical deduction.',
            difficulty: 'Medium'
          }
        ]
      },
      {
        id: 'sec-b',
        name: 'SECTION B',
        description: 'Very Short Answer Questions (Questions 6 to 11 carry 2 marks each)',
        questions: [
          {
            id: 'q-6',
            questionNumber: 6,
            type: 'vsa',
            chapter: 'Chemical Reactions and Equations',
            text: 'Why do we store silver chloride in dark coloured bottles? Write the balanced photochemical chemical equation for the reaction involved.',
            marks: 2,
            answer: 'Silver chloride undergoes photochemical decomposition in the presence of sunlight to form metallic silver and chlorine gas:\n2AgCl(s) --[Sunlight]--> 2Ag(s) + Cl2(g)\nTherefore, it is stored in dark bottles to prevent exposure to light.',
            markingScheme: '1 mark for reason (prevents decomposition), 1 mark for balanced chemical equation.',
            difficulty: 'Medium'
          },
          {
            id: 'q-7',
            questionNumber: 7,
            type: 'vsa',
            chapter: 'Life Processes',
            text: 'Differentiate between aerobic and anaerobic respiration on the basis of: (i) Site of occurrence in the cell (ii) End products formed in humans.',
            marks: 2,
            answer: '(i) Site: Aerobic occurs in cytoplasm and mitochondria; Anaerobic (in humans) occurs in cytoplasm.\n(ii) End products: Aerobic produces CO2, H2O, and 36-38 ATP; Anaerobic in muscle cells produces Lactic acid and 2 ATP.',
            markingScheme: '1 mark for site comparison, 1 mark for end products in humans.',
            difficulty: 'Easy'
          },
          {
            id: 'q-8',
            questionNumber: 8,
            type: 'vsa',
            chapter: 'Electricity',
            text: 'A wire of resistance R is cut into three equal pieces. These pieces are then connected in parallel. If the equivalent resistance of this combination is R\', find the ratio R / R\'.',
            marks: 2,
            answer: 'Resistance of each piece = R/3.\nWhen connected in parallel:\n1/R\' = 1/(R/3) + 1/(R/3) + 1/(R/3) = 3/R + 3/R + 3/R = 9/R\n=> R\' = R/9\n=> Ratio R / R\' = 9 : 1',
            markingScheme: '1 mark for step finding R/3 and parallel formula, 1 mark for final ratio 9:1.',
            difficulty: 'Medium'
          }
        ]
      },
      {
        id: 'sec-c',
        name: 'SECTION C',
        description: 'Short Answer Type Questions (Questions 12 to 18 carry 3 marks each)',
        questions: [
          {
            id: 'q-9',
            questionNumber: 9,
            type: 'sa',
            chapter: 'Acids, Bases and Salts',
            text: 'Identify the compound of calcium which is yellowish-white powder and is used for disinfecting drinking water.\n(a) Write its chemical name and chemical formula.\n(b) Write the chemical equation for its preparation.\n(c) What happens when it is kept open in the air for a long time?',
            marks: 3,
            answer: '(a) Bleaching Powder; Chemical Name: Calcium oxychloride; Formula: CaOCl2.\n(b) Preparation: Ca(OH)2 + Cl2 --> CaOCl2 + H2O (Action of chlorine on dry slaked lime).\n(c) When exposed to air, it reacts with atmospheric CO2 releasing chlorine gas, losing its bleaching properties.',
            markingScheme: '1 mark for name and formula; 1 mark for preparation equation; 1 mark for effect of open air exposure.',
            difficulty: 'Medium'
          },
          {
            id: 'q-10',
            questionNumber: 10,
            type: 'sa',
            chapter: 'Life Processes',
            text: 'Explain the mechanism of transport of water and minerals in plants. What role does transpiration pull play in tall trees?',
            marks: 3,
            answer: '1. Root pressure pushes water up to smaller heights via active ionic uptake.\n2. Transpiration pull: Evaporation of water from stomata creates a suction pull (transpiration pull) inside xylem vessels.\n3. Continuous water column is maintained due to cohesive and adhesive forces of water molecules, enabling ascent of sap up to 100 meters.',
            markingScheme: '1 mark for root absorption mechanism, 1.5 marks for transpiration pull suction explanation, 0.5 mark for continuous xylem column.',
            difficulty: 'Medium'
          },
          {
            id: 'q-11',
            questionNumber: 11,
            type: 'sa',
            chapter: 'Human Eye and Colourful World',
            text: 'A person cannot see objects clearly beyond 1.5 m. Identify the defect of vision.\n(a) Name the type of corrective lens required.\n(b) Calculate the focal length and power of the corrective lens required to restore normal distant vision.',
            marks: 3,
            answer: 'Defect: Myopia (Near-sightedness).\n(a) Corrective lens: Concave lens.\n(b) Far point of myopic eye d = -1.5 m; Normal far point u = infinity.\nUsing lens formula: 1/f = 1/v - 1/u => 1/f = 1/(-1.5) - 1/(-inf) = -1/1.5\n=> f = -1.5 m.\nPower P = 1/f = 1/(-1.5) = -0.67 D (or -2/3 D).',
            markingScheme: '1 mark for naming defect & concave lens, 1 mark for focal length calculation, 1 mark for power with negative sign and dioptre unit.',
            difficulty: 'Hard'
          }
        ]
      },
      {
        id: 'sec-d',
        name: 'SECTION D',
        description: 'Long Answer Type Questions (Questions 19 to 21 carry 5 marks each)',
        questions: [
          {
            id: 'q-12',
            questionNumber: 12,
            type: 'la',
            chapter: 'Metals and Non-Metals',
            text: '(a) How is copper extracted from its sulphide ore (copper glance, Cu2S)? Write all balanced chemical equations with conditions.\n(b) Explain electrolytic refining of blister copper with a neat labeled schematic description specifying the anode, cathode, and electrolyte.',
            marks: 5,
            answer: '(a) Extraction:\n1. Roasting: 2Cu2S + 3O2 --[Heat]--> 2Cu2O + 2SO2\n2. Auto-reduction: 2Cu2O + Cu2S --[Heat]--> 6Cu + SO2\n\n(b) Electrolytic Refining:\n- Anode: Thick block of impure copper metal.\n- Cathode: Thin strip of pure copper metal.\n- Electrolyte: Acidified copper sulphate (CuSO4) solution.\n- Reaction at cathode: Cu2+ + 2e- --> Cu (pure copper deposited).\n- Reaction at anode: Cu --> Cu2+ + 2e- (dissolves).\n- Impurities settle as anode mud containing precious metals (Au, Ag, Pt).',
            markingScheme: '2 marks for roasting & auto-reduction equations; 1.5 marks for electrolytic setup (anode, cathode, electrolyte); 1.5 marks for electrode reactions and anode mud explanation.',
            difficulty: 'Hard'
          }
        ]
      },
      {
        id: 'sec-e',
        name: 'SECTION E',
        description: 'Case-Based / Data-Interpretation Questions (Questions 22 to 24 carry 4 marks each)',
        questions: [
          {
            id: 'q-13',
            questionNumber: 13,
            type: 'case_based',
            chapter: 'Electricity & Magnetic Effects',
            text: 'Read the following passage and answer the questions that follow:\n\nAn electric circuit is constructed with an appliance having two heating coils of resistance 24 ohms each. These coils can be used separately, in series, or in parallel connected across a 220 V electric supply line.',
            subQuestions: [
              {
                id: 'sq-1',
                label: '(i)',
                text: 'Calculate the electric current drawn when only one coil is used.',
                marks: 1,
                answer: 'Current I = V / R = 220 V / 24 ohm = 9.17 A'
              },
              {
                id: 'sq-2',
                label: '(ii)',
                text: 'What will be the total current drawn when both coils are connected in series across the 220 V line?',
                marks: 1,
                answer: 'In series: R_total = 24 + 24 = 48 ohm. Current I = 220 / 48 = 4.58 A'
              },
              {
                id: 'sq-3',
                label: '(iii)',
                text: 'Calculate the total heat energy dissipated in 10 minutes when the coils are connected in parallel.',
                marks: 2,
                answer: 'In parallel: 1/R_p = 1/24 + 1/24 = 2/24 => R_p = 12 ohm.\nHeat H = (V^2 / R) * t = (220^2 / 12) * (10 * 60) seconds\n= (48400 / 12) * 600 = 48400 * 50 = 2,420,000 Joules = 2.42 MJ.'
              }
            ],
            marks: 4,
            answer: 'See sub-part solutions above.',
            markingScheme: '1 mark for part (i), 1 mark for part (ii), 2 marks for part (iii) (1 mark for equivalent resistance, 1 mark for Joule heat with units).',
            difficulty: 'Medium'
          }
        ]
      }
    ]
  },
  {
    id: 'sample-cbse-10-maths',
    title: 'Class 10 Mathematics - Standard Unit Test (40 Marks)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    examDetails: {
      schoolName: 'MODERN VIDYA NIKETAN PUBLIC SCHOOL',
      examName: 'PERIODIC ASSESSMENT - II (2025 - 2026)',
      grade: 'Class 10',
      board: 'CBSE',
      subject: 'Mathematics',
      session: '2025 - 2026',
      durationFormatted: '1 Hour 30 Minutes',
      maxMarks: 40,
      setLabel: 'Set B',
      generalInstructions: [
        'The question paper contains 18 questions divided into four Sections: A, B, C, and D.',
        'Section A comprises 8 questions of 1 mark each (MCQ and Assertion-Reason).',
        'Section B comprises 4 questions of 2 marks each.',
        'Section C comprises 4 questions of 3 marks each.',
        'Section D comprises 2 questions of 6 marks each (or Case-based).',
        'Use of calculators is strictly prohibited.'
      ]
    },
    includeAnswerKey: true,
    includeMarkingScheme: true,
    sections: [
      {
        id: 'sec-a',
        name: 'SECTION A',
        description: 'Multiple Choice Questions (8 × 1 = 8 Marks)',
        questions: [
          {
            id: 'qm-1',
            questionNumber: 1,
            type: 'mcq',
            chapter: 'Quadratic Equations',
            text: 'If one root of the quadratic equation 2x^2 + kx - 6 = 0 is 2, then the value of k is:',
            options: ['-1', '1', '-2', '2'],
            marks: 1,
            answer: 'Option (A): -1 (Substitute x = 2: 2(4) + 2k - 6 = 0 => 8 + 2k - 6 = 0 => 2k = -2 => k = -1)',
            markingScheme: '1 mark for correct substitution and solving for k = -1.',
            difficulty: 'Easy'
          },
          {
            id: 'qm-2',
            questionNumber: 2,
            type: 'mcq',
            chapter: 'Arithmetic Progressions',
            text: 'The 11th term of the AP: -3, -1/2, 2, ... is:',
            options: ['28', '22', '-38', '46/2'],
            marks: 1,
            answer: 'Option (B): 22 (a = -3, d = -1/2 - (-3) = 5/2. a_11 = a + 10d = -3 + 10(5/2) = -3 + 25 = 22)',
            markingScheme: '1 mark for finding common difference and evaluating a_11.',
            difficulty: 'Easy'
          }
        ]
      },
      {
        id: 'sec-b',
        name: 'SECTION B',
        description: 'Short Answer Questions - I (4 × 2 = 8 Marks)',
        questions: [
          {
            id: 'qm-3',
            questionNumber: 3,
            type: 'sa',
            chapter: 'Triangles',
            text: 'In triangle ABC, DE || BC intersecting AB at D and AC at E. If AD = 4 cm, DB = 4.5 cm, and AE = 8 cm, find AC.',
            marks: 2,
            answer: 'By Basic Proportionality Theorem (Thales Theorem):\nAD / DB = AE / EC\n4 / 4.5 = 8 / EC => EC = (8 * 4.5) / 4 = 9 cm.\nTherefore, AC = AE + EC = 8 + 9 = 17 cm.',
            markingScheme: '1 mark for applying BPT correctly to find EC = 9 cm, 1 mark for finding AC = 17 cm.',
            difficulty: 'Medium'
          }
        ]
      },
      {
        id: 'sec-c',
        name: 'SECTION C',
        description: 'Short Answer Questions - II (4 × 3 = 12 Marks)',
        questions: [
          {
            id: 'qm-4',
            questionNumber: 4,
            type: 'sa',
            chapter: 'Introduction to Trigonometry',
            text: 'Prove the trigonometric identity: (sin θ - 2 sin^3 θ) / (2 cos^3 θ - cos θ) = tan θ.',
            marks: 3,
            answer: 'LHS = [sin θ (1 - 2 sin^2 θ)] / [cos θ (2 cos^2 θ - 1)]\nSince 1 - 2 sin^2 θ = cos 2θ and 2 cos^2 θ - 1 = cos 2θ (or substitute 1 = sin^2 θ + cos^2 θ):\nNumerator: (sin^2 θ + cos^2 θ) - 2 sin^2 θ = cos^2 θ - sin^2 θ\nDenominator: 2 cos^2 θ - (sin^2 θ + cos^2 θ) = cos^2 θ - sin^2 θ\nBoth terms cancel out: = sin θ / cos θ = tan θ = RHS. Hence Proved.',
            markingScheme: '1 mark for factoring sin θ and cos θ; 1 mark for substituting identity 1 = sin^2 + cos^2; 1 mark for cancellation and final proof.',
            difficulty: 'Medium'
          }
        ]
      },
      {
        id: 'sec-d',
        name: 'SECTION D',
        description: 'Long Answer / Case Study (2 × 6 = 12 Marks)',
        questions: [
          {
            id: 'qm-5',
            questionNumber: 5,
            type: 'la',
            chapter: 'Some Applications of Trigonometry',
            text: 'From the top of a 7 m high building, the angle of elevation of the top of a cable tower is 60° and the angle of depression of its foot is 45°. Determine the height of the cable tower.',
            marks: 6,
            answer: 'Let AB be building = 7 m. Let CD be cable tower of height H.\nHorizontal distance between building and tower = x.\nIn right triangle ABD: tan 45° = AB / BD => 1 = 7 / x => x = 7 m.\nLet E be point on CD at same level as A. ED = 7 m, CE = H - 7.\nIn right triangle AEC: tan 60° = CE / AE\nsqrt(3) = (H - 7) / 7 => H - 7 = 7 * sqrt(3)\nH = 7(sqrt(3) + 1) = 7(1.732 + 1) = 7 * 2.732 ≈ 19.12 m.\nHeight of tower = 7(√3 + 1) m ≈ 19.12 m.',
            markingScheme: '2 marks for accurate labeled diagram and identifying geometry; 2 marks for finding horizontal distance x = 7 m; 2 marks for applying tan 60° and calculating height.',
            difficulty: 'Hard'
          }
        ]
      }
    ]
  }
];
