import data from "./data.js";
import {searchMovieByTitle, makeBgActive} from "./helpers.js";

class MoviesApp {
    constructor(options) {
        const { root, searchInput, searchForm, yearHandler, yearSubmitter, genreSubmitter } = options;
        this.$tableEl = document.getElementById(root);
        this.$tbodyEl = this.$tableEl.querySelector("tbody");
        this.$yearEl = document.querySelector(".year__container");
        this.$genreEl = document.querySelector(".genre__container");

        this.$searchInput = document.getElementById(searchInput);
        this.$searchForm   = document.getElementById(searchForm);
        this.yearHandler = yearHandler;
        this.$yearSubmitter = document.getElementById(yearSubmitter);
        this.$genreSubmitter = document.getElementById(genreSubmitter);
    }

    createMovieEl(movie){
        const {image, title, genre, year,id} = movie;
        return `<tr data-id="${id}"><td><img src="${image}" onerror="this.src = 'https://static.techgig.com/files/skilllogo/Placeholder.svg';"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`
    }

    createFilterYearEl(movie, length) {
        //const { image, title, genre, year, id } = movie;
        return `
        <div class="form-check position-relative d-flex align-items-center ">
            <input class="form-check-input me-3 mb-1" type="radio" name="year" id="year${movie}" value="${movie}">
            <label class="form-check-label" for="year${movie}">
                ${movie}
            </label>
            <label class="form-check-label position-absolute end-0 tag-count" for="genre${movie}">
                ${length}
            </label>
        </div>
        `
    }

    createFilterGenreEl(movie, length) {
        //const { genre, length } = movie;
        return `
        <div class="form-check position-relative d-flex align-items-center ">
            <input class="form-check-input me-3 mb-1" type="checkbox" value="${movie}" id="genre${movie}" />
            <label class="form-check-label" for="genre${movie}">
                ${movie}
            </label>
            <label class="form-check-label position-absolute end-0 tag-count" for="genre${movie}">
                ${length}
            </label>
        </div>
        `
    }

    groupBy(key) {
        return function group(array) {
            return array.reduce((acc, obj) => {
                const proporty = obj[key];
                acc[proporty] = acc[proporty] || [];
                acc[proporty].push(obj);
                return acc;
            }, {});
        }
    }

    fillYear() {
        const groupByGenre = this.groupBy("year");
        const _tmpObj = groupByGenre(data)
        const moviesArr = Object.keys(_tmpObj).sort((a, b) => {
            return b.year - a.year;
        }).map((movie) => {
            return this.createFilterYearEl(movie, _tmpObj[movie].length)
        }).join("");
        /*
        const moviesArr = data.sort((a, b) => {
            return b.year - a.year;
        }).map((movie) => {
            return this.createFilterYearEl(movie)
        }).join("");
        */
        this.$yearEl.innerHTML = moviesArr;
    }

    fillGenre() {
        const _tmpData = [];
        const groupByGenre = this.groupBy("genre");

        const _tmpObj = groupByGenre(data)
        const moviesArr = Object.keys(_tmpObj).sort((a, b) => {
            return ('' + a).localeCompare(b);
        }).map((movie) => {
            return this.createFilterGenreEl(movie, _tmpObj[movie].length)
        }).join("");

        this.$genreEl.innerHTML = moviesArr;
    }

    fillTable(){
        /* const moviesHTML = data.reduce((acc, cur) => {
            return acc + this.createMovieEl(cur);
        }, "");*/
        const moviesArr = data.map((movie) => {
           return this.createMovieEl(movie)
        }).join("");
        this.$tbodyEl.innerHTML = moviesArr;
    }

    reset(){
        this.$tbodyEl.querySelectorAll("tr").forEach((item) => {
            item.style.background = "transparent";
        })
    }


    handleSearch(){
        this.$searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.reset();

            const searchValue = this.$searchInput.value;
            const matchedMovies = data.filter((movie) => {
                return searchMovieByTitle(movie, searchValue);
            }).forEach(makeBgActive)

            this.$searchInput.value = '';
            this.$searchInput.focus();
        });
    }

    handleYearFilter(){
        this.$yearSubmitter.addEventListener("click", () => {
            this.reset();
            const selectedYear = document.querySelector(`input[name='${this.yearHandler}']:checked`).value
            const matchedMovies = data.filter((movie) => {
                return movie.year === selectedYear;
            }).forEach(makeBgActive)
        });
    }

    handleGenreFilter() {
        this.$genreSubmitter.addEventListener("click", () => {
            this.reset();
            const selectedGenres = document.querySelectorAll(`input[type='checkbox']:checked`)
            selectedGenres.forEach((item) => {
                const matchedMovies = data.filter((movie) => {
                    return movie.genre === item.value;
                }).forEach(makeBgActive)
            })

        });
    }

    init(){
        this.fillTable();
        this.fillYear();
        this.fillGenre();
        this.handleSearch();
        this.handleYearFilter();
        this.handleGenreFilter();
    }
}

let myMoviesApp = new MoviesApp({
    root: "movies-table",
    searchInput: "searchInput",
    searchForm: "searchForm",
    yearHandler: "year",
    yearSubmitter: "yearSubmitter",
    genreSubmitter: 'genreSubmitter'
});

myMoviesApp.init();
