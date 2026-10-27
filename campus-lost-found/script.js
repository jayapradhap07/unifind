/**
 * Campus Lost & Found Portal - Main Application Logic
 * Vanilla JavaScript (ES6+) with LocalStorage Data Persistence
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. CONFIGURATION & CONSTANTS
  // =========================================================================
  const STORAGE_KEY = 'campus_lost_found_items';
  const MY_REPORTS_KEY = 'campus_lost_found_my_ids';

  // Common stop words to exclude during tokenization for smart matching
  const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
    'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
    'between', 'both', 'but', 'by', 'could', 'did', 'do', 'does', 'doing', 'down',
    'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having',
    'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if',
    'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my',
    'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or',
    'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should',
    'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
    'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
    'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which',
    'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself',
    'item', 'lost', 'found', 'please', 'help', 'campus', 'near', 'around'
  ]);

  // Initial High-Quality Demo Sample Data
  const INITIAL_SAMPLE_ITEMS = [
    {
      id: 'UNF-1001',
      type: 'lost',
      name: 'Space Gray MacBook Pro 14"',
      category: 'Electronics',
      location: 'Central Library',
      locationDetails: '2nd Floor quiet study cubicle #14',
      date: '2026-10-21',
      description: '14-inch Space Gray MacBook Pro with M2 Pro chip. It has an octocat sticker and a small React sticker on the lid. Stored in a black neoprene zip sleeve.',
      imageUrl: '',
      contactMethod: 'desk',
      contactDetail: 'Campus Central Info Desk (Ref: L-1001)',
      status: 'lost',
      isUserReport: true, // Marked for demo user testing
      createdAt: '2026-10-21T10:30:00Z'
    },
    {
      id: 'UNF-1002',
      type: 'found',
      name: 'Apple MacBook Pro in Black Sleeve',
      category: 'Electronics',
      location: 'Central Library',
      locationDetails: 'Turned into 1st floor circulation counter',
      date: '2026-10-21',
      description: 'Space Gray Apple laptop found unattended on 2nd floor desk during evening closing rounds. Housed inside a black zippered case with coding stickers.',
      imageUrl: '',
      contactMethod: 'desk',
      contactDetail: 'Central Library Circulation Desk #1',
      status: 'found',
      isUserReport: false,
      createdAt: '2026-10-21T19:45:00Z'
    },
    {
      id: 'UNF-1003',
      type: 'lost',
      name: 'Student ID Card - Alex Morgan',
      category: 'ID Card',
      location: 'Science Complex',
      locationDetails: 'Between Chem Lab 201 and Lecture Hall B',
      date: '2026-10-22',
      description: 'University Student ID Card for Alex Morgan (Biochemistry Dept). Masked ID STU-****-8842 on a purple braided campus lanyard with a silver clip.',
      imageUrl: '',
      contactMethod: 'email',
      contactDetail: 'a.morgan@campus.edu',
      status: 'lost',
      isUserReport: false,
      createdAt: '2026-10-22T08:15:00Z'
    },
    {
      id: 'UNF-1004',
      type: 'found',
      name: 'University Student ID Card on Lanyard',
      category: 'ID Card',
      location: 'Science Complex',
      locationDetails: 'Found on walkway bench outside Science Building',
      date: '2026-10-22',
      description: 'Found student ID card issued to Alex M. (STU-****-8842) attached to a purple university lanyard. Handed over to Science Complex Administrative Office.',
      imageUrl: '',
      contactMethod: 'desk',
      contactDetail: 'Science Complex Dept Office (Room 105)',
      status: 'found',
      isUserReport: false,
      createdAt: '2026-10-22T11:20:00Z'
    },
    {
      id: 'UNF-1005',
      type: 'lost',
      name: 'Blue Hydro Flask 32oz Water Bottle',
      category: 'Water Bottles',
      location: 'Student Center',
      locationDetails: 'Cafeteria seating booth near east entrance',
      date: '2026-10-20',
      description: 'Cobalt blue 32oz wide-mouth Hydro Flask with a black straw lid. Has a Yosemite National Park sticker and a slight dent on the bottom rim.',
      imageUrl: '',
      contactMethod: 'phone',
      contactDetail: 'Ext. 3120 (Student Union Help Desk)',
      status: 'lost',
      isUserReport: true, // Marked for demo user testing
      createdAt: '2026-10-20T14:10:00Z'
    },
    {
      id: 'UNF-1006',
      type: 'found',
      name: 'Cobalt Blue Insulated Water Flask',
      category: 'Water Bottles',
      location: 'Student Center',
      locationDetails: 'Food court tray return station',
      date: '2026-10-20',
      description: 'Blue vacuum flask with outdoor mountain stickers and black straw cap. Turned in to Student Center Concierge Desk.',
      imageUrl: '',
      contactMethod: 'desk',
      contactDetail: 'Student Center Concierge Desk',
      status: 'found',
      isUserReport: false,
      createdAt: '2026-10-20T17:00:00Z'
    },
    {
      id: 'UNF-1007',
      type: 'lost',
      name: 'Brass Keychain with Toyota Key Fob',
      category: 'Keys',
      location: 'Engineering Hall',
      locationDetails: 'Computer Lab 304 or 3rd floor hallway',
      date: '2026-10-19',
      description: 'Set of 3 brass keys, one bike lock key, and a black Toyota vehicle remote on a red woven university alumni lanyard with a bottle opener.',
      imageUrl: '',
      contactMethod: 'desk',
      contactDetail: 'Campus Security Central Desk',
      status: 'lost',
      isUserReport: false,
      createdAt: '2026-10-19T16:20:00Z'
    },
    {
      id: 'UNF-1008',
      type: 'found',
      name: 'Black Herschel Little America Backpack',
      category: 'Bags',
      location: 'Main Cafeteria',
      locationDetails: 'Under corner table near smoothie counter',
      date: '2026-10-22',
      description: 'Black canvas backpack with brown rubber straps. Contains a spiral calculus notebook and a yellow highlighter. Safe in manager office.',
      imageUrl: '',
      contactMethod: 'desk',
      contactDetail: 'Dining Hall Manager Office',
      status: 'found',
      isUserReport: false,
      createdAt: '2026-10-22T13:40:00Z'
    },
    {
      id: 'UNF-1009',
      type: 'lost',
      name: 'Sony WH-1000XM4 Noise Canceling Headphones',
      category: 'Electronics',
      location: 'Sports Arena',
      locationDetails: 'Cardio workout area 2nd floor',
      date: '2026-10-18',
      description: 'Black Sony over-ear Bluetooth headphones in their original hard zipper travel case with auxiliary cable included.',
      imageUrl: '',
      contactMethod: 'desk',
      contactDetail: 'Sports Arena Reception Desk',
      status: 'returned', // Reunited item demonstration
      isUserReport: true, // Marked for demo
      createdAt: '2026-10-18T09:00:00Z'
    },
    {
      id: 'UNF-1010',
      type: 'found',
      name: 'Tortoiseshell Ray-Ban Prescription Glasses',
      category: 'Accessories',
      location: 'North Quad',
      locationDetails: 'Wooden bench under the large oak tree',
      date: '2026-10-23',
      description: 'Brown tortoiseshell patterned frames in a black semi-hard case with cleaning cloth. Currently stored safely at North Quad Security Booth.',
      imageUrl: '',
      contactMethod: 'desk',
      contactDetail: 'North Quad Security Kiosk',
      status: 'found',
      isUserReport: false,
      createdAt: '2026-10-23T08:30:00Z'
    }
  ];

  // SVG Icons for Category Placeholders
  const CATEGORY_ICONS = {
    'ID Card': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2.5"/><line x1="15" y1="9" x2="19" y2="9"/><line x1="15" y1="13" x2="19" y2="13"/><line x1="6" y1="17" x2="18" y2="17"/></svg>`,
    'Electronics': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    'Books': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    'Bags': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 20h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/><line x1="9" y1="6" x2="15" y2="6"/></svg>`,
    'Keys': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`,
    'Water Bottles': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 2h8v3H8z"/><path d="M9 5v3a3 3 0 0 1-3 3v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-9a3 3 0 0 1-3-3V5"/></svg>`,
    'Accessories': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-4 0"/><path d="M2.5 13 4 7c.3-1.2 1.4-2 2.6-2h.8"/><path d="M21.5 13 20 7c-.3-1.2-1.4-2-2.6-2h-.8"/></svg>`,
    'Other': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
  };

  // =========================================================================
  // 2. STATE MANAGEMENT & LOCAL STORAGE
  // =========================================================================
  let items = [];
  let userReportIds = new Set();
  let currentActiveItem = null;
  let activeView = 'home';
  let myReportsFilter = 'all';

  /**
   * Initializes data from LocalStorage or populates with sample items.
   */
  function initializeStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedMyIds = localStorage.getItem(MY_REPORTS_KEY);

      if (stored) {
        items = JSON.parse(stored);
      } else {
        items = [...INITIAL_SAMPLE_ITEMS];
        saveItemsToStorage();
      }

      if (storedMyIds) {
        userReportIds = new Set(JSON.parse(storedMyIds));
      } else {
        // Preload demo user report IDs from initial sample items
        userReportIds = new Set(
          items.filter(item => item.isUserReport).map(item => item.id)
        );
        saveMyIdsToStorage();
      }
    } catch (e) {
      console.error('LocalStorage load failed, fallback to memory', e);
      items = [...INITIAL_SAMPLE_ITEMS];
      userReportIds = new Set(['UNF-1001', 'UNF-1005', 'UNF-1009']);
    }
  }

  function saveItemsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Storage quota exceeded or storage disabled', e);
      showToast('Warning: Browser storage quota exceeded. Please reduce image sizes.', 'warning');
    }
  }

  function saveMyIdsToStorage() {
    try {
      localStorage.setItem(MY_REPORTS_KEY, JSON.stringify([...userReportIds]));
    } catch (e) {
      console.warn('Failed to save user report IDs', e);
    }
  }

  function resetSampleData() {
    items = JSON.parse(JSON.stringify(INITIAL_SAMPLE_ITEMS));
    userReportIds = new Set(items.filter(item => item.isUserReport).map(item => item.id));
    saveItemsToStorage();
    saveMyIdsToStorage();
    refreshAllViews();
    showToast('Sample campus data has been reset successfully!', 'success');
  }

  // =========================================================================
  // 3. UI VIEW ROUTING
  // =========================================================================
  const views = {
    'home': document.getElementById('viewHome'),
    'browse': document.getElementById('viewBrowse'),
    'report': document.getElementById('viewReport'),
    'my-reports': document.getElementById('viewMyReports'),
    'safety': document.getElementById('viewSafety')
  };

  /**
   * Switch the active view section
   */
  function switchView(viewName, scrollOptions = { top: 0, behavior: 'smooth' }) {
    if (!views[viewName]) viewName = 'home';
    activeView = viewName;

    // Toggle active class on view sections
    Object.keys(views).forEach(key => {
      if (views[key]) {
        views[key].classList.toggle('active', key === viewName);
      }
    });

    // Update desktop nav links
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Update mobile nav links
    document.querySelectorAll('.mobile-nav-link').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Close mobile drawer if open
    document.getElementById('mobileDrawer').classList.remove('open');

    // Update URL hash safely without jumping if desired
    if (window.location.hash !== `#${viewName}`) {
      window.history.pushState(null, '', `#${viewName}`);
    }

    if (scrollOptions) {
      window.scrollTo(scrollOptions);
    }

    // Refresh view specific contents
    if (viewName === 'home') {
      renderDashboard();
    } else if (viewName === 'browse') {
      renderBrowseItems();
    } else if (viewName === 'my-reports') {
      renderMyReports();
    }
  }

  // Listen to hash change for browser back/forward
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (views[hash] && hash !== activeView) {
      switchView(hash, false);
    }
  });

  // =========================================================================
  // 4. SMART ITEM MATCHING ALGORITHM (UNIQUE FEATURE)
  // =========================================================================
  /**
   * Tokenizes text into meaningful lowercase keywords, stripping punctuation and stopwords.
   */
  function extractKeywords(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 3 && !STOP_WORDS.has(word));
  }

  /**
   * Calculates a match score (0-100) between a target item and a candidate item.
   * Compares Category, Keywords, Campus Location, and Date Proximity.
   */
  function calculateMatch(targetItem, candidateItem) {
    // Cannot match identical items or items with identical report types
    if (targetItem.id === candidateItem.id) return null;
    if (targetItem.type === candidateItem.type) return null;
    // Do not suggest items that are already returned
    if (candidateItem.status === 'returned') return null;

    let score = 0;
    const reasons = [];

    // 1. Category Matching (Max 35 points)
    if (targetItem.category.toLowerCase() === candidateItem.category.toLowerCase()) {
      score += 35;
      reasons.push(`Category: ${candidateItem.category}`);
    }

    // 2. Campus Location Matching (Max 25 points)
    if (targetItem.location.toLowerCase() === candidateItem.location.toLowerCase()) {
      score += 25;
      reasons.push(`Location: ${candidateItem.location}`);
    } else if (
      targetItem.locationDetails &&
      candidateItem.locationDetails &&
      targetItem.locationDetails.toLowerCase().includes(candidateItem.location.toLowerCase())
    ) {
      score += 15;
      reasons.push('Nearby Location Area');
    }

    // 3. Keyword / Title / Description Overlap (Max 25 points)
    const targetTokens = new Set([
      ...extractKeywords(targetItem.name),
      ...extractKeywords(targetItem.description)
    ]);

    const candidateTokens = new Set([
      ...extractKeywords(candidateItem.name),
      ...extractKeywords(candidateItem.description)
    ]);

    const matchingWords = [];
    targetTokens.forEach(token => {
      if (candidateTokens.has(token)) {
        matchingWords.push(token);
      }
    });

    if (matchingWords.length > 0) {
      const keywordScore = Math.min(25, matchingWords.length * 8);
      score += keywordScore;
      const displayKeywords = matchingWords.slice(0, 2).map(w => `"${w}"`).join(', ');
      reasons.push(`Keywords: ${displayKeywords}`);
    }

    // 4. Date Proximity (Max 15 points)
    if (targetItem.date && candidateItem.date) {
      const targetDate = new Date(targetItem.date);
      const candidateDate = new Date(candidateItem.date);
      const diffTime = Math.abs(targetDate - candidateDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 2) {
        score += 15;
        reasons.push('Reported ±2 days apart');
      } else if (diffDays <= 7) {
        score += 10;
        reasons.push('Reported ±1 week apart');
      } else if (diffDays <= 14) {
        score += 5;
        reasons.push('Reported ±2 weeks');
      }
    }

    // Cap score at 100
    score = Math.min(100, score);

    // Only return if it meets a reasonable threshold (35+)
    if (score >= 35) {
      return {
        item: candidateItem,
        score: score,
        reasons: reasons
      };
    }

    return null;
  }

  /**
   * Finds top potential matches for a given item.
   */
  function getSmartMatches(item) {
    const matches = [];
    items.forEach(candidate => {
      const result = calculateMatch(item, candidate);
      if (result) {
        matches.push(result);
      }
    });

    // Sort descending by score
    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, 4); // Top 4 suggestions
  }

  // =========================================================================
  // 5. RENDERING HELPERS & CARD GENERATOR
  // =========================================================================
  /**
   * Safe HTML Escaping
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Formats ISO or YYYY-MM-DD date into readable text (e.g. "Oct 21, 2026")
   */
  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  /**
   * Masks sensitive student numbers or emails in public cards
   */
  function maskSensitiveText(text) {
    if (!text) return '';
    // Mask student IDs like STU1234567 -> STU-****-567
    return text.replace(/\b([A-Z]{2,4})[-_]?(\d{3,})(\d{3})\b/gi, '$1-****-$3');
  }

  /**
   * Generates media container HTML: either the base64 user image or the SVG category placeholder.
   */
  function getItemMediaHtml(item) {
    if (item.imageUrl) {
      return `<img src="${item.imageUrl}" alt="${escapeHtml(item.name)}" class="item-card-img" loading="lazy">`;
    }
    const svgIcon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS['Other'];
    return `
      <div class="item-placeholder-art">
        ${svgIcon}
        <span class="text-xs text-muted">${escapeHtml(item.category)}</span>
      </div>
    `;
  }

  /**
   * Builds an individual listing card component.
   */
  function createItemCardHtml(item, options = { showOwnerControls: false }) {
    const isOwner = userReportIds.has(item.id);
    const statusClass = `status-${item.status}`;
    const statusLabel = item.status === 'lost' ? 'Lost' : (item.status === 'found' ? 'Found' : 'Returned');

    return `
      <article class="item-card" data-id="${item.id}">
        <div class="item-card-media">
          ${getItemMediaHtml(item)}
          <div class="item-card-badges">
            <span class="status-badge ${statusClass}">
              <span class="dot-indicator dot-${item.status}"></span>
              ${statusLabel}
            </span>
          </div>
          ${isOwner ? '<span class="item-card-owner-tag">My Report</span>' : ''}
        </div>

        <div class="item-card-body">
          <div class="item-card-category-row">
            <span class="category-badge">${escapeHtml(item.category)}</span>
            <span class="text-muted-sm font-mono text-xs">#${item.id}</span>
          </div>

          <h3 class="item-card-title" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h3>
          <p class="item-card-desc">${escapeHtml(maskSensitiveText(item.description))}</p>

          <div class="item-card-meta">
            <div class="meta-item">
              <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${escapeHtml(item.location)}</span>
            </div>
            <div class="meta-item">
              <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>${formatDate(item.date)}</span>
            </div>
          </div>

          <div class="item-card-footer">
            <button class="btn btn-outline btn-sm btn-block view-details-btn" data-id="${item.id}">
              View Details
            </button>
            ${options.showOwnerControls ? `
              <button class="btn btn-sm btn-outline edit-report-btn" data-id="${item.id}" title="Edit this report">
                <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button class="btn btn-sm btn-outline text-danger delete-report-btn" data-id="${item.id}" title="Delete report">
                <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }

  // =========================================================================
  // 6. DASHBOARD & STATISTICS VIEW
  // =========================================================================
  function renderDashboard() {
    updateStatistics();
    renderRecentItems();
  }

  function updateStatistics() {
    const total = items.length;
    const lostCount = items.filter(i => i.status === 'lost').length;
    const foundCount = items.filter(i => i.status === 'found').length;
    const returnedCount = items.filter(i => i.status === 'returned').length;

    const elTotal = document.getElementById('statTotalReports');
    const elLost = document.getElementById('statLostCount');
    const elFound = document.getElementById('statFoundCount');
    const elReturned = document.getElementById('statReturnedCount');

    if (elTotal) elTotal.textContent = total;
    if (elLost) elLost.textContent = lostCount;
    if (elFound) elFound.textContent = foundCount;
    if (elReturned) elReturned.textContent = returnedCount;

    // Update My Reports header badge
    const myCount = items.filter(i => userReportIds.has(i.id)).length;
    const badgeDesktop = document.getElementById('myReportsCountBadge');
    const badgeMobile = document.getElementById('mobileMyReportsCount');
    if (badgeDesktop) badgeDesktop.textContent = myCount;
    if (badgeMobile) badgeMobile.textContent = myCount;
  }

  function renderRecentItems() {
    const container = document.getElementById('recentItemsGrid');
    if (!container) return;

    // Sort by createdAt / date descending, take top 4
    const recent = [...items]
      .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
      .slice(0, 4);

    if (recent.length === 0) {
      container.innerHTML = `<p class="text-muted text-center py-4">No recent reports found.</p>`;
      return;
    }

    container.innerHTML = recent.map(item => createItemCardHtml(item)).join('');
    bindCardEvents(container);
  }

  // =========================================================================
  // 7. BROWSE ITEMS & FILTERING
  // =========================================================================
  function renderBrowseItems() {
    const container = document.getElementById('browseItemsGrid');
    const emptyState = document.getElementById('browseEmptyState');
    const countDisplay = document.getElementById('resultsCount');
    const summaryDisplay = document.getElementById('activeFilterSummary');
    if (!container) return;

    // Read current filter inputs
    const keyword = (document.getElementById('filterSearchInput').value || '').trim().toLowerCase();
    const statusVal = document.getElementById('filterStatusSelect').value;
    const categoryVal = document.getElementById('filterCategorySelect').value;
    const locationVal = document.getElementById('filterLocationSelect').value;
    const sortBy = document.getElementById('sortBySelect').value;

    let filtered = items.filter(item => {
      // 1. Status filter
      if (statusVal !== 'all' && item.status !== statusVal) {
        return false;
      }
      // 2. Category filter
      if (categoryVal !== 'all' && item.category !== categoryVal) {
        return false;
      }
      // 3. Location filter
      if (locationVal !== 'all' && item.location !== locationVal) {
        return false;
      }
      // 4. Keyword search across name, description, location, id
      if (keyword) {
        const targetStr = `${item.name} ${item.description} ${item.location} ${item.locationDetails || ''} ${item.id}`.toLowerCase();
        if (!targetStr.includes(keyword)) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
      } else if (sortBy === 'alpha') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    // Update count & summaries
    if (countDisplay) countDisplay.textContent = filtered.length;

    let filterTags = [];
    if (keyword) filterTags.push(`Keyword: "${keyword}"`);
    if (statusVal !== 'all') filterTags.push(`Status: ${statusVal}`);
    if (categoryVal !== 'all') filterTags.push(`Category: ${categoryVal}`);
    if (locationVal !== 'all') filterTags.push(`Location: ${locationVal}`);

    if (summaryDisplay) {
      summaryDisplay.innerHTML = filterTags.length > 0
        ? ` (filtered by ${filterTags.join(', ')})`
        : '';
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      container.innerHTML = filtered.map(item => createItemCardHtml(item)).join('');
      bindCardEvents(container);
    }
  }

  function clearAllBrowseFilters() {
    document.getElementById('filterSearchInput').value = '';
    document.getElementById('filterStatusSelect').value = 'all';
    document.getElementById('filterCategorySelect').value = 'all';
    document.getElementById('filterLocationSelect').value = 'all';
    document.getElementById('sortBySelect').value = 'newest';
    renderBrowseItems();
    showToast('Filters cleared', 'info');
  }

  // =========================================================================
  // 8. MY REPORTS VIEW
  // =========================================================================
  function renderMyReports() {
    const container = document.getElementById('myReportsGrid');
    const emptyState = document.getElementById('myReportsEmptyState');
    if (!container) return;

    // Filter items owned by this browser
    const myItems = items.filter(item => userReportIds.has(item.id));

    // Update Tab Counters
    const countAll = myItems.length;
    const countLost = myItems.filter(i => i.status === 'lost').length;
    const countFound = myItems.filter(i => i.status === 'found').length;
    const countReturned = myItems.filter(i => i.status === 'returned').length;

    document.getElementById('myCountAll').textContent = countAll;
    document.getElementById('myCountLost').textContent = countLost;
    document.getElementById('myCountFound').textContent = countFound;
    document.getElementById('myCountReturned').textContent = countReturned;

    // Filter by selected tab
    let displayItems = myItems;
    if (myReportsFilter !== 'all') {
      displayItems = myItems.filter(item => item.status === myReportsFilter);
    }

    // Sort newest first
    displayItems.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

    if (displayItems.length === 0) {
      container.innerHTML = '';
      if (emptyState) {
        emptyState.classList.remove('hidden');
        const emptyTitle = document.getElementById('myEmptyTitle');
        const emptyText = document.getElementById('myEmptyText');
        if (myReportsFilter === 'all') {
          emptyTitle.textContent = 'No Reports Yet';
          emptyText.textContent = "You haven't reported any lost or found items in this browser yet.";
        } else {
          emptyTitle.textContent = `No ${myReportsFilter.toUpperCase()} items`;
          emptyText.textContent = `You currently have zero items categorized as ${myReportsFilter}.`;
        }
      }
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      container.innerHTML = displayItems.map(item => createItemCardHtml(item, { showOwnerControls: true })).join('');
      bindCardEvents(container);
    }
  }

  // =========================================================================
  // 9. REPORT AN ITEM (ADD & EDIT)
  // =========================================================================
  let uploadedImageBase64 = '';

  /**
   * Resizes an image file via HTML5 canvas to safe dimensions (< 600px)
   * to guarantee LocalStorage 5MB quota is never exceeded.
   */
  function handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, or WEBP).', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale max 600px width/height
        const maxDimension = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compact JPEG format (~40-60 KB)
        uploadedImageBase64 = canvas.toDataURL('image/jpeg', 0.75);

        // Show Preview
        const previewImg = document.getElementById('imagePreviewImg');
        const previewWrap = document.getElementById('imagePreviewWrapper');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');

        if (previewImg && previewWrap && uploadPlaceholder) {
          previewImg.src = uploadedImageBase64;
          previewWrap.classList.remove('hidden');
          uploadPlaceholder.classList.add('hidden');
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function removeUploadedImage() {
    uploadedImageBase64 = '';
    const fileInput = document.getElementById('itemImageFile');
    if (fileInput) fileInput.value = '';
    const previewWrap = document.getElementById('imagePreviewWrapper');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    if (previewWrap) previewWrap.classList.add('hidden');
    if (uploadPlaceholder) uploadPlaceholder.classList.remove('hidden');
  }

  function prepareReportFormForAdd(defaultType = 'lost') {
    const form = document.getElementById('itemReportForm');
    if (!form) return;

    form.reset();
    document.getElementById('reportEditId').value = '';
    document.getElementById('formMainTitle').textContent = 'Report a Campus Item';
    document.getElementById('formSubTitle').textContent = 'Fill in the details below to publish an item report to the campus board.';
    document.getElementById('formSubmitBtnText').textContent = 'Publish Report';

    // Set Radio
    if (defaultType === 'found') {
      document.getElementById('typeRadioFound').checked = true;
    } else {
      document.getElementById('typeRadioLost').checked = true;
    }
    updateFormTypeLabels();

    // Default date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('itemDate');
    dateInput.value = today;
    dateInput.max = today;

    // Contact default
    document.getElementById('contactMethod').value = 'desk';
    updateContactMethodFields();

    removeUploadedImage();
    clearAllValidationErrors();
  }

  function prepareReportFormForEdit(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) {
      showToast('Item not found', 'error');
      return;
    }

    document.getElementById('reportEditId').value = item.id;
    document.getElementById('formMainTitle').textContent = `Edit Report #${item.id}`;
    document.getElementById('formSubTitle').textContent = 'Update details for this campus listing.';
    document.getElementById('formSubmitBtnText').textContent = 'Save Changes';

    // Set Type
    if (item.type === 'found') {
      document.getElementById('typeRadioFound').checked = true;
    } else {
      document.getElementById('typeRadioLost').checked = true;
    }
    updateFormTypeLabels();

    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemDate').value = item.date;
    document.getElementById('itemDate').max = new Date().toISOString().split('T')[0];
    document.getElementById('itemLocation').value = item.location;
    document.getElementById('itemLocationDetails').value = item.locationDetails || '';
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('descCharCount').textContent = `${item.description.length} / 800`;

    document.getElementById('contactMethod').value = item.contactMethod || 'desk';
    updateContactMethodFields();
    document.getElementById('contactDetailInput').value = item.contactDetail || '';

    // Image
    if (item.imageUrl) {
      uploadedImageBase64 = item.imageUrl;
      const previewImg = document.getElementById('imagePreviewImg');
      const previewWrap = document.getElementById('imagePreviewWrapper');
      const uploadPlaceholder = document.getElementById('uploadPlaceholder');
      if (previewImg && previewWrap && uploadPlaceholder) {
        previewImg.src = uploadedImageBase64;
        previewWrap.classList.remove('hidden');
        uploadPlaceholder.classList.add('hidden');
      }
    } else {
      removeUploadedImage();
    }

    clearAllValidationErrors();
    switchView('report');
  }

  function updateFormTypeLabels() {
    const isLost = document.getElementById('typeRadioLost').checked;
    const dateLabel = document.getElementById('itemDateLabel');
    if (dateLabel) {
      dateLabel.textContent = isLost ? 'Date Lost' : 'Date Found';
    }
  }

  function updateContactMethodFields() {
    const method = document.getElementById('contactMethod').value;
    const label = document.getElementById('contactDetailLabel');
    const input = document.getElementById('contactDetailInput');

    if (method === 'desk') {
      label.textContent = 'Campus Desk Reference / Officer Info';
      input.placeholder = 'e.g. Central Library Info Desk, Ticket #42';
      if (!input.value || input.value.includes('@')) {
        input.value = 'Central Library Circulation & Security Desk';
      }
    } else if (method === 'email') {
      label.textContent = 'Campus Student Email (Masked in public)';
      input.placeholder = 'e.g. student.name@campus.edu';
      if (input.value.includes('Desk')) input.value = '';
    } else if (method === 'phone') {
      label.textContent = 'Campus Extension / Phone (Masked in public)';
      input.placeholder = 'e.g. Ext. 2240 or (555) 019-2240';
      if (input.value.includes('Desk') || input.value.includes('@')) input.value = '';
    }
  }

  function clearAllValidationErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));
  }

  function validateReportForm() {
    clearAllValidationErrors();
    let isValid = true;

    const name = document.getElementById('itemName').value.trim();
    if (!name || name.length < 3) {
      document.getElementById('itemNameError').classList.add('visible');
      document.getElementById('itemName').classList.add('is-invalid');
      isValid = false;
    }

    const category = document.getElementById('itemCategory').value;
    if (!category) {
      document.getElementById('itemCategoryError').classList.add('visible');
      document.getElementById('itemCategory').classList.add('is-invalid');
      isValid = false;
    }

    const date = document.getElementById('itemDate').value;
    const today = new Date().toISOString().split('T')[0];
    if (!date || date > today) {
      document.getElementById('itemDateError').classList.add('visible');
      document.getElementById('itemDate').classList.add('is-invalid');
      isValid = false;
    }

    const location = document.getElementById('itemLocation').value;
    if (!location) {
      document.getElementById('itemLocationError').classList.add('visible');
      document.getElementById('itemLocation').classList.add('is-invalid');
      isValid = false;
    }

    const desc = document.getElementById('itemDescription').value.trim();
    if (!desc || desc.length < 15) {
      document.getElementById('itemDescriptionError').classList.add('visible');
      document.getElementById('itemDescription').classList.add('is-invalid');
      isValid = false;
    }

    const contactDetail = document.getElementById('contactDetailInput').value.trim();
    if (!contactDetail) {
      document.getElementById('contactDetailError').classList.add('visible');
      document.getElementById('contactDetailInput').classList.add('is-invalid');
      isValid = false;
    }

    return isValid;
  }

  function handleReportFormSubmit(e) {
    e.preventDefault();
    if (!validateReportForm()) {
      showToast('Please correct highlighted fields before submitting.', 'warning');
      return;
    }

    const submitBtn = document.getElementById('formSubmitBtn');
    submitBtn.disabled = true;

    const editId = document.getElementById('reportEditId').value;
    const isLost = document.getElementById('typeRadioLost').checked;
    const type = isLost ? 'lost' : 'found';
    const name = document.getElementById('itemName').value.trim();
    const category = document.getElementById('itemCategory').value;
    const date = document.getElementById('itemDate').value;
    const location = document.getElementById('itemLocation').value;
    const locationDetails = document.getElementById('itemLocationDetails').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    const contactMethod = document.getElementById('contactMethod').value;
    const contactDetail = document.getElementById('contactDetailInput').value.trim();

    if (editId) {
      // Edit existing
      const index = items.findIndex(i => i.id === editId);
      if (index !== -1) {
        items[index] = {
          ...items[index],
          type,
          name,
          category,
          date,
          location,
          locationDetails,
          description,
          imageUrl: uploadedImageBase64 || items[index].imageUrl,
          contactMethod,
          contactDetail,
          updatedAt: new Date().toISOString()
        };
        saveItemsToStorage();
        showToast(`Report #${editId} updated successfully!`, 'success');
        refreshAllViews();
        openItemDetailsModal(editId);
      }
    } else {
      // Create new
      const newId = `UNF-${Math.floor(1000 + Math.random() * 9000)}`;
      const newItem = {
        id: newId,
        type,
        name,
        category,
        date,
        location,
        locationDetails,
        description,
        imageUrl: uploadedImageBase64,
        contactMethod,
        contactDetail,
        status: type, // 'lost' or 'found'
        isUserReport: true,
        createdAt: new Date().toISOString()
      };

      items.unshift(newItem);
      userReportIds.add(newId);
      saveItemsToStorage();
      saveMyIdsToStorage();
      showToast(`Report #${newId} created successfully!`, 'success');
      refreshAllViews();
      openItemDetailsModal(newId);
    }

    submitBtn.disabled = false;
  }

  // =========================================================================
  // 10. ITEM DETAILS MODAL & SMART MATCHES
  // =========================================================================
  function openItemDetailsModal(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    currentActiveItem = item;
    const isOwner = userReportIds.has(item.id);

    // Populate Modal Meta & Content
    const modal = document.getElementById('itemDetailsModal');
    const badgeStatus = document.getElementById('modalStatusBadge');
    const badgeCategory = document.getElementById('modalCategoryBadge');
    const title = document.getElementById('modalItemTitle');
    const desc = document.getElementById('modalDescription');
    const loc = document.getElementById('modalLocation');
    const locDetailRow = document.getElementById('modalLocationDetailRow');
    const locDetail = document.getElementById('modalLocationDetails');
    const date = document.getElementById('modalDate');
    const reportId = document.getElementById('modalReportId');
    const imgWrap = document.getElementById('modalImageWrap');
    const contactValue = document.getElementById('modalContactValue');
    const actionsBar = document.getElementById('modalActionsBar');

    // Status Badge
    badgeStatus.className = `status-badge status-${item.status}`;
    badgeStatus.innerHTML = `<span class="dot-indicator dot-${item.status}"></span> ${item.status.toUpperCase()}`;
    badgeCategory.textContent = item.category;

    title.textContent = item.name;
    desc.textContent = maskSensitiveText(item.description);
    loc.textContent = item.location;

    if (item.locationDetails) {
      locDetailRow.style.display = 'flex';
      locDetail.textContent = item.locationDetails;
    } else {
      locDetailRow.style.display = 'none';
    }

    date.textContent = formatDate(item.date);
    reportId.textContent = `#${item.id}`;

    // Media
    imgWrap.innerHTML = getItemMediaHtml(item);

    // Contact Masking
    if (item.contactMethod === 'email') {
      const email = item.contactDetail || '';
      const maskedEmail = email.replace(/(^.{2})(.*)(@.*)/, '$1***$3');
      contactValue.textContent = `Student Email (${maskedEmail})`;
    } else if (item.contactMethod === 'phone') {
      contactValue.textContent = 'Campus Extension / Desk Guard';
    } else {
      contactValue.textContent = item.contactDetail || 'Central Campus Desk';
    }

    // Modal Action Buttons
    let actionsHtml = '';

    // If item is not yet returned, provide safe claim/inquire button
    if (item.status !== 'returned') {
      const btnLabel = item.type === 'lost' ? 'I Found This Item!' : 'Claim This Item';
      actionsHtml += `
        <button class="btn btn-primary" id="modalClaimActionBtn">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          ${btnLabel}
        </button>
      `;
    }

    // Return button (owner can mark as returned, or anyone testing demo can mark)
    if (item.status !== 'returned') {
      actionsHtml += `
        <button class="btn btn-success" id="modalReturnActionBtn">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Mark as Returned
        </button>
      `;
    }

    // Owner controls: Edit & Delete
    if (isOwner) {
      actionsHtml += `
        <button class="btn btn-outline" id="modalEditActionBtn">
          <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          Edit Report
        </button>
        <button class="btn btn-outline text-danger" id="modalDeleteActionBtn">
          <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete
        </button>
      `;
    }

    actionsBar.innerHTML = actionsHtml;

    // Bind action buttons
    const claimBtn = document.getElementById('modalClaimActionBtn');
    if (claimBtn) {
      claimBtn.addEventListener('click', () => {
        openClaimModal(item);
      });
    }

    const returnBtn = document.getElementById('modalReturnActionBtn');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        markItemAsReturned(item.id);
      });
    }

    const editBtn = document.getElementById('modalEditActionBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        closeAllModals();
        prepareReportFormForEdit(item.id);
      });
    }

    const delBtn = document.getElementById('modalDeleteActionBtn');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        openDeleteModal(item.id, item.name);
      });
    }

    // Render Smart Item Matching Section
    renderSmartMatchesForActiveItem(item);

    // Open Modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function renderSmartMatchesForActiveItem(item) {
    const container = document.getElementById('smartMatchesContainer');
    const notice = document.getElementById('noMatchesNotice');
    if (!container || !notice) return;

    const matches = getSmartMatches(item);

    if (matches.length === 0) {
      container.innerHTML = '';
      notice.classList.remove('hidden');
    } else {
      notice.classList.add('hidden');
      container.innerHTML = matches.map(match => {
        const mItem = match.item;
        const reasonsHtml = match.reasons
          .map(r => `<span class="match-tag">${escapeHtml(r)}</span>`)
          .join('');

        return `
          <div class="match-card" data-id="${mItem.id}">
            <span class="match-score-pill">${match.score}% Match</span>
            <div class="match-card-title">${escapeHtml(mItem.name)}</div>
            <div class="match-card-meta">
              <strong>${mItem.type.toUpperCase()}:</strong> ${escapeHtml(mItem.location)} &bull; ${formatDate(mItem.date)}
            </div>
            <div class="match-tags-row">
              ${reasonsHtml}
            </div>
          </div>
        `;
      }).join('');

      // Clicking a match card opens its details
      container.querySelectorAll('.match-card').forEach(card => {
        card.addEventListener('click', () => {
          const matchId = card.dataset.id;
          openItemDetailsModal(matchId);
        });
      });
    }
  }

  // =========================================================================
  // 11. RETURN ITEM & DELETE ACTIONS
  // =========================================================================
  function markItemAsReturned(itemId) {
    const index = items.findIndex(i => i.id === itemId);
    if (index === -1) return;

    items[index].status = 'returned';
    items[index].returnedAt = new Date().toISOString();
    saveItemsToStorage();

    refreshAllViews();
    openItemDetailsModal(itemId);
    showToast(`Success! Item #${itemId} marked as Returned.`, 'success');
  }

  let itemToDeleteId = null;

  function openDeleteModal(itemId, itemName) {
    itemToDeleteId = itemId;
    const titleEl = document.getElementById('deleteItemTitle');
    if (titleEl) titleEl.textContent = `"${itemName || itemId}"`;
    document.getElementById('deleteConfirmModal').classList.remove('hidden');
  }

  function confirmDelete() {
    if (!itemToDeleteId) return;

    items = items.filter(i => i.id !== itemToDeleteId);
    userReportIds.delete(itemToDeleteId);
    saveItemsToStorage();
    saveMyIdsToStorage();

    closeAllModals();
    refreshAllViews();
    showToast(`Report #${itemToDeleteId} deleted successfully.`, 'info');
    itemToDeleteId = null;
  }

  // =========================================================================
  // 12. SAFE CLAIM / CONTACT MODAL
  // =========================================================================
  function openClaimModal(item) {
    const modal = document.getElementById('claimModal');
    const summary = document.getElementById('claimItemSummary');
    const title = document.getElementById('claimModalTitle');

    title.textContent = item.type === 'lost' ? 'Found This Belonging?' : 'Claim This Item';

    summary.innerHTML = `
      <div class="d-flex align-center justify-between">
        <strong>${escapeHtml(item.name)}</strong>
        <span class="category-badge">${escapeHtml(item.category)}</span>
      </div>
      <div class="text-muted-sm mt-1">
        Location: ${escapeHtml(item.location)} &bull; Reported: ${formatDate(item.date)}
      </div>
    `;

    document.getElementById('claimInquiryForm').reset();
    modal.classList.remove('hidden');
  }

  function handleClaimSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('claimSenderName').value.trim();
    const email = document.getElementById('claimSenderContact').value.trim();
    const msg = document.getElementById('claimMessage').value.trim();

    if (!name || !email || !msg) {
      showToast('Please fill in all inquiry details.', 'warning');
      return;
    }

    // Simulate safe routed notification to campus desk
    closeAllModals();
    showToast(
      `Inquiry sent safely! Campus services will verify your details for item #${currentActiveItem.id}.`,
      'success'
    );
  }

  // =========================================================================
  // 13. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    if (type === 'success') {
      icon = `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'warning' || type === 'error') {
      icon = `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="d-flex align-center gap-2">
        ${icon}
        <span>${escapeHtml(message)}</span>
      </div>
      <button class="toast-close-btn" aria-label="Dismiss">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-close-btn').addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // =========================================================================
  // 14. EVENT LISTENERS & INITIALIZATION
  // =========================================================================
  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
    document.body.style.overflow = '';
  }

  function bindCardEvents(container) {
    // View Details buttons
    container.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openItemDetailsModal(btn.dataset.id);
      });
    });

    // Whole card click
    container.querySelectorAll('.item-card').forEach(card => {
      card.addEventListener('click', () => {
        openItemDetailsModal(card.dataset.id);
      });
    });

    // Edit Report buttons
    container.querySelectorAll('.edit-report-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        prepareReportFormForEdit(btn.dataset.id);
      });
    });

    // Delete Report buttons
    container.querySelectorAll('.delete-report-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const item = items.find(i => i.id === id);
        openDeleteModal(id, item ? item.name : id);
      });
    });
  }

  function refreshAllViews() {
    updateStatistics();
    if (activeView === 'home') renderDashboard();
    if (activeView === 'browse') renderBrowseItems();
    if (activeView === 'my-reports') renderMyReports();
  }

  function setupEventListeners() {
    // Brand link
    document.getElementById('brandLink').addEventListener('click', (e) => {
      e.preventDefault();
      switchView('home');
    });

    // Nav Links (Desktop & Footer)
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.dataset.view;
        switchView(view);
      });
    });

    // Mobile Drawer Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
      });
    }

    // Reset Demo Data Button
    document.getElementById('resetDemoDataBtn').addEventListener('click', () => {
      if (confirm('Reset sample data? This will restore initial demonstration items.')) {
        resetSampleData();
      }
    });

    // Hero Action Buttons
    document.getElementById('heroLostBtn').addEventListener('click', () => {
      prepareReportFormForAdd('lost');
      switchView('report');
    });

    document.getElementById('heroFoundBtn').addEventListener('click', () => {
      prepareReportFormForAdd('found');
      switchView('report');
    });

    document.getElementById('headerReportLostBtn').addEventListener('click', () => {
      prepareReportFormForAdd('lost');
      switchView('report');
    });

    document.getElementById('headerReportFoundBtn').addEventListener('click', () => {
      prepareReportFormForAdd('found');
      switchView('report');
    });

    document.getElementById('browseNewReportBtn').addEventListener('click', () => {
      prepareReportFormForAdd('lost');
      switchView('report');
    });

    document.getElementById('myReportsAddBtn').addEventListener('click', () => {
      prepareReportFormForAdd('lost');
      switchView('report');
    });

    document.getElementById('myEmptyReportBtn').addEventListener('click', () => {
      prepareReportFormForAdd('lost');
      switchView('report');
    });

    document.getElementById('emptyReportItemBtn').addEventListener('click', () => {
      prepareReportFormForAdd('lost');
      switchView('report');
    });

    // Hero Search Button & Enter Key
    const heroSearchInput = document.getElementById('heroSearchInput');
    const heroLocationSelect = document.getElementById('heroLocationSelect');
    const heroSearchBtn = document.getElementById('heroSearchBtn');

    function performHeroSearch() {
      const q = heroSearchInput.value.trim();
      const loc = heroLocationSelect.value;

      document.getElementById('filterSearchInput').value = q;
      document.getElementById('filterLocationSelect').value = loc || 'all';
      switchView('browse');
      renderBrowseItems();
    }

    if (heroSearchBtn) heroSearchBtn.addEventListener('click', performHeroSearch);
    if (heroSearchInput) {
      heroSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performHeroSearch();
      });
    }

    // Browse Filters Live Change
    ['filterSearchInput', 'filterStatusSelect', 'filterCategorySelect', 'filterLocationSelect', 'sortBySelect']
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', renderBrowseItems);
          el.addEventListener('change', renderBrowseItems);
        }
      });

    // Clear Filters Buttons
    document.getElementById('clearFiltersBtn').addEventListener('click', clearAllBrowseFilters);
    document.getElementById('emptyResetFiltersBtn').addEventListener('click', clearAllBrowseFilters);
    document.getElementById('viewAllBrowseBtn').addEventListener('click', () => switchView('browse'));

    // Stat Cards Filter Click
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('click', () => {
        const filter = card.dataset.filter;
        document.getElementById('filterStatusSelect').value = filter || 'all';
        switchView('browse');
        renderBrowseItems();
      });
    });

    // My Reports Tabs
    document.querySelectorAll('#myReportsTabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#myReportsTabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        myReportsFilter = btn.dataset.tab;
        renderMyReports();
      });
    });

    // Report Form Radio Toggle
    document.querySelectorAll('input[name="reportType"]').forEach(radio => {
      radio.addEventListener('change', updateFormTypeLabels);
    });

    // Contact Method change
    document.getElementById('contactMethod').addEventListener('change', updateContactMethodFields);

    // Character Counter on Description
    const descTextarea = document.getElementById('itemDescription');
    const descCounter = document.getElementById('descCharCount');
    if (descTextarea && descCounter) {
      descTextarea.addEventListener('input', () => {
        descCounter.textContent = `${descTextarea.value.length} / 800`;
      });
    }

    // Image Upload Drop Zone & Input
    const dropZone = document.getElementById('imageDropZone');
    const fileInput = document.getElementById('itemImageFile');
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', (e) => {
        if (!e.target.closest('#removeImageBtn')) {
          fileInput.click();
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          handleImageUpload(fileInput.files[0]);
        }
      });

      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--teal-600)';
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '';
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleImageUpload(e.dataTransfer.files[0]);
        }
      });
    }

    // Remove Image button
    const removeImgBtn = document.getElementById('removeImageBtn');
    if (removeImgBtn) {
      removeImgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeUploadedImage();
      });
    }

    // Report Form Submit & Cancel
    document.getElementById('itemReportForm').addEventListener('submit', handleReportFormSubmit);
    document.getElementById('formCancelBtn').addEventListener('click', () => {
      switchView('browse');
    });

    // Modal Close buttons
    document.getElementById('modalCloseBtn').addEventListener('click', closeAllModals);
    document.getElementById('claimModalCloseBtn').addEventListener('click', closeAllModals);
    document.getElementById('claimCancelBtn').addEventListener('click', closeAllModals);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeAllModals);

    // Confirm Delete
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);

    // Claim Form Submit
    document.getElementById('claimInquiryForm').addEventListener('submit', handleClaimSubmit);

    // Modal Overlay backdrop click to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });

    // Keyboard ESC to close modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });
  }

  // =========================================================================
  // 15. BOOTSTRAP APPLICATION
  // =========================================================================
  function initApp() {
    initializeStorage();
    setupEventListeners();

    // Check URL hash or default to home
    const hash = window.location.hash.replace('#', '');
    if (views[hash]) {
      switchView(hash, false);
    } else {
      switchView('home', false);
    }

    renderDashboard();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
