(function ($) {
	"use strict";

	// Sticky menu
	var $window = $(window);
	$window.on('scroll', function () {
		var scroll = $window.scrollTop();
		if (scroll < 300) {
			$(".sticky").removeClass("is-sticky");
		} else {
			$(".sticky").addClass("is-sticky");
		}
	});



	fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });

	fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;
    });

	


	///shoppage and product  page js start here
// Updated Product Page Script
let products = [];

const API_URL = "https://silver-crown-creation-main-1.onrender.com/api/products/";

// Fetch products from API
async function fetchProducts() {
  try {
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store' // ✅ Prevents browser and CDN caching
    });

    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}


// Load products and initialize pages
async function loadProductsFromAPI() {
  try {
    products = await fetchProducts();

    const shopPage = document.getElementById("shop-products");
    const detailPage = document.getElementById("product-name");

    if (shopPage) {
      generateShopCards(products);
      setupFilters();
    }

    if (detailPage) {
      const savedIndex = localStorage.getItem("productIndex");
      if (savedIndex !== null) {
        loadProduct(savedIndex);
      }
    }
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

// Generate product cards for shop page
function generateShopCards(filteredList = products) {
  const container = document.getElementById("shop-products");
  if (!container) return;

  container.innerHTML = '';

  filteredList.forEach((product, index) => {
    const imageSrc = product.thumbnail || 'assets/images/placeholder.jpg';
    const discountBadge = product.discount ? 
      `<div class="product-label discount"><span>${product.discount}</span></div>` : '';

    const card = document.createElement("div");
    card.className = "col-md-4 col-sm-6 mb-4";
    card.innerHTML = `
      <div class="product-item">
        <figure class="product-thumb">
          <a href="product-details.html" onclick="localStorage.setItem('productIndex', ${index})">
            <img class="pri-img" src="${imageSrc}" alt="${product.name}">
            <img class="sec-img" src="${imageSrc}" alt="${product.name}">
          </a>
          <div class="product-badge">
            <div class="product-label new"><span>new</span></div>
            ${discountBadge}
          </div>
        </figure>
        <div class="product-caption text-center">
          <div class="product-identity">
            <p class="manufacturer-name">Silver</p>
          </div>
          <h6 class="product-name">
            <a href="product-details.html" onclick="localStorage.setItem('productIndex', ${index})">
              ${product.name}
            </a>
          </h6>
          <div class="price-box">
            <span class="price-regular">₹${product.price}</span>
          </div>
          <button class="btn btn-hero btn-primary mt-2 add-to-cart-btn" data-index="${index}">
            <i class="fa fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>`;
    container.appendChild(card);
  });

  setupAddToCartButtons();
}

function setupAddToCartButtons() {
  document.addEventListener('click', function(e) {
    const button = e.target.closest('.add-to-cart-btn');
    if (button) {
      e.preventDefault();
      const index = button.dataset.index;
      addProductToCart(index);
    }
  });
}

function addProductToCart(index) {
  if (!products[index]) return;

  const product = products[index];
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingIndex = cart.findIndex(
    item => item.name === product.name &&
           (item.size || '') === (product.size || '') &&
           (item.color || '') === (product.color || '')
  );

  if (existingIndex === -1) {
    cart.push({ ...product, quantity: 1 });
  } else {
    cart[existingIndex].quantity += 1;
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = 'cart.html';
}

function setupFilters() {
  const sizeCheckboxes = document.querySelectorAll(".size-filter");
  const colorCheckboxes = document.querySelectorAll(".color-filter");

  function updateFilters() {
    const selectedSizes = Array.from(sizeCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const selectedColors = Array.from(colorCheckboxes).filter(cb => cb.checked).map(cb => cb.value);

    let filtered = products;

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => selectedSizes.includes(product.size));
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => selectedColors.includes(product.color));
    }

    generateShopCards(filtered);
  }

  sizeCheckboxes.forEach(cb => cb.addEventListener("change", updateFilters));
  colorCheckboxes.forEach(cb => cb.addEventListener("change", updateFilters));
}

async function loadProduct(index) {
  if (!products[index]) return;

  const product = products[index];

  document.getElementById("product-name").textContent = product.name;
  document.getElementById("price").textContent = "₹" + product.price;
  document.getElementById("description").textContent = product.description || 'No description available';
  document.getElementById("stock").textContent = product.stock || 'In Stock';

  const mainImage = product.images?.[0]?.image || product.thumbnail || 'assets/images/placeholder.jpg';
  document.getElementById("main-images").innerHTML = `<img src="${mainImage}" id="main-image" />`;

  const thumbs = document.getElementById("thumbs");
  thumbs.innerHTML = '';
  if (product.images && product.images.length > 0) {
    product.images.forEach((img, i) => {
      const thumb = document.createElement("div");
      thumb.className = "pro-nav-thumb";
      thumb.innerHTML = `<img src="${img.image}" data-src="${img.image}" ${i === 0 ? 'class="active"' : ''} />`;
      thumbs.appendChild(thumb);
    });
  }

  const stars = Math.min(5, Math.max(0, Math.round(product.rating || 0)));
  document.getElementById("rating-stars").innerHTML =
    '<span>' + '★'.repeat(stars) + '☆'.repeat(5 - stars) + '</span>';

  const rawNumber = product.whatsapp || '';
  const phone = rawNumber.replace(/[^0-9]/g, '');
  const whatsappBtn = document.getElementById("enquire-btn");
  if (whatsappBtn && phone) {
    whatsappBtn.href = `https://wa.me/${phone}`;
    whatsappBtn.style.display = 'inline-block';
  } else if (whatsappBtn) {
    whatsappBtn.style.display = 'none';
  }

  const detailsAddToCartBtn = document.getElementById('details-add-to-cart-btn');
  if (detailsAddToCartBtn) {
    detailsAddToCartBtn.onclick = (e) => {
      e.preventDefault();
      addProductToCart(index);
    };
  }
}

function setupThumbnailNavigation() {
  const thumbsContainer = document.getElementById("thumbs");
  if (thumbsContainer) {
    thumbsContainer.addEventListener("click", function(e) {
      if (e.target.tagName === "IMG") {
        const src = e.target.dataset.src;
        document.getElementById("main-image").src = src;
        document.querySelectorAll(".pro-nav-thumb img").forEach(img => img.classList.remove("active"));
        e.target.classList.add("active");
      }
    });
  }
}

function setupWhatsAppButton() {
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      generateWhatsAppLink(cart);
    });
  }
}

