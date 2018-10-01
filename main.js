// terminal settings
var txt = "";
var typeSpeed = 20;
var blinkSpeed = 300;
var typePos = 0;
var args = [];
var executingCommand = false;

// 'environment' variables
var WELCOME_MESSAGE = " \nWelcome to my terminal.\nPlease enjoy your stay.\n:^)\n ";

var BOOT_COMMANDS = [
	"setcolor 84 254 217",
	"echo $WELCOME_MESSAGE"
];


/*
 * primary functions
 */

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

		txt = "";
		typePos = 0;
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
		$("#acceptInput").html("\n# ");

		var term = $("#termText");
		if (term.html() != "") term.append("\n");
		if (input.val() != "") term.append("# " + input.val() + "\n");
		else term.append("#");

		// process then clear input
		evalCommand(input.val());
		input.val("");
	}

	handleTyping();
}


/*
 * OS functions
 */

function evalCommand(input, callback)
{
	var retry = () =>
	{
		evalCommand(input);
	};

	if (executingCommand)
	{
		setTimeout(retry, typeSpeed);
		return 0;
	}

	// split command into args
	args = input.split(" ");

	// prevent users from running scripts outside  of the 'bin' directory
	if (args[0].includes(".."))
	{
		print("Please don't do that.");
		return 0;
	}

	switch (args[0])
	{
		case "clear":
			$("#termText").html("");
			$("#acceptInput").html("# ");
			txt = "";
			typePos = 0;
			typeWriter();
			break;

		case "export":
			if (args.length != 2)
			{
				print("Invalid syntax.");
			}
			else
			{
				if ((args[1].match(/=/g) || []).length != 1) print("Invalid syntax.");
				else
				{
					var parts = args[1].split("=");
					window[String(parts[0])] = parts[1];

					print(String(parts[1]));
				}
			}
			break;

		case "echo":
			args.shift(); // remove command from args[]

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
			print("");
			break;

		default:
			executingCommand = true;
			$.loadScript("./bin/" + args[0] + ".js", () =>
			{
				loadedFunc(args);
				executingCommand = false;
				if (callback != null) callback();
			}, () =>
			{
				print("Could not execute `" + args[0] + ".js` (Error 404: File not found)");
				executingCommand = false;
				if (callback != null) callback();
			});
	}
}

function print(p)
{
	txt += p;
	typeWriter();
}

function printBuffer(p)
{
	txt += p;
}

function bootFunc()
{
	printBuffer("Executing boot commands...\n");

	BOOT_COMMANDS.forEach((command) =>
	{
		evalCommand(command, () => { printBuffer("\n") });
	});

	print("");
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