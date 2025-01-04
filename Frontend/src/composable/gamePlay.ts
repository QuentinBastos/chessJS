
import axios from 'axios';
import {
  API_URL,
  API_ROOT_URL,
  API_BOARD_URL,
  API_INIT_BOARD_URL,
  API_POSSIBLES_MOVES_URL,
  API_MOVE_PIECE_URL,
  API_KING_CHECK_URL,
  API_PROMOTION_URL,
  API_END_GAME_URL,
} from '@/constants';

export const getBoard = async () => {
  try {
    const response = await axios.get(`${API_URL}${API_ROOT_URL}${API_BOARD_URL}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du plateau de jeu:', error);
    throw error;
  }
};

export const initBoard = async () => {
  try {
    const response = await axios.get(`${API_URL}${API_ROOT_URL}${API_INIT_BOARD_URL}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du plateau de jeu:', error);
    throw error;
  }
};

export const getPossibleMovesPiece = async (pieceId: string) => {
  try {
    const url = `${API_URL}${API_ROOT_URL}${API_POSSIBLES_MOVES_URL.replace(':id', pieceId)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des mouvements possibles pour la pièce ${pieceId}:`, error);
    throw error;
  }
};

export const moveOnePiece = async (pieceId: number, toPosition: [number, number]) => {
  try {
    const response = await axios.post(`${API_URL}${API_ROOT_URL}${API_MOVE_PIECE_URL}`, {
      pieceId,
      toPosition,
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors du déplacement de la pièce ${pieceId}:`, error);
    throw error;
  }
};

export const isKingInCheck = async (color: string) => {
  try {
    const url = `${API_URL}${API_ROOT_URL}${API_KING_CHECK_URL.replace(':color', color)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la vérification de l'échec pour la couleur ${color}:`, error);
    throw error;
  }
};

export const promotePiece = async (pieceId: number, type: number) => {
  try {
    const response = await axios.post(`${API_URL}${API_ROOT_URL}${API_PROMOTION_URL}`, {
      pieceId,
      pieceType: type,
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la promotion de la pièce ${pieceId}:`, error);
    throw error;
  }
};

export const endGame = async () => {
  try {
    const response = await axios.post(`${API_URL}${API_ROOT_URL}${API_END_GAME_URL}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la terminaison de la partie:', error);
    throw error;
  }
};