function generateWhatsAppLink(cart) {
  if (!cart.length) {
    alert('Your cart is empty!');
    return;
  }

  let message = "Hello! I'm interested in these products:\n\n";
  let total = 0;

  cart.forEach(item => {
    message += `- ${item.name} (${item.quantity}x) - ₹${item.price * item.quantity}\n`;
    total += item.price * item.quantity;
  });

  message += `\nTotal: ₹${total}\n`;
  message += "Please let me know about availability and payment options.";

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}

document.addEventListener("DOMContentLoaded", () => {
  loadProductsFromAPI();
  setupThumbnailNavigation();
  setupWhatsAppButton();
});






document.addEventListener("DOMContentLoaded", async () => {
  const shopPage = document.getElementById("shop-products");
  const detailPage = document.getElementById("product-name");

  if (!shopPage && !detailPage) return;

  let products = [];
  try {
    const response = await fetch("https://silver-crown-creation-main-1.onrender.com/api/products/");
    products = await response.json();
  } catch (err) {
    console.error("API fetch failed:", err);
    return;
  }

  if (shopPage) {
    generateShopCards(products);
    setupAddToCartButtons();
    setupFilters();
  }

  if (detailPage) {
    const idx = localStorage.getItem("productIndex");
    if (idx !== null && products[+idx]) {
      loadProduct(products, +idx);
    }
  }
})


	// tooltip active js
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})

	// Background Image JS start
	var bgSelector = $(".bg-img");
	bgSelector.each(function (index, elem) {
		var element = $(elem),
			bgSource = element.data('bg');
		element.css('background-image', 'url(' + bgSource + ')');
	});


	// Off Canvas Open close
	$(".mobile-menu-btn").on('click', function () {
		$("body").addClass('fix');
		$(".off-canvas-wrapper").addClass('open');
	});

	$(".btn-close-off-canvas,.off-canvas-overlay").on('click', function () {
		$("body").removeClass('fix');
		$(".off-canvas-wrapper").removeClass('open');
	});

	// offcanvas mobile menu
    var $offCanvasNav = $('.mobile-menu'),
        $offCanvasNavSubMenu = $offCanvasNav.find('.dropdown');
    
    /*Add Toggle Button With Off Canvas Sub Menu*/
    $offCanvasNavSubMenu.parent().prepend('<span class="menu-expand"><i></i></span>');
    
    /*Close Off Canvas Sub Menu*/
    $offCanvasNavSubMenu.slideUp();
    
    /*Category Sub Menu Toggle*/
    $offCanvasNav.on('click', 'li a, li .menu-expand', function(e) {
        var $this = $(this);
        if ( ($this.parent().attr('class').match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/)) && ($this.attr('href') === '#' || $this.hasClass('menu-expand')) ) {
            e.preventDefault();
            if ($this.siblings('ul:visible').length){
                $this.parent('li').removeClass('active');
                $this.siblings('ul').slideUp();
            } else {
                $this.parent('li').addClass('active');
                $this.closest('li').siblings('li').removeClass('active').find('li').removeClass('active');
                $this.closest('li').siblings('li').find('ul:visible').slideUp();
                $this.siblings('ul').slideDown();
            }
        }
	});
	

	// hero slider active js
	$('.hero-slider-active').slick({
		fade: true,
		speed: 1000,
		dots: false,
		autoplay: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="pe-7s-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="pe-7s-angle-right"></i></button>',
		responsive: [{
			breakpoint: 992,
			settings: {
				arrows: false,
				dots: true
			}
		}]
	});

	// Hero main slider active js
    $('.hero-slider-active-4').slick({
		autoplay: true,
		speed: 1000,
        arrows: false,
        slidesToShow: 4,
        responsive: [{
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
            }
        },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
					slidesToShow: 1,
					dots: true
                }
            }
        ]
    });


	// product carousel active js
	$('.product-carousel-4').slick({
		speed: 1000,
		autoplay: true,
		slidesToShow: 4,
		adaptiveHeight: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="pe-7s-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="pe-7s-angle-right"></i></button>',
		responsive: [{
			breakpoint: 992,
			settings: {
				slidesToShow: 3
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				arrows: false
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				arrows: false
			}
		}]
	});


	// product carousel active
	$('.product-carousel-4_2').slick({
		speed: 1000,
		slidesToShow: 4,
		autoplay: true,
		rows: 2,
		adaptiveHeight: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="pe-7s-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="pe-7s-angle-right"></i></button>',
		responsive: [{
			breakpoint: 992,
			settings: {
				slidesToShow: 3
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				arrows: false,
				rows: 1
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				arrows: false,
				rows: 1
			}
		}]
	});


	// product banner active js
	$('.product-banner-carousel').slick({
		autoplay: true,
		speed: 1000,
		arrows: false,
		slidesToShow: 4,
		adaptiveHeight: true,
		responsive: [{
			breakpoint: 992,
			settings: {
				slidesToShow: 3
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1
			}
		}]
	});

