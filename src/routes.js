const {
	addBookHandler,
	getAllBooksHandler,
	getBookById,
	editBook,
	deleteById,
} = require("./handler");

const routes = [
	{
		method: "POST",
		path: "/books",
		handler: addBookHandler,
	},
	{
		method: "GET",
		path: "/books",
		handler: getAllBooksHandler,
	},
	{
		method: "GET",
		path: "/books/{id}",
		handler: getBookById,
	},
	{
		method: "PUT",
		path: "/books/{id}",
		handler: editBook,
	},
	{
		method: "DELETE",
		path: "/books/{id}",
		handler: deleteById,
	},
];

module.exports = routes;
