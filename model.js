//HTML Selectors
const coinContainer = document.querySelector(
	'.coin-container'
);
const tableBody = document.querySelector('.table-body');

const mktAvg = document.querySelector('.mkt-average');
const mktAvgNum = document.querySelector(
	'.mkt-average-number'
);
const biggestGain = document.querySelector('.biggest-gain');
const biggestGainNum = document.querySelector(
	'.biggest-gain-number'
);
const biggestGainSubtitle = document.querySelector(
	'.biggest-gain-subtitle'
);
const biggestGainIcon = document.querySelector(
	'.biggest-gain-icon'
);

const biggestLoss = document.querySelector('.biggest-loss');
const biggestLossNum = document.querySelector(
	'.biggest-loss-number'
);
const biggestLossSubtitle = document.querySelector(
	'.biggest-loss-subtitle'
);
const biggestLossIcon = document.querySelector(
	'.biggest-loss-icon'
);

const paginationBtns = document.querySelector(
	'.pagination-btns'
);

const forwardBtn = document.querySelector(
	'.btn-page-forward'
);
const backBtn = document.querySelector('.btn-page-back');

///Table heads
const allColumn = document.querySelectorAll('.header-col');

// ///////GLOBAL VARIABLES//////////
// this will become all the returned data
let data = '';
// pulls the relevant piece of data into an array that can be sorted
let sortable = [];
//Average change
let totalAvg = '';

//Pagination
const state = {
	page: 1,
	resultsPerPage: 10,
	start: 0,
	end: 9,
};

// get rid of these
let highest = '';
let highestCoin = '';
let lowest = '';
let lowestCoin = '';

/**
 *
 * @param {An Array in the order you want it presented} sorted
 */
function renderTable(sorted) {
	//CLEAR prev
	tableBody.innerHTML = '';

	sorted.forEach((item) => {
		//Add the coin to the html
		const newEl = `
		<tr class="row">
                
                <td > <img class="icon" src="${
									item.iconUrl
								}" alt="coin logo"></td>
                <td > <div class="name">${item.name}</div>
                    <div class="symbol">${item.symbol}</div>
                </td>
                <td class="market-cap">$${(
									item.marketCap / 1000000000
								).toFixed(2)}B</td>
                <td class="price">$${dollarRound(
									item.price
								)}</td>
                <td class="change">${
									item.change > 0 ? '+' : ''
								} ${item.change}% ${
			item.change > 0
				? '<ion-icon class="up-arrow" name="caret-up-outline"></ion-icon>'
				: '<ion-icon class="down-arrow" name="caret-down-outline"></ion-icon>'
		} </td>
                
        </tr>`;
		//Append the html
		tableBody.insertAdjacentHTML('beforeend', newEl);
	});
}

//takes in a number and rounds to two decimal points
function dollarRound(number) {
	return Number.parseFloat(number).toFixed(2);
}

//REFACTOR ALMOST COPY OF RENDR GLANCE
function renderAvg(glanceBox, glanceBoxNumber, number) {
	//render number
	let n = number;
	glanceBoxNumber.innerHTML = '';
	glanceBoxNumber.innerHTML = `${n.toFixed(2)}% ${
		n < 0
			? '<ion-icon class="down-arrow" name="caret-down-outline"></ion-icon>'
			: '<ion-icon class="up-arrow" name="caret-up-outline"></ion-icon>'
	}`;
	//change color
	if (n < 0) {
		glanceBox.classList.add('loss');
	} else {
		glanceBox.classList.remove('loss');
	}
}

/**
 *
 * @param {html container of the box} glanceBox
 * @param {html container of the number} glanceBoxNumber
 * @param {html container that lists the coin} glanceBoxCoin
 * @param {html container that shows the icon} glanceBoxIcon
 * @param {the item being referenced} coin
 */
function renderGlance(
	glanceBox,
	glanceBoxNumber,
	glanceBoxCoin,
	glanceBoxIcon,
	coin
) {
	//render coin name
	if (glanceBoxCoin) {
		glanceBoxCoin.innerHTML = '';
		glanceBoxCoin.innerHTML = `${coin.symbol}`;
	}

	//render coin symbol

	if (glanceBoxIcon) {
		glanceBoxIcon.innerHTML = '';
		glanceBoxIcon.src = `${coin.iconUrl}`;
	}

	//render number
	let n = +coin.change;
	glanceBoxNumber.innerHTML = '';
	glanceBoxNumber.innerHTML = `${n.toFixed(2)}% ${
		n < 0
			? '<ion-icon class="down-arrow" name="caret-down-outline"></ion-icon>'
			: '<ion-icon class="up-arrow" name="caret-up-outline"></ion-icon>'
	}`;
	//change color
	if (n < 0) {
		glanceBox.classList.add('loss');
	} else {
		glanceBox.classList.remove('loss');
	}
}

const highestChange = function (data) {
	data.coins.forEach((coin) => {
		if (+coin.change > +highest) {
			highest = coin.change;
			highestCoin = coin;
		}
	});
};

const lowestChange = function (data) {
	data.coins.forEach((coin) => {
		if (+coin.change < +lowest) {
			lowest = coin.change;
			lowestCoin = coin;
		}
	});
};

const avgChange = function (data) {
	let total = 0;
	data.coins.forEach((coin) => {
		total = +coin.change + total;
	});
	totalAvg = total / data.coins.length;
};

const renderCoin = function (data, num) {
	const html = `<div class="coin">
  ${data.coins[num].name}
  <div class="price">Price is $${dollarRound(
		data.coins[num].price
	)}</div>
</div>`;

	coinContainer.insertAdjacentHTML('beforeend', html);
};

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
		'X-RapidAPI-Key':
			'8fcb4d186dmsh5199186e0cd1f70p1a2c91jsn62171dc732af',
	},
};

