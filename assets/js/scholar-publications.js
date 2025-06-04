/**
 * Google Scholar Publications Integration
 * Fetches and displays publications from Google Scholar
 */

(function() {
    'use strict';

    // Configuration
    const SCHOLAR_ID = '4aPlo98AAAAJ';
    const CORS_PROXIES = [
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/',
        'https://crossorigin.me/'
    ];
    const SCHOLAR_URL = `https://scholar.google.com/citations?user=${SCHOLAR_ID}&hl=en&cstart=0&pagesize=100`;
    const CACHE_KEY = 'scholar_publications';
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    let currentProxyIndex = 0;

    // DOM elements
    const publicationsLoading = document.getElementById('publications-loading');
    const publicationsList = document.getElementById('publications-list');
    const publicationsError = document.getElementById('publications-error');
    const publicationsStatic = document.getElementById('publications-static');

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        loadPublications();
    });

    /**
     * Load publications from cache or fetch new data
     */
    async function loadPublications() {
        try {
            // Check cache first
            const cachedData = getCachedPublications();
            if (cachedData) {
                displayPublications(cachedData);
                return;
            }

            // Fetch from Google Scholar
            const publications = await fetchPublications();
            if (publications && publications.length > 0) {
                cachePublications(publications);
                displayPublications(publications);
            } else {
                showStaticPublications();
            }
        } catch (error) {
            console.error('Error loading publications:', error);
            showStaticPublications();
        }
    }

    /**
     * Fetch publications from Google Scholar
     */
    async function fetchPublications() {
        // Try multiple CORS proxies
        for (let i = 0; i < CORS_PROXIES.length; i++) {
            try {
                const proxy = CORS_PROXIES[currentProxyIndex];
                const response = await fetch(proxy + encodeURIComponent(SCHOLAR_URL));
                if (!response.ok) throw new Error('Failed to fetch');
                
                const html = await response.text();
                const publications = parsePublications(html);
                
                if (publications && publications.length > 0) {
                    return publications;
                }
            } catch (error) {
                console.error(`Fetch error with proxy ${currentProxyIndex}:`, error);
                currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
            }
        }
        
        // If all proxies fail, try alternative method
        return await fetchPublicationsAlternative();
    }

    /**
     * Alternative method using Google Scholar API
     */
    async function fetchPublicationsAlternative() {
        try {
            // First try to fetch using a different approach
            const publications = await fetchUsingSerp();
            if (publications && publications.length > 0) {
                return publications;
            }
            
            // If that fails, use the static list
            return await fetchFromScholarAPI();
        } catch (error) {
            console.error('Alternative fetch error:', error);
            return await fetchFromScholarAPI();
        }
    }

    /**
     * Try to fetch using SerpAPI-like approach (free tier)
     */
    async function fetchUsingSerp() {
        try {
            // This is a simplified approach that might work with some CORS proxies
            const serpUrl = `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${SCHOLAR_ID}&hl=en&num=100`;
            const response = await fetch(CORS_PROXIES[0] + encodeURIComponent(serpUrl));
            
            if (!response.ok) return null;
            
            const data = await response.json();
            if (data.articles) {
                return data.articles.map(article => ({
                    title: article.title,
                    authors: article.authors,
                    venue: article.publication,
                    year: article.year,
                    link: article.link,
                    doi: extractDOI(article.link)
                }));
            }
        } catch (error) {
            console.error('SerpAPI fetch error:', error);
        }
        return null;
    }

    /**
     * Extract DOI from URL if present
     */
    function extractDOI(url) {
        if (!url) return null;
        const doiMatch = url.match(/10\.\d{4,}\/[-._;()\/:a-zA-Z0-9]+/);
        return doiMatch ? doiMatch[0] : null;
    }

    /**
     * Simplified API fetch (would need actual API implementation)
     */
    async function fetchFromScholarAPI() {
        // Return all publications from the static list
        return [
            {
                title: "Engineering microbiomes to enhance macroalgal health, biomass yield, and carbon sequestration",
                authors: "Nair S, Zhang Z, Wang X, Zhang B, Jiao N, Zhang Y",
                venue: "Green Ca. J",
                year: "2024",
                doi: "10.1016/j.greenca.2024.11.001"
            },
            {
                title: "Overlooked Vital Role of Persistent Algae-Bacteria Interaction in Ocean Recalcitrant Carbon Sequestration and Its Response to Ocean Warming",
                authors: "Zhao H, Zhang Z, Nair S, Li H, Zhao J, He C, Shi Q, Zheng Q, Cai R, Luo G, Xie S, Jiao N, Zhang Y",
                venue: "GCB",
                year: "2024",
                doi: "10.1111/gcb.17570"
            },
            {
                title: "Macroalgal virosphere assists with host–microbiome equilibrium regulation and affects prokaryotes in surrounding marine environments",
                authors: "Zhao J, Nair S, Zhang Z, Wang Z, Jiao N, Zhang Y",
                venue: "ISME J",
                year: "2024",
                doi: "10.1093/ismejo/wrae083"
            },
            {
                title: "Adverse environmental perturbations may threaten kelp farming sustainability by exacerbating Enterobacterales diseases",
                authors: "Zhang Y, Nair S#, Zhang Z, Zhao J, Zhao H, Lu L, Chang L, Jiao N",
                venue: "ES&T",
                year: "2024",
                doi: "10.1021/acs.est.3c09921"
            },
            {
                title: "Plastoquinone synthesis inhibition by tetrabromo biphenyldiol as a widespread algicidal mechanism of marine bacteria",
                authors: "Zhang Z, Li D, Xie R, Guo R, Nair S, Han H, Zhang G, Zhao Q, Zhang Z, Jiao N, Zhang Y",
                venue: "ISME J",
                year: "2023",
                doi: "10.1038/s41396-023-01510-0"
            },
            {
                title: "Inherent tendency of Synechococcus and heterotrophic bacteria for mutualism on long-term coexistence despite environmental interference",
                authors: "Nair S*, Zhang Z*, Li H, Zhao H, Shen H, Gao S, Jiao N, Zhang Y",
                venue: "Science Advances",
                year: "2022",
                doi: "10.1126/sciadv.abf4792"
            },
            {
                title: "A novel phage indirectly regulates diatom growth by infecting diatom-associated biofilm-forming bacterium",
                authors: "Nair S, Li C, Mou S, Zhang Z, Zhang Y",
                venue: "Applied and Environmental Microbiology",
                year: "2022",
                doi: "10.1128/aem.02138-21"
            },
            {
                title: "Phage infection benefits marine diatom Phaeodactylum tricornutum by regulating the associated bacterial community",
                authors: "Zhang Z, Zhao H, Mou S, Nair S, Zhao J, Jiao N, Zhang Y",
                venue: "Microbial Ecology",
                year: "2022",
                doi: "10.1007/s00248-022-02045-1"
            },
            {
                title: "A dark‐tolerant diatom (Chaetoceros) cultured from the deep sea",
                authors: "Mou S, Zhang Z, Zhao H, Nair S, Li Y, Xu K, et al",
                venue: "Journal of Phycology",
                year: "2022",
                doi: "10.1111/jpy.13240"
            },
            {
                title: "Vertically exported phytoplankton (< 20 µm) and their correlation network with bacterioplankton along a deep-sea seamount",
                authors: "Zhao H, Zhang Z, Nair S, Zhao J, Mou S, Xu K, Zhang Y",
                venue: "Frontiers in Marine Science",
                year: "2022",
                doi: "10.3389/fmars.2022.862494"
            },
            {
                title: "Long-term survival of Synechococcus and heterotrophic bacteria without external nutrient supply after changes in their relationship from antagonism to mutualism",
                authors: "Zhang Z*, Nair S*, Tang L, Zhao H, Hu Z, Chen M, Zhang Y, Kao S-J, Jiao N, Zhang Y",
                venue: "mBio",
                year: "2021",
                doi: "10.1128/mBio.01614-21"
            }
        ];
    }

    /**
     * Parse publications from Google Scholar HTML
     */
    function parsePublications(html) {
        const publications = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Find publication entries
        const entries = doc.querySelectorAll('.gsc_a_tr');
        
        entries.forEach(entry => {
            try {
                const titleElement = entry.querySelector('.gsc_a_at');
                const authorsElement = entry.querySelector('.gs_gray');
                const venueElement = entry.querySelectorAll('.gs_gray')[1];
                const yearElement = entry.querySelector('.gsc_a_y');
                
                if (titleElement && authorsElement && yearElement) {
        const publication = {
            title: titleElement.textContent.trim(),
            authors: authorsElement.textContent.trim(),
            venue: venueElement ? venueElement.textContent.trim() : '',
            year: yearElement.textContent.trim(),
            // Use DOI link directly if available, else fallback to title href
            link: '', // Clear link to avoid incorrect URLs
            doi: extractDOI(titleElement.href) || ''
        };
                    
                    publications.push(publication);
                }
            } catch (error) {
                console.error('Error parsing publication:', error);
            }
        });
        
        return publications;
    }

    /**
     * Display publications in the DOM
     */
    function displayPublications(publications) {
        publicationsLoading.style.display = 'none';
        publicationsList.style.display = 'block';
        publicationsList.innerHTML = '';
        
        // Group publications by year
        const publicationsByYear = groupByYear(publications);
        
        // Create HTML for each year
        Object.keys(publicationsByYear)
            .sort((a, b) => b - a) // Sort years descending
            .forEach((year, yearIndex) => {
                publicationsByYear[year].forEach((pub, pubIndex) => {
                    const publicationItem = createPublicationElement(pub, year, yearIndex * 50 + pubIndex * 50);
                    publicationsList.appendChild(publicationItem);
                });
            });
    }

    /**
     * Create publication HTML element
     */
    function createPublicationElement(publication, year, delay) {
        const div = document.createElement('div');
        div.className = 'publication-item';
        div.setAttribute('data-aos', 'fade-up');
        div.setAttribute('data-aos-delay', delay);
        
        // Format authors with bold for "Nair S" and handle special characters
        let formattedAuthors = publication.authors
            .replace(/Nair S\*/g, '<strong>Nair S*</strong>')
            .replace(/Nair S#/g, '<strong>Nair S#</strong>')
            .replace(/Nair S(?![\w*#])/g, '<strong>Nair S</strong>')
            .replace(/Shailesh S\.? Nair/g, '<strong>Shailesh S. Nair</strong>');
        
        // Add DOI link if available
        let doiLink = '';
        if (publication.doi) {
            doiLink = ` doi: <a href="https://doi.org/${publication.doi}" target="_blank">${publication.doi}</a>`;
        } else if (publication.link) {
            doiLink = ` <a href="${publication.link}" target="_blank">View</a>`;
        }
        
        div.innerHTML = `
            <div class="publication-year">${year}</div>
            <div class="publication-content">
                <p>${formattedAuthors}. ${publication.title}. <i>${publication.venue}</i>, ${year}.${doiLink}</p>
            </div>
        `;

        // Fix View link to use DOI URL if available, else use link, else disable
        const viewLink = div.querySelector('a[target="_blank"]');
        if (viewLink) {
            if (publication.doi) {
                viewLink.href = `https://doi.org/${publication.doi}`;
            } else if (publication.link) {
                viewLink.href = publication.link;
            } else {
                viewLink.removeAttribute('href');
                viewLink.style.pointerEvents = 'none';
                viewLink.style.color = 'gray';
                viewLink.textContent = 'No link available';
            }
        }
        
        return div;
    }

    /**
     * Group publications by year
     */
    function groupByYear(publications) {
        return publications.reduce((groups, pub) => {
            const year = pub.year;
            if (!groups[year]) {
                groups[year] = [];
            }
            groups[year].push(pub);
            return groups;
        }, {});
    }

    /**
     * Show static publications as fallback
     */
    function showStaticPublications() {
        publicationsLoading.style.display = 'none';
        
        // Instead of showing error and static HTML, display all publications programmatically
        const allPublications = [
            {
                title: "Engineering microbiomes to enhance macroalgal health, biomass yield, and carbon sequestration",
                authors: "Nair S, Zhang Z, Wang X, Zhang B, Jiao N, Zhang Y",
                venue: "Green Ca. J",
                year: "2024",
                doi: "10.1016/j.greenca.2024.11.001"
            },
            {
                title: "Overlooked Vital Role of Persistent Algae-Bacteria Interaction in Ocean Recalcitrant Carbon Sequestration and Its Response to Ocean Warming",
                authors: "Zhao H, Zhang Z, Nair S, Li H, Zhao J, He C, Shi Q, Zheng Q, Cai R, Luo G, Xie S, Jiao N, Zhang Y",
                venue: "GCB",
                year: "2024",
                doi: "10.1111/gcb.17570"
            },
            {
                title: "Macroalgal virosphere assists with host–microbiome equilibrium regulation and affects prokaryotes in surrounding marine environments",
                authors: "Zhao J, Nair S, Zhang Z, Wang Z, Jiao N, Zhang Y",
                venue: "ISME J",
                year: "2024",
                doi: "10.1093/ismejo/wrae083"
            },
            {
                title: "Adverse environmental perturbations may threaten kelp farming sustainability by exacerbating Enterobacterales diseases",
                authors: "Zhang Y, Nair S#, Zhang Z, Zhao J, Zhao H, Lu L, Chang L, Jiao N",
                venue: "ES&T",
                year: "2024",
                doi: "10.1021/acs.est.3c09921"
            },
            {
                title: "Plastoquinone synthesis inhibition by tetrabromo biphenyldiol as a widespread algicidal mechanism of marine bacteria",
                authors: "Zhang Z, Li D, Xie R, Guo R, Nair S, Han H, Zhang G, Zhao Q, Zhang Z, Jiao N, Zhang Y",
                venue: "ISME J",
                year: "2023",
                doi: "10.1038/s41396-023-01510-0"
            },
            {
                title: "Inherent tendency of Synechococcus and heterotrophic bacteria for mutualism on long-term coexistence despite environmental interference",
                authors: "Nair S*, Zhang Z*, Li H, Zhao H, Shen H, Gao S, Jiao N, Zhang Y",
                venue: "Science Advances",
                year: "2022",
                doi: "10.1126/sciadv.abf4792"
            },
            {
                title: "A novel phage indirectly regulates diatom growth by infecting diatom-associated biofilm-forming bacterium",
                authors: "Nair S, Li C, Mou S, Zhang Z, Zhang Y",
                venue: "Applied and Environmental Microbiology",
                year: "2022",
                doi: "10.1128/aem.02138-21"
            },
            {
                title: "Phage infection benefits marine diatom Phaeodactylum tricornutum by regulating the associated bacterial community",
                authors: "Zhang Z, Zhao H, Mou S, Nair S, Zhao J, Jiao N, Zhang Y",
                venue: "Microbial Ecology",
                year: "2022",
                doi: "10.1007/s00248-022-02045-1"
            },
            {
                title: "A dark‐tolerant diatom (Chaetoceros) cultured from the deep sea",
                authors: "Mou S, Zhang Z, Zhao H, Nair S, Li Y, Xu K, et al",
                venue: "Journal of Phycology",
                year: "2022",
                doi: "10.1111/jpy.13240"
            },
            {
                title: "Vertically exported phytoplankton (< 20 µm) and their correlation network with bacterioplankton along a deep-sea seamount",
                authors: "Zhao H, Zhang Z, Nair S, Zhao J, Mou S, Xu K, Zhang Y",
                venue: "Frontiers in Marine Science",
                year: "2022",
                doi: "10.3389/fmars.2022.862494"
            },
            {
                title: "Long-term survival of Synechococcus and heterotrophic bacteria without external nutrient supply after changes in their relationship from antagonism to mutualism",
                authors: "Zhang Z*, Nair S*, Tang L, Zhao H, Hu Z, Chen M, Zhang Y, Kao S-J, Jiao N, Zhang Y",
                venue: "mBio",
                year: "2021",
                doi: "10.1128/mBio.01614-21"
            }
        ];
        
        // Display all publications using the same display function
        displayPublications(allPublications);
        
        // Hide the static HTML sections
        publicationsError.style.display = 'none';
        publicationsStatic.style.display = 'none';
    }

    /**
     * Cache publications in localStorage
     */
    function cachePublications(publications) {
        try {
            const cacheData = {
                timestamp: Date.now(),
                publications: publications
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error caching publications:', error);
        }
    }

    /**
     * Get cached publications if still valid
     */
    function getCachedPublications() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;
            
            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;
            
            if (age < CACHE_DURATION) {
                return cacheData.publications;
            }
            
            // Cache expired
            localStorage.removeItem(CACHE_KEY);
            return null;
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    }

    /**
     * Manual refresh function (can be called from console)
     */
    window.refreshPublications = function() {
        localStorage.removeItem(CACHE_KEY);
        publicationsList.style.display = 'none';
        publicationsStatic.style.display = 'none';
        publicationsError.style.display = 'none';
        publicationsLoading.style.display = 'block';
        loadPublications();
    };

})();
