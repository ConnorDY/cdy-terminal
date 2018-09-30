// settings
var txt = "";
var typeSpeed = 25;
var blinkSpeed = 300;
var typePos = 0;
var args = [];

// 'environment' variables
var WELCOME_MESSAGE = " \nWelcome to my terminal.\nPlease enjoy your stay.\n:^)\n ";
var BOOT_COMMAND = "echo $WELCOME_MESSAGE";

function init()
{
	setTimeout(blinkBlock, blinkSpeed);

	$("#capInput").on("change paste keyup", handleTyping);
	$("#capInput").keydown(handleInput);

	$("body").click(() =>
	{
		$("#capInput").focus();
	});

	bootFunc();
}

function typeWriter()
{
	$("#capInput").blur();

	if (typePos < txt.length)
	{
		$("#termText").append(txt.charAt(typePos));
		typePos++;
		setTimeout(typeWriter, typeSpeed);
	}
	else
	{
		$("#acceptInput").css("display", "inline");
		$("#capInput").focus();
	}

	// scroll to bottom
	var content = $("#content");
	content.scrollTop(content[0].scrollHeight);
}

function blinkBlock()
{
	var enc = $("#blockChar");

	if (enc.css("visibility") == "hidden") enc.css("visibility", "visible");
	else enc.css("visibility", "hidden");

	setTimeout(blinkBlock, blinkSpeed);
}

function handleTyping()
{
	$("#userInput").html($("#capInput").val());
}

function handleInput(event)
{
	if (event.which == 13) // enter key is pressed
	{
		var input = $("#capInput");

		// trim input
		input.val(input.val().trim());

		// hide input field then display the input
		$("#acceptInput").css("display", "none");
		$("#termText").append("\n# " + input.val());

		// process then clear input
		evalCommand(input.val());
		input.val("");
	}

	handleTyping();
}

function evalCommand(input)
{
	args = input.split(" ");

	// prevent users from running scripts outside  of the 'bin' directory
	if (args[0].includes(".."))
	{
		txt += "\nPlease don't do that.";
		typeWriter();
		return 0;
	}

	switch (args[0])
	{
		case "clear":
			$("#termText").html("");
			txt = "";
			typePos = 0;
			typeWriter();
			break;

		case "echo":
			args.shift(); // remove command from args[]
			txt += "\n";

			// iterate through the 'words'
			args.forEach((arg) =>
			{
				if (arg.charAt(0) == "$") txt += String(window[arg.substr(1)]); // replace $var with its value
				else txt += arg;

				txt += " ";
			});

			typeWriter();
			break;

		case "":
			typeWriter();
			break;

		default:
			$.loadScript("./bin/" + args[0] + ".js", () =>
			{
				loadedFunc(args);
			}, () =>
			{
				txt += "\nCould not execute `" + args[0] + ".js` (Error 404: File not found)";
				typeWriter();
			});
	}
}

function bootFunc()
{
	txt += BOOT_COMMAND;
	evalCommand(BOOT_COMMAND);
}

jQuery.loadScript = (url, callback, failed) =>
{
    jQuery.ajax({
        url: url,
        dataType: "script",
        success: callback,
        error: failed,
        async: true
    });
}