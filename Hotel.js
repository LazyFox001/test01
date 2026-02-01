        // --- Room Database ---
        const roomsDB = {
            "Hyatt Regency Tokyo": {
                img: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2025/06/10/2050/TYOTY-P1232-Regency-Suite-King.jpg/TYOTY-P1232-Regency-Suite-King.16x9.jpg?imwidth=1280",
                desc: "Hyatt Regency Tokyo offers 712 modern rooms in 22 distinctive styles, including 18 luxurious suites and 34 studios. ",
                specs: "Size: 45m² • Bed: King Size • View: Shinjuku Skyline"
            },
            "JR Tower Hotel Nikko Sapporo": {
                img: "https://ak-d.tripcdn.com/images/0221312000aw08hwc12F8_R_600_400_R5.webp",
                desc: "Breakfast at JR Tower Hotel Nikko Sapporo is served at the restaurant on the 35th floor, offering a Japanese-Western buffet and a Japanese set menu.",
                specs: "Size: 55m² • Bed: Futon • Feature: Tatami Room"
            },
            "Vessel Hotel Campana Susukino": {
                img: "https://ak-d.tripcdn.com/images/200l11000000rg5y1A56F_R_600_400_R5.webp",
                desc: "With a stay at Vessel Hotel Campana Susukino in Sapporo (Chuo-ku), you'll be within a 5-minute drive of Odori Park and Hokkaido University.",
                specs: "Size: 50m² • Bed: Queen + Twin • Feature: Private Onsen"
            },
            "Serenity Paris": {
                img: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80",
                desc: "Classic Parisian elegance with high ceilings, moldings, and plush velvet furnishings.",
                specs: "Size: 40m² • Bed: Royal King • Style: Haussmann"
            },
            "Serenity Riviera": {
                img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
                desc: "Bright, airy interiors opening onto a spacious terrace overlooking the azure sea.",
                specs: "Size: 60m² • Bed: California King • View: Mediterranean"
            },
            "Serenity Provence": {
                img: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80",
                desc: "Charming country-style interiors with stone walls and vintage furniture.",
                specs: "Size: 55m² • Bed: Canopy Bed • Decor: Rustic Chic"
            },
            "Serenity Shanghai": {
                img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
                desc: "Sophisticated interiors blending 1920s glamour with contemporary luxury.",
                specs: "Size: 65m² • Bed: King Size • Style: Art Deco"
            },
            "Serenity Beijing": {
                img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
                desc: "Elegant rooms featuring rich fabrics and traditional Chinese craftsmanship.",
                specs: "Size: 50m² • Bed: King Size • Decor: Imperial Red"
            },
            "Serenity Guilin": {
                img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
                desc: "Serene interiors using natural materials to reflect the stunning landscape outside.",
                specs: "Size: 45m² • Bed: Bamboo Frame • View: Karst Mountains"
            }
        };

        // --- Carousel Logic ---
        function scrollCarousel(btn, direction) {
            const container = btn.parentElement.querySelector('.room-carousel');
            const scrollAmount = container.clientWidth;
            container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
        }

        // Add event listeners to all carousels for badge updates
        document.querySelectorAll('.room-carousel').forEach(carousel => {
            carousel.addEventListener('scroll', () => {
                const index = Math.round(carousel.scrollLeft / carousel.clientWidth) + 1;
                const badge = carousel.parentElement.querySelector('.carousel-badge');
                // Ensure index stays within 1-3
                const safeIndex = Math.min(Math.max(index, 1), 3);
                badge.innerText = `${safeIndex}/3`;
            });
        });

        // --- Modal Logic ---
        const modal = document.getElementById('bookingModal');
        
        function openModal(hotelName = null, price = null) {
            modal.style.display = 'flex';
            // Slight delay for animation
            setTimeout(() => modal.classList.add('active'), 10);

            // Pre-select hotel if clicked from card
            if (hotelName) {
                const select = document.getElementById('roomType');
                const options = select.getElementsByTagName('option');
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === hotelName) {
                        options[i].selected = true;
                        break;
                    }
                }
            }
            
            // Set default dates (Today and Tomorrow)
            if(!document.getElementById('checkIn').value) {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                document.getElementById('checkIn').valueAsDate = today;
                document.getElementById('checkOut').valueAsDate = tomorrow;
            }

            // Update preview and price immediately
            updateModalPreview();
        }

        function updateModalPreview() {
            const roomSelect = document.getElementById('roomType');
            const selectedValue = roomSelect.value;
            
            // Elements to update
            const imgEl = document.getElementById('modalRoomImg');
            const titleEl = document.getElementById('modalRoomTitle');
            const descEl = document.getElementById('modalRoomDesc');
            const specsEl = document.getElementById('modalRoomSpecs');

            // Fetch data
            const data = roomsDB[selectedValue];

            if (data) {
                imgEl.src = data.img;
                titleEl.textContent = selectedValue;
                descEl.textContent = data.desc;
                specsEl.textContent = data.specs;
            }

            // Also recalc price
            calculateTotal();
        }

        function closeModal() {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
            }
        }

        // --- Booking Calculation Logic ---
        function calculateTotal() {
            const checkIn = new Date(document.getElementById('checkIn').value);
            const checkOut = new Date(document.getElementById('checkOut').value);
            const roomSelect = document.getElementById('roomType');
            // Logic to find selected option even within optgroups
            const selectedOption = roomSelect.options[roomSelect.selectedIndex];
            const price = parseFloat(selectedOption.getAttribute('data-price'));
            
            const summaryDiv = document.getElementById('summary');
            
            if (checkIn && checkOut && checkOut > checkIn) {
                const diffTime = Math.abs(checkOut - checkIn);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                const total = diffDays * price;

                document.getElementById('nightCount').innerText = diffDays;
                document.getElementById('pricePerNight').innerText = '$' + price;
                document.getElementById('totalPrice').innerText = '$' + total.toLocaleString();
                
                summaryDiv.style.display = 'block';
            } else {
                summaryDiv.style.display = 'none';
            }
        }

        // --- Form Submission ---
        function handleBooking(e) {
            e.preventDefault();
            const hotel = document.getElementById('roomType').value;
            const date = document.getElementById('checkIn').value;
            const total = document.getElementById('totalPrice').innerText;
            
            alert(`Booking Confirmed!\n\nDestination: ${hotel}\nCheck-in: ${date}\nTotal: ${total}\n\nWe look forward to welcoming you.`);
            closeModal();
        }

        // --- Navbar Scroll Effect ---
        window.addEventListener('scroll', function() {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 50) {
                nav.style.padding = '0.5rem 5%';
                nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                nav.style.padding = '1rem 5%';
                nav.style.boxShadow = 'none';
            }
        });
