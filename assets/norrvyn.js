// BLICKLI: native product forms remain usable when JavaScript is unavailable.
function initBlickli(scope) {
  scope.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    if (gallery.dataset.ready) return;
    gallery.dataset.ready = 'true';
    var panels = gallery.querySelectorAll('[data-gallery-panel]');
    var buttons = gallery.querySelectorAll('[data-gallery-select]');
    buttons.forEach(function (button, index) {
      button.addEventListener('click', function () {
        panels.forEach(function (panel, i) { panel.hidden = i !== index; });
        buttons.forEach(function (control, i) { control.setAttribute('aria-pressed', String(i === index)); });
      });
    });
  });
  scope.querySelectorAll('[data-product-form]').forEach(function (form) {
    if (form.dataset.ready) return;
    form.dataset.ready = 'true';
    var button = form.querySelector('[data-add-btn]');
    var label = button.querySelector('[data-add-label]');
    var feedback = form.querySelector('[data-cart-feedback]');
    var variants = form.querySelector('[data-variant-select]');
    if (variants) variants.addEventListener('change', function () {
      var option = variants.selectedOptions[0];
      button.disabled = option.dataset.available !== 'true';
      label.textContent = button.disabled ? 'Sold out' : 'Add to cart — ' + option.dataset.price;
      form.closest('.product-details').querySelector('.product-price').textContent = option.dataset.price;
      feedback.textContent = '';
    });
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (button.disabled) return;
      var original = label.textContent;
      button.disabled = true;
      if (variants) variants.disabled = true;
      label.textContent = 'Adding…';
      feedback.textContent = '';
      var root = window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/';
      try {
        var response = await fetch(root + 'cart/add.js', {
          method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({id: form.querySelector('[name="id"]').value, quantity: 1})
        });
        var result = await response.json();
        if (!response.ok) throw new Error(result.description || 'This print could not be added. Please try again.');
        feedback.textContent = 'Added to your cart.';
        // A count-refresh failure must never submit the purchase a second time.
        try {
          var cartResponse = await fetch(root + 'cart.js');
          if (cartResponse.ok) {
            var cart = await cartResponse.json();
            document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = cart.item_count; });
          }
        } catch (_) { /* The item was added. The cart page has the current count. */ }
      } catch (error) {
        feedback.textContent = error instanceof TypeError ? 'We could not confirm the cart update. Please check your cart before trying again.' : error.message;
      } finally {
        label.textContent = original;
        button.disabled = false;
        if (variants) variants.disabled = false;
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', function () { initBlickli(document); });
document.addEventListener('shopify:section:load', function (event) { initBlickli(event.target); });
