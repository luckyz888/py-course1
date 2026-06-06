export function exportAllData(): string {
  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    courseProgress: JSON.parse(localStorage.getItem('course-progress') || '{}'),
    exerciseResults: JSON.parse(localStorage.getItem('exercise-results') || '{}'),
    quizResults: JSON.parse(localStorage.getItem('quiz-results') || '{}'),
    achievementStore: JSON.parse(localStorage.getItem('achievement-store') || '{}'),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.version !== 1) return false;

    if (data.courseProgress) localStorage.setItem('course-progress', JSON.stringify(data.courseProgress));
    if (data.exerciseResults) localStorage.setItem('exercise-results', JSON.stringify(data.exerciseResults));
    if (data.quizResults) localStorage.setItem('quiz-results', JSON.stringify(data.quizResults));
    if (data.achievementStore) localStorage.setItem('achievement-store', JSON.stringify(data.achievementStore));

    return true;
  } catch {
    return false;
  }
}

export function resetAllData(): void {
  localStorage.removeItem('course-progress');
  localStorage.removeItem('exercise-results');
  localStorage.removeItem('quiz-results');
  localStorage.removeItem('achievement-store');
}
