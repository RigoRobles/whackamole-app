const CONFIG = {
  SHEET_ID: 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE',
  SCORES_SHEET_NAME: 'Scores',
  ANSWERS_SHEET_NAME: 'Answers',
};

const SCORE_HEADERS = [
  'Saved At',
  'Round ID',
  'Player Name',
  'Score',
  'Accuracy',
  'Topic',
  'Level',
  'Played At',
  'Mode',
  'Difficulty',
  'Total Questions',
  'Correct Count',
  'Wrong Count',
  'Highest Streak',
  'Coins Earned',
  'Stars Earned',
  'Answers Recorded',
];

const ANSWER_HEADERS = [
  'Saved At',
  'Round ID',
  'Answer ID',
  'Player Name',
  'Question Number',
  'Question ID',
  'Sentence',
  'Selected Answer',
  'Correct Answer',
  'Is Correct',
  'Topic',
  'Difficulty',
  'Explanation',
  'Answered At',
];

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle("Teacher Rigo's Whack-a-Mole")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveScore(record) {
  const safeRecord = normalizeScoreRecord_(record);
  const sheet = getScoresSheet_();
  const answers = normalizeAnswerRecords_(record && record.answers);

  sheet.appendRow([
    new Date(),
    safeRecord.id,
    safeRecord.playerName,
    safeRecord.score,
    safeRecord.accuracy,
    safeRecord.topic,
    safeRecord.level,
    safeRecord.date,
    safeRecord.mode,
    safeRecord.difficulty,
    safeRecord.totalQuestions,
    safeRecord.correctCount,
    safeRecord.wrongCount,
    safeRecord.highestStreak,
    safeRecord.coinsEarned,
    safeRecord.starsEarned,
    answers.length,
  ]);

  if (answers.length > 0) {
    const answerSheet = getAnswersSheet_();
    const savedAt = new Date();
    const answerRows = answers.map((answer) => [
      savedAt,
      safeRecord.id,
      answer.id,
      safeRecord.playerName,
      answer.questionNumber,
      answer.questionId,
      answer.sentence,
      answer.selectedAnswer,
      answer.correctAnswer,
      answer.isCorrect,
      answer.topic,
      answer.difficulty,
      answer.explanation,
      answer.answeredAt,
    ]);

    answerSheet
      .getRange(answerSheet.getLastRow() + 1, 1, answerRows.length, ANSWER_HEADERS.length)
      .setValues(answerRows);
  }

  return { ok: true, answersRecorded: answers.length };
}

function getLeaderboard(limit) {
  const sheet = getScoresSheet_();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1);
  const maxRows = Math.max(1, Math.min(Number(limit) || 25, 100));

  return rows
    .map((row) => ({
      savedAt: row[0],
      id: row[1],
      playerName: row[2],
      score: Number(row[3]) || 0,
      accuracy: Number(row[4]) || 0,
      topic: row[5],
      level: Number(row[6]) || 0,
      date: row[7],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRows);
}

function getScoresSheet_() {
  return getSheetWithHeaders_(CONFIG.SCORES_SHEET_NAME, SCORE_HEADERS);
}

function getAnswersSheet_() {
  return getSheetWithHeaders_(CONFIG.ANSWERS_SHEET_NAME, ANSWER_HEADERS);
}

function getSheetWithHeaders_(sheetName, headers) {
  if (!CONFIG.SHEET_ID || CONFIG.SHEET_ID === 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE') {
    throw new Error('Set CONFIG.SHEET_ID in Code.gs before deploying.');
  }

  const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = firstRow.some((value) => value);
  const headersMatch = headers.every((header, index) => firstRow[index] === header);

  if (!hasHeaders || !headersMatch) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function normalizeScoreRecord_(record) {
  const source = record || {};
  return {
    id: cleanText_(source.id || Utilities.getUuid(), 80),
    playerName: cleanText_(source.playerName || 'Guest', 80),
    score: clampNumber_(source.score, 0, 1000000),
    accuracy: clampNumber_(source.accuracy, 0, 100),
    topic: cleanText_(source.topic || 'mixed', 80),
    level: clampNumber_(source.level, 0, 100),
    date: cleanText_(source.date || new Date().toISOString(), 80),
    mode: cleanText_(source.mode || '', 40),
    difficulty: cleanText_(source.difficulty || '', 40),
    totalQuestions: clampNumber_(source.totalQuestions, 0, 500),
    correctCount: clampNumber_(source.correctCount, 0, 500),
    wrongCount: clampNumber_(source.wrongCount, 0, 500),
    highestStreak: clampNumber_(source.highestStreak, 0, 500),
    coinsEarned: clampNumber_(source.coinsEarned, 0, 1000000),
    starsEarned: clampNumber_(source.starsEarned, 0, 1000),
  };
}

function normalizeAnswerRecords_(answers) {
  if (!Array.isArray(answers)) return [];

  return answers.slice(0, 500).map((answer, index) => {
    const source = answer || {};
    return {
      id: cleanText_(source.id || Utilities.getUuid(), 80),
      questionNumber: clampNumber_(source.questionNumber || index + 1, 1, 500),
      questionId: cleanText_(source.questionId || '', 80),
      sentence: cleanText_(source.sentence || '', 500),
      selectedAnswer: cleanText_(source.selectedAnswer || '', 160),
      correctAnswer: cleanText_(source.correctAnswer || '', 160),
      isCorrect: Boolean(source.isCorrect),
      topic: cleanText_(source.topic || '', 80),
      difficulty: cleanText_(source.difficulty || '', 40),
      explanation: cleanText_(source.explanation || '', 1000),
      answeredAt: cleanText_(source.answeredAt || '', 80),
    };
  });
}

function cleanText_(value, maxLength) {
  return String(value).replace(/[\r\n\t]/g, ' ').trim().slice(0, maxLength);
}

function clampNumber_(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(number, max));
}
