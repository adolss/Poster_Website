// Norrvyn theme JS — AJAX add-to-cart with inline feedback + live cart count.
document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('[data-product-form]');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('[data-add-btn]');
    var original = btn.textContent;
    btn.disabled = true;

    fetch(window.Shopify && Shopify.routes ? Shopify.routes.root + 'cart/add.js' : '/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: Number(form.querySelector('[name="id"]').value), quantity: 1 })
    })
      .then(function (r) { if (!r.ok) throw new Error('add failed'); return r.json(); })
      .then(function () { return fetch('/cart.js').then(function (r) { return r.json(); }); })
      .then(function (cart) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count;
        });
        btn.textContent = 'Added ✓ Add another';
      })
      .catch(function () {
        // Fall back to a native submit (does not re-trigger this listener).
        btn.textContent = original;
        form.submit();
      })
      .finally(function () { btn.disabled = false; });
  });
});
