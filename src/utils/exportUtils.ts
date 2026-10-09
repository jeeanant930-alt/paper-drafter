import { QuestionPaper, Question, Section } from '../types';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import jsPDF from 'jspdf';

/**
 * Clean text export for clipboard or .txt download
 */
export function formatPaperAsText(
  paper: QuestionPaper,
  options: { includeQuestions?: boolean; includeAnswers?: boolean } = { includeQuestions: true, includeAnswers: true }
): string {
  const { examDetails, sections } = paper;
  const lines: string[] = [];

  const addLine = (str: string = '') => lines.push(str);
  const addCenter = (str: string) => lines.push(str);

  if (options.includeQuestions) {
    if (examDetails.schoolName) {
      addCenter(examDetails.schoolName.toUpperCase());
    }
    addCenter(examDetails.examName.toUpperCase());
    addLine(`CLASS: ${examDetails.grade.toUpperCase()} | BOARD: ${examDetails.board} | SUBJECT: ${examDetails.subject.toUpperCase()}`);
    if (examDetails.session) {
      addLine(`ACADEMIC SESSION: ${examDetails.session}`);
    }
    addLine(`TIME ALLOWED: ${examDetails.durationFormatted} | MAXIMUM MARKS: ${examDetails.maxMarks}${examDetails.setLabel ? ` | [${examDetails.setLabel}]` : ''}`);
    addLine('='.repeat(72));

    if (examDetails.generalInstructions && examDetails.generalInstructions.length > 0) {
      addLine('GENERAL INSTRUCTIONS:');
      examDetails.generalInstructions.forEach((inst, idx) => {
        addLine(`  ${idx + 1}. ${inst}`);
      });
      addLine('-'.repeat(72));
    }

    sections.forEach((sec) => {
      addLine('');
      addLine(`--- ${sec.name.toUpperCase()} ---`);
      if (sec.description) {
        addLine(`(${sec.description})`);
      }
      addLine('');

      sec.questions.forEach((q) => {
        addLine(`Q.${q.questionNumber}  ${q.text}   [${q.marks} Mark${q.marks > 1 ? 's' : ''}]`);

        if (q.type === 'assertion_reason') {
          if (q.assertion) addLine(`     Assertion (A): ${q.assertion}`);
          if (q.reason) addLine(`     Reason (R): ${q.reason}`);
        }

        if (q.options && q.options.length > 0) {
          const optPrefixes = ['(A)', '(B)', '(C)', '(D)', '(E)'];
          q.options.forEach((opt, oIdx) => {
            addLine(`     ${optPrefixes[oIdx] || `(${oIdx + 1})`} ${opt}`);
          });
        }

        if (q.subQuestions && q.subQuestions.length > 0) {
          q.subQuestions.forEach((sq) => {
            addLine(`     ${sq.label} ${sq.text}  [${sq.marks} Mark${sq.marks > 1 ? 's' : ''}]`);
          });
        }

        addLine('');
      });
    });
  }

  if (options.includeAnswers) {
    addLine('');
    addLine('='.repeat(72));
    addLine('               ANSWER KEY & MARKING SCHEME');
    addLine(`               ${examDetails.subject} - ${examDetails.grade}`);
    addLine('='.repeat(72));
    addLine('');

    sections.forEach((sec) => {
      addLine(`[${sec.name}]`);
      sec.questions.forEach((q) => {
        addLine(`Q.${q.questionNumber}:`);
        addLine(`  Answer: ${q.answer || 'Not provided'}`);
        if (paper.includeMarkingScheme && q.markingScheme) {
          addLine(`  Marking Scheme: ${q.markingScheme}`);
        }
        if (q.subQuestions && q.subQuestions.length > 0) {
          q.subQuestions.forEach((sq) => {
            if (sq.answer) {
              addLine(`    ${sq.label} Answer: ${sq.answer}`);
            }
          });
        }
        addLine('');
      });
    });
  }

  return lines.join('\n');
}

/**
 * Download as plain text file (.txt)
 */
