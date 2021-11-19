import dog1 from "../images/cancel.png";

function createImg(root) {
  const img = new Image();
  img.src = dog1;
  img.classList.add("avatar"); // 添加 avatar 类名
  root.append(img);
}
console.log(4543243545)

export default createImg;