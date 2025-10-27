var logStyle = 'color: yellow; background-color: black; font-weight: bold; '

// Initialize Optimizely
var optimizelyClient = window.optimizelySdk.createInstance({
    datafile: window.optimizelyDatafile,
    // other options
    eventBatchSize: 10,
    eventFlushInterval: 1000
});

// Prepare user attributes
// Check if the user is on a mobile device. This is not the most reliable method but sufficient for demo purposes.
var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Check if the user is logged in. For this demo, we use a simple cookie to store the logged_in status
function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
}

// Create the user attributes object
var loggedIn = getCookie('logged_in');
var attributes = {
    logged_in: Boolean(loggedIn),
    mobile: Boolean(mobile)
};

// Set user ID
var userId = getCookie('userId');

// Create user context with the userId and attributes
var user = optimizelyClient.createUserContext(userId, attributes);

// Get all decisions for this user
var decisions = user.decideAll();


// ### START Carousel experiment & targeted rollout ###
// Depending on the bucketing decision for an A/B test and Targeted Rollout, show/hide the carousel feature

// Get the decision for the carousel feature
var carouselDecision = decisions['carousel'];

// Get the "enabled" status and the carousel speed
var carouselEnabled = carouselDecision['enabled'];
var carouselSpeed = carouselDecision.variables['carousel_speed'];

// console-logging some variables for troublehooting / demo purposes
console.log("%c carouselEnabled: " + carouselEnabled, logStyle);
console.log("%c carouselSpeed: " + carouselSpeed, logStyle);

// Show / hide the carousel
if (carouselEnabled) {
    $('.carousel-indicators').show();
    $('#carousel-controls').show();
} else {
    $('.carousel-indicators').hide();
    $('#carousel-controls').hide();
}
// And set the carousel speed
$('#product_details_slider').carousel({
    interval: carouselSpeed
});

// Tracking the Add to Cart event - this function is called upon clicking the CTA
function trackAddToCartEvent(quantity) {
    console.log("%c Tracking 'add_to_cart' event with quantity: " + quantity, logStyle);
    var tags = {
        value: quantity
    };
    user.trackEvent("add_to_cart", tags);
}


// ####   START Discount CTA Multi-armed-bandit   #####
// Depending on the bucketing decision for a Mult-Armed-Bandit rule, show/hide the Discount CTA

// Get the decision for the Discount CTA feature
var discountCtaDecision = decisions['discount_cta'];

// Get the "enabled" status and the CTA text String
var discountCtaEnabled = discountCtaDecision['enabled'];
var discountCtaText = discountCtaDecision.variables['cta_text'];

// console-logging some variables for troublehooting / demo purposes
console.log("%c discountCtaEnabled: " + discountCtaEnabled, logStyle);
console.log("%c discountCtaText: " + discountCtaText, logStyle);

if (discountCtaEnabled) {
    $('#discountCta').show();
    $('#discountCta').text(discountCtaText);
} else {
    console.log("OFF");
    $('#discountCta').hide();   
}

// Tracking the Add to Cart event - this function is called upon clicking the CTA
function trackClickDiscountCtaEvent() {
    console.log("%c Tracking 'click_discount_cta' event", logStyle);
    user.trackEvent("add_to_cart");
}