export function downloadAsText(
  paper: QuestionPaper,
  options: { includeQuestions?: boolean; includeAnswers?: boolean } = { includeQuestions: true, includeAnswers: true },
  filenameSuffix: string = ''
) {
  const content = formatPaperAsText(paper, options);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = paper.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  a.href = url;
  a.download = `${safeTitle}${filenameSuffix}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy Question Paper or Answer Key to Clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * Download as Microsoft Word document (.docx)
 */
export async function downloadAsDocx(
  paper: QuestionPaper,
  options: { includeQuestions?: boolean; includeAnswers?: boolean } = { includeQuestions: true, includeAnswers: true },
  filenameSuffix: string = ''
) {
  const { examDetails, sections } = paper;
  const docParagraphs: Paragraph[] = [];

  const borderNone = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  };

  if (options.includeQuestions) {
    // School Name Heading
    if (examDetails.schoolName) {
      docParagraphs.push(
        new Paragraph({
          text: examDetails.schoolName.toUpperCase(),
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        })
      );
    }

    // Exam Name
    docParagraphs.push(
      new Paragraph({
        text: examDetails.examName.toUpperCase(),
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: examDetails.examName.toUpperCase(),
            bold: true,
            size: 26,
            color: '1E293B',
          }),
        ],
      })
    );

    // Metadata line
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `CLASS: ${examDetails.grade}    |    BOARD: ${examDetails.board}    |    SUBJECT: ${examDetails.subject.toUpperCase()}`,
            bold: true,
            size: 22,
          }),
        ],
      })
    );

    // Time & Max Marks line
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: `Time Allowed: ${examDetails.durationFormatted}                Maximum Marks: ${examDetails.maxMarks}`,
            bold: true,
            size: 22,
          }),
          ...(examDetails.setLabel
            ? [
                new TextRun({
                  text: `                [${examDetails.setLabel}]`,
                  bold: true,
                  size: 22,
                  color: '0F172A',
                }),
              ]
            : []),
        ],
      })
    );

    // General Instructions
    if (examDetails.generalInstructions && examDetails.generalInstructions.length > 0) {
      docParagraphs.push(
        new Paragraph({
          text: 'General Instructions:',
          children: [new TextRun({ text: 'General Instructions:', bold: true, underline: {} })],
          spacing: { before: 200, after: 100 },
        })
      );

      examDetails.generalInstructions.forEach((inst, idx) => {
        docParagraphs.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: `${idx + 1}. `, bold: true }),
              new TextRun({ text: inst }),
            ],
          })
        );
      });
      docParagraphs.push(new Paragraph({ spacing: { after: 300 } }));
    }

    // Sections & Questions
    sections.forEach((sec) => {
      docParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 60 },
          children: [
            new TextRun({
              text: sec.name.toUpperCase(),
              bold: true,
              size: 24,
              color: '1E3A8A',
            }),
          ],
        })
      );

      if (sec.description) {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: `(${sec.description})`,
                italics: true,
                size: 20,
                color: '475569',
              }),
            ],
          })
        );
      }

      sec.questions.forEach((q) => {
        // Question text and marks
        docParagraphs.push(
          new Paragraph({
            spacing: { before: 140, after: 80 },
            children: [
              new TextRun({ text: `Q.${q.questionNumber}  `, bold: true, size: 22 }),
              new TextRun({ text: q.text, size: 22 }),
              new TextRun({
                text: `   [${q.marks} Mark${q.marks > 1 ? 's' : ''}]`,
                bold: true,
                size: 20,
                color: '334155',
              }),
            ],
          })
        );

        if (q.type === 'assertion_reason') {
          if (q.assertion) {
            docParagraphs.push(
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({ text: '       Assertion (A): ', bold: true }),
                  new TextRun({ text: q.assertion }),
                ],
              })
            );
          }
          if (q.reason) {
            docParagraphs.push(
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: '       Reason (R): ', bold: true }),
                  new TextRun({ text: q.reason }),
                ],
              })
            );
          }
        }

        if (q.options && q.options.length > 0) {
          const prefixes = ['(a)', '(b)', '(c)', '(d)', '(e)'];
          q.options.forEach((opt, idx) => {
            docParagraphs.push(
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({ text: `       ${prefixes[idx] || `(${idx + 1})`}  `, bold: true }),
                  new TextRun({ text: opt }),
                ],
              })
            );
          });
        }

        if (q.subQuestions && q.subQuestions.length > 0) {
          q.subQuestions.forEach((sq) => {
            docParagraphs.push(
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: `       ${sq.label} `, bold: true }),
                  new TextRun({ text: sq.text }),
                  new TextRun({ text: `   [${sq.marks} Mark${sq.marks > 1 ? 's' : ''}]`, bold: true }),
                ],
              })
            );
          });
        }
      });
    });
  }

  // Answer Key Section
  if (options.includeAnswers) {
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 120 },
        children: [
          new TextRun({
            text: 'ANSWER KEY & MARKING SCHEME',
            bold: true,
            size: 28,
            color: '1E3A8A',
          }),
        ],
      })
    );

    sections.forEach((sec) => {
      docParagraphs.push(
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: `[${sec.name}]`,
              bold: true,
              size: 22,
              color: '1E293B',
            }),
          ],
        })
      );

      sec.questions.forEach((q) => {
        docParagraphs.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: `Q.${q.questionNumber}: `, bold: true }),
              new TextRun({ text: q.answer || 'Answer key pending' }),
            ],
          })
        );

        if (paper.includeMarkingScheme && q.markingScheme) {
          docParagraphs.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({ text: '       Marking Scheme: ', italics: true, bold: true, color: '475569' }),
                new TextRun({ text: q.markingScheme, italics: true, color: '475569' }),
              ],
            })
          );
        }
      });
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
          },
        },
        children: docParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = paper.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  a.href = url;
  a.download = `${safeTitle}${filenameSuffix}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download as clean examination PDF using jsPDF
 */
export function downloadAsPdf(
  paper: QuestionPaper,
  options: { includeQuestions?: boolean; includeAnswers?: boolean } = { includeQuestions: true, includeAnswers: true },
  filenameSuffix: string = ''
) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkNewPage(neededSpace: number = 30) {
    if (y + neededSpace > pageHeight - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  }

  const { examDetails, sections } = paper;

  if (options.includeQuestions) {
    // School Header
    if (examDetails.schoolName) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text(examDetails.schoolName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
      y += 18;
    }

    // Exam Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(examDetails.examName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 16;

    // Class / Board / Subject
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const subLine = `Class: ${examDetails.grade}   |   Board: ${examDetails.board}   |   Subject: ${examDetails.subject.toUpperCase()}`;
    doc.text(subLine, pageWidth / 2, y, { align: 'center' });
    y += 16;

    // Time & Max Marks line
    doc.setFont('helvetica', 'bold');
    doc.text(`Time Allowed: ${examDetails.durationFormatted}`, margin, y);
    doc.text(`Maximum Marks: ${examDetails.maxMarks}`, pageWidth - margin, y, { align: 'right' });
    if (examDetails.setLabel) {
      doc.text(`[${examDetails.setLabel}]`, pageWidth / 2, y, { align: 'center' });
    }
    y += 12;

    // Horizontal Rule
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;

    // Instructions
    if (examDetails.generalInstructions && examDetails.generalInstructions.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('General Instructions:', margin, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);

      examDetails.generalInstructions.forEach((inst, idx) => {
        checkNewPage(24);
        const text = `${idx + 1}. ${inst}`;
        const splitText = doc.splitTextToSize(text, contentWidth);
        doc.text(splitText, margin + 8, y);
        y += splitText.length * 12 + 2;
      });

      y += 6;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 16;
    }

    // Sections
    sections.forEach((sec) => {
      checkNewPage(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138); // Navy blue
      doc.text(sec.name.toUpperCase(), pageWidth / 2, y, { align: 'center' });
      y += 14;

      if (sec.description) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(`(${sec.description})`, pageWidth / 2, y, { align: 'center' });
        y += 14;
      }

      sec.questions.forEach((q) => {
        checkNewPage(45);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);

        // Q number
        doc.text(`Q.${q.questionNumber}`, margin, y);

        // Marks right-aligned
        doc.setTextColor(71, 85, 105);
        doc.text(`[${q.marks}]`, pageWidth - margin, y, { align: 'right' });

        // Question text
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        const qTextWidth = contentWidth - 45;
        const qLines = doc.splitTextToSize(q.text, qTextWidth);
        doc.text(qLines, margin + 24, y);
        y += qLines.length * 13 + 4;

        // Assertion / Reason
        if (q.type === 'assertion_reason') {
          if (q.assertion) {
            checkNewPage(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Assertion (A): ', margin + 24, y);
            doc.setFont('helvetica', 'normal');
            const aLines = doc.splitTextToSize(q.assertion, qTextWidth - 70);
            doc.text(aLines, margin + 95, y);
            y += aLines.length * 12 + 4;
          }
          if (q.reason) {
            checkNewPage(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Reason (R): ', margin + 24, y);
            doc.setFont('helvetica', 'normal');
            const rLines = doc.splitTextToSize(q.reason, qTextWidth - 70);
            doc.text(rLines, margin + 95, y);
            y += rLines.length * 12 + 4;
          }
        }

        // MCQ options
        if (q.options && q.options.length > 0) {
          const prefixes = ['(A)', '(B)', '(C)', '(D)'];
          q.options.forEach((opt, oIdx) => {
            checkNewPage(18);
            doc.setFont('helvetica', 'bold');
            doc.text(prefixes[oIdx] || `(${oIdx + 1})`, margin + 24, y);
            doc.setFont('helvetica', 'normal');
            const optLines = doc.splitTextToSize(opt, qTextWidth - 30);
            doc.text(optLines, margin + 46, y);
            y += optLines.length * 12 + 2;
          });
        }

        // Sub questions
        if (q.subQuestions && q.subQuestions.length > 0) {
          q.subQuestions.forEach((sq) => {
            checkNewPage(25);
            doc.setFont('helvetica', 'bold');
            doc.text(sq.label, margin + 24, y);
            doc.text(`[${sq.marks}]`, pageWidth - margin, y, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            const sqLines = doc.splitTextToSize(sq.text, qTextWidth - 30);
            doc.text(sqLines, margin + 42, y);
            y += sqLines.length * 12 + 4;
          });
        }

        y += 8; // spacing between questions
      });
      y += 10;
    });
  }

  // Answer Key Page / Section
  if (options.includeAnswers) {
    if (options.includeQuestions) {
      doc.addPage();
      y = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text('ANSWER KEY & MARKING SCHEME', pageWidth / 2, y, { align: 'center' });
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`${examDetails.subject} - ${examDetails.grade} (${examDetails.examName})`, pageWidth / 2, y, {
      align: 'center',
    });
    y += 14;

    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;

    sections.forEach((sec) => {
      checkNewPage(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`[${sec.name}]`, margin, y);
      y += 14;

      sec.questions.forEach((q) => {
        checkNewPage(35);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(`Q.${q.questionNumber}:`, margin, y);

        doc.setFont('helvetica', 'normal');
        const ansLines = doc.splitTextToSize(q.answer || 'Answer not provided', contentWidth - 40);
        doc.text(ansLines, margin + 30, y);
        y += ansLines.length * 12 + 3;

        if (paper.includeMarkingScheme && q.markingScheme) {
          checkNewPage(20);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 116, 139);
          const msLines = doc.splitTextToSize(`Rubric: ${q.markingScheme}`, contentWidth - 40);
          doc.text(msLines, margin + 30, y);
          y += msLines.length * 11 + 4;
        }
        y += 4;
      });
    });
  }

  const safeTitle = paper.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeTitle}${filenameSuffix}.pdf`);
}

/**
 * Trigger clean browser print dialog
 */
export function printPaperDocument() {
  window.print();
}
