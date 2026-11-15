// Shared behaviour for the look samples: screen switching, the guess scales and
// tap-ranking. Each direction supplies its own markup and styling.
window.LOOK = function (opts = {}) {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const state = { stated: {}, order: [], tied: false };
  function go(name) {
    $$('[data-screen]').forEach((el) => el.classList.toggle('on', el.dataset.screen === name));
    $$('[data-nav]').forEach((el) => el.classList.toggle('on', el.dataset.go === name));
    document.body.dataset.at = name;
    window.scrollTo(0, 0);
    if (opts.onScreen) opts.onScreen(name, state);
  }
  function paintRank() {
    $$('[data-opt]').forEach((el) => {
      const i = +el.dataset.opt, n = state.order.indexOf(i);
      el.classList.toggle('picked', n >= 0);
      el.classList.toggle('tied', state.tied && n < 0);
      (el.closest('li') || el).style.setProperty('--n', n >= 0 ? n : 9);
      const badge = $('.n', el);
      if (badge) badge.textContent = n >= 0 ? String(n + 1) : state.tied ? '=' : '';
    });
    const tie = $('[data-act=tie]');
    if (tie) tie.classList.toggle('show', state.order.length >= 1 && state.order.length < 3 && !state.tied);
    const done = $('[data-act=rankDone]');
    if (done) done.disabled = !(state.order.length >= 3 || state.tied);
    if (opts.onRank) opts.onRank(state);
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-go],[data-opt],[data-dot],[data-act]');
    if (!t) return;
    if (t.dataset.go) return go(t.dataset.go);
    if (t.dataset.dot) {
      const [k, v] = t.dataset.dot.split(':');
      state.stated[k] = +v;
      $$(`[data-dot^="${k}:"]`).forEach((d) => d.classList.toggle('on', d === t));
      if (opts.onStated) opts.onStated(k, +v, state);
      return;
    }
    if (t.dataset.opt !== undefined) {
      const i = +t.dataset.opt, n = state.order.indexOf(i);
      if (n >= 0) { state.order.splice(n, 1); if (state.order.length === 3) state.order.pop(); }
      else {
        state.tied = false;
        state.order.push(i);
        if (state.order.length === 3) state.order.push([0, 1, 2, 3].find((j) => !state.order.includes(j)));
      }
      return paintRank();
    }
    if (t.dataset.act === 'tie') { state.tied = true; return paintRank(); }
    if (t.dataset.act === 'rankDone') return go('result');
  });
  document.addEventListener('DOMContentLoaded', () => {
    if (opts.build) opts.build(window.LIKE);
    paintRank();
    go(location.hash.slice(1) || 'guess');
  });
  return { state, go };
};
