/**
 * @typedef {import('../types/game.js').Puzzle} Puzzle
 */

/**
 * Curated to match the assets actually present in public/puzzleImage/.
 * The spec's original 10th puzzle (fire + man = Fireman) is intentionally
 * dropped: there is no fire image in public/puzzleImage, and the other 18
 * images divide evenly into these 9 puzzles with nothing left over.
 *
 * @type {Puzzle[]}
 */
export const puzzles = [
  {
    id: 1,
    leftImage: '/puzzleImage/rain.jpg',
    rightImage: '/puzzleImage/bow.png',
    leftWord: 'Rain',
    rightWord: 'Bow',
    answer: 'Rainbow',
  },
  {
    id: 2,
    leftImage: '/puzzleImage/star.png',
    rightImage: '/puzzleImage/fish.png',
    leftWord: 'Star',
    rightWord: 'Fish',
    answer: 'Starfish',
  },
  {
    id: 3,
    leftImage: '/puzzleImage/lion.png',
    rightImage: '/puzzleImage/king.png',
    leftWord: 'Lion',
    rightWord: 'King',
    answer: 'The Lion King',
  },
  {
    id: 4,
    leftImage: '/puzzleImage/spider.png',
    rightImage: '/puzzleImage/man.png',
    leftWord: 'Spider',
    rightWord: 'Man',
    answer: 'Spider-Man',
  },
  {
    id: 5,
    leftImage: '/puzzleImage/tooth.png',
    rightImage: '/puzzleImage/brush.png',
    leftWord: 'Tooth',
    rightWord: 'Brush',
    answer: 'Toothbrush',
  },
  {
    id: 6,
    leftImage: '/puzzleImage/butter.png',
    rightImage: '/puzzleImage/fly.png',
    leftWord: 'Butter',
    rightWord: 'Fly',
    answer: 'Butterfly',
  },
  {
    id: 7,
    leftImage: '/puzzleImage/honey.png',
    rightImage: '/puzzleImage/moon.png',
    leftWord: 'Honey',
    rightWord: 'Moon',
    answer: 'Honeymoon',
  },
  {
    id: 8,
    leftImage: '/puzzleImage/face.png',
    rightImage: '/puzzleImage/book.png',
    leftWord: 'Face',
    rightWord: 'Book',
    answer: 'Facebook',
  },
  {
    id: 9,
    leftImage: '/puzzleImage/basket.png',
    rightImage: '/puzzleImage/ball.png',
    leftWord: 'Basket',
    rightWord: 'Ball',
    answer: 'Basketball',
  },
]
