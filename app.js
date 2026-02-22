const App = {
    elements: {
        departureInput: document.getElementById('departureInput'),
        arrivalInput: document.getElementById('arrivalInput'),
        departureHidden: document.getElementById('departure'),
        arrivalHidden: document.getElementById('arrival'),
        departureSuggestions: document.getElementById('departureSuggestions'),
        arrivalSuggestions: document.getElementById('arrivalSuggestions'),
        dateInput: document.getElementById('dateInput'),
        swapButton: document.getElementById('swapButton'),
        resultsContainer: document.getElementById('results-container'),
        messageArea: document.getElementById('message-area'),
        searchForm: document.querySelector('form'),
        connectingToggle: document.getElementById('connectingToggle')
    },

    state: {
        allStops: {},
        allStopsList: [],
        currentResults: [],
        searchParams: {},
        lastLoadedDate: null,
        routeData: {},
        isLoading: false,
        pendingArrivalFilter: false
    },

    init() {
        window.loadAllStops = (data) => this.onAllStopsLoaded(data);
        window.loadRouteDetails = (data) => this.onRouteDetailsLoaded(data);
        window.toggleStops = (id) => {
            const el = document.getElementById(id);
            const btn = document.querySelector(`button[onclick="toggleStops('${id}')"]`);
            if (!el || !btn) return;

            const isHidden = el.classList.contains('hidden');
            if (isHidden) {
                el.classList.remove('hidden');
                btn.innerHTML = `Hide stops <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(180deg)"><path d="M6 9l6 6 6-6"/></svg>`;
            } else {
                el.classList.add('hidden');
                btn.innerHTML = `Show stops <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;
            }
        };

        const now = new Date();
        const nyTime = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(now);
        this.elements.dateInput.value = nyTime; // YYYY-MM-DD

        this.setupInputListeners(this.elements.departureInput, this.elements.departureSuggestions, this.elements.departureHidden, 'departure');
        this.setupInputListeners(this.elements.arrivalInput, this.elements.arrivalSuggestions, this.elements.arrivalHidden, 'arrival');

        this.elements.swapButton.addEventListener('click', () => this.swapStations());
        this.elements.connectingToggle.checked = true; // Enable by default
        this.elements.searchForm.addEventListener('submit', (e) => this.searchTrains(e));

        document.addEventListener('click', (e) => {
            if (!this.elements.departureInput.contains(e.target)) this.hideSuggestions(this.elements.departureSuggestions);
            if (!this.elements.arrivalInput.contains(e.target)) this.hideSuggestions(this.elements.arrivalSuggestions);
        });

        this.injectScript('data/all_stops.js');
    },

    setupInputListeners(inputEl, suggestionEl, hiddenEl, type) {
        const trigger = () => {
            if (type === 'arrival' && !this.elements.departureHidden.value) {
                this.showMessage("Please select a departure station first.", "info");
                return;
            }
            this.showSuggestions(inputEl, suggestionEl, inputEl.value, type);
        };
        inputEl.addEventListener('focus', trigger);
        inputEl.addEventListener('click', trigger);
        inputEl.addEventListener('input', (e) => {
            hiddenEl.value = '';
            if (type === 'departure') {
                this.elements.arrivalInput.value = '';
                this.elements.arrivalHidden.value = '';
            }
            this.showSuggestions(inputEl, suggestionEl, e.target.value, type);
        });

        inputEl.addEventListener('keydown', (e) => {
            const items = suggestionEl.querySelectorAll('.suggestion-item');
            let activeIdx = Array.from(items).findIndex(item => item.classList.contains('bg-slate-50'));

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (activeIdx < items.length - 1) {
                    if (activeIdx !== -1) items[activeIdx].classList.remove('bg-slate-50');
                    items[activeIdx + 1].classList.add('bg-slate-50');
                    items[activeIdx + 1].scrollIntoView({ block: 'nearest' });
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (activeIdx > 0) {
                    items[activeIdx].classList.remove('bg-slate-50');
                    items[activeIdx - 1].classList.add('bg-slate-50');
                    items[activeIdx - 1].scrollIntoView({ block: 'nearest' });
                }
            } else if (e.key === 'Enter' && activeIdx !== -1) {
                e.preventDefault();
                items[activeIdx].click();
            }
        });
    },

    injectScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.onerror = () => this.showMessage(`Failed to load data from ${src}`, 'error');
        document.body.appendChild(script);
    },

    onAllStopsLoaded(data) {
        this.state.allStops = data;
        this.state.allStopsList = Object.values(data);
    },

    onRouteDetailsLoaded(data) {
        const routeId = data.route.id;
        this.state.routeData[routeId] = data;
        if (this.state.pendingRoutes) this.state.pendingRoutes.delete(routeId);

        if (this.state.pendingArrivalFilter) {
            this.checkAllRoutesForFilterLoaded();
        } else {
            this.checkAllRoutesLoaded();
        }
    },

    checkAllRoutesForFilterLoaded() {
        if (!this.state.pendingRoutes || this.state.pendingRoutes.size > 0) return;
        this.state.pendingArrivalFilter = false;
        this.showSuggestions(this.elements.arrivalInput, this.elements.arrivalSuggestions, this.elements.arrivalInput.value, 'arrival');
    },

    showSuggestions(inputEl, suggestionEl, query, type) {
        let matches = [];
        const q = query.toLowerCase().trim();

        const depId = this.elements.departureHidden.value;
        const dateRaw = this.elements.dateInput.value;

        if (type === 'arrival' && depId && dateRaw) {
            const depStop = this.state.allStops[depId];
            const routesToLoad = depStop.routes.filter(r => !this.state.routeData[r]);

            if (routesToLoad.length > 0) {
                this.state.pendingArrivalFilter = true;
                this.state.pendingRoutes = new Set(routesToLoad);
                routesToLoad.forEach(routeId => {
                    this.injectScript(`data/routes/${routeId.replace(/ /g, '_')}.js`);
                });
                suggestionEl.innerHTML = '<div class="px-4 py-3 text-sm text-slate-500 italic">Loading schedule data...</div>';

                // Safety timeout
                setTimeout(() => {
                    if (this.state.pendingArrivalFilter) {
                        this.state.pendingArrivalFilter = false;
                        this.hideSuggestions(suggestionEl);
                    }
                }, 5000);

                suggestionEl.classList.remove('hidden');
                return;
            }

            const reachableIds = this.getReachableStops(depId, dateRaw);
            if (reachableIds.size === 0) {
                suggestionEl.innerHTML = '<div class="px-4 py-3 text-sm text-red-500 italic">No trains available from this station on the selected date.</div>';
                suggestionEl.classList.remove('hidden');
                return;
            }

            const currentStops = this.state.allStopsList.filter(s => reachableIds.has(s.id) && s.id !== depId);

            if (q.length === 0) {
                matches = currentStops.filter(s => s.popular || reachableIds.size < 10);
                if (matches.length === 0) matches = currentStops.slice(0, 10);
                this.renderSuggestions(suggestionEl, matches, inputEl, "Available Destinations", type);
                return;
            }

            matches = currentStops.map(s => {
                const name = s.name.toLowerCase();
                let score = 0;
                if (name === q) score = 100;
                else if (name.startsWith(q)) score = 80;
                else if (name.includes(q)) score = 50;
                if (s.popular && score > 0) score += 15;
                return { ...s, score };
            }).filter(s => s.score > 0)
                .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
                .slice(0, 10);

            if (matches.length > 0) this.renderSuggestions(suggestionEl, matches, inputEl, "", type);
            else this.hideSuggestions(suggestionEl);
            return;
        }

        if (q.length === 0) {
            const importance = ["NEW YORK PENN STATION", "NEWARK PENN STATION", "SECAUCUS JUNCTION", "TRENTON TRANSIT CENTER", "HOBOKEN TERMINAL", "NEWARK BROAD ST", "ATLANTIC CITY", "METROPARK", "PRINCETON JUNCTION", "HAMILTON", "RAHWAY"];
            matches = this.state.allStopsList
                .filter(s => s.popular)
                .sort((a, b) => {
                    const idxA = importance.indexOf(a.name);
                    const idxB = importance.indexOf(b.name);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });

            if (matches.length > 0) this.renderSuggestions(suggestionEl, matches, inputEl, "Popular Stations", type);
            else this.hideSuggestions(suggestionEl);
            return;
        }

        matches = this.state.allStopsList.map(s => {
            const name = s.name.toLowerCase();
            let score = 0;
            if (name === q) score = 100;
            else if (name.startsWith(q)) score = 80;
            else if (name.includes(q)) score = 50;
            else {
                let j = 0;
                for (let i = 0; i < name.length && j < q.length; i++) {
                    if (name[i] === q[j]) j++;
                }
                if (j === q.length) score = 20;
            }
            if (s.popular && score > 0) score += 15;
            return { ...s, score };
        })
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
            .slice(0, 10);

        if (matches.length > 0) this.renderSuggestions(suggestionEl, matches, inputEl, "", type);
        else this.hideSuggestions(suggestionEl);
    },

    getReachableStops(depId, dateRaw) {
        const dateStr = dateRaw.replace(/-/g, '');
        const reachableIds = new Set();
        const depStop = this.state.allStops[depId];

        depStop.routes.forEach(routeId => {
            const data = this.state.routeData[routeId];
            if (!data) return;
            const route = data.route;

            [route.d0, route.d1].forEach(dir => {
                if (!dir) return;
                dir.trips.forEach(trip => {
                    const depIdx = trip.stops.findIndex(s => s.s === depId);
                    if (depIdx !== -1) {
                        const tDepRaw = trip.stops[depIdx].t;
                        const offset = Math.floor(this.timeToMin(tDepRaw) / 1440);
                        const serviceDateStr = this.shiftDate(dateStr, -offset);

                        if (trip.dates.includes(serviceDateStr)) {
                            for (let i = depIdx + 1; i < trip.stops.length; i++) {
                                reachableIds.add(trip.stops[i].s);
                            }
                        }
                    }
                });
            });
        });
        return reachableIds;
    },

    renderSuggestions(suggestionEl, items, inputEl, title = "", type) {
        let html = title ? `<div class="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">${title}</div>` : '';
        items.forEach(item => {
            const isPopular = item.popular ? '<i class="fa-solid fa-star text-amber-400 text-[10px] ml-1.5"></i>' : '';
            html += `
                <div class="suggestion-item px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between" 
                     data-id="${item.id}" data-name="${item.name}">
                    <div class="flex items-center min-w-0">
                        <i class="fa-solid fa-train-subway text-slate-300 mr-3 text-xs flex-shrink-0"></i>
                        <span class="text-sm font-semibold text-slate-700 uppercase break-words">${item.name}</span>
                        ${isPopular}
                    </div>
                </div>`;
        });
        suggestionEl.innerHTML = html;
        suggestionEl.classList.remove('hidden');

        suggestionEl.querySelectorAll('.suggestion-item').forEach(el => {
            el.addEventListener('click', () => {
                inputEl.value = el.dataset.name;
                const isDeparture = inputEl.id === 'departureInput';
                const hiddenEl = isDeparture ? this.elements.departureHidden : this.elements.arrivalHidden;
                hiddenEl.value = el.dataset.id;
                this.hideSuggestions(suggestionEl);

                if (isDeparture) {
                    this.elements.arrivalInput.value = '';
                    this.elements.arrivalHidden.value = '';
                    // Pre-load routes for departure
                    const depStop = this.state.allStops[el.dataset.id];
                    depStop.routes.forEach(routeId => {
                        if (!this.state.routeData[routeId]) {
                            this.injectScript(`data/routes/${routeId.replace(/ /g, '_')}.js`);
                        }
                    });
                }
            });
        });
    },

    hideSuggestions: (el) => {
        el.classList.add('hidden');
    },

    swapStations() {
        const depName = this.elements.departureInput.value;
        const depId = this.elements.departureHidden.value;
        this.elements.departureInput.value = this.elements.arrivalInput.value;
        this.elements.departureHidden.value = this.elements.arrivalHidden.value;
        this.elements.arrivalInput.value = depName;
        this.elements.arrivalHidden.value = depId;

        if (this.state.currentResults.length > 0 || this.elements.messageArea.innerHTML.includes('found')) {
            this.searchTrains(new Event('submit'));
        }
    },

    searchTrains(e) {
        if (e && e.preventDefault) e.preventDefault();
        const depId = this.elements.departureHidden.value;
        const arrId = this.elements.arrivalHidden.value;
        const dateRaw = this.elements.dateInput.value;

        if (!depId || !arrId || !dateRaw) {
            this.showMessage("Please select valid stations from the list.");
            return;
        }

        this.clearResults();
        const depStop = this.state.allStops[depId];
        const arrStop = this.state.allStops[arrId];
        const commonRoutes = depStop.routes.filter(r => arrStop.routes.includes(r));

        if (commonRoutes.length === 0) {
            this.showMessage("No direct train found.", "error");
            return;
        }

        this.state.pendingRoutes = new Set(commonRoutes);
        this.state.searchParams = { depId, arrId, dateRaw };

        commonRoutes.forEach(routeId => {
            if (this.state.routeData[routeId]) this.state.pendingRoutes.delete(routeId);
            else this.injectScript(`data/routes/${routeId.replace(/ /g, '_')}.js`);
        });

        this.checkAllRoutesLoaded();
    },

    checkAllRoutesLoaded() {
        if (!this.state.pendingRoutes || this.state.pendingRoutes.size > 0) return;
        this.processSearch();
    },

    processSearch(isAppend = false) {
        const { depId, arrId, dateRaw } = this.state.searchParams;
        const dateStr = dateRaw.replace(/-/g, '');
        this.state.lastLoadedDate = dateRaw;

        let directTrips = [];
        const depStop = this.state.allStops[depId];
        const arrStop = this.state.allStops[arrId];
        const commonRoutes = depStop.routes.filter(r => arrStop.routes.includes(r));

        commonRoutes.forEach(routeId => {
            directTrips = directTrips.concat(this.findTrips(routeId, depId, arrId, dateStr));
        });

        let connectingTrips = [];
        if (this.elements.connectingToggle.checked) {
            connectingTrips = this.findConnectingTrips(depId, arrId, dateStr);
        }

        let allTrips = [...directTrips, ...connectingTrips];

        // --- Dominance Filter (UX Optimization) ---
        // A trip A is BETTER than trip B if:
        // A.dep >= B.dep AND A.arr < B.arr
        // OR
        // A.dep > B.dep AND A.arr <= B.arr
        const filtered = allTrips.filter((tripB, idxB) => {
            return !allTrips.some((tripA, idxA) => {
                if (idxA === idxB) return false;

                const depA = tripA.absMinDep;
                const arrA = tripA.absMinArr;
                const depB = tripB.absMinDep;
                const arrB = tripB.absMinArr;

                // Better if starts at same time or later, but arrives earlier
                const arrivesEarlier = arrA < arrB;
                const startsLaterOrSame = depA >= depB;

                // Better if starts later, but arrives same time or earlier
                const arrivesEarlierOrSame = arrA <= arrB;
                const startsLater = depA > depB;

                if ((startsLaterOrSame && arrivesEarlier) || (startsLater && arrivesEarlierOrSame)) {
                    return true; // tripB is dominated by tripA
                }

                // If identical times, prefer Direct over Transfer
                if (depA === depB && arrA === arrB) {
                    if (tripA.isTransfer && !tripB.isTransfer) return false;
                    if (!tripA.isTransfer && tripB.isTransfer) return true;
                    return idxA < idxB; // Keep first occurrence
                }

                return false;
            });
        });

        // Filter out extreme durations relative to direct trips
        const minDuration = directTrips.length > 0 ? Math.min(...directTrips.map(t => t.duration)) : 0;
        const semiFiltered = filtered.filter(t => {
            if (minDuration > 0 && t.duration > minDuration * 2.5 && t.isTransfer) return false;
            return true;
        });

        const sorted = semiFiltered.sort((a, b) => {
            if (a.passed !== b.passed) return a.passed ? 1 : -1;
            return a.absMinDep - b.absMinDep || a.absMinArr - b.absMinArr;
        });

        if (!isAppend) this.state.currentResults = sorted;
        else this.state.currentResults = this.state.currentResults.concat(sorted);

        if (this.state.currentResults.length === 0) {
            this.showMessage("No trips found for this date.", "info");
        } else {
            this.renderResults(isAppend);
        }
    },

    findTrips(routeId, fromId, toId, dateStr) {
        const data = this.state.routeData[routeId];
        if (!data) return [];
        const route = data.route;
        const results = [];

        [route.d0, route.d1].forEach(dir => {
            if (!dir) return;
            dir.trips.forEach(trip => {
                const depIdx = trip.stops.findIndex(s => s.s === fromId);
                const arrIdx = trip.stops.findIndex(s => s.s === toId);

                if (depIdx !== -1 && arrIdx !== -1 && depIdx < arrIdx) {
                    const tDepRaw = trip.stops[depIdx].t;
                    const tArrRaw = trip.stops[arrIdx].t;
                    const offset = Math.floor(this.timeToMin(tDepRaw) / 1440);
                    const serviceDateStr = this.shiftDate(dateStr, -offset);

                    if (trip.dates.includes(serviceDateStr)) {
                        const now = new Date();
                        const searchDateRaw = this.state.searchParams.dateRaw;
                        const nyCurrentDate = new Intl.DateTimeFormat('en-CA', {
                            timeZone: 'America/New_York',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).format(now);
                        const isToday = searchDateRaw === nyCurrentDate;

                        const nyDateLocal = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
                        const nyCurrentMin = nyDateLocal.getHours() * 60 + nyDateLocal.getMinutes();

                        results.push({
                            depTime: this.normalizeTime(tDepRaw),
                            arrTime: this.normalizeTime(tArrRaw),
                            absMinDep: this.timeToMin(tDepRaw),
                            absMinArr: this.timeToMin(tArrRaw),
                            from: data.stops[fromId]?.name || fromId,
                            to: data.stops[toId]?.name || toId,
                            headsign: trip.h || dir.headsign, // Use trip-specific headsign if available
                            routeColor: route.color || '#2563eb',
                            duration: this.timeToMin(tArrRaw) - this.timeToMin(tDepRaw),
                            trainNumber: trip.n || '', // Added train number
                            passed: isToday && this.timeToMin(tDepRaw) < nyCurrentMin,
                            stops: trip.stops.slice(depIdx + 1, arrIdx).map(s => ({
                                id: s.s,
                                name: data.stops[s.s]?.name || s.s,
                                time: this.normalizeTime(s.t)
                            })),
                            fullStopIds: trip.stops.map(s => s.s) // For backtracking check
                        });
                    }
                }
            });
        });
        return results;
    },

    findConnectingTrips(fromId, toId, dateStr) {
        const depStop = this.state.allStops[fromId];
        const arrStop = this.state.allStops[toId];
        const results = [];

        depStop.routes.forEach(r1Id => {
            const r1Data = this.state.routeData[r1Id];
            if (!r1Data) return;

            arrStop.routes.forEach(r2Id => {
                const r2Data = this.state.routeData[r2Id];
                if (!r2Data) return;

                // Find intersection stops
                const r1Stops = Object.keys(r1Data.stops);
                const r2Stops = Object.keys(r2Data.stops);
                const intersection = r1Stops.filter(sId => r2Stops.includes(sId));

                intersection.forEach(xId => {
                    if (xId === fromId || xId === toId) return; // Intersection can't be start or end

                    const leg1 = this.findTrips(r1Id, fromId, xId, dateStr);
                    const leg2 = this.findTrips(r2Id, xId, toId, dateStr);

                    leg1.forEach(t1 => {
                        leg2.forEach(t2 => {
                            const waitTime = t2.absMinDep - t1.absMinArr;
                            if (waitTime >= 4 && waitTime <= 45) { // Max 45 mins wait for better UX

                                // --- Backtracking Prevention ---
                                // If Leg 1 already contains the final destination, it's a backtrack.
                                // If Leg 2 contains the origin, it's a backtrack.
                                if (t1.fullStopIds.includes(toId)) return;
                                if (t2.fullStopIds.includes(fromId)) return;

                                results.push({
                                    isTransfer: true,
                                    transferStation: r1Data.stops[xId]?.name || xId,
                                    waitTime,
                                    leg1: t1,
                                    leg2: t2,
                                    depTime: t1.depTime,
                                    arrTime: t2.arrTime,
                                    absMinDep: t1.absMinDep,
                                    absMinArr: t2.absMinArr,
                                    duration: t2.absMinArr - t1.absMinDep,
                                    passed: t1.passed,
                                    from: t1.from,
                                    to: t2.to
                                });
                            }
                        });
                    });
                });
            });
        });

        // Deduplicate and filter best options
        const bestOnly = [];
        const seen = new Set();
        results.sort((a, b) => a.duration - b.duration).forEach(r => {
            const key = `${r.depTime}-${r.arrTime}`;
            if (!seen.has(key)) {
                bestOnly.push(r);
                seen.add(key);
            }
        });

        return bestOnly;
    },

    renderResults(isAppend = false) {
        let html = '';
        let nextFound = false;

        // Compute NY current time once
        const _now = new Date();
        const _nyLocal = new Date(_now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const _nyMin = _nyLocal.getHours() * 60 + _nyLocal.getMinutes();
        const _nyDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(_now);
        const _isToday = this.state.searchParams.dateRaw === _nyDate;

        // Express band
        const avgDur = this.state.currentResults.reduce((s, r) => s + r.duration, 0) / (this.state.currentResults.length || 1);

        this.state.currentResults.forEach((t, idx) => {
            const isNext = !t.passed && !nextFound;
            if (isNext) nextFound = true;

            const cardId = `stops-${idx}`;
            const isExpress = t.duration < avgDur * 0.9;

            // Duration label: "42m" if <60min, else "1h 12m"
            const dur = t.duration;
            const durLabel = dur < 60 ? `${dur}m` : `${Math.floor(dur / 60)}h ${dur % 60}m`;

            // Minutes until departure (for today only)
            let minsUntil = null;
            let countdownLabel = '';
            if (_isToday && !t.passed) {
                minsUntil = t.absMinDep - _nyMin;
                if (minsUntil >= 0) {
                    if (minsUntil < 60) {
                        countdownLabel = `${minsUntil}m left`;
                    } else {
                        const h = Math.floor(minsUntil / 60);
                        const m = minsUntil % 60;
                        countdownLabel = `${h}h ${m}m left`;
                    }
                }
            }

            // Urgency pill: Conditional styling based on time remaining
            let urgencyPill = '';
            if (countdownLabel) {
                const isUrgent = minsUntil <= 20;
                const pillClass = isUrgent ? 'train-urgency-pill' : 'train-urgency-pill !bg-slate-100 !border-slate-200 !text-slate-600';
                urgencyPill = `
                    <div class="flex justify-center mt-3 mb-1">
                        <span class="${pillClass}">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="inline-block" style="vertical-align:-1px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            ${countdownLabel}
                        </span>
                    </div>`;
            }

            if (t.isTransfer) {
                const totalStops = (t.leg1.stops?.length || 0) + (t.leg2.stops?.length || 0);
                const leg1Html = this.renderStopsList(t.leg1.stops);
                const leg2Html = this.renderStopsList(t.leg2.stops);

                const xfDur = t.duration;
                const xfDurLabel = xfDur < 60 ? `${xfDur}m` : `${Math.floor(xfDur / 60)}h ${xfDur % 60}m`;

                html += `
                <div class="train-card ${isNext ? 'train-card--next' : ''} ${t.passed ? 'train-card--passed' : ''}"
                     ${isNext ? 'id="next-train"' : ''} tabindex="0">
                    <!-- Top row -->
                    <div class="train-card__top">
                        <span class="train-headsign">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="display:inline;vertical-align:1px;margin-right:3px"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>Via ${t.transferStation}
                        </span>
                        <div class="train-card__status-dur">
                            ${t.passed ? '<span class="train-badge train-badge--departed">DEPARTED</span>' : isNext ? '<span class="train-badge train-badge--next">NEXT</span>' : ''}
                            <span class="train-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:-1px;margin-right:2px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${xfDurLabel}</span>
                        </div>
                    </div>
                    <!-- Times -->
                    <div class="train-card__times">
                        <div class="train-card__endpoint">
                            <div class="train-time">${t.depTime}</div>
                            <div class="train-station" translate="no">${t.from}</div>
                        </div>
                        <div class="train-card__arrow">
                            <div class="train-arrow-line"></div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                        <div class="train-card__endpoint train-card__endpoint--right">
                            <div class="train-time">${t.arrTime}</div>
                            <div class="train-station" translate="no">${t.to}</div>
                        </div>
                    </div>
                    ${urgencyPill}
                    <!-- Stops count -->
                    <div class="train-card__stops-row">
                        <span class="train-stops-badge">+${totalStops} stops · ${t.waitTime}m transfer wait</span>
                    </div>
                    <!-- Expand -->
                    <div class="train-card__footer">
                        <button onclick="toggleStops('${cardId}')" class="train-expand-btn">
                            Show stops <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                    </div>
                    <!-- Detail -->
                    <div id="${cardId}" class="train-card__detail hidden">
                        <div class="train-stops-list">
                            <div class="train-stop train-stop--origin"><span class="train-stop__dot train-stop__dot--blue"></span><span class="train-stop__name" translate="no">${t.from}</span><span class="train-stop__time">${t.depTime}</span></div>
                            ${leg1Html}
                            <div class="train-stop train-stop--transfer"><span class="train-stop__dot train-stop__dot--amber"></span><span class="train-stop__name" translate="no">Transfer at ${t.transferStation} (arr ${t.leg1.arrTime} → dep ${t.leg2.depTime})</span><span class="train-stop__time">${t.waitTime}m wait</span></div>
                            ${leg2Html}
                            <div class="train-stop"><span class="train-stop__dot train-stop__dot--gray"></span><span class="train-stop__name" translate="no">${t.to}</span><span class="train-stop__time">${t.arrTime}</span></div>
                        </div>
                    </div>
                </div>`;
            } else {
                const stopsCount = t.stops.length;
                const stopsHtml = this.renderStopsList(t.stops);

                html += `
                <div class="train-card ${isNext ? 'train-card--next' : ''} ${t.passed ? 'train-card--passed' : ''}"
                     ${isNext ? 'id="next-train"' : ''} tabindex="0">
                    <!-- Top row: headsign + status/duration -->
                    <div class="train-card__top">
                        <span class="train-headsign">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style="display:inline;vertical-align:1px;margin-right:3px"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>${t.headsign}${isExpress ? ' <span class="train-express-dot">⚡</span>' : ''}
                        </span>
                        <div class="train-card__status-dur">
                            ${t.passed ? '<span class="train-badge train-badge--departed">DEPARTED</span>' : isNext ? '<span class="train-badge train-badge--next">NEXT</span>' : ''}
                            <span class="train-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:-1px;margin-right:2px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${durLabel}</span>
                        </div>
                    </div>
                    <!-- Times row -->
                    <div class="train-card__times">
                        <div class="train-card__endpoint">
                            <div class="train-time">${t.depTime}</div>
                            <div class="train-station" translate="no">${t.from}</div>
                        </div>
                        <div class="train-card__arrow">
                            <div class="train-arrow-line"></div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                        <div class="train-card__endpoint train-card__endpoint--right">
                            <div class="train-time">${t.arrTime}</div>
                            <div class="train-station" translate="no">${t.to}</div>
                        </div>
                    </div>
                    ${urgencyPill}
                    <!-- Stops count -->
                    ${stopsCount > 0 ? `<div class="train-card__stops-row"><span class="train-stops-badge">+${stopsCount} stops</span></div>` : '<div class="train-card__stops-row"></div>'}
                    <!-- Expand button -->
                    <div class="train-card__footer">
                        <button onclick="toggleStops('${cardId}')" class="train-expand-btn">
                            Show stops <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                    </div>
                    <!-- Stop list (hidden) -->
                    <div id="${cardId}" class="train-card__detail hidden">
                        <div class="train-stops-list">
                            <div class="train-stop train-stop--origin">
                                <span class="train-stop__dot train-stop__dot--blue"></span>
                                <span class="train-stop__name" translate="no">${t.from}</span>
                                <span class="train-stop__time">${t.depTime}</span>
                            </div>
                            ${stopsHtml}
                            <div class="train-stop">
                                <span class="train-stop__dot train-stop__dot--gray"></span>
                                <span class="train-stop__name" translate="no">${t.to}</span>
                                <span class="train-stop__time">${t.arrTime}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        });

        this.elements.resultsContainer.innerHTML = html;

        const nextTrainEl = document.getElementById('next-train');
        if (nextTrainEl) {
            nextTrainEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (!isAppend) {
            this.elements.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    renderStopsList(stops) {
        if (!stops || stops.length === 0) return '';
        return stops.map(s => `
            <div class="train-stop">
                <span class="train-stop__dot"></span>
                <span class="train-stop__name" translate="no">${s.name}</span>
                <span class="train-stop__time">${s.time}</span>
            </div>
        `).join('');
    },



    clearResults: function () { this.elements.resultsContainer.innerHTML = ''; this.elements.messageArea.innerHTML = ''; },
    showMessage: function (msg, type = 'error') {
        const bg = type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600';
        this.elements.messageArea.innerHTML = `<div class="p-4 rounded-xl ${bg} font-medium text-sm text-center animate-fade-in">${msg}</div>`;
    },
    timeToMin: (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; },
    normalizeTime: (t) => { const [h, m] = t.split(':').map(Number); return `${String(h % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`; },
    shiftDate: (dateStr, offset) => {
        const dt = new Date(parseInt(dateStr.substring(0, 4)), parseInt(dateStr.substring(4, 6)) - 1, parseInt(dateStr.substring(6, 8)));
        dt.setDate(dt.getDate() + offset);
        return `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, '0')}${String(dt.getDate()).padStart(2, '0')}`;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
