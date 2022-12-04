function convertToBinaryStr(item) {
	let fillLenStr = "";
	const binaryStr = item.toString(2);

	for (let j = 0; j < 8 - binaryStr.length; j++) {
		fillLenStr = fillLenStr + "0";
	}

	return fillLenStr + binaryStr;
}

// https://www.w3.org/TR/2003/REC-PNG-20031110/
function getPNGInfo(unit8Array) {
	const widthInfoArr = unit8Array.slice(16, 20);
	const heigthInfoArr = unit8Array.slice(20, 24);
	let wRes = "";
	widthInfoArr.forEach(i => {
		wRes = wRes + convertToBinaryStr(i);
	});

	let hRes = "";
	heigthInfoArr.forEach(i => {
		hRes = hRes + convertToBinaryStr(i);
	});
	return { width: parseInt(wRes, 2), height: parseInt(hRes, 2) };
}

// https://www.w3.org/Graphics/GIF/spec-gif89a.txt
function getGIFInfo(unit8Array) {
	const widthInfoArr = unit8Array.slice(6, 8);
	const heigthInfoArr = unit8Array.slice(8, 10);
	let wRes = "";
	widthInfoArr.forEach(i => {
		wRes = convertToBinaryStr(i) + wRes;
	});

	let hRes = "";
	heigthInfoArr.forEach(i => {
		hRes = convertToBinaryStr(i) + hRes;
	});
	return { width: parseInt(wRes, 2), height: parseInt(hRes, 2) };
}

// https://blog.csdn.net/STN_LCD/article/details/78629029
function getJPEGInfo(unit8Array) {
	for (let i = 0; i < unit8Array.length; i++) {
		if (unit8Array[i] === 255 && (unit8Array[i + 1] === 192 || unit8Array[i + 1] === 193)) {
			const heigthInfoArr = unit8Array.slice(i + 5, i + 7);
			const widthInfoArr = unit8Array.slice(i + 7, i + 9);

			let wRes = "";
			widthInfoArr.forEach(x => {
				wRes = wRes + convertToBinaryStr(x);
			});

			let hRes = "";
			heigthInfoArr.forEach(y => {
				hRes = hRes + convertToBinaryStr(y);
			});
			return { width: parseInt(wRes, 2), height: parseInt(hRes, 2) };
		}
	}
}

function getImgInfo(file, cb) {
	const reader = new FileReader();
	reader.onload = res => {
		let info = {};
		const arrybuffer = res.target.result;
		const unit8Array = new Uint8Array(arrybuffer); // 转换为8位无符号整形数组
		// equal GIF
		if (unit8Array.slice(0, 3).join(" ") === "71 73 70") {
			info = { size: file.size, type: file.type, realType: "image/gif", ...getGIFInfo(unit8Array) };
		}

		// png
		if (unit8Array.slice(0, 8).join(" ") === "137 80 78 71 13 10 26 10") {
			info = { size: file.size, type: file.type, realType: "image/png", ...getPNGInfo(unit8Array) };
		}

		if (
			unit8Array.slice(0, 2).join(" ") === "255 216" &&
			unit8Array.slice(unit8Array.length - 2, unit8Array.length).join(" ") === "255 217"
		) {
			info = { size: file.size, type: file.type, realType: "image/jpeg", ...getJPEGInfo(unit8Array) };
		}

		cb && cb(info);
	};
	reader.readAsArrayBuffer(file);
}
