export function getRandomRoomID(len = 6) {
  return Math.random().toString(20).substr(2, 6).toUpperCase();
}
