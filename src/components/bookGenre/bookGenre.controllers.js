import {
  obtenerBookGenres,
  obtenerBookGenrePorId,
  obtenerGenresPorLibro,
  obtenerLibrosPorGenero,
  crearBookGenre,
  crearBookGenres,
  actualizarBookGenre,
  eliminarBookGenre,
  eliminarBookGenresPorLibro,
  actualizarGenresDeLibro
} from './bookGenre.models.js';

export const getBookGenres = async (req, res) => {
  try {
    const bookGenres = await obtenerBookGenres();
    res.status(200).json({
      success: true,
      data: bookGenres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBookGenreById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookGenre = await obtenerBookGenrePorId(id);
    
    if (!bookGenre) {
      return res.status(404).json({
        success: false,
        message: 'Book genre no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: bookGenre
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getGenresByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const bookGenres = await obtenerGenresPorLibro(bookId);
    
    res.status(200).json({
      success: true,
      data: bookGenres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBooksByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const bookGenres = await obtenerLibrosPorGenero(genreId);
    
    res.status(200).json({
      success: true,
      data: bookGenres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createBookGenre = async (req, res) => {
  try {
    const { bookId, genreId } = req.body;
    
    if (!bookId || !genreId) {
      return res.status(400).json({
        success: false,
        message: 'bookId y genreId son requeridos'
      });
    }
    
    const bookGenre = await crearBookGenre({ bookId, genreId });
    
    res.status(201).json({
      success: true,
      data: bookGenre
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createBookGenres = async (req, res) => {
  try {
    const { bookId, genreIds } = req.body;
    
    if (!bookId || !genreIds || !Array.isArray(genreIds)) {
      return res.status(400).json({
        success: false,
        message: 'bookId y genreIds (array) son requeridos'
      });
    }
    
    const bookGenres = await crearBookGenres(bookId, genreIds);
    
    res.status(201).json({
      success: true,
      data: bookGenres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateBookGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookId, genreId } = req.body;
    
    if (!bookId || !genreId) {
      return res.status(400).json({
        success: false,
        message: 'bookId y genreId son requeridos'
      });
    }
    
    const bookGenre = await actualizarBookGenre({ id, bookId, genreId });
    
    res.status(200).json({
      success: true,
      data: bookGenre
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteBookGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eliminarBookGenre(id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteBookGenresByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const result = await eliminarBookGenresPorLibro(bookId);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateBookGenres = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { genreIds } = req.body;
    
    if (!genreIds || !Array.isArray(genreIds)) {
      return res.status(400).json({
        success: false,
        message: 'genreIds (array) es requerido'
      });
    }
    
    const bookGenres = await actualizarGenresDeLibro(bookId, genreIds);
    
    res.status(200).json({
      success: true,
      data: bookGenres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 