const { nanoid } = require("nanoid");
const books = [];

const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	if (!name) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku",
		});
		response.code(400);
		return response;
	}

	const id = nanoid(16);
	const insertedAt = new Date().toISOString();

	if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message:
				"Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
		});
		response.code(400);
		return response;
	}

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished: pageCount === readPage,
		reading,
		insertedAt,
		updatedAt: insertedAt,
	};

	books.push(newBook);

	const response = h.response({
		status: "success",
		message: "Buku berhasil ditambahkan",
		...(name && { data: { bookId: id } }), // Include data only if name exists
	});

	response.code(201);

	return response;
};

const getAllBooksHandler = (request, h) => {
	const { name, reading, finished } = request.query; // Extract query parameters

	// Filter books based on query parameters
	let filteredBooks = books;
	if (name) {
		filteredBooks = filteredBooks.filter(book =>
			book.name.toLowerCase().includes(name.toLowerCase())
		);
	}
	if (reading !== undefined) {
		filteredBooks = filteredBooks.filter(
			book => book.reading === (reading === "1")
		);
	}
	if (finished !== undefined) {
		filteredBooks = filteredBooks.filter(
			book => book.finished === (finished === "1")
		);
	}

	const projectedBooks = filteredBooks.map(book => ({
		id: book.id,
		name: book.name,
		publisher: book.publisher,
	}));

	const response = h.response({
		status: "success",
		data: {
			books: projectedBooks,
		},
	});
	response.code(200);

	return response;
};

const getBookById = (request, h) => {
	const { id } = request.params;
	const book = books.find(book => book.id === id);

	if (!book) {
		const response = h.response({
			status: "fail",
			message: "Buku tidak ditemukan",
		});
		response.code(404); // Not Found
		return response;
	}
	const response = h.response({
		status: "success",
		data: {
			book,
		},
	});
	response.code(200); // OK

	return response;
};

const editBook = (request, h) => {
	const { id } = request.params;
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;
	const updatedAt = new Date().toISOString();
	const index = books.findIndex(book => book.id === id);

	if (index !== -1) {
		if (name === undefined) {
			const response = h.response({
				status: "fail",
				message: "Gagal memperbarui buku. Mohon isi nama buku",
			});
			response.code(400);

			return response;
		}

		if (pageCount < readPage) {
			const response = h.response({
				status: "fail",
				message:
					"Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
			});
			response.code(400);

			return response;
		}

		const finished = pageCount === readPage;

		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			finished,
			reading,
			updatedAt,
		};

		const response = h.response({
			status: "success",
			message: "Buku berhasil diperbarui",
		});
		response.code(200);

		return response;
	}

	const response = h.response({
		status: "fail",
		message: "Gagal memperbarui buku. Id tidak ditemukan",
	});
	response.code(404);

	return response;
};

const deleteById = (request, h) => {
	const { id } = request.params;

	const index = books.findIndex(book => book.id === id);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: "success",
			message: "Buku berhasil dihapus",
		});
		response.code(200);
		return response;
	}
	const response = h.response({
		status: "fail",
		message: "Buku gagal dihapus. Id tidak ditemukan",
	});
	response.code(404);
	return response;
};

module.exports = {
	addBookHandler,
	getAllBooksHandler,
	getBookById,
	editBook,
	deleteById,
};
