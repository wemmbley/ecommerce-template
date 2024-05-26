const __SEARCH_ROUTE = 'https://f840f620732c48fca100ec92af65a439.api.mockbin.io/';
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
            neo(this.searchbar).focus();
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

            this.fetchResultsFromServer();
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

    static fetchResultsFromServer()
    {
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
    }

    static insertSearchResults(results) {
        this.clearSearchResults();

        results.forEach((result) => {
            let resultNode = neo(this.resultSkeleton).clone();
            let $resultNode = neo(resultNode);

            $resultNode.show();
            $resultNode.addClass('search-result-item');

            //
            // required fields first
            //
            neo($resultNode.select('a')).prop('href', result.url);
            neo($resultNode.select('.preview')).prop('src', result.thumbnailUrl);
            neo($resultNode.select('.title')).text(result.title);

            //
            // not required fields
            //
            let $price = neo($resultNode.select('.price'));

            if(result.price !== undefined) {
                $price.text(result.price);
                $price.show();
            }

            if(result.discount !== undefined
                && result.discount.oldPrice !== undefined
                && result.discount.newPrice !== undefined) {
                let $oldPrice = neo($resultNode.select('.old-price'));

                $oldPrice.text(result.discount.oldPrice);
                $price.text(result.discount.newPrice);

                $oldPrice.show();
                $price.show();
            }

            if(result.description !== undefined) {
                let $description = neo($resultNode.select('.description'));

                $description.text(result.description);
                $description.show();
            }

            this.resultSkeleton.closest('.results').insertAdjacentElement('beforeend', resultNode);
        });
    }

    static clearSearchResults() {
        neo(this.resultSkeleton.closest('.results')).dropChildren('.search-result-item');
    }
}