document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Tap/Click functionality for Interactive Elements
    const interactiveCards = document.querySelectorAll('.diagnostic-card, .interactive-signal');

    interactiveCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Remove active class from all other cards to keep the UI clean
            interactiveCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('active');
                }
            });
            // Toggle active state on the clicked card
            card.classList.toggle('active');
        });
    });

    // Optional: Number counters for the hero stats when they scroll into view
    const statValues = document.querySelectorAll('.stat-value');
    
    const animateValue = (element, start, end, duration, isDecimal, suffix) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = start + easeProgress * (end - start);
            
            if (isDecimal) {
                element.innerHTML = currentVal.toFixed(2) + suffix;
            } else {
                element.innerHTML = Math.floor(currentVal).toLocaleString() + suffix;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.innerText;
                
                let endValue = parseFloat(text.replace(/,/g, '').replace(/[^\d.-]/g, ''));
                let isDecimal = text.includes('.');
                let suffix = text.replace(/[\d.,]/g, '');
                
                // Only animate once
                if (!target.classList.contains('animated')) {
                    // Set initial value to 0
                    target.innerText = isDecimal ? '0.00' + suffix : '0' + suffix;
                    animateValue(target, 0, endValue, 2000, isDecimal, suffix);
                    target.classList.add('animated');
                }
                observer.unobserve(target);
            }
        });
    };

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    statValues.forEach(stat => {
        observer.observe(stat);
    });
});
