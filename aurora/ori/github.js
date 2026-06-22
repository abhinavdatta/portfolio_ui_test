/* ============================================
   Aurora Glass v2 — GitHub Module
   Works both via Next.js API proxy AND standalone (file://)
   ============================================ */
(function () {
  'use strict';

  var GITHUB_USERNAME = 'abhinavdatta';
  var GITHUB_API = 'https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&per_page=10&type=owner';

  var langColors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'C': '#555555',
    'C++': '#f34b7d',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Java': '#b07219',
    'Shell': '#89e051',
    'Arduino': '#00979D',
    'Verilog': '#8B6F47',
    'SystemVerilog': '#DA4012',
    'VHDL': '#adb2cb',
    'Jupyter Notebook': '#DA5B0B',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#F05138',
    'Kotlin': '#A97BFF',
    'Dart': '#00B4AB',
    'Lua': '#000080',
    'Makefile': '#427819',
    'Dockerfile': '#384d54',
    'MATLAB': '#e16737'
  };

  // Fallback repos used when both API proxy and GitHub direct fail
  var FALLBACK_REPOS = [
    { name: 'Home-Automation-System', description: 'IoT-based home automation system using ESP32 and a web dashboard for controlling appliances remotely.', updated_at: '2026-04-15T10:00:00Z', language: 'C++', html_url: 'https://github.com/' + GITHUB_USERNAME + '/Home-Automation-System', stargazers_count: 0, fork: false },
    { name: 'personal-ai', description: 'A personal AI assistant built with Python, featuring natural language processing and task management.', updated_at: '2026-03-20T10:00:00Z', language: 'Python', html_url: 'https://github.com/' + GITHUB_USERNAME + '/personal-ai', stargazers_count: 0, fork: false },
    { name: 'engineering-notes', description: 'Comprehensive engineering notes covering ECE topics, digital electronics, signal processing, and more.', updated_at: '2026-02-10T10:00:00Z', language: 'HTML', html_url: 'https://github.com/' + GITHUB_USERNAME + '/engineering-notes', stargazers_count: 0, fork: false },
    { name: 'portfolio-website', description: 'Personal portfolio website with glassmorphism design, dark/light theme, and responsive layout.', updated_at: '2026-04-20T10:00:00Z', language: 'HTML', html_url: 'https://github.com/' + GITHUB_USERNAME + '/portfolio-website', stargazers_count: 0, fork: false },
    { name: 'cybersecurity-tools', description: 'Collection of cybersecurity tools and scripts for ethical hacking and network analysis.', updated_at: '2025-12-05T10:00:00Z', language: 'Python', html_url: 'https://github.com/' + GITHUB_USERNAME + '/cybersecurity-tools', stargazers_count: 0, fork: false },
    { name: 'signal-processing-lab', description: 'MATLAB and Python implementations of signal processing algorithms and experiments.', updated_at: '2026-03-01T10:00:00Z', language: 'MATLAB', html_url: 'https://github.com/' + GITHUB_USERNAME + '/signal-processing-lab', stargazers_count: 0, fork: false }
  ];

  function timeAgo(dateStr) {
    var now = new Date();
    var date = new Date(dateStr);
    var diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 2592000) return Math.floor(diff / 86400) + 'd ago';
    if (diff < 31536000) return Math.floor(diff / 2592000) + 'mo ago';
    return Math.floor(diff / 31536000) + 'y ago';
  }

  function renderSkeletons(container, count) {
    var html = '';
    for (var i = 0; i < count; i++) {
      html += '<div class="skeleton">' +
        '<div class="skeleton-line w-75"></div>' +
        '<div class="skeleton-line"></div>' +
        '<div class="skeleton-line w-50"></div>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  function renderRepos(container, repos) {
    var html = '';
    var shown = repos.slice(0, 6);
    shown.forEach(function (repo) {
      var langColor = langColors[repo.language] || '#71717a';
      var desc = repo.description || '';
      if (desc.length > 90) desc = desc.substring(0, 90) + '…';
      var stars = repo.stargazers_count || 0;
      var lang = repo.language || '';

      html += '<a href="' + escapeHtml(repo.html_url) + '" target="_blank" rel="noopener noreferrer" class="gh-repo-card" style="text-decoration:none;color:inherit;">' +
        '<div class="gh-repo-name">' + escapeHtml(repo.name) + '</div>' +
        (desc ? '<div class="gh-repo-desc">' + escapeHtml(desc) + '</div>' : '') +
        '<div class="gh-repo-meta">' +
        (lang ? '<span><span class="gh-repo-lang-dot" style="background:' + langColor + '"></span>' + escapeHtml(lang) + '</span>' : '') +
        (stars > 0 ? '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' + stars + '</span>' : '') +
        '<span>' + timeAgo(repo.updated_at) + '</span>' +
        '</div></a>';
    });
    container.innerHTML = html;
  }

  function renderError(container) {
    container.innerHTML =
      '<div class="gh-error">' +
        '<div class="gh-error-icon">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:2rem;height:2rem;opacity:0.5;"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>' +
        '</div>' +
        '<p>Unable to load repositories right now</p>' +
        '<a href="https://github.com/' + GITHUB_USERNAME + '?tab=repositories" target="_blank" rel="noopener noreferrer" class="gh-error-link">' +
          'View all repositories on GitHub' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:0.875rem;height:0.875rem;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
        '</a>' +
      '</div>';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function processRepos(repos) {
    repos.sort(function (a, b) {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    repos = repos.filter(function (r) { return !r.fork; });
    return repos;
  }

  function fetchRepos(url, headers) {
    return fetch(url, { headers: headers || {} })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && data.error) throw new Error(data.error);
        var repos = Array.isArray(data) ? data : (data.repos || []);
        if (repos.length === 0) throw new Error('No repos');
        return processRepos(repos);
      });
  }

  function init() {
    var container = document.getElementById('gh-repos');
    if (!container) return;

    renderSkeletons(container, 6);

    var isFileProtocol = (window.location.protocol === 'file:');

    // Strategy: try API proxy first (won't work on file://), then GitHub direct, then fallback
    var promise;

    if (isFileProtocol) {
      // Skip the API proxy entirely on file:// — go straight to GitHub
      promise = fetchRepos(GITHUB_API, {
        'Accept': 'application/vnd.github.v3+json'
      });
    } else {
      // Try server API proxy first, fall back to direct GitHub call
      promise = fetchRepos('/api/github')
        .catch(function () {
          // API proxy failed — try GitHub directly
          return fetchRepos(GITHUB_API, {
            'Accept': 'application/vnd.github.v3+json'
          });
        });
    }

    promise
      .then(function (repos) {
        if (repos.length === 0) throw new Error('Empty after filter');
        renderRepos(container, repos);
      })
      .catch(function () {
        // Last resort: use embedded fallback data
        renderRepos(container, FALLBACK_REPOS);
      });
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.github = { init: init };
})();