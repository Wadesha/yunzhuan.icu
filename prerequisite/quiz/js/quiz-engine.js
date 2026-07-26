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
      this.coinsEarned += 1;
    } else {
      this.streak = 0;
    }

    saveSingleAnswer(isCorrect, q);

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

// 保存到用户档案（最后提交时调用）
function saveResult(result) {
  const user = UserStorage.getUser();
  user.totalSessions += 1;
  if (result.maxStreak > user.maxStreak) user.maxStreak = result.maxStreak;
  UserStorage.saveUser(user);
  
  if (typeof CloudSlot !== 'undefined' && CloudSlot.isLoggedIn()) {
    CloudSlot.kvSet('user_data', user).catch(e => console.warn('[云同步] 上传失败:', e.message));
  }
  
  return user;
}

// 每答一题就保存（支持云同步）
async function saveSingleAnswer(isCorrect, q) {
  const user = UserStorage.getUser();
  user.totalAnswered += 1;
  if (isCorrect) {
    user.coin += 1;
    user.totalCorrect += 1;
  }
  if (q.courseId) {
    const cp = user.courseProgress[q.courseId] || { answered: 0, correct: 0, best: 0 };
    cp.answered += 1;
    if (isCorrect) cp.correct += 1;
    const currentAccuracy = Math.round(cp.correct / cp.answered * 100);
    if (currentAccuracy > cp.best) cp.best = currentAccuracy;
    user.courseProgress[q.courseId] = cp;
  }
  user.level = UserStorage.calcLevel(user.coin);
  UserStorage.saveUser(user);

  if (typeof CloudSlot !== 'undefined' && CloudSlot.isLoggedIn()) {
    try {
      await CloudSlot.kvSet('user_data', user);
      console.log('[云同步] 答题数据已上传');
    } catch (e) {
      console.warn('[云同步] 上传失败:', e.message);
    }
  }
}
