var txt;
var typeSpeed = 25;
var blinkSpeed = 300;
var typePos = 0;

function init()
{
	txt = $("#textToDisplay").text();
	txt = txt.replace(/\t/g, ""); // remove tabs
	txt = txt.substr(1, txt.length-2); // remove first and last newlines

	setTimeout(typeWriter, 400);
	setTimeout(blinkBlock, blinkSpeed);

	$("#capInput").on("change paste keyup", handleTyping);
	$("#capInput").keydown(handleInput);

	$("body").click(() =>
	{
		$("#capInput").focus();
	});
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

		// process input
		switch (input.val())
		{
			case "shutdown":
				txt += "\nShutdown failed.";
				typeWriter();
				break;

			case "reboot":
				location.reload(true);
				break;

			case "clear":
				$("#termText").html("");
				txt = "";
				typePos = 0;
				typeWriter();
				break;

			case "":
				typeWriter();
				break;

			default:
				txt += "\nUnknown command: `" + input.val() + "`";
				typeWriter();
		}

		// clear input
		input.val("");
	}

	handleTyping();
}