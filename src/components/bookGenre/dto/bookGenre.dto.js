export const bookGenreDto = {
  bookId: {
    type: 'string',
    required: true,
    description: 'ID del libro'
  },
  genreId: {
    type: 'string',
    required: true,
    description: 'ID del género'
  }
};

export const bookGenresDto = {
  bookId: {
    type: 'string',
    required: true,
    description: 'ID del libro'
  },
  genreIds: {
    type: 'array',
    required: true,
    description: 'Array de IDs de géneros',
    items: {
      type: 'string'
    }
  }
};

export const updateBookGenreDto = {
  id: {
    type: 'string',
    required: true,
    description: 'ID del book genre'
  },
  bookId: {
    type: 'string',
    required: true,
    description: 'ID del libro'
  },
  genreId: {
    type: 'string',
    required: true,
    description: 'ID del género'
  }
};

export const updateBookGenresDto = {
  genreIds: {
    type: 'array',
    required: true,
    description: 'Array de IDs de géneros',
    items: {
      type: 'string'
    }
  }
}; 