//timer

  document.addEventListener("DOMContentLoaded", function () {
    const countdownEl = document.querySelector(".product-countdown");
    const resetEvery24Hours = false; // Change to true to reset daily

    let deadline = new Date(countdownEl.getAttribute("data-countdown")).getTime();

    const update = () => {
      const now = new Date().getTime();
      let t = deadline - now;

      if (t < 0) {
        clearInterval(interval);

        // Add fade-out animation
        countdownEl.classList.add("fade-out");


        // After animation, show "Time Expired" message
        setTimeout(() => {
			countdownEl.classList.remove("fade-out"); // Remove animation (optional)
			countdownEl.innerHTML = `
				<div style="text-align: center; font-weight: bold; font-size: 18px; color: red;">
				⏰ Time Expired
				</div>
			`;
			}, 1000);

        // Reset countdown if enabled
        if (resetEvery24Hours) {
          deadline = now + 24 * 60 * 60 * 1000; // 24 hours from now
          countdownEl.classList.remove("fade-out");
          interval = setInterval(update, 1000);
        }

        return;
      }

      const days = Math.floor(t / (1000 * 60 * 60 * 24));
      const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((t % (1000 * 60)) / 1000);

      document.getElementById("day").textContent = days;
      document.getElementById("hour").textContent = hours;
      document.getElementById("minute").textContent = minutes;
      document.getElementById("second").textContent = seconds;
    };

    let interval = setInterval(update, 1000);
    update();
  });


