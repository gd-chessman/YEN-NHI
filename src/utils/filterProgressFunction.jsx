import {compareFunctionSort} from "src/utils/compareFunctionSortCards.jsx";

export function filterProgress(listCards) {
    let displayList = []; // lưu trữ các card chưa học hoặc đang học

    // lọc các card chưa học hoặc đang học để hiển thị lên màn hình
    listCards.forEach((item) => {
        // check var progress (khác true tức là 'chưa học' or 'đang học')
        if (item.isRemembered !== true) {
            // đẩy dữ liệu vào display list
            displayList.push({
                ...item,
                isRemembered: item.isRemembered, // bổ sung trường progress
                mark: item.mark, // bổ sung trường mark
            });
        }
    });

    if (displayList.length === 0) {
        displayList = [...listCards];
    }

    // Sắp xếp display list.
    // Quy tắc: ưu tiên đưa những thẻ đánh dấu lên trước.
    // Trong trường hợp còn lại (những thẻ cùng có đánh dấu hoặc không cùng có đánh dấu), ưu tiên những thẻ
    // đang học lên trước chưa học.
    // Cuối cùng là sắp xếp theo id.

    displayList.sort(compareFunctionSort);

    // sắp xếp full list
    // mà thực ra không cần sắp xếp
    // xuống dưới display terms thì đơn giản là chỉ lọc

    return displayList;
};