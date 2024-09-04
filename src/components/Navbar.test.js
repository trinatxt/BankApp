
import { runNavbarTests } from './NavbarTests';

const paths = [
  '/',
  '/login',
  '/profilecreationpage',
  '/profile',
  '/exchangehistorypage',
  '/exchangepop1',
  '/exchangepop2',
  '/editprofilepage',
  '/promotionpage'
];

// Loop through each path and run the navbar tests
for (const path of paths) {
  runNavbarTests(path);
}
