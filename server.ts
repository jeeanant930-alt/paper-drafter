import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('GEMINI_API_KEY is not set. Real AI generation requires GEMINI_API_KEY.');
}

// Generate Question Paper Endpoint
app.post('/api/generate-paper', async (req, res) => {
  try {
    const {
      schoolName,
      grade,
      board,
      subject,
      examType,
      chapters,
      totalMarks,
      duration,
      difficulty,
      questionTypes,
      questionCounts,
      includeAnswerKey,
      includeMarkingScheme,
      additionalInstructions,
    } = req.body;

    if (!grade || !subject || !totalMarks) {
      return res.status(400).json({ error: 'Missing required parameters (grade, subject, totalMarks).' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API is not configured on the server. Please check GEMINI_API_KEY.',
      });
    }

    const marksNum = parseInt(totalMarks, 10) || 50;
    const chaptersText = Array.isArray(chapters) && chapters.length > 0 ? chapters.join(', ') : 'Whole Syllabus / Key Topics';
    const qTypesText = Array.isArray(questionTypes) && questionTypes.length > 0 ? questionTypes.join(', ') : 'MCQs, Short Answer, Long Answer';

    const systemPrompt = `You are a senior examination board paper setter and academic curriculum expert for ${board || 'CBSE/ICSE/State'} examinations.
Your task is to generate a complete, rigorous, and authentic examination question paper matching standard school format.

CRITICAL RULES:
1. The SUM OF ALL QUESTION MARKS MUST EXACTLY EQUAL ${marksNum} MARKS. This is an unbreakable constraint.
2. Structure questions into standard examination sections (e.g., Section A: Objective / MCQs, Section B: Very Short / Short Answer, Section C: Long Answer, Section D: Case-Based / Application).
3. Every question must have an allotted mark count (e.g. 1, 2, 3, 4, 5).
4. For MCQs, provide 4 distinct, plausible options (A, B, C, D).
5. For Assertion-Reason questions, provide the standard statements (Assertion: ..., Reason: ...) and standard 4 options.
6. For Case-Based questions, include a 2-4 sentence stimulus passage followed by 2-3 sub-questions with individual marks.
7. Questions must be 100% curriculum-authentic for ${grade}, ${subject}, covering chapters: ${chaptersText}.
8. Difficulty level requested: ${difficulty || 'Mixed'}.
9. General Instructions must be standard examination guidelines (e.g. "All questions are compulsory", "Draw neat diagrams where necessary", "Use of calculators is not permitted").
10. If includeAnswerKey is true, provide thorough, accurate answers for every single question. For numerical or multi-step questions, include step-by-step working and marking scheme points (e.g., "1 mark for formula, 1 mark for substitution, 1 mark for correct answer with units").

Output MUST be valid JSON adhering strictly to the required schema with no Markdown code block wrap or text outside JSON.`;

    const userPrompt = `Generate a ${marksNum}-mark examination question paper for:
- School: ${schoolName || 'DELHI PUBLIC SCHOOL / MODEL SENIOR SECONDARY SCHOOL'}
- Examination: ${examType || 'Term Examination 2025-26'}
- Class / Grade: ${grade}
- Board: ${board || 'CBSE'}
- Subject: ${subject}
- Target Chapters: ${chaptersText}
- Duration: ${duration || '2 Hours'}
- Total Marks: ${marksNum}
- Question Types: ${qTypesText}
- Question Counts: ${JSON.stringify(questionCounts || {})}
- Include Answer Key: ${includeAnswerKey ? 'Yes' : 'No'}
- Include Marking Scheme: ${includeMarkingScheme ? 'Yes' : 'No'}
- Special Teacher Instructions: ${additionalInstructions || 'None'}

Return a JSON object with this exact structure:
{
  "examDetails": {
    "schoolName": "string",
    "examName": "string",
    "grade": "string",
    "board": "string",
    "subject": "string",
    "session": "2025-2026",
    "durationFormatted": "string",
    "maxMarks": ${marksNum},
    "generalInstructions": ["string"]
  },
  "sections": [
    {
      "id": "sec-a",
      "name": "SECTION A",
      "description": "Objective & Multiple Choice Questions (1 Mark Each)",
      "questions": [
        {
          "id": "q-1",
          "questionNumber": 1,
          "type": "mcq", // "mcq" | "fill_blank" | "true_false" | "assertion_reason" | "vsa" | "sa" | "la" | "case_based"
          "text": "string question text",
          "chapter": "chapter name",
          "options": ["Option A text", "Option B text", "Option C text", "Option D text"], // only if mcq or assertion_reason
          "assertion": "string", // only if assertion_reason
          "reason": "string", // only if assertion_reason
          "marks": 1,
          "answer": "Option (B) with explanation or exact answer",
          "markingScheme": "1 mark for correct option",
          "difficulty": "Easy" // "Easy" | "Medium" | "Hard"
        }
      ]
    }
  ]
}
Double-check that the sum of all question marks across all sections equals exactly ${marksNum}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim() || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Failed to parse JSON response:', responseText);
      return res.status(500).json({ error: 'AI generated invalid JSON structure. Please retry.' });
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating question paper:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate question paper. Please check connection and try again.',
    });
  }
});

// Regenerate single question endpoint
app.post('/api/regenerate-question', async (req, res) => {
  try {
    const { grade, board, subject, chapter, type, marks, difficulty, currentText } = req.body;

    if (!ai) {
      return res.status(500).json({ error: 'Gemini API not configured.' });
    }

    const prompt = `You are a school examination paper setter. Create 1 replacement question for a ${grade} ${board || 'CBSE'} ${subject} examination.
Chapter: ${chapter || 'Current Syllabus'}
Question Type: ${type || 'sa'} (options: mcq, fill_blank, true_false, assertion_reason, vsa, sa, la, case_based)
Marks allotted: ${marks || 2}
Difficulty: ${difficulty || 'Medium'}
Previous question to REPLACE (do not duplicate): "${currentText || ''}"

Return ONLY valid JSON:
{
  "type": "${type || 'sa'}",
  "text": "new high-quality question text",
  "chapter": "${chapter || 'Current Syllabus'}",
  "options": ["A", "B", "C", "D"], // if mcq
  "assertion": "", // if assertion_reason
  "reason": "", // if assertion_reason
  "marks": ${marks || 2},
  "answer": "detailed model answer",
  "markingScheme": "step-by-step marking rubric",
  "difficulty": "${difficulty || 'Medium'}"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error regenerating question:', error);
    return res.status(500).json({ error: error.message || 'Failed to regenerate question' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
