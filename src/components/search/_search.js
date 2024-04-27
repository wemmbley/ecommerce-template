const __SEARCH_ROUTE = 'https://jsonplaceholder.typicode.com/photos?_limit=10';
const __SEARCH_SLEEP = 1000;

class Search
{
    // Nodes
    container;
    preloader;
    nothingFound;
    resultSkeleton;
    searchbar;

    // States
    isSearchBarOpened;

    static fromEl(searchBtn)
    {
        this.container = neo().select('#searchContainer');

        const $container = neo(this.container);

        this.preloader = $container.select('#preloader');
        this.nothingFound = $container.select('#emptyResults');
        this.resultSkeleton = $container.select('#resultSkeleton');
        this.searchbar = $container.select('.searchInput');

        this.initSearch(searchBtn);
    }

    static initSearch(searchBtn)
    {
        neo(searchBtn).on('click', (e) => {
            this.isSearchBarOpened = true;

            neo(this.container).show();
            neo(this.searchbar).show();
        });

        neo(this.searchbar).on('userTyping', () => {
            neo(this.preloader).show();

            this.clearSearchResults();
        }).typeDone((event) => {
            const textToSearch = event.srcElement.value;

            if(textToSearch === '') {
                neo(this.preloader).hide();

                return;
            }

            neo()
                .ajax(__SEARCH_ROUTE)
                .then((response) => response.json())
                .then((json) => {
                    neo(this.preloader).hide();

                    if(json.length === 0) {
                        neo(this.nothingFound).show();

                        return;
                    }

                    this.insertSearchResults(json);
                });
        }, {sleep: __SEARCH_SLEEP});

        neo(this.container).on('userCancelAction', () => {
            if(!this.isSearchBarOpened) {
                return;
            }

            this.isSearchBarOpened = false;

            neo(this.container).hide();
            neo(this.searchbar).clear();

            this.clearSearchResults();
        }, {skipElements: [searchBtn]});
    }

    static insertSearchResults(results) {
        this.clearSearchResults();

        results.forEach((result) => {
            let resultNode = neo(this.resultSkeleton).clone();
            let $resultNode = neo(resultNode);

            $resultNode.show();
            $resultNode.addClass('search-result-item');

            neo($resultNode.select('a')).prop('href', '/photo/' + result.id);
            neo($resultNode.select('.preview')).prop('src', result.thumbnailUrl);
            neo($resultNode.select('.title')).text(result.title);

            this.resultSkeleton.closest('.results').insertAdjacentElement('afterbegin', resultNode);
        });
    }

    static clearSearchResults() {
        neo(this.resultSkeleton.closest('.results')).dropChildren('.search-result-item');
    }
}