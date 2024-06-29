export default function generateID() {
  const min = 1;
  const max = 2147483647;
  return Math.floor(Math.random() * (max - min) + min);
}
