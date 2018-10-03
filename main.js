// terminal settings
var txt = "";
var typeSpeed = 20;
var blinkSpeed = 300;
var typePos = 0;
var args = [];
var executingCommand = false;
var pad = "  ";
var booting = true;
var redirectingInput = false;
var receiveInput = () => {};
var defaultPrompt = "#";
var prompt = defaultPrompt;

// 'environment' variables
var WELCOME_MESSAGE = "\nWelcome to my terminal.\nPlease enjoy your stay.\n:^)\n ";

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
		var term = $("#termText");
		var html = term.html();
		var char = txt.charAt(typePos);

		if (char == "[")
		{
			// find first [block]
			var searchStr = txt.substring(typePos);
			var endPos = searchStr.indexOf("]");
			var inner = searchStr.substring(1, endPos);

			// add to buffer
			var buff = "<" + inner + ">";

			// find the inbetween stuff
			searchStr = searchStr.substring(endPos+1);
			endPos = searchStr.indexOf("[");
			inner = searchStr.substring(0, endPos);

			// add to buffer
			buff += inner;

			// find final [/block]
			searchStr = searchStr.substring(endPos);
			endPos = searchStr.indexOf("]");
			inner = searchStr.substring(1, endPos);

			// add to buffer
			buff += "<" + inner + ">";
			typePos += buff.length;

			// write buffer
			term.html(html + buff);

		}
		else
		{
			term.html(html + char);
			typePos++;
		}

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
		$("#acceptInput").html("\n"+prompt+" ");

		var term = $("#termText");
		if (term.html() != "") term.append("\n");
		if (input.val() != "") term.append(prompt+" " + input.val() + "\n");
		else term.append(prompt);

		// process then clear input
		if (redirectingInput) receiveInput(input.val());
		else evalCommand(input.val());
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
		print(pad+"Please don't do that.");
		return 0;
	}

	switch (args[0])
	{
		case "clear":
			$("#termText").html("");
			$("#acceptInput").html(prompt+" ");
			txt = "";
			typePos = 0;
			typeWriter();
			break;

		case "export":
			if (args.length != 2)
			{
				print(pad+"Invalid syntax.");
			}
			else
			{
				if ((args[1].match(/=/g) || []).length != 1) print(pad+"Invalid syntax.");
				else
				{
					var parts = args[1].split("=");
					window[String(parts[0])] = parts[1];

					print(pad+String(parts[1]));
				}
			}
			break;

		case "echo":
			args.shift(); // remove command from args[]
			txt += pad;

			// iterate through the 'words'
			args.forEach((arg) =>
			{
				if (arg.charAt(0) == "$") txt += String(window[arg.substring(1)]); // replace $var with its value
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
				if (loadedFunc(args)) redirectingInput = true;
				executingCommand = false;
				if (callback != null) callback();
			}, () =>
			{
				print(pad+"Could not execute `" + args[0] + ".js` (Error 404: File not found)");
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
		booting = true;
		evalCommand(command, () => { printBuffer("\n"); booting = false; });
	});

	print("");
}

function setPrompt(p)
{
	prompt = p;
	$("#acceptInput").html("\n"+prompt+" ");
}

function resetPrompt()
{
	setPrompt(defaultPrompt);
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