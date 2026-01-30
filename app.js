const App = {
    elements: {
        routeSelect: document.getElementById('routeSelect'),
        departureSelect: document.getElementById('departure'),
        arrivalSelect: document.getElementById('arrival'),
        dateInput: document.getElementById('dateInput'),
        swapButton: document.getElementById('swapButton'),
        resultsContainer: document.getElementById('results-container'),
        messageArea: document.getElementById('message-area'),
        searchForm: document.querySelector('form')
    },

    state: {
        routes: [],
        currentRouteData: null,
        stops: {}
    },

    init() {
        // Defines global callbacks for JSONP
        window.loadRoutesData = (data) => this.onRoutesLoaded(data);
        window.loadRouteDetails = (data) => this.onRouteDetailsLoaded(data);

        // Set default date to today (NY Time)
        const nyNow = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        const nyDate = new Date(nyNow);
        const y = nyDate.getFullYear();
        const m = String(nyDate.getMonth() + 1).padStart(2, '0');
        const d = String(nyDate.getDate()).padStart(2, '0');
        this.elements.dateInput.value = `${y}-${m}-${d}`;

        // Event Listeners
        this.elements.routeSelect.addEventListener('change', (e) => this.handleRouteChange(e.target.value));
        this.elements.departureSelect.addEventListener('change', () => this.checkSwapState());
        this.elements.arrivalSelect.addEventListener('change', () => this.checkSwapState());
        this.elements.swapButton.addEventListener('click', () => this.swapStations());
        this.elements.searchForm.addEventListener('submit', (e) => this.searchTrains(e));

        // Start loading routes
        this.injectScript('data/routes.js');
    },

    injectScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.onerror = () => this.showMessage(`Failed to load data from ${src}`, 'error');
        document.body.appendChild(script);
        // Script will call window.loadRoutesData or window.loadRouteDetails
    },

    onRoutesLoaded(data) {
        this.state.routes = data;
        this.populateRoutes();
    },

    onRouteDetailsLoaded(data) {
        this.state.currentRouteData = data.route;
        this.state.stops = data.stops;

        // Remove loading state
        this.elements.routeSelect.parentElement.classList.remove('opacity-50');
        document.body.style.cursor = 'default';

        // Update UI
        this.updateStopsDropdowns();

        // Update Theme Colors
        if (this.state.currentRouteData.color) {
            document.documentElement.style.setProperty('--primary', this.state.currentRouteData.color);
        }
    },

    populateRoutes() {
        this.elements.routeSelect.innerHTML = '<option value="" disabled selected>Select Route...</option>';
        this.state.routes.forEach(route => {
            const option = document.createElement('option');
            option.value = route.id;
            option.textContent = route.name;
            option.style.borderLeft = `5px solid ${route.color}`;
            this.elements.routeSelect.appendChild(option);
        });
    },

    handleRouteChange(routeId) {
        if (!routeId) return;

        // Visual feedback
        this.elements.routeSelect.parentElement.classList.add('opacity-50');
        document.body.style.cursor = 'wait';

        // Clear previous
        this.state.currentRouteData = null;
        this.elements.departureSelect.innerHTML = '<option>Loading...</option>';
        this.elements.arrivalSelect.innerHTML = '<option>Loading...</option>';
        this.elements.departureSelect.disabled = true;
        this.elements.arrivalSelect.disabled = true;

        // Inject script for specific route
        // routeId might have spaces, filenames used underscores
        const filename = `data/routes/${routeId.replace(/ /g, '_')}.js`;
        this.injectScript(filename);
    },

    updateStopsDropdowns() {
        if (!this.state.currentRouteData) return;

        const route = this.state.currentRouteData;
        const stopIds = new Set();

        const addStops = (direction) => {
            if (direction && direction.trips) {
                direction.trips.forEach(trip => {
                    trip.stops.forEach(s => stopIds.add(s.s));
                });
            }
        };

        addStops(route.d0);
        addStops(route.d1);

        const sortedStops = Array.from(stopIds).map(id => ({
            id: id,
            name: this.state.stops[id] || id
        })).sort((a, b) => a.name.localeCompare(b.name));

        this.populateSelect(this.elements.departureSelect, sortedStops, "Select Origin...");
        this.populateSelect(this.elements.arrivalSelect, sortedStops, "Select Destination...");

        this.elements.departureSelect.disabled = false;
        this.elements.arrivalSelect.disabled = false;
        this.checkSwapState();
    },

    populateSelect(el, items, placeholder) {
        el.innerHTML = `<option value="" disabled selected hidden>${placeholder}</option>`;
        items.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = item.name;
            el.appendChild(opt);
        });
    },

    checkSwapState() {
        const dep = this.elements.departureSelect.value;
        const arr = this.elements.arrivalSelect.value;
        this.elements.swapButton.disabled = !(dep && arr && dep !== arr);

        if (!this.elements.swapButton.disabled) {
            this.elements.swapButton.classList.add('text-blue-600', 'bg-white', 'shadow-md');
            this.elements.swapButton.classList.remove('text-gray-300', 'bg-gray-100');
        } else {
            this.elements.swapButton.classList.remove('text-blue-600', 'bg-white', 'shadow-md');
            this.elements.swapButton.classList.add('text-gray-300', 'bg-gray-100');
        }
    },

    swapStations() {
        const temp = this.elements.departureSelect.value;
        this.elements.departureSelect.value = this.elements.arrivalSelect.value;
        this.elements.arrivalSelect.value = temp;
        this.checkSwapState();
    },

    searchTrains(e) {
        e.preventDefault();
        this.clearResults();

        const route = this.state.currentRouteData;
        const depId = this.elements.departureSelect.value;
        const arrId = this.elements.arrivalSelect.value;
        const dateRaw = this.elements.dateInput.value;
        const dateStr = dateRaw.replace(/-/g, '');

        if (!route || !depId || !arrId || !dateStr) {
            this.showMessage("Please fill in all fields.");
            return;
        }

        if (depId === arrId) {
            this.showMessage("Origin and Destination must be different.");
            return;
        }

        // Find applicable trips
        let applicableTrips = [];

        [route.d0, route.d1].forEach(dir => {
            if (!dir) return;
            dir.trips.forEach(trip => {
                if (!trip.dates.includes(dateStr)) return;

                const depIdx = trip.stops.findIndex(s => s.s === depId);
                const arrIdx = trip.stops.findIndex(s => s.s === arrId);

                if (depIdx !== -1 && arrIdx !== -1 && depIdx < arrIdx) {
                    applicableTrips.push({
                        trip: trip,
                        depIdx: depIdx,
                        arrIdx: arrIdx,
                        headsign: dir.headsign
                    });
                }
            });
        });

        if (applicableTrips.length === 0) {
            this.showMessage("No trains found for this date and route.", "info");
            return;
        }

        // Process results
        const displayedTrips = applicableTrips.map(item => {
            const tDep = item.trip.stops[item.depIdx].t;
            const tArr = item.trip.stops[item.arrIdx].t;

            const minDep = this.timeToMin(tDep);
            const minArr = this.timeToMin(tArr);
            let duration = minArr - minDep;
            if (duration < 0) duration += 1440;

            const stops = item.trip.stops.slice(item.depIdx + 1, item.arrIdx).map(s => ({
                name: this.state.stops[s.s],
                time: s.t
            }));

            // Countdown (NY Time)
            const now = new Date();
            const nyTimeStr = now.toLocaleString("en-US", { timeZone: "America/New_York", hour12: false });
            const nyDateObj = new Date(nyTimeStr);

            const nyYear = nyDateObj.getFullYear();
            const nyMonth = String(nyDateObj.getMonth() + 1).padStart(2, '0');
            const nyDay = String(nyDateObj.getDate()).padStart(2, '0');
            const nyTodayStr = `${nyYear}-${nyMonth}-${nyDay}`;
            const nyCurrentMin = nyDateObj.getHours() * 60 + nyDateObj.getMinutes();

            const isToday = dateRaw === nyTodayStr;
            let countdown = null;
            let passed = false;

            if (isToday) {
                if (minDep < nyCurrentMin) {
                    passed = true;
                } else {
                    let diff = minDep - nyCurrentMin;
                    const h = Math.floor(diff / 60);
                    const m = diff % 60;
                    countdown = `${h > 0 ? h + 'h ' : ''}${m}m`;
                }
            } else if (dateRaw < nyTodayStr) {
                passed = true;
            }

            return {
                depTime: tDep,
                arrTime: tArr,
                from: this.state.stops[depId],
                to: this.state.stops[arrId],
                duration: duration,
                stops: stops,
                passed: passed,
                countdown: countdown,
                minDep: minDep,
                headsign: item.headsign
            };
        }).sort((a, b) => a.minDep - b.minDep);

        this.renderResults(displayedTrips);
    },

    renderResults(trips) {
        let html = '';
        let nextFound = false;

        trips.forEach((t, idx) => {
            const isNext = !t.passed && !nextFound;
            if (isNext) nextFound = true;

            const opacity = t.passed ? 'opacity-50 grayscale' : 'opacity-100';
            const ring = isNext ? 'ring-2 ring-blue-500 ring-offset-2' : '';

            let badge = '';
            if (isNext) badge = `<span class="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-sm">NEXT</span>`;
            else if (t.passed) badge = `<span class="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-bl-lg">DEPARTED</span>`;

            const stopsHtml = t.stops.length ? `
                <div class="mt-4 pt-3 border-t border-dashed border-gray-100 hidden group-focus-within:block transition-all">
                    <p class="text-[10px] uppercase text-gray-400 font-bold mb-2 tracking-wider">Intermediate Stops</p>
                    <div class="pl-3 border-l-2 border-gray-200 space-y-2">
                        ${t.stops.map(s => `
                            <div class="flex justify-between text-xs">
                                <span class="text-gray-600">${s.name}</span>
                                <span class="font-mono font-medium text-gray-900">${s.time}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : '';

            const durH = Math.floor(t.duration / 60);
            const durM = t.duration % 60;
            const durText = `${durH > 0 ? durH + 'h ' : ''}${durM}m`;

            html += `
            <div class="ticket-card bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative group mb-4 ${opacity} ${ring}" tabindex="0">
                ${badge}
                <div class="p-5">
                    <div class="flex justify-between items-center mb-4">
                        <span class="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            ${t.headsign || 'Train'}
                        </span>
                        <div class="flex items-center text-xs text-gray-400 font-medium">
                            <i class="fa-regular fa-clock mr-1"></i> ${durText}
                        </div>
                    </div>

                    <div class="flex items-center justify-between gap-4">
                        <div class="text-left w-1/3">
                            <div class="text-2xl font-black text-gray-800 leading-none">${t.depTime}</div>
                            <div class="text-[10px] font-bold text-gray-400 mt-1 truncate" title="${t.from}">${t.from}</div>
                        </div>

                        <div class="flex-1 flex flex-col items-center justify-center">
                            <div class="w-full h-0.5 bg-gray-200 relative">
                                <div class="absolute w-1.5 h-1.5 bg-gray-300 rounded-full left-0 -top-0.5"></div>
                                <div class="absolute w-1.5 h-1.5 bg-gray-300 rounded-full right-0 -top-0.5"></div>
                                <div class="absolute left-1/2 -top-2 bg-white px-1">
                                    <i class="fa-solid fa-angle-right text-gray-300 text-xs"></i>
                                </div>
                            </div>
                        </div>

                        <div class="text-right w-1/3">
                            <div class="text-2xl font-black text-gray-800 leading-none">${t.arrTime}</div>
                            <div class="text-[10px] font-bold text-gray-400 mt-1 truncate" title="${t.to}">${t.to}</div>
                        </div>
                    </div>

                    ${t.countdown ? `
                    <div class="mt-4 flex justify-center">
                        <span class="inline-flex items-center bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold">
                            <i class="fa-solid fa-hourglass-start mr-1.5 ${isNext ? 'animate-pulse' : ''}"></i> ${t.countdown} left
                        </span>
                    </div>` : ''}

                    ${stopsHtml}
                    ${t.stops.length ? `
                    <div class="mt-3 text-center group-focus-within:hidden">
                        <span class="text-[10px] text-gray-400 font-semibold border-b border-dashed border-gray-300">
                             +${t.stops.length} stops
                        </span>
                    </div>
                    ` : ''}
                </div>
            </div>
            `;
        });

        this.elements.resultsContainer.innerHTML = html;
        this.elements.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    clearResults() {
        this.elements.resultsContainer.innerHTML = '';
        this.elements.messageArea.innerHTML = '';
    },

    showMessage(msg, type = 'error') {
        const bg = type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600';
        this.elements.messageArea.innerHTML = `
            <div class="p-4 rounded-xl ${bg} font-medium text-sm text-center animate-fade-in">
                ${msg}
            </div>
        `;
    },

    timeToMin(t) {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
