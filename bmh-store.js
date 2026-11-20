var BMH_PACKAGES = {
      free: {
        id: 'free',
        name: 'Free Squeeze Pack: High-DPI AI Diagnostic + Code FIRST25',
        listPrice: 0,
        first25Price: 0,
        zipUrl: 'dist/BestOfMustHave-Free-High-DPI-Diagnostic-Pack.zip'
      },
      tier1: {
        id: 'tier1',
        name: 'Tier 1: Universal AI Drag & High-DPI Physics Bridge',
        listPrice: 19,
        first25Price: 9,
        zipUrl: 'dist/BestOfMustHave-Tier1-Universal-AI-Drag-Bridge-v1.0-19USD-FIRST25.zip'
      },
      tier2: {
        id: 'tier2',
        name: 'Tier 2: Complete 14-Tool AI PowerToys Pro Bundle',
        listPrice: 79,
        first25Price: 69,
        zipUrl: 'dist/BestOfMustHave-Tier2-12-Tools-For-AI-Agents-Bundle-v1.0-79USD.zip'
      },
      tier3: {
        id: 'tier3',
        name: 'Tier 3: 6-Module Agent Team Academy + 120 SOPs + All 14 Tools',
        listPrice: 297,
        first25Price: 247,
        zipUrl: 'dist/BestOfMustHave-AI-PowerToys-Complete-v2.0-Latest.zip'
      }
    };

    function recalcBmhCheckout() {
      var tierEl = document.getElementById('bmh-checkout-tier');
      var coupEl = document.getElementById('bmh-checkout-coupon');
      var sumEl = document.getElementById('bmh-checkout-summary-text');
      var btnEl = document.getElementById('bmh-checkout-submit-btn');
      var tid = tierEl ? tierEl.value : 'tier1';
      var pkg = BMH_PACKAGES[tid] || BMH_PACKAGES.tier1;
      var code = ((coupEl && coupEl.value) ? coupEl.value : '').trim().toUpperCase();
      var hasDiscount = (code === 'FIRST25' || code === 'ALOHA' || code === 'VIP108');
      var finalPrice = hasDiscount ? pkg.first25Price : pkg.listPrice;
      var saved = pkg.listPrice - finalPrice;

      if (sumEl) {
        if (pkg.listPrice === 0) {
          sumEl.innerHTML = '<strong>Order Summary:</strong> ' + pkg.name + ' · <strong>Total Due: $0.00 (Unlocks Code FIRST25)</strong>';
        } else if (saved > 0) {
          sumEl.innerHTML = '<strong>Order Summary:</strong> ' + pkg.name + ' · List $' + pkg.listPrice + '.00 · Coupon <code>' + code + '</code> (-$' + saved + '.00) · <strong>Total Due: $' + finalPrice + '.00</strong>';
        } else {
          sumEl.innerHTML = '<strong>Order Summary:</strong> ' + pkg.name + ' · <strong>Total Due: $' + finalPrice + '.00</strong> (Enter <code>FIRST25</code> to save)';
        }
      }
      if (btnEl) {
        btnEl.textContent = finalPrice === 0 ? 'Claim Free Pack ($0)' : ('Complete Order ($' + finalPrice + ')');
      }
      return { pkg: pkg, code: code, hasDiscount: hasDiscount, finalPrice: finalPrice, saved: saved };
    }

    function applyBmhCoupon(code) {
      var coupEl = document.getElementById('bmh-checkout-coupon');
      if (coupEl) coupEl.value = code || 'FIRST25';
      recalcBmhCheckout();
    }

    function selectBmhCheckoutTier(tierId, couponCode) {
      var tierEl = document.getElementById('bmh-checkout-tier');
      var coupEl = document.getElementById('bmh-checkout-coupon');
      if (tierEl) tierEl.value = tierId;
      if (coupEl && couponCode) coupEl.value = couponCode;
      recalcBmhCheckout();
      var box = document.getElementById('instant-checkout');
      if (box && box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function submitBmhCheckout(ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      var state = recalcBmhCheckout();
      var name = ((document.getElementById('bmh-checkout-name') || {}).value || '').trim() || 'Studio Buyer';
      var email = ((document.getElementById('bmh-checkout-email') || {}).value || '').trim() || 'buyer@bestofmusthave.com';
      var channel = ((document.getElementById('bmh-checkout-channel') || {}).value || 'direct-instant');
      var orderId = 'BMH-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
      var refPartner = '';
      try {
        var qp = new URLSearchParams(window.location.search || '');
        refPartner = (qp.get('ref') || qp.get('aff') || localStorage.getItem('ee_aff_ref__evolveearth_ecosystem') || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
      } catch (e) {}

      var order = {
        order_id: orderId,
        timestamp: new Date().toISOString(),
        site: 'BESTOFMUSTHAVE.COM',
        product_family: 'AI PowerToys (Main Flagship Product)',
        tier_id: state.pkg.id,
        tier_name: state.pkg.name,
        list_price_usd: state.pkg.listPrice,
        discount_usd: state.saved,
        total_paid_usd: state.finalPrice,
        coupon_code: state.code || 'NONE',
        buyer_name: name,
        buyer_email: email,
        channel: channel,
        ref_partner: refPartner || 'DIRECT',
        stripe_account: 'acct_1SphK2GeMRugIGuL (Evolve Earth LLC · Best of Must Have)',
        n8n_webhook: 'https://n8n.evolveearth.com/webhook/stripe-payments-log (NuZFbTdK26z8aQbz)',
        zip_download: state.pkg.zipUrl,
        github_release: 'https://github.com/onecoded/ai-powertoys/releases/tag/v2.0-latest'
      };

      try {
        var orders = JSON.parse(localStorage.getItem('bomh_orders') || '[]');
        orders.unshift(order);
        localStorage.setItem('bomh_orders', JSON.stringify(orders.slice(0, 100)));
      } catch (e) {}

      var receiptLines = [
        'BESTOFMUSTHAVE.COM — OFFICIAL AI POWERTOYS ORDER RECEIPT',
        'Order ID:       ' + order.order_id,
        'Timestamp:      ' + order.timestamp,
        'Buyer:          ' + order.buyer_name + ' <' + order.buyer_email + '>',
        'Package:        ' + order.tier_name,
        'Coupon Applied: ' + order.coupon_code + ' (Saved $' + order.discount_usd + '.00)',
        'Total Paid:     $' + order.total_paid_usd + '.00 USD (' + order.channel + ')',
        'Stripe Account: ' + order.stripe_account,
        'n8n Webhook:    ' + order.n8n_webhook,
        'Local .zip:     ' + order.zip_download,
        'GitHub Release: ' + order.github_release
      ].join('\n');

      var recBox = document.getElementById('bmh-checkout-receipt-box');
      var recPre = document.getElementById('bmh-receipt-pre');
      var recBtn = document.getElementById('bmh-receipt-download-btn');
      var recStripeBtn = document.getElementById('bmh-receipt-stripe-btn');
      var recHead = document.getElementById('bmh-receipt-heading');
      if (recPre) recPre.textContent = receiptLines;
      if (recBtn) recBtn.setAttribute('href', state.pkg.zipUrl);
      if (recHead) recHead.textContent = 'Order ' + order.order_id + ' Confirmed ($' + order.total_paid_usd + ')';
      if (recBox) recBox.hidden = false;

      fetch('http://127.0.0.1:8655/api/bestofmusthave-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.order && res.order.stripe_payment_link_url && recStripeBtn) {
            recStripeBtn.setAttribute('href', res.order.stripe_payment_link_url);
          }
        })
        .catch(function () {});

      if (refPartner) {
        var bmhOfferMap = { free: 'BMH-POWERTOYS-FREE', tier1: 'BMH-POWERTOYS-T1', tier2: 'BMH-POWERTOYS-T2', tier3: 'BMH-POWERTOYS-T3' };
        fetch('http://127.0.0.1:8655/api/infinite-affiliates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'event',
            event_type: state.finalPrice > 0 ? 'sale' : 'signup',
            offer_id: bmhOfferMap[state.pkg.id] || 'BMH-POWERTOYS-T1',
            direct_handle: refPartner,
            buyer_email: email,
            gross_usd: state.pkg.listPrice,
            net_basis_usd: state.finalPrice,
            note: 'Best of Must Have checkout ' + orderId
          })
        }).catch(function () {});
      }

      return false;
    }

    function runBmhDemoBuyerTest() {
      var n = document.getElementById('bmh-checkout-name');
      var e = document.getElementById('bmh-checkout-email');
      var t = document.getElementById('bmh-checkout-tier');
      var c = document.getElementById('bmh-checkout-coupon');
      if (n && !n.value) n.value = 'Joseph (Review Test)';
      if (e && !e.value) e.value = 'peacepromoter@gmail.com';
      if (t) t.value = 'tier1';
      if (c) c.value = 'FIRST25';
      submitBmhCheckout();
    }

    function copyBmhOrderReceipt() {
      var recPre = document.getElementById('bmh-receipt-pre');
      if (recPre && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(recPre.textContent);
      }
    }

    var BMH_STATE = { cat: 'studio', criterion: 'roi' };
    var BMH_ITEMS = [
      {
        cat: 'studio',
        criterion: 'roi',
        rank: '01 · MAIN FLAGSHIP PRODUCT',
        title: 'AI PowerToys: 14 Tools for AI Agents & 6-Module Academy',
        verdict: 'Score: 100/100 · Universal High-DPI Drag Bridge (:7885), AI Login Valet (:7887) + Bitwarden Cleaner + ;2fa / ;door, Machine-Identity Wall (;who), PromptGenesis (;prom0/;prom1), and 120 SOPs.',
        why: 'Gives Claude, Cursor, and desktop AI agents reliable hands, auto-login, and zero permission popups across every Windows 11 app ($9 with code FIRST25 / $79 Bundle / $297 Course).',
        buyTier: 'tier1'
      },
      {
        cat: 'studio',
        criterion: 'bifl',
        rank: '02 · WORKSTATION COMPUTE',
        title: 'Dual-GPU Local AI Rig (RTX 4090 24GB + RTX 3080 10GB)',
        verdict: 'Score: 99/100 · Runs SDXL/Juggernaut XL, Wan 2.2 Video, ACE-Step Music, and 32B local LLMs at $0 marginal cost with 100% privacy.',
        why: 'Eliminates $1,000+/mo in cloud GPU rental fees while keeping every creative asset on local NVMe storage.'
      },
      {
        cat: 'studio',
        criterion: 'sovereign',
        rank: '03 · VOCAL & NETWORK CHAIN',
        title: 'Broadcast Dynamic Cardioid Mic + Dual-Wi-Fi/RJ45 Failover',
        verdict: 'Score: 98/100 · Studio-booth vocal warmth in untreated rooms paired with zero-drop CAT6 + USB 3.0 root-hub networking.',
        why: 'Keeps overnight AI generation and -16 LUFS broadcast narration running 24/7 with zero packet drop.'
      },
      {
        cat: 'offgrid',
        criterion: 'bifl',
        rank: '04 · OFF-GRID ENERGY',
        title: '48V LiFePO4 Rack Battery + Victron Pure Sine Inverter',
        verdict: 'Score: 99/100 · 6,000+ deep cycles (15+ years daily use) with zero cobalt thermal runaway risk.',
        why: 'Modular, field-serviceable, and programmable 100% offline via direct Bluetooth and VE.Direct.'
      },
      {
        cat: 'offgrid',
        criterion: 'sovereign',
        rank: '05 · WATER PURITY',
        title: 'Gravity-Fed Stainless Chamber + Ceramic/Carbon Elements',
        verdict: 'Score: 98/100 · Turns rainwater or stream water into mineral-clean drinking water with zero moving parts.',
        why: 'Cleanable ceramic outer shell can be scrubbed hundreds of times in the field.'
      },
      {
        cat: 'offgrid',
        criterion: 'roi',
        rank: '06 · MOBILE COOLING & COOKING',
        title: '12V/24V Secop Chest Fridge + Cast-Iron Induction Cooktop',
        verdict: 'Score: 96/100 · Sip-level 35W average solar draw with lifetime cast-iron thermal mass.',
        why: 'Runs effortlessly off a single 400W roof solar panel day and night.'
      },
      {
        cat: 'wellness',
        criterion: 'bifl',
        rank: '07 · LIVING ENZYME NUTRITION',
        title: '80 RPM Slow-Masticating Stainless Wheatgrass & Root Juicer',
        verdict: 'Score: 98/100 · Cold extraction preserves living chlorophyll, enzymes, and trace minerals without oxidation.',
        why: 'Processes wheatgrass, ginger, turmeric, and celery with a 15-year motor warranty.'
      },
      {
        cat: 'wellness',
        criterion: 'sovereign',
        rank: '08 · SOUND HEALING & VAGAL TONE',
        title: '432 Hz / 528 Hz Hand-Hammered Tibetan Seven-Metal Bowl Set',
        verdict: 'Score: 97/100 · Rich 90-second sustain with harmonic overtones for somatic nervous-system reset.',
        why: 'Pure acoustic resonance that entrains breath and heart-rate variability in under 3 minutes.'
      },
      {
        cat: 'wellness',
        criterion: 'roi',
        rank: '09 · CIRCADIAN & SLEEP RECOVERY',
        title: 'Silver-Thread Earthing Mat + Zero-Blue Amber Night Lamps',
        verdict: 'Score: 95/100 · Protects pineal melatonin production after sunset and grounds static voltage.',
        why: 'Immediate improvement in deep-sleep architecture for under $80.'
      },
      {
        cat: 'homestead',
        criterion: 'bifl',
        rank: '10 · SOIL AERATION',
        title: 'Forged Chromoly 5-Tine Broadfork & Garden Claw',
        verdict: 'Score: 99/100 · Aerates compacted subsoil to 14 inches without inverting mycorrhizal fungal networks.',
        why: 'Indestructible one-piece welded chromoly steel that outlasts rototillers by decades.'
      },
      {
        cat: 'homestead',
        criterion: 'roi',
        rank: '11 · MICROBIAL SOIL MULTIPLIER',
        title: '5-Gallon Vortex Compost Tea Brewer + Kelp/Humic Pack',
        verdict: 'Score: 97/100 · Multiplies aerobic beneficial microbes 1,000x in 24 hours using 1.5 lbs of compost.',
        why: 'Replaces synthetic fertilizers across 5 acres for pennies per brew.'
      },
      {
        cat: 'homestead',
        criterion: 'sovereign',
        rank: '12 · SEED VAULT PRESERVATION',
        title: 'Amber Borosilicate Hermetic Jars + Indicating Silica',
        verdict: 'Score: 98/100 · Keeps heirloom seeds viable for 10 to 25+ years in cool, dry, dark storage.',
        why: 'Oven-reactivated silica beads change color when saturated so your seed bank never molds.'
      }
    ];

    function goBmhStep(n) {
      [1, 2, 3].forEach(function (i) {
        var p = document.getElementById('bmh_panel_' + i);
        var t = document.getElementById('bmh_tab_' + i);
        if (p) p.hidden = (i !== n);
        if (t) {
          if (i === n) t.classList.remove('btn--quiet');
          else t.classList.add('btn--quiet');
        }
      });
      if (n === 3) renderBmhWinner();
    }

    function pickBmhCategory(cat, advance) {
      BMH_STATE.cat = cat;
      renderBmhGrid();
      if (advance) goBmhStep(2);
    }

    function setBmhCriterion(crit) {
      BMH_STATE.criterion = crit;
      goBmhStep(3);
    }

    function renderBmhWinner() {
      var matches = BMH_ITEMS.filter(function (x) { return x.cat === BMH_STATE.cat; });
      var top = matches.find(function (x) { return x.criterion === BMH_STATE.criterion; }) || matches[0];
      var box = document.getElementById('bmh_winner_spotlight');
      if (!box || !top) return;
      box.innerHTML =
        '<span class="label">' + top.rank + '</span>' +
        '<h3 class="h3">' + top.title + '</h3>' +
        '<p><strong>' + top.verdict + '</strong></p>' +
        '<p>' + top.why + '</p>';
    }

    function renderBmhGrid() {
      var qEl = document.getElementById('bmh_search');
      var q = qEl ? (qEl.value || '').toLowerCase() : '';
      var rows = BMH_ITEMS.filter(function (x) {
        if (!q) return true;
        return (x.title + ' ' + x.verdict + ' ' + x.why + ' ' + x.rank).toLowerCase().indexOf(q) !== -1;
      });
      var grid = document.getElementById('bmh_grid');
      if (!grid) return;
      grid.innerHTML = rows.map(function (x) {
        var actionHtml = x.buyTier
          ? '<div class="row"><button type="button" class="btn btn--sm" onclick="selectBmhCheckoutTier(\'tier1\',\'FIRST25\')">Buy Now ($9 FIRST25)</button><a class="btn btn--quiet btn--sm" href="BESTOFMUSTHAVE-UNIVERSAL-AI-DRAG-SQUEEZE.html">Open Squeeze Page</a></div>'
          : '';
        return '<article class="card stack">' +
          '<span class="label">' + x.rank + '</span>' +
          '<h3 class="h3">' + x.title + '</h3>' +
          '<p><strong>' + x.verdict + '</strong></p>' +
          '<p>' + x.why + '</p>' +
          actionHtml +
          '</article>';
      }).join('');
    }

    recalcBmhCheckout();
    renderBmhGrid();
    renderBmhWinner();
