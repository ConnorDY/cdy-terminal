function loadedFunc(params)
{
	if (params.length != 4)
	{
		print("Invalid syntax. Type `help setcolor` for help.");
		return 0;
	}

	// get colors
	var r = params[1];
	var g = params[2];
	var b = params[3];

	var mainCol = new tinycolor("rgb " + r + " " + g + " " + b);
	var mainHex = mainCol.toHexString();

	mainCol.darken(25);
	var glowHex = mainCol.toHexString();

	// set colors
	$("body").css("color", mainHex);
	$("body").css("text-shadow", "0 0 5px " + glowHex);

	$("#blockChar").css("background-color", mainHex);
	$("#blockChar").css("box-shadow", "0 0 5px " + glowHex);

	print("Terminal color set to " + mainHex + ".");
}

function printHelp()
{
	print(
		"Usage: setcolor r g b\n" +
		"r, g, and b should be numbers between 0 and 255."
	);
}