//run when clicked to sort the column

const sort = function () {
	let column = this.dataset.column;
	let order = this.dataset.order;
	state.page = 1;

	sortable = data.coins;
	allColumns = document.querySelectorAll('.header-col');
	//Seperate version to work with strings
	if (column == 'name') {
		if (order == 'desc') {
			allColumns.forEach((col) =>
				col.classList.remove('sort-asc')
			);
			allColumns.forEach((col) =>
				col.classList.remove('sort-desc')
			);
			this.classList.add('sort-asc');

			this.dataset.order = 'asc';
			sortable = sortable.sort((a, b) =>
				a[column] < b[column] ? 1 : -1
			);
		}
		if (order == 'asc') {
			allColumns.forEach((col) =>
				col.classList.remove('sort-asc')
			);
			allColumns.forEach((col) =>
				col.classList.remove('sort-desc')
			);
			this.classList.add('sort-desc');
			this.dataset.order = 'desc';
			sortable = sortable.sort((a, b) =>
				a[column] > b[column] ? 1 : -1
			);
		}
	} ///TEMP needs refactoring

	if (column !== 'name') {
		if (order == 'desc') {
			allColumns.forEach((col) =>
				col.classList.remove('sort-asc')
			);
			allColumns.forEach((col) =>
				col.classList.remove('sort-desc')
			);
			this.classList.add('sort-asc');

			this.dataset.order = 'asc';
			sortable = sortable.sort((a, b) =>
				+a[column] > +b[column] ? 1 : -1
			);
		}
		if (order == 'asc') {
			allColumns.forEach((col) =>
				col.classList.remove('sort-asc')
			);
			allColumns.forEach((col) =>
				col.classList.remove('sort-desc')
			);
			this.classList.add('sort-desc');
			this.dataset.order = 'desc';
			sortable = sortable.sort((a, b) =>
				+a[column] < +b[column] ? 1 : -1
			);
		}
	}

	renderPaginate(state.page);
};

//listens for click on the parent to the paginitation buttons and then runs the functions
const listenPagination = function () {
	paginationBtns.addEventListener('click', function (e) {
		const btn = e.target.closest('.btn');

		if (btn.classList.contains('btn-page-forward')) {
			goForward();
		}
		if (btn.classList.contains('btn-page-back')) {
			goBack();
		}
	});
};

const goForward = function () {
	state.page++;
	console.log(state.page);
	renderPaginate(state.page);
};
const goBack = function () {
	state.page--;
	console.log(state.page);
	renderPaginate(state.page);
};

const renderBtns = function () {
	paginationBtns.innerHTML = '';
	let btnsEl = '';
	//pg 1 and there are more pages
	if (
		state.page == 1 &&
		state.resultsPerPage < data.coins.length
	) {
		btnsEl = `
		<button class="btn btn-page-forward shadow">Page ${
			state.page + 1
		} <ion-icon name="arrow-forward-outline"></ion-icon></button>`;

		// forwardBtn.addEventListener('click', goForward);
	}

	//pg 1 and there are no more pages
	if (
		state.page == 1 &&
		state.resultsPerPage >= data.coins.length
	)
		console.log('1 and no more pages');

	//other pg and there are more and prev pages
	if (
		state.page > 1 &&
		state.resultsPerPage * state.page < data.coins.length
	) {
		btnsEl = `<button class="btn btn-page-back shadow"><ion-icon name="arrow-back-outline"></ion-icon>Page ${
			state.page - 1
		} </button>
		<button class="btn btn-page-forward shadow">Page ${
			state.page + 1
		} <ion-icon name="arrow-forward-outline"></ion-icon></button>`;
	}

	//last pg and there are prev pages
	if (
		state.page > 1 &&
		state.resultsPerPage * state.page >= data.coins.length
	) {
		btnsEl = `<button class="btn btn-page-back"><ion-icon name="arrow-back-outline"></ion-icon>Page ${
			state.page - 1
		} </button>`;
	}
	paginationBtns.insertAdjacentHTML('beforeend', btnsEl);
};

const renderPaginate = function (page) {
	state.page = page;
	state.start = (state.page - 1) * state.resultsPerPage;
	state.end = state.page * state.resultsPerPage;
	renderTable(sortable.slice(state.start, state.end));
	renderBtns(state.page);
};

const listen = function () {
	allColumn.forEach((column) =>
		column.addEventListener('click', sort)
	);
};

const getCoins = async function (time) {
	const info = await fetch(
		`https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=${time}&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0`,
		options
	)
		.then((response) => response.json())
		.catch((err) => console.error(err));
	data = info.data;

	highestChange(data);
	lowestChange(data);
	avgChange(data);
	renderAvg(mktAvg, mktAvgNum, totalAvg);
	renderGlance(
		biggestGain,
		biggestGainNum,
		biggestGainSubtitle,
		biggestGainIcon,
		highestCoin
	);
	renderGlance(
		biggestLoss,
		biggestLossNum,
		biggestLossSubtitle,
		biggestLossIcon,
		lowestCoin
	);
	sortable = data.coins;
	renderPaginate(1);
	listen();
	listenPagination();
};

getCoins('24h');

const timeFrame = document.querySelector('.timeframe');

//Listener for the timeframe list
document
	.querySelector('.timeframe')
	.addEventListener('click', function (e) {
		document
			.querySelectorAll('.time-int')
			.forEach((item) =>
				item.classList.remove('time-active')
			);
		const timeBtn = e.target.closest('.time-int');
		timeBtn.classList.add('time-active');
		getCoins(timeBtn.dataset.time);
	});
