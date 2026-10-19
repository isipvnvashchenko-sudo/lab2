import bulgakovImg from '../assets/Булгаков.webp';
import dostoevskyImg from '../assets/Достоевский.webp';
import orwellImg from '../assets/1984.webp';
import exuperyImg from '../assets/Экзюпери.webp';
import doyleImg from '../assets/Дойл.webp';
import bradburyImg from '../assets/Брэдбери.webp';

export const books = [
  {
    id: 1,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    price: 590,
    genre: 'Роман',
    color: 'rose',
    image: bulgakovImg
  },
  {
    id: 2,
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    price: 520,
    genre: 'Классика',
    color: 'blue',
    image: dostoevskyImg
  },
  {
    id: 3,
    title: '1984',
    author: 'Джордж Оруэлл',
    price: 640,
    genre: 'Антиутопия',
    color: 'green',
    image: orwellImg
  },
  {
    id: 4,
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    price: 390,
    genre: 'Сказка',
    color: 'gold',
    image: exuperyImg
  },
  {
    id: 5,
    title: 'Шерлок Холмс: Собака Баскервилей',
    author: 'Артур Конан Дойл',
    price: 470,
    genre: 'Детектив',
    color: 'purple',
    image: doyleImg
  },
  {
    id: 6,
    title: 'Вино из одуванчиков',
    author: 'Рэй Брэдбери',
    price: 560,
    genre: 'Фантастика',
    color: 'teal',
    image: bradburyImg
  }
];