//rating
document.addEventListener("DOMContentLoaded",function(){

  document.querySelectorAll(".ratings").forEach(function(box){

    const rating = parseFloat(box.dataset.rating) || 0;   // e.g. 3.5
    const stars  = box.querySelectorAll("i");

    stars.forEach(function(star,index){
      const starNumber = index + 1;                       // 1..5

      if (rating >= starNumber){                          // full star
        star.classList.remove("fa-star-o");
        star.classList.add   ("fa-star");
      }
      else if (rating > index && rating < starNumber){    // half star
        star.classList.remove("fa-star-o");
        star.classList.add   ("fa-star-half-o");
      }
      /* else leave as empty star */
    });

  });

});


   
document.querySelectorAll(".color-circle").forEach(function(colorCircle) {
  colorCircle.addEventListener("click", function(e) {
    e.preventDefault();

    // Remove previous selection
    document.querySelectorAll(".color-circle").forEach(c => c.classList.remove("selected"));
    this.classList.add("selected");

    // Update selectedColor
    selectedColor = this.getAttribute("data-color");

    // Optional: update image preview
    const imgSrc = this.getAttribute("data-image");
    if (imgSrc) {
      document.getElementById("productImage").src = imgSrc;
    }
  });
});





	// group product carousel active
	$('.group-list-carousel').each(function () {
		var $this = $(this);
		var $arrowContainer = $(this).parent().siblings('.section-title-append').find('.slick-append');
		$this.slick({
			infinite: true,
			rows: 4,
			prevArrow: '<button type="button" class="slick-prev"><i class="pe-7s-angle-left"></i></button>',
			nextArrow: '<button type="button" class="slick-next"><i class="pe-7s-angle-right"></i></button>',
			appendArrows: $arrowContainer,
			responsive: [{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
				}
			}]
		});
	});


	// blog carousel active start
	$('.group-list-carousel--3').slick({
		autoplay: true,
		speed: 1000,
		rows: 3,
		slidesToShow: 3,
		adaptiveHeight: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="pe-7s-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="pe-7s-angle-right"></i></button>',
		responsive: [{
			breakpoint: 992,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: 768,
			settings: {
				arrows: false,
				slidesToShow: 1
			}
		}]
	});

	// blog carousel active start
	$('.blog-carousel-2').slick({
		speed: 1000,
		dots: true,
		arrows: false,
		autoplay: true,
	});


	// testimonial cariusel active js
	$('.testimonial-content-carousel').slick({
        arrows: false,
        asNavFor: '.testimonial-thumb-carousel'
    });


    // product details slider nav active
    $('.testimonial-thumb-carousel').slick({
        slidesToShow: 3,
        asNavFor: '.testimonial-content-carousel',
		centerMode: true,
		arrows: false,
        centerPadding: 0,
		focusOnSelect: true
	});


	// blog carousel active
	$('.blog-carousel-active').slick({
		autoplay: true,
		speed: 1000,
		slidesToShow: 3,
		adaptiveHeight: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="pe-7s-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="pe-7s-angle-right"></i></button>',
		responsive: [{
			breakpoint: 992,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: 768,
			settings: {
				arrows: false,
				slidesToShow: 1
			}
		}]
	});


	//  Hot deals carousel active start
	$('.deals-carousel-active').slick({
		autoplay: true,
		speed: 1000,
		slidesToShow: 3,
		adaptiveHeight: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="pe-7s-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="pe-7s-angle-right"></i></button>',
		responsive: [{
			breakpoint: 992,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: 768,
			settings: {
				arrows: false,
				slidesToShow: 2
			}
		},
		{
			breakpoint: 576,
			settings: {
				arrows: false,
				slidesToShow: 1
			}
		}]
	});

	//  Hot deals carousel active start
	$('.deals-carousel-active--two').slick({
		autoplay: true,
		speed: 1000,
		slidesToShow: 4,
		adaptiveHeight: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="pe-7s-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="pe-7s-angle-right"></i></button>',
		responsive: [{
			breakpoint: 992,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: 768,
			settings: {
				arrows: false,
				slidesToShow: 2
			}
		},
		{
			breakpoint: 576,
			settings: {
				arrows: false,
				slidesToShow: 1
			}
		}]
	});


	// brand logo carousel active js
	$('.brand-logo-carousel').slick({
		speed: 1000,
		slidesToShow: 5,
		adaptiveHeight: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="pe-7s-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="pe-7s-angle-right"></i></button>',
		responsive: [{
			breakpoint: 1200,
			settings: {
				slidesToShow: 4
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 3,
				arrows: false
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				arrows: false
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				arrows: false
			}
		}]
	});

	// product details slider active
    $('.product-large-slider').slick({
        fade: true,
		arrows: false,
		speed: 1000,
        asNavFor: '.pro-nav'
    });


    // product details slider nav active
    $('.pro-nav').slick({
        slidesToShow: 4,
        asNavFor: '.product-large-slider',
		centerMode: true,
		speed: 1000,
        centerPadding: 0,
		focusOnSelect: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="lnr lnr-chevron-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="lnr lnr-chevron-right"></i></button>',
		responsive: [{
			breakpoint: 576,
			settings: {
				slidesToShow: 3,
			}
		}]
	});


	//nice select active start
	$('select').niceSelect();


	// Image zoom effect
	$('.img-zoom').zoom();


	// offcanvas minicart button js
	$(".minicart-btn").on('click', function(){
		$("body").addClass('fix');
		$(".minicart-inner").addClass('show')
	})

	$(".offcanvas-close, .minicart-close,.offcanvas-overlay").on('click', function(){
		$("body").removeClass('fix');
		$(".minicart-inner").removeClass('show')
	})


	// Data countdown active js
	$('[data-countdown]').each(function () {
		var $this = $(this),
			finalDate = $(this).data('countdown');
		$this.countdown(finalDate, function (event) {
			$this.html(event.strftime('<div class="single-countdown"><span class="single-countdown__time">%D</span><span class="single-countdown__text">Days</span></div><div class="single-countdown"><span class="single-countdown__time">%H</span><span class="single-countdown__text">Hours</span></div><div class="single-countdown"><span class="single-countdown__time">%M</span><span class="single-countdown__text">Mins</span></div><div class="single-countdown"><span class="single-countdown__time">%S</span><span class="single-countdown__text">Secs</span></div>'));
		});
	});

	// quantity change js
    $('.pro-qty').prepend('<span class="dec qtybtn">-</span>');
    $('.pro-qty').append('<span class="inc qtybtn">+</span>');
    $('.qtybtn').on('click', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
	});


	// product view mode change js
    $('.product-view-mode a').on('click', function (e) {
        e.preventDefault();
        var shopProductWrap = $('.shop-product-wrap');
        var viewMode = $(this).data('target');
        $('.product-view-mode a').removeClass('active');
        $(this).addClass('active');
        shopProductWrap.removeClass('grid-view list-view').addClass(viewMode);
	})
	
	
	// pricing filter
	var rangeSlider = $(".price-range"),
		amount = $("#amount"),
		minPrice = rangeSlider.data('min'),
		maxPrice = rangeSlider.data('max');
	rangeSlider.slider({
		range: true,
		min: minPrice,
		max: maxPrice,
		values: [minPrice, maxPrice],
		slide: function (event, ui) {
			amount.val("$" + ui.values[0] + " - $" + ui.values[1]);
		}
	});
	amount.val(" $" + rangeSlider.slider("values", 0) +
		" - $" + rangeSlider.slider("values", 1)
	);


	// Checkout Page accordion
    $("#create_pwd").on("change", function () {
        $(".account-create").slideToggle("100");
    });

    $("#ship_to_different").on("change", function () {
        $(".ship-to-different").slideToggle("100");
	});
	

    // Payment Method Accordion
    $('input[name="paymentmethod"]').on('click', function () {
        var $value = $(this).attr('value');
        $('.payment-method-details').slideUp();
        $('[data-method="' + $value + '"]').slideDown();
	});


	// Scroll to top active js
	$(window).on('scroll', function () {
		if ($(this).scrollTop() > 600) {
			$('.scroll-top').removeClass('not-visible');
		} else {
			$('.scroll-top').addClass('not-visible');
		}
	});
	$('.scroll-top').on('click', function (event) {
		$('html,body').animate({
			scrollTop: 0
		}, 1000);
	});
	

	// Search trigger js
	$(".search-trigger").on('click', function(){
		$(".header-search-box").toggleClass('search-box-open');
	})


	// Mail-chimp for dynamic newsletter
    $('#mc-form').ajaxChimp({
        language: 'en',
        callback: mailChimpResponse,
        // ADD YOUR MAILCHIMP URL BELOW HERE!
        url: 'https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef'

    });

    // mail-chimp active js
    function mailChimpResponse(resp) {
        if (resp.result === 'success') {
            $('.mailchimp-success').html('' + resp.msg).fadeIn(900);
            $('.mailchimp-error').fadeOut(400);

        } else if (resp.result === 'error') {
            $('.mailchimp-error').html('' + resp.msg).fadeIn(900);
        }
	}
	

	// Instagram feed carousel active
	$('.instagram-carousel').slick({
		slidesToShow: 6,
		slidesToScroll: 2,
		autoplay: true,
		speed: 1000,
		dots: false,
		arrows: false,
		responsive: [{
				breakpoint: 480,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 4,
				}
			}
		]
	})
	
})(jQuery);

