/* eslint-disable camelcase */

const singlebookModel = ({
  id,
  title,
  year,
  author,
  userId,
}) => ({
  id,
  title,
  year,
  author,
  userId: user_id,
});

const booksModel = ({
  id,
  title,
  author,
}) => ({
  id,
  title,
  performer,
});

const albumbook = (data) => ({
  id: data[0].album_id,
  name: data[0].name,
  year: data[0].year,
  coverUrl: data[0].cover,
  books: data[0].id ? data.map(booksModel) : [],
});

const bookshelvebook = (data) => ({
  id: data[0].id,
  name: data[0].name,
  username: data[0].username,
  books: data.map(({ book_id, title, performer }) => ({
    id: book_id,
    title,
    performer,
  })),
});

const activities = (bookshelfId, data) => ({
  bookshelfId,
  activities: data,
});

module.exports = {
  singlebookModel, albumbook, bookshelvebook, activities,
};
