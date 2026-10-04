// Gốm Thuần Ngọc — chút chạy trên trang: ray ảnh, nút Zalo chép sẵn mã món.
(function () {
  var bao = document.querySelector('.bao'), hen;
  function noi(t) {
    if (!bao) return;
    bao.textContent = t; bao.classList.add('hien');
    clearTimeout(hen); hen = setTimeout(function () { bao.classList.remove('hien'); }, 3200);
  }

  // Zalo không cho điền sẵn tin nhắn qua link, nên chép câu hỏi kèm mã món vào bộ nhớ rồi mở Zalo.
  document.querySelectorAll('[data-zalo]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      var tin = a.getAttribute('data-tin') || '';
      var mo = function () {
        if (window.ZALO) { noi('Đã chép câu hỏi. Dán vào Zalo để gửi kho.'); setTimeout(function () { location.href = 'https://zalo.me/' + window.ZALO; }, 700); }
        else noi('Bản mẫu: số Zalo chưa chốt. Câu hỏi đã được chép sẵn.');
      };
      if (navigator.clipboard && tin) navigator.clipboard.writeText(tin).then(mo, mo); else mo();
    });
  });

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
