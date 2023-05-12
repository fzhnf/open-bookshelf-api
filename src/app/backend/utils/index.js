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
  author,
});

const bookshelvesbook = (data) => ({
  id: data[0].id,
  name: data[0].name,
  username: data[0].username,
  books: data.map(({ book_id, title, author }) => ({
    id: book_id,
    title,
    author,
  })),
});

const activities = (bookshelfId, data) => ({
  bookshelfId,
  activities: data,
});

export default {
  singlebookModel, albumbook, bookshelvesbook, activities,
};
