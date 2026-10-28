/**
 * WebDev Academy - Progress Tracker & State Engine
 * Tracks completed lessons, courses, scores, and last-visited location in localStorage.
 */
(function(window) {
  'use strict';

  const Progress = {
    STORAGE_KEY: 'webdev_progress',
    LAST_VISITED_KEY: 'webdev_last_visited',

    getProgressData: function() {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{"completed":{}}');
      } catch (e) {
        return { completed: {} };
      }
    },

    saveProgressData: function(data) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Error saving progress:', e);
      }
    },

    isCompleted: function(lessonId) {
      const data = this.getProgressData();
      return !!data.completed[lessonId];
    },

    toggleLesson: function(lessonId) {
      const data = this.getProgressData();
      if (data.completed[lessonId]) {
        delete data.completed[lessonId];
      } else {
        data.completed[lessonId] = {
          date: new Date().toISOString()
        };
      }
      this.saveProgressData(data);
      this.updateUI();
      return !!data.completed[lessonId];
    },

    recordVisit: function(title, path) {
      try {
        localStorage.setItem(this.LAST_VISITED_KEY, JSON.stringify({
          title: title || document.title,
          url: path || window.location.href,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error(e);
      }
    },

    getLastVisited: function() {
      try {
        return JSON.parse(localStorage.getItem(this.LAST_VISITED_KEY) || 'null');
      } catch (e) {
        return null;
      }
    },

    updateUI: function() {
      const data = this.getProgressData();
      const completedMap = data.completed;

      // Update sidebar links checkmarks
      const sidebarLinks = document.querySelectorAll('.sidebar-item');
      sidebarLinks.forEach(function(item) {
        const id = item.getAttribute('data-lesson-id');
        if (id && completedMap[id]) {
          item.classList.add('completed');
        } else {
          item.classList.remove('completed');
        }
      });

      // Update current page "Mark as Complete" button
      const markBtn = document.querySelector('.mark-complete-btn');
      if (markBtn) {
        const currentId = markBtn.getAttribute('data-lesson-id');
        if (currentId && completedMap[currentId]) {
          markBtn.classList.add('completed');
          markBtn.innerHTML = '&#10003; Completed';
        } else {
          markBtn.classList.remove('completed');
          markBtn.innerHTML = 'Mark as Complete';
        }
      }

      // Update progress bars on page
      const totalLessonsInSidebar = sidebarLinks.length;
      if (totalLessonsInSidebar > 0) {
        let completedInSidebar = 0;
        sidebarLinks.forEach(function(item) {
          const id = item.getAttribute('data-lesson-id');
          if (id && completedMap[id]) completedInSidebar++;
        });

        const percent = Math.round((completedInSidebar / totalLessonsInSidebar) * 100);
        const fill = document.querySelector('.sidebar-course-progress .progress-fill-small');
        const text = document.querySelector('.sidebar-course-progress .progress-num');
        if (fill) fill.style.width = percent + '%';
        if (text) text.textContent = percent + '% (' + completedInSidebar + '/' + totalLessonsInSidebar + ')';
      }
    },

    init: function() {
      // Record visit if on a lesson or tutorial page
      const pageTitle = document.querySelector('h1')?.textContent || document.title;
      const lessonBtn = document.querySelector('.mark-complete-btn');
      if (lessonBtn) {
        const lessonId = lessonBtn.getAttribute('data-lesson-id');
        this.recordVisit(pageTitle, window.location.pathname.split('/').pop());

        lessonBtn.addEventListener('click', () => {
          this.toggleLesson(lessonId);
        });
      }

      this.updateUI();
    }
  };

  window.Progress = Progress;
})(window);
