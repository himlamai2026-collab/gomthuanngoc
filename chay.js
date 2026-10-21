// Gốm Thuần Ngọc — chút chạy trên trang: ray ảnh, nút Zalo chép sẵn mã món.
(function () {
  var bao = document.querySelector('.bao'), hen;
  function noi(t) {
    if (!bao) return;
    bao.textContent = t; bao.classList.add('hien');
    clearTimeout(hen); hen = setTimeout(function () { bao.classList.remove('hien'); }, 3200);
  }

  // Zalo không cho điền sẵn tin nhắn qua link, nên chép câu hỏi kèm mã món vào bộ nhớ rồi mở Zalo.
  function ganZalo(a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      var tin = a.getAttribute('data-tin') || '';
      var mo = function () {
        if (window.ZALO) { noi('Đã chép câu hỏi. Dán vào Zalo để gửi kho.'); setTimeout(function () { location.href = 'https://zalo.me/' + window.ZALO; }, 700); }
        else noi('Bản mẫu: số Zalo chưa chốt. Câu hỏi đã được chép sẵn.');
      };
      if (navigator.clipboard && tin) navigator.clipboard.writeText(tin).then(mo, mo); else mo();
    });
  }
  document.querySelectorAll('[data-zalo]').forEach(ganZalo);

  // Trạng thái sống: đọc sổ kho online (chỉ mã + trạng thái) để món vừa giữ / vừa bán đổi ngay, không chờ dựng lại web.
  var TEN = { con: 'Đang có', giu: 'Đang giữ', 'da-co-chu': 'Đã có chủ' };
  function nhan(tt) { var s = document.createElement('span'); s.className = 'tt tt-' + tt; s.textContent = TEN[tt]; return s; }
  function doiThe(a, tt) {
    var cu = a.querySelector('.the-anh .tt');
    if (cu) cu.remove();
    if (tt !== 'con') a.querySelector('.the-anh').prepend(nhan(tt));
    var gia = a.querySelector('.gia');
    if (gia && tt === 'da-co-chu') { gia.className = 'gia gia-an'; gia.textContent = 'Đã có chủ'; }
  }
  function doiTrang(b, tt) {
    var cu = b.querySelector('.mon-so .tt');
    if (cu) cu.replaceWith(nhan(tt));
    if (tt === 'con') return;   // giữ → còn: để lần dựng sau vẽ lại nút
    var ma = b.getAttribute('data-ma'), cot = b.querySelector('.nut-cot');
    var gia = b.querySelector('.gia');
    if (gia && tt === 'da-co-chu') { gia.className = 'gia gia-an'; gia.textContent = 'Đã có chủ'; }
    if (!cot) return;
    cot.innerHTML = '';
    var p = document.createElement('p'); p.className = 'da-ban';
    p.textContent = tt === 'giu' ? 'Món đang được giữ cho một khách. Anh chị muốn được báo khi món trống lại thì nhắn kho.'
      : 'Món này đã có chủ. Trang hồ sơ được giữ lại để tra cứu.';
    var a = document.createElement('a'); a.className = 'nut-vien nut-rong'; a.href = '#'; a.setAttribute('data-zalo', '');
    a.setAttribute('data-tin', tt === 'giu' ? 'Chào kho Gốm Thuần Ngọc, món ' + ma + ' trống lại thì báo em'
      : 'Chào kho Gốm Thuần Ngọc, em muốn tìm món giống ' + ma);
    a.textContent = tt === 'giu' ? 'Nhờ kho báo khi trống' : 'Hỏi món tương tự';
    cot.append(p, a); ganZalo(a);
  }
  if (window.TT_URL && window.fetch && document.querySelector('[data-ma]')) {
    fetch(window.TT_URL).then(function (r) { return r.json(); }).then(function (tt) {
      document.querySelectorAll('[data-ma]').forEach(function (el) {
        var moi = tt[el.getAttribute('data-ma')];
        if (!moi || !TEN[moi] || moi === el.getAttribute('data-tt')) return;
        el.setAttribute('data-tt', moi);
        if (el.classList.contains('the')) doiThe(el, moi); else doiTrang(el, moi);
      });
    }).catch(function () {});   // sổ không trả lời thì giữ nguyên trạng thái lúc dựng
  }

  // ray ảnh: đếm ảnh, ảnh nhỏ, link "xem ảnh 7"
  var ray = document.querySelector('.ray');
  if (!ray) return;
  var dem = document.querySelector('[data-dem]');
  var nho = document.querySelectorAll('.nho button');
  function den(i) { ray.scrollTo({ left: i * ray.clientWidth, behavior: 'smooth' }); }
  function capNhat() {
    var i = Math.round(ray.scrollLeft / ray.clientWidth);
    if (dem) dem.textContent = i + 1;
    nho.forEach(function (b, k) { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  }
  ray.addEventListener('scroll', function () { window.requestAnimationFrame(capNhat); }, { passive: true });
  document.querySelectorAll('[data-den]').forEach(function (b) {
    b.addEventListener('click', function (ev) {
      ev.preventDefault();
      den(+b.getAttribute('data-den'));
      if (b.tagName === 'A') document.querySelector('.mon-anh').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  ray.addEventListener('keydown', function (ev) {
    var i = Math.round(ray.scrollLeft / ray.clientWidth);
    if (ev.key === 'ArrowRight') den(i + 1);
    if (ev.key === 'ArrowLeft') den(Math.max(0, i - 1));
  });
  capNhat();
})();
