// 刷题核心引擎
class QuizEngine {
  constructor(questions, courseId) {
    this.allQuestions = questions || [];
    this.courseId = courseId;
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.answered = false;
    this.startTime = Date.now();
    this.coinsEarned = 0;
  }

  // 随机取N题
  init(count) {
    const pool = this.allQuestions.filter(q => !this.courseId || q.courseId === this.courseId);
    this.questions = this.shuffle(pool).slice(0, count || Math.min(10, pool.length));
    return this.questions.length;
  }

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  getCurrent() {
    return this.questions[this.currentIndex];
  }

  getProgress() {
    return {
      current: this.currentIndex + 1,
      total: this.questions.length,
      percent: Math.round((this.currentIndex) / this.questions.length * 100)
    };
  }

  answer(choiceIndex) {
    if (this.answered) return null;
    this.answered = true;
    const q = this.getCurrent();
    const isCorrect = choiceIndex === q.answer;

    if (isCorrect) {
      this.score++;
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;
      // 简单规则:答对+1金币,答错+0
      this.coinsEarned += 1;
    } else {
      this.streak = 0;
    }

    return { isCorrect, correctAnswer: q.answer, q };
  }

  next() {
    this.currentIndex++;
    this.answered = false;
    if (this.currentIndex >= this.questions.length) {
      return { done: true };
    }
    return { done: false };
  }

  getResult() {
    const total = this.questions.length;
    const accuracy = total > 0 ? Math.round(this.score / total * 100) : 0;
    return {
      total,
      correct: this.score,
      accuracy,
      maxStreak: this.maxStreak,
      coinsEarned: this.coinsEarned,
      timeUsed: Math.round((Date.now() - this.startTime) / 1000),
      courseId: this.courseId
    };
  }
}

// 保存到用户档案
function saveResult(result) {
  const user = Storage.getUser();
  user.coin += result.coinsEarned;
  user.totalAnswered += result.total;
  user.totalCorrect += result.correct;
  user.totalSessions += 1;
  if (result.maxStreak > user.maxStreak) user.maxStreak = result.maxStreak;
  // 课程进度
  if (result.courseId) {
    const cp = user.courseProgress[result.courseId] || { answered: 0, correct: 0, best: 0 };
    cp.answered += result.total;
    cp.correct += result.correct;
    if (result.accuracy > cp.best) cp.best = result.accuracy;
    user.courseProgress[result.courseId] = cp;
  }
  // 重新计算等级 (简化:每100金币1级)
  user.level = Storage.calcLevel(user.coin);
  Storage.saveUser(user);
  return user;
}
