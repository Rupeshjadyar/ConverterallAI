/**
 * WebDev Academy - Interactive Quiz Engine
 * Handles instant MCQ feedback, explanation reveals, scoring, and persistence.
 */
(function(window) {
  'use strict';

  const Quiz = {
    init: function() {
      const quizContainers = document.querySelectorAll('.quiz-section');
      quizContainers.forEach(function(section, qIdx) {
        Quiz.setupQuiz(section, qIdx);
      });
    },

    setupQuiz: function(section, quizId) {
      const questions = section.querySelectorAll('.quiz-question-item');
      const scoreBanner = section.querySelector('.quiz-score-banner');
      const submitBtn = section.querySelector('.btn-submit-quiz');
      const retryBtn = section.querySelector('.btn-retry-quiz');
      const lessonKey = window.location.pathname.split('/').pop() || 'quiz_' + quizId;

      questions.forEach(function(item) {
        const options = item.querySelectorAll('.quiz-option');
        const feedback = item.querySelector('.quiz-feedback');
        const correctIndex = parseInt(item.getAttribute('data-correct'), 10);
        const explanation = item.getAttribute('data-explanation') || '';

        options.forEach(function(opt, optIdx) {
          opt.addEventListener('click', function() {
            // Clear prior selection in this question
            options.forEach(o => o.classList.remove('selected', 'correct', 'incorrect'));
            opt.classList.add('selected');

            // Immediate validation
            if (optIdx === correctIndex) {
              opt.classList.add('correct');
              if (feedback) {
                feedback.className = 'quiz-feedback show-correct';
                feedback.innerHTML = '<strong>Correct!</strong> ' + explanation;
              }
            } else {
              opt.classList.add('incorrect');
              options[correctIndex].classList.add('correct');
              if (feedback) {
                feedback.className = 'quiz-feedback show-incorrect';
                feedback.innerHTML = '<strong>Not quite.</strong> ' + explanation;
              }
            }
            Quiz.calculateScore(section, lessonKey);
          });
        });
      });

      if (retryBtn) {
        retryBtn.addEventListener('click', function() {
          questions.forEach(function(item) {
            const options = item.querySelectorAll('.quiz-option');
            const feedback = item.querySelector('.quiz-feedback');
            options.forEach(o => o.classList.remove('selected', 'correct', 'incorrect'));
            if (feedback) {
              feedback.className = 'quiz-feedback';
              feedback.innerHTML = '';
            }
          });
          if (scoreBanner) {
            scoreBanner.style.display = 'none';
          }
        });
      }
    },

    calculateScore: function(section, lessonKey) {
      const questions = section.querySelectorAll('.quiz-question-item');
      let answeredCount = 0;
      let correctCount = 0;

      questions.forEach(function(item) {
        const selected = item.querySelector('.quiz-option.selected');
        if (selected) {
          answeredCount++;
          if (selected.classList.contains('correct')) {
            correctCount++;
          }
        }
      });

      const scoreBanner = section.querySelector('.quiz-score-banner');
      if (answeredCount === questions.length && scoreBanner) {
        scoreBanner.style.display = 'block';
        const percent = Math.round((correctCount / questions.length) * 100);
        let message = '';
        if (percent === 100) message = 'Outstanding! Perfect score!';
        else if (percent >= 80) message = 'Great job! You have mastered this topic!';
        else message = 'Good effort! Review the lesson notes and try again!';

        scoreBanner.innerHTML = `
          <h3>Quiz Completed!</h3>
          <p style="font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0; color: ${percent >= 80 ? 'var(--state-success)' : 'var(--accent-primary)'};">
            Score: ${correctCount} / ${questions.length} (${percent}%)
          </p>
          <p style="color: var(--text-secondary); margin-bottom: 1rem;">${message}</p>
          <button class="btn btn-outline btn-retry-quiz" onclick="location.reload()">Retake Quiz</button>
        `;

        // Store score in localStorage
        try {
          const scores = JSON.parse(localStorage.getItem('webdev_scores') || '{}');
          scores[lessonKey] = { score: correctCount, total: questions.length, percent: percent };
          localStorage.setItem('webdev_scores', JSON.stringify(scores));
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  window.Quiz = Quiz;
})(window);
