export default function handleArray(
  currentList: string[][],
  oldListIndex: number,
  newListIndex: number,
  oldCardIndex: number,
  newCardIndex: number
  //   sortableID: string
) {
  console.log("currentList: ", currentList);
  console.log("oldListIndex: ", oldListIndex);
  console.log("newListIndex: ", newListIndex);
  console.log("oldCardIndex: ", oldCardIndex);
  console.log("newCardIndex: ", newCardIndex);

  const active = currentList[oldListIndex][oldCardIndex];
  const over = currentList[newListIndex][newCardIndex];

  console.log("active: ", active);
  console.log("over: ", over);

  console.log("length: ", currentList[newListIndex].length - 1);
  console.log("index over: ", currentList[newListIndex].indexOf(over));

  if (oldListIndex == newListIndex) {
    currentList[newListIndex][newCardIndex] = active;
    currentList[oldListIndex][oldCardIndex] = over;
    console.log("New", currentList);
  } else {
    if (
      currentList[newListIndex].length - 1 ==
      currentList[newListIndex].indexOf(over)
    ) {
      console.log("Inserted at end!");
      currentList[oldListIndex].splice(oldCardIndex, 1);
      currentList[newListIndex].push(active);
    } else {
      console.log("Inserted before the over");
      currentList[oldListIndex].splice(oldCardIndex, 1);
      currentList[newListIndex].splice(
        currentList[newListIndex].indexOf(over) - 1,
        0,
        active
      );
    }

    console.log("New", currentList);
  }
  return currentList;
